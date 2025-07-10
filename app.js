require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Routes
app.use('/api', authRoutes);
app.use('/api', quoteRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something broke!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));