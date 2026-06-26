import Database from 'better-sqlite3';
import path from 'path';

// Using an in-memory database for demo purposes, or a file for persistence
// Since it's a prototype, let's use a local file so data persists across restarts
const db = new Database('fashion.db');
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'voter', -- 'voter', 'shop_owner', 'admin'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      logo_url TEXT,
      banner_url TEXT,
      email TEXT,
      phone TEXT,
      instagram_url TEXT,
      twitter_url TEXT,
      website_url TEXT,
      category TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      image_url TEXT,
      gallery_images TEXT,
      category TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    );

    CREATE TABLE IF NOT EXISTS competitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      image_url TEXT,
      start_date DATETIME,
      end_date DATETIME,
      voting_enabled BOOLEAN DEFAULT 1,
      status TEXT DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS competition_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      competition_id INTEGER NOT NULL,
      shop_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      votes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (competition_id) REFERENCES competitions(id),
      FOREIGN KEY (shop_id) REFERENCES shops(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS favorite_shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      shop_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, shop_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    );

    CREATE TABLE IF NOT EXISTS favorite_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS voting_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      competition_id INTEGER NOT NULL,
      entry_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, competition_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (competition_id) REFERENCES competitions(id),
      FOREIGN KEY (entry_id) REFERENCES competition_entries(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Insert mock data if empty
    INSERT OR IGNORE INTO users (id, name, email, role) VALUES 
      (1, 'Admin User', 'admin@example.com', 'admin'),
      (2, 'Kente Couture', 'owner@kentecouture.com', 'shop_owner'),
      (3, 'Ankara Styles', 'owner@ankarastyles.com', 'shop_owner'),
      (4, 'Voter One', 'voter1@example.com', 'voter'),
      (5, 'Adinkra Designs', 'owner@adinkra.com', 'shop_owner'),
      (6, 'Ashanti Fits', 'owner@ashanti.com', 'shop_owner'),
      (7, 'Global Trends', 'owner@global.com', 'shop_owner'),
      (8, 'Accra Exclusives', 'owner@accraexc.com', 'shop_owner'),
      (9, 'Urban Wear', 'owner@urbanwear.com', 'shop_owner'),
      (10, 'Golden Thread', 'owner@goldenthread.com', 'shop_owner'),
      (11, 'Content Editor', 'editor@example.com', 'editor');

    INSERT OR IGNORE INTO shops (id, owner_id, name, description, email, phone, instagram_url, website_url, category, location) VALUES
      (1, 2, 'Kente Couture', 'Authentic traditional and modern Kente designs.', 'contact@kentecouture.com', '+233 20 123 4567', '@kentecouture', 'www.kentecouture.com', 'Traditional', 'Kumasi'),
      (2, 3, 'Ankara Styles', 'Vibrant everyday Ankara wear.', 'hello@ankarastyles.com', '+233 24 987 6543', '@ankarastyles', 'www.ankarastyles.com', 'Modern', 'Accra'),
      (3, 5, 'Adinkra Designs', 'Beautiful Adinkra symbols incorporated into everyday fashion.', 'hello@adinkra.com', '+233 24 111 2222', '@adinkradesigns', 'www.adinkra.com', 'Traditional', 'Accra'),
      (4, 6, 'Ashanti Fits', 'Premium handcrafted Ashanti traditional wear.', 'contact@ashantifits.com', '+233 20 222 3333', '@ashantifits', 'www.ashantifits.com', 'Luxury', 'Kumasi'),
      (5, 7, 'Global Trends', 'Imported and locally crafted modern urban styles.', 'hello@globaltrends.com', '+233 24 333 4444', '@globaltrends', 'www.globaltrends.com', 'Modern', 'Tema'),
      (6, 8, 'Accra Exclusives', 'High-end exclusive fashion items for special occasions.', 'contact@accraexc.com', '+233 20 444 5555', '@accraexclusives', 'www.accraexc.com', 'Luxury', 'Accra'),
      (7, 9, 'Urban Wear GH', 'Streetwear and contemporary fashion.', 'hello@urbanwear.com', '+233 24 555 6666', '@urbanweargh', 'www.urbanweargh.com', 'Streetwear', 'Accra'),
      (8, 10, 'Golden Thread', 'Fine tailoring and custom bespoke suits and dresses.', 'contact@goldenthread.com', '+233 20 666 7777', '@goldenthread', 'www.goldenthread.com', 'Bespoke', 'Takoradi');

    INSERT OR IGNORE INTO products (id, shop_id, name, description, price) VALUES
      (1, 1, 'Royal Kente Gown', 'A stunning floor-length gown.', 250.00),
      (2, 2, 'Modern Ankara Flare', 'Elegant high-fashion dress.', 120.00),
      (3, 1, 'Kaba & Slit Elegance', 'Striking two-piece design.', 180.00),
      (4, 2, 'Northern Smock Couture', 'Hand-woven smock fabric.', 150.00);

    INSERT OR IGNORE INTO competitions (id, title, description, category, image_url, start_date, end_date, voting_enabled, status) VALUES
      (1, 'Fashion Competition ''26', 'Showcase your best traditional inspired modern wear.', 'Traditional Fusion', 'https://images.unsplash.com/photo-1550614000-4b95d4662d5f?w=800&q=80', datetime('now', '-1 day'), datetime('now', '+7 days'), 1, 'active'),
      (2, 'Summer Elegance', 'The best modern twists on classic summer outfits.', 'Modern', 'https://images.unsplash.com/photo-1611042553365-9b101441c135?w=800&q=80', datetime('now', '+5 days'), datetime('now', '+20 days'), 1, 'upcoming'),
      (3, 'Winter Gala 2025', 'Reflecting on the best winter collection pieces.', 'Luxury', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', datetime('now', '-30 days'), datetime('now', '-10 days'), 0, 'completed');

    INSERT OR IGNORE INTO competition_entries (id, competition_id, shop_id, product_id, votes) VALUES
      (1, 1, 1, 1, 1240),
      (2, 1, 2, 2, 985),
      (3, 1, 1, 3, 890),
      (4, 1, 2, 4, 1150);
    -- Add default images to shops if missing
    UPDATE shops SET logo_url = 'https://images.unsplash.com/photo-1584999734661-d70c4bc268db?w=800&q=80' WHERE logo_url IS NULL OR logo_url = '';
    UPDATE shops SET banner_url = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80' WHERE banner_url IS NULL OR banner_url = '';

    -- Add default images to products if missing
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80' WHERE (image_url IS NULL OR image_url = '') AND id % 4 = 1;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80' WHERE (image_url IS NULL OR image_url = '') AND id % 4 = 2;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611042553365-9b101441c135?w=800&q=80' WHERE (image_url IS NULL OR image_url = '') AND id % 4 = 3;
    UPDATE products SET image_url = 'https://images.unsplash.com/photo-1574676118182-b7d1e8c9b910?w=800&q=80' WHERE (image_url IS NULL OR image_url = '') AND id % 4 = 0;

    -- Provide gallery images
    UPDATE products SET gallery_images = '["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80"]' WHERE gallery_images IS NULL OR gallery_images = '';

    -- Fallback for competitions
    UPDATE competitions SET image_url = 'https://images.unsplash.com/photo-1548624313-0396c70e4aec?w=800&q=80' WHERE image_url IS NULL OR image_url = '';
  `);
}

export default db;
