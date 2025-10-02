// seed.js
// Run with: `node seed.js`
// This inserts an admin, a client, a few locations, and example items

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'storage.db');
const db = new Database(dbPath);

console.log("🌱 Seeding Halifax Hold'em database...");

// Insert admin user
const adminStmt = db.prepare(`
  INSERT INTO users (name, email, password, role)
  VALUES (@name, @mail, @pass, 'admin')
`);

adminStmt.run({
  name: 'Admin User',
  mail: 'admin@example.com',
  pass: 'admin1234'
});

// Insert client user
const clientStmt = db.prepare(`
  INSERT INTO users (name, email, password, role)
  VALUES (@name, @mail, @pass, 'client')
`);

clientStmt.run({
  name: 'Client One',
  mail: 'client@example.com',
  pass: 'client1234'
});

// Fetch client ID to assign items
const clientId = db.prepare(`SELECT id FROM users WHERE email = ?`).get('client@example.com').id;

// Insert sample locations
const insertLocation = db.prepare(`
  INSERT INTO locations (name, description) VALUES (@name, @desc)
`);

insertLocation.run({ name: 'Unit A1', desc: 'Front row, near loading bay' });
insertLocation.run({ name: 'Unit B2', desc: 'Second row, climate-controlled section' });

// Get one location ID
const location = db.prepare(`SELECT id FROM locations WHERE name = ?`).get('Unit A1');

// Insert sample items
const insertItem = db.prepare(`
  INSERT INTO items (name, description, quantity, owner_id, location_id, photo_url, qr_url)
  VALUES (@name, @desc, @qty, @owner, @loc, @photo, @qr)
`);

insertItem.run({
  name: 'Antique Desk',
  desc: 'Early 1900s oak writing desk.',
  qty: 1,
  owner: clientId,
  loc: location.id,
  photo: 'https://example.com/photos/desk.jpg',
  qr: 'https://halifax-holdem.com/items/1'
});

insertItem.run({
  name: 'Seasonal Decorations',
  desc: 'Boxes of winter holiday decorations.',
  qty: 5,
  owner: clientId,
  loc: location.id,
  photo: 'https://example.com/photos/decor.jpg',
  qr: 'https://halifax-holdem.com/items/2'
});

console.log("✅ Seed data inserted successfully.");
db.close();
