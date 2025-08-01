require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

// Middleware
// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://autoline-frontend.vercel.app',
    'https://autolinepanel-backend-production.up.railway.app',
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

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Routes
app.use('/api', authRoutes);
app.use('/api', quoteRoutes);
app.use('/api/admin', invoiceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something broke!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));