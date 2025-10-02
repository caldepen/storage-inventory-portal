require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Session setup ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false
}));

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// --- View engine ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Global middleware for views ---
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// --- Routes ---
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/client', clientRoutes);

// --- Home redirect ---
app.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/client/dashboard');
    }
  }
  res.redirect('/login');
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`✅ Halifax Hold'em server running on http://localhost:${PORT}`);
});
