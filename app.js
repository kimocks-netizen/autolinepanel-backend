require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://autoline-frontend.vercel.app',
    'https://autolinepanel-backend-production.up.railway.app',
    'https://autolinepanel-backend-staging.up.railway.app',
    'https://autolinepanel-backend-gixq.vercel.app',
    'https://autolinepanelshop.com',
    'http://autolinepanelshop.com',
    'https://www.autolinepanelshop.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Range', 'Content-Length', 'Content-Disposition'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api', quoteRoutes);
app.use('/api/admin', invoiceRoutes);
app.use('/api', galleryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something broke!' });
});

// Export the app for Vercel
module.exports = app;

// Only listen in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}