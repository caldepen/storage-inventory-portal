// -------------------------------
// 📦 Storage Inventory Portal
// app.js - Main Express Server
// -------------------------------

require('dotenv').config(); // Load environment variables

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

// ✅ Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');

// ✅ Initialize Express
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Session (basic example - for production, use a store like MongoStore)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Serve static frontend files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/storage_inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Register routes
app.use('/auth', authRoutes);    // login, signup, logout
app.use('/admin', adminRoutes);  // inventory management
app.use('/client', clientRoutes); // public client access

// ✅ Default route
app.get('/', (req, res) => {
  res.send('📦 Storage Inventory Portal API is running...');
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
