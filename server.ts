import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import db, { initDb } from "./src/db.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: any;
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize DB
  initDb();

  const getUserId = (req: express.Request) => {
    const cookies = req.headers.cookie;
    if (cookies) {
      const match = cookies.match(/user_id=([^;]+)/);
      if (match) return parseInt(match[1]);
    }
    return 4; // Default to voter for development, although real auth would not do this
  };

  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = userId;
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    next();
  };

  const requireRole = (allowedRoles: string[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient permissions" });
      }
      next();
    };
  };

  const logAction = (userId: number, action: string, resource: string, details: string = '') => {
    try {
      db.prepare(`
        INSERT INTO audit_logs (user_id, action, resource, details)
        VALUES (?, ?, ?, ?)
      `).run(userId, action, resource, details);
    } catch(e) {
      console.error("Failed to log action:", e);
    }
  };

  // --- API Routes ---

  app.post("/api/ai/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: `You are 'S&P Beta' (or 'Sew & Post AI Fashion Buddy'), a highly knowledgeable, friendly, and elegant African fashion consultant. You help users discover authentic African designs, understand the Sew & Post platform, learn about custom dresses from local brands (such as Kente Couture, Ankara Styles, Adinkra Designs, Ashanti Fits, Accra Exclusives, and Golden Thread), and provide style recommendations for traditional fabrics. Keep your tone sophisticated, warm, and highly helpful. Advise them that by watching brief designer ad showcases in Sew & Post, they can boost their votes for their favorite shops and help local artisans grow. Keep responses relatively concise (2-4 sentences max), styled nicely, and focused on fashion and styling.`,
        }
      });

      res.json({ text: response.text || "I'm sorry, I couldn't process that request." });
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      res.status(500).json({ error: e.message || "Failed to generate AI response" });
    }
  });

  app.get("/api/shops", (req, res) => {
    const { search, category, location, sort, page = '1', limit = '6' } = req.query;
    
    let query = "SELECT s.*, COALESCE(SUM(ce.votes), 0) as total_votes FROM shops s LEFT JOIN competition_entries ce ON s.id = ce.shop_id";
    const params: any[] = [];
    const conditions: string[] = [];

    if (search) {
      conditions.push("(s.name LIKE ? OR s.description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push("s.category = ?");
      params.push(category);
    }
    if (location) {
      conditions.push("s.location = ?");
      params.push(location);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY s.id";

    if (sort === 'popular') {
      query += " ORDER BY total_votes DESC";
    } else if (sort === 'newest') {
      query += " ORDER BY s.created_at DESC";
    } else {
      query += " ORDER BY s.name ASC"; // default
    }

    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 6;
    const offset = (pageNum - 1) * limitNum;
    
    // Count total for pagination
    let countQuery = "SELECT COUNT(DISTINCT s.id) as total FROM shops s";
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }
    
    try {
      const totalResult = db.prepare(countQuery).get(...params) as { total: number };
      const total = totalResult ? totalResult.total : 0;
      
      query += " LIMIT ? OFFSET ?";
      params.push(limitNum, offset);

      const shops = db.prepare(query).all(...params);
      
      res.json({
        shops,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch shops" });
    }
  });

  app.get("/api/shops/:id", (req, res) => {
    const shop = db
      .prepare("SELECT * FROM shops WHERE id = ?")
      .get(req.params.id) as object;
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    const products = db
      .prepare("SELECT * FROM products WHERE shop_id = ?")
      .all(req.params.id);
      
    const entries = db.prepare(`
      SELECT ce.*, p.name as product_name, p.image_url, c.title as competition_title, c.status as competition_status
      FROM competition_entries ce
      JOIN products p ON ce.product_id = p.id
      JOIN competitions c ON ce.competition_id = c.id
      WHERE ce.shop_id = ?
      ORDER BY ce.created_at DESC
    `).all(req.params.id);
      
    res.json({ ...shop, products, entries });
  });

  app.put("/api/shops/:id", requireAuth, (req, res) => {
    const shopId = req.params.id;
    // Check ownership or admin
    const shop = db.prepare("SELECT * FROM shops WHERE id = ?").get(shopId) as any;
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    if (shop.owner_id !== req.userId && req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }

    const { name, description, email, phone, instagram_url, twitter_url, website_url, banner_url, logo_url } = req.body;
    try {
      db.prepare(`
        UPDATE shops 
        SET name = ?, description = ?, email = ?, phone = ?, instagram_url = ?, twitter_url = ?, website_url = ?, banner_url = ?, logo_url = ?
        WHERE id = ?
      `).run(name, description, email, phone, instagram_url, twitter_url, website_url, banner_url, logo_url, shopId);
      
      if (req.user.role === 'admin' || req.user.role === 'editor') {
         logAction(req.userId!, 'UPDATE_SHOP', `Shop ${shopId}`);
      }

      res.json({ success: true });
    } catch(e) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.get("/api/competitions", (req, res) => {
    const comps = db.prepare("SELECT * FROM competitions ORDER BY start_date DESC").all();
    res.json(comps);
  });

  app.get("/api/competitions/:id", (req, res) => {
    const comp = db
      .prepare("SELECT * FROM competitions WHERE id = ?")
      .get(req.params.id) as any;
    if (!comp) return res.status(404).json({ error: "Competition not found" });

    // Ensure boolean
    comp.voting_enabled = !!comp.voting_enabled;

    const entries = db
      .prepare(
        `
      SELECT ce.*, p.name as product_name, p.image_url, s.name as shop_name, s.logo_url as shop_logo
      FROM competition_entries ce
      JOIN products p ON ce.product_id = p.id
      JOIN shops s ON ce.shop_id = s.id
      WHERE ce.competition_id = ?
      ORDER BY ce.votes DESC
    `,
      )
      .all(req.params.id);

    res.json({ ...comp, entries });
  });

  app.post("/api/competitions", requireAuth, requireRole(['admin', 'editor']), (req, res) => {
    const { title, description, category, image_url, start_date, end_date, voting_enabled, status } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO competitions (title, description, category, image_url, start_date, end_date, voting_enabled, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title, description, category, image_url, start_date, end_date, voting_enabled ? 1 : 0, status || 'upcoming');
      
      logAction(req.userId!, 'CREATE_COMPETITION', `Competition ${result.lastInsertRowid}`);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to create competition" });
    }
  });

  app.put("/api/competitions/:id", requireAuth, requireRole(['admin', 'editor']), (req, res) => {
    const { title, description, category, image_url, start_date, end_date, voting_enabled, status } = req.body;
    try {
      db.prepare(`
        UPDATE competitions 
        SET title = ?, description = ?, category = ?, image_url = ?, start_date = ?, end_date = ?, voting_enabled = ?, status = ?
        WHERE id = ?
      `).run(title, description, category, image_url, start_date, end_date, voting_enabled ? 1 : 0, status, req.params.id);
      
      logAction(req.userId!, 'UPDATE_COMPETITION', `Competition ${req.params.id}`);
      res.json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to update competition" });
    }
  });

  app.post("/api/competitions/:id/entries", requireAuth, requireRole(['shop_owner', 'admin']), (req, res) => {
    const { shop_id, product_id } = req.body;
    try {
      // Check if entry already exists
      const existing = db.prepare("SELECT * FROM competition_entries WHERE competition_id = ? AND product_id = ?").get(req.params.id, product_id);
      if (existing) {
        return res.status(400).json({ error: "Product already entered in this competition" });
      }

      const result = db.prepare(`
        INSERT INTO competition_entries (competition_id, shop_id, product_id)
        VALUES (?, ?, ?)
      `).run(req.params.id, shop_id, product_id);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to enter competition" });
    }
  });

  app.post("/api/vote", requireAuth, (req, res) => {
    const { entryId, votes } = req.body;
    try {
      db.prepare(
        "UPDATE competition_entries SET votes = votes + ? WHERE id = ?",
      ).run(votes, entryId);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Vote failed" });
    }
  });

  app.post("/api/mock-login", (req, res) => {
    const { userId } = req.body;
    res.cookie("user_id", userId, { maxAge: 86400000 }); // 1 day
    res.json({ success: true });
  });

  app.get("/api/mock/users", (req, res) => {
    // Only for dev user switcher
    const users = db.prepare("SELECT id, name, role FROM users ORDER BY created_at DESC").all();
    res.json(users);
  });

  app.get("/api/admin/audit-logs", requireAuth, requireRole(['admin']), (req, res) => {
    try {
      const logs = db.prepare(`
        SELECT a.*, u.name as user_name, u.email as user_email 
        FROM audit_logs a 
        JOIN users u ON a.user_id = u.id 
        ORDER BY a.created_at DESC 
        LIMIT 100
      `).all();
      res.json(logs);
    } catch(e) {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/users", requireAuth, requireRole(['admin']), (req, res) => {
    const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
    res.json(users);
  });

  app.put("/api/users/:id/role", requireAuth, requireRole(['admin']), (req, res) => {
    const { role } = req.body;
    try {
      db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, req.params.id);
      logAction(req.userId!, 'UPDATE_USER_ROLE', `User ${req.params.id}`, `New role: ${role}`);
      res.json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to update role" });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireRole(['admin']), (req, res) => {
    try {
      db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
      logAction(req.userId!, 'DELETE_USER', `User ${req.params.id}`);
      res.json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.get("/api/admin/stats", requireAuth, requireRole(['admin', 'editor']), (req, res) => {
    try {
      const usersCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as any).count;
      const shopsCount = (db.prepare("SELECT COUNT(*) as count FROM shops").get() as any).count;
      const productsCount = (db.prepare("SELECT COUNT(*) as count FROM products").get() as any).count;
      const competitionsCount = (db.prepare("SELECT COUNT(*) as count FROM competitions").get() as any).count;
      const votesCount = (db.prepare("SELECT SUM(votes) as count FROM competition_entries").get() as any).count || 0;
      
      res.json({
        usersCount,
        shopsCount,
        productsCount,
        competitionsCount,
        votesCount
      });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/shops", requireAuth, requireRole(['admin', 'editor']), (req, res) => {
    const shops = db.prepare(`
      SELECT s.*, u.name as owner_name, u.email as owner_email,
      (SELECT COUNT(*) FROM products WHERE shop_id = s.id) as product_count
      FROM shops s
      JOIN users u ON s.owner_id = u.id
      ORDER BY s.created_at DESC
    `).all();
    res.json(shops);
  });

  app.delete("/api/shops/:id", requireAuth, requireRole(['admin']), (req, res) => {
    try {
      db.prepare("DELETE FROM products WHERE shop_id = ?").run(req.params.id);
      db.prepare("DELETE FROM shops WHERE id = ?").run(req.params.id);
      logAction(req.userId!, 'DELETE_SHOP', `Shop ${req.params.id}`);
      res.json({ success: true });
    } catch(e) {
      res.status(500).json({ error: "Failed to delete shop" });
    }
  });

  app.delete("/api/competitions/:id", requireAuth, requireRole(['admin']), (req, res) => {
    try {
      db.prepare("DELETE FROM competition_entries WHERE competition_id = ?").run(req.params.id);
      db.prepare("DELETE FROM competitions WHERE id = ?").run(req.params.id);
      logAction(req.userId!, 'DELETE_COMPETITION', `Competition ${req.params.id}`);
      res.json({ success: true });
    } catch(e) {
      res.status(500).json({ error: "Failed to delete competition" });
    }
  });

  app.get("/api/users/me", requireAuth, (req, res) => {
    const userId = getUserId(req);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    res.json(user);
  });

  app.get("/api/users/me/shop", (req, res) => {
    const userId = getUserId(req);
    const shop = db.prepare("SELECT * FROM shops WHERE owner_id = ?").get(userId) as any;
    if (shop) {
      const products = db.prepare("SELECT * FROM products WHERE shop_id = ?").all(shop.id);
      const entries = db.prepare(`
        SELECT ce.*, p.name as product_name, p.image_url, c.title as competition_title, c.status as competition_status
        FROM competition_entries ce
        JOIN products p ON ce.product_id = p.id
        JOIN competitions c ON ce.competition_id = c.id
        WHERE ce.shop_id = ?
        ORDER BY ce.created_at DESC
      `).all(shop.id);
      res.json({ ...shop, products, entries });
    } else {
      res.json(null);
    }
  });

  app.get("/api/users/me/buyer_data", (req, res) => {
    const userId = getUserId(req);
    
    // Seed mock data for user 4 if they don't have any
    if (userId === 4) {
      const hasFavorites = db.prepare("SELECT count(*) as count FROM favorite_products WHERE user_id = 4").get() as any;
      if (hasFavorites.count === 0) {
        db.prepare("INSERT OR IGNORE INTO favorite_products (user_id, product_id) VALUES (4, 1), (4, 2)").run();
        db.prepare("INSERT OR IGNORE INTO favorite_shops (user_id, shop_id) VALUES (4, 1), (4, 2)").run();
        db.prepare("INSERT OR IGNORE INTO voting_history (user_id, competition_id, entry_id) VALUES (4, 1, 1), (4, 1, 3)").run();
        db.prepare("INSERT OR IGNORE INTO notifications (user_id, title, message) VALUES (4, 'New Competition!', 'A new Traditional Fusion competition has started.'), (4, 'Vote Reminder', 'You have 2 days left to vote in Summer Elegance.')").run();
      }
    }

    const favoriteShops = db.prepare(`
      SELECT fs.id, s.id as shop_id, s.name, s.logo_url
      FROM favorite_shops fs
      JOIN shops s ON fs.shop_id = s.id
      WHERE fs.user_id = ?
    `).all(userId);

    const favoriteProducts = db.prepare(`
      SELECT fp.id, p.id as product_id, p.name, p.image_url, p.price, s.name as shop_name
      FROM favorite_products fp
      JOIN products p ON fp.product_id = p.id
      JOIN shops s ON p.shop_id = s.id
      WHERE fp.user_id = ?
    `).all(userId);

    const votingHistory = db.prepare(`
      SELECT vh.id, c.id as competition_id, c.title as competition_title, vh.entry_id, p.name as product_name, vh.created_at
      FROM voting_history vh
      JOIN competitions c ON vh.competition_id = c.id
      JOIN competition_entries ce ON vh.entry_id = ce.id
      JOIN products p ON ce.product_id = p.id
      WHERE vh.user_id = ?
      ORDER BY vh.created_at DESC
    `).all(userId);

    const notifications = db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC").all(userId);

    res.json({ favoriteShops, favoriteProducts, votingHistory, notifications });
  });

  app.get("/api/admin/products", requireAuth, requireRole(['admin', 'editor']), (req, res) => {
    try {
      const products = db.prepare(`
        SELECT p.*, s.name as shop_name 
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        ORDER BY p.created_at DESC
      `).all();
      res.json(products);
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // --- Product Routes ---
  app.get("/api/products/:id", (req, res) => {
    try {
      const product = db.prepare("SELECT p.*, s.name as shop_name, s.logo_url as shop_logo FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = ?").get(req.params.id) as any;
      if (!product) return res.status(404).json({ error: "Product not found" });

      const relatedProducts = db.prepare("SELECT * FROM products WHERE shop_id = ? AND id != ? LIMIT 4").all(product.shop_id, req.params.id);

      res.json({ product, relatedProducts });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", requireAuth, requireRole(['shop_owner', 'admin']), (req, res) => {
    const { shop_id, name, description, price, image_url, gallery_images, category, tags } = req.body;
    try {
      const shop = db.prepare("SELECT * FROM shops WHERE id = ?").get(shop_id) as any;
      if (!shop || (shop.owner_id !== req.userId && req.user.role !== 'admin')) {
        return res.status(403).json({ error: "Forbidden: insufficient permissions" });
      }

      const result = db.prepare(`
        INSERT INTO products (shop_id, name, description, price, image_url, gallery_images, category, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(shop_id, name, description, price, image_url, JSON.stringify(gallery_images || []), category, JSON.stringify(tags || []));
      res.json({ id: result.lastInsertRowid, success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", requireAuth, (req, res) => {
    const { name, description, price, image_url, gallery_images, category, tags } = req.body;
    try {
      const product = db.prepare("SELECT p.*, s.owner_id FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = ?").get(req.params.id) as any;
      if (!product) return res.status(404).json({ error: "Product not found" });
      if (product.owner_id !== req.userId && req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({ error: "Forbidden: insufficient permissions" });
      }

      db.prepare(`
        UPDATE products 
        SET name = ?, description = ?, price = ?, image_url = ?, gallery_images = ?, category = ?, tags = ?
        WHERE id = ?
      `).run(name, description, price, image_url, JSON.stringify(gallery_images || []), category, JSON.stringify(tags || []), req.params.id);
      
      if (req.user.role === 'admin' || req.user.role === 'editor') {
        logAction(req.userId!, 'UPDATE_PRODUCT', `Product ${req.params.id}`);
      }
      res.json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAuth, (req, res) => {
    try {
      const product = db.prepare("SELECT p.*, s.owner_id FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = ?").get(req.params.id) as any;
      if (!product) return res.status(404).json({ error: "Product not found" });
      if (product.owner_id !== req.userId && req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({ error: "Forbidden: insufficient permissions" });
      }

      db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);

      if (req.user.role === 'admin' || req.user.role === 'editor') {
        logAction(req.userId!, 'DELETE_PRODUCT', `Product ${req.params.id}`);
      }

      res.json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
