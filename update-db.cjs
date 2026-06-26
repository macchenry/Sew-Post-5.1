const Database = require('better-sqlite3');
const db = new Database('fashion.db');

const productImages = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80',
  'https://images.unsplash.com/photo-1611042553365-9b101441c135?w=800&q=80',
  'https://images.unsplash.com/photo-1574676118182-b7d1e8c9b910?w=800&q=80',
  'https://images.unsplash.com/photo-1523309375637-b3f4f2347f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  'https://images.unsplash.com/photo-1548624313-0396c70e4aec?w=800&q=80',
  'https://images.unsplash.com/photo-1550614000-4b95d4662d5f?w=800&q=80'
];

const shopLogos = [
  'https://images.unsplash.com/photo-1584999734661-d70c4bc268db?w=400&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  'https://images.unsplash.com/photo-1621086820202-b2f7b88ec7b0?w=400&q=80',
  'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&q=80'
];

const shopBanners = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80',
  'https://images.unsplash.com/photo-1523309375637-b3f4f2347f2d?w=1200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=80',
  'https://images.unsplash.com/photo-1574676118182-b7d1e8c9b910?w=1200&q=80'
];

const compImages = [
  'https://images.unsplash.com/photo-1548624313-0396c70e4aec?w=1200&q=80',
  'https://images.unsplash.com/photo-1611042553365-9b101441c135?w=1200&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80'
];

const galleryImages = [
  productImages[0],
  productImages[1],
  productImages[2]
];
const galleryStr = JSON.stringify(galleryImages);

db.prepare(`UPDATE products SET image_url = ? WHERE id % 8 = 0`).run(productImages[0]);
db.prepare(`UPDATE products SET image_url = ? WHERE id % 8 = 1`).run(productImages[1]);
db.prepare(`UPDATE products SET image_url = ? WHERE id % 8 = 2`).run(productImages[2]);
db.prepare(`UPDATE products SET image_url = ? WHERE id % 8 = 3`).run(productImages[3]);
db.prepare(`UPDATE products SET image_url = ? WHERE id % 8 = 4`).run(productImages[4]);
db.prepare(`UPDATE products SET image_url = ? WHERE id % 8 = 5`).run(productImages[5]);
db.prepare(`UPDATE products SET image_url = ? WHERE id % 8 = 6`).run(productImages[6]);
db.prepare(`UPDATE products SET image_url = ? WHERE id % 8 = 7`).run(productImages[7]);

db.prepare(`UPDATE products SET gallery_images = ?`).run(galleryStr);

db.prepare(`UPDATE shops SET logo_url = ? WHERE id % 4 = 0`).run(shopLogos[0]);
db.prepare(`UPDATE shops SET logo_url = ? WHERE id % 4 = 1`).run(shopLogos[1]);
db.prepare(`UPDATE shops SET logo_url = ? WHERE id % 4 = 2`).run(shopLogos[2]);
db.prepare(`UPDATE shops SET logo_url = ? WHERE id % 4 = 3`).run(shopLogos[3]);

db.prepare(`UPDATE shops SET banner_url = ? WHERE id % 4 = 0`).run(shopBanners[0]);
db.prepare(`UPDATE shops SET banner_url = ? WHERE id % 4 = 1`).run(shopBanners[1]);
db.prepare(`UPDATE shops SET banner_url = ? WHERE id % 4 = 2`).run(shopBanners[2]);
db.prepare(`UPDATE shops SET banner_url = ? WHERE id % 4 = 3`).run(shopBanners[3]);

db.prepare(`UPDATE competitions SET image_url = ? WHERE id % 3 = 0`).run(compImages[0]);
db.prepare(`UPDATE competitions SET image_url = ? WHERE id % 3 = 1`).run(compImages[1]);
db.prepare(`UPDATE competitions SET image_url = ? WHERE id % 3 = 2`).run(compImages[2]);

console.log("Database updated with African fashion images.");
