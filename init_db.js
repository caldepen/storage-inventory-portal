// init_db.js
// Run this once to initialize the database: `node init_db.js`

const Database = require('better-sqlite3');
const path = require('path');

// DB path from env or default to local file
const dbPath = process.env.DB_PATH || path.join(__dirname, 'storage.db');
const db = new Database(dbPath);

console.log("🗄️ Initializing Halifax Hold'em database...");

// Drop old tables (optional - comment out if you don't want resets during development)
db.exec(`
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS items;
  DROP TABLE IF EXISTS locations;
`);

// --- Users table ---
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'client')) NOT NULL DEFAULT 'client',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// --- Locations table ---
db.exec(`
  CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// --- Items table ---
db.exec(`
  CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    owner_id INTEGER NOT NULL,
    location_id INTEGER,
    photo_url TEXT,
    qr_url TEXT,
    date_received DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
  );
`);

console.log("✅ Database initialized successfully at:", dbPath);
db.close();
