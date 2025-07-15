const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/quotes', quoteController.submitQuote);

// Admin (Protected)
router.get('/admin/quotes', authMiddleware, quoteController.getAllQuotes);
router.put('/admin/quotes/:id/status', authMiddleware, quoteController.updateQuoteStatus); 
module.exports = router;