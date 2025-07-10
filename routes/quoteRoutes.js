const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/quotes', quoteController.submitQuote);

// Admin routes (add auth middleware later)
//router.get('/admin/quotes', quoteController.getAllQuotes);
// Admin (Protected)
router.get('/admin/quotes', authMiddleware, quoteController.getAllQuotes);

module.exports = router;