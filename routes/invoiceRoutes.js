const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Create new invoice
router.post('/invoices', invoiceController.createInvoice);

// Get all invoices
router.get('/invoices', invoiceController.getAllInvoices);

// Get invoice by ID
router.get('/invoices/:id', invoiceController.getInvoiceById);

// Update invoice
router.put('/invoices/:id', invoiceController.updateInvoice);

// Convert document (invoice to quote or vice versa)
router.post('/invoices/:id/convert', invoiceController.convertDocument);

// Delete invoice
router.delete('/invoices/:id', invoiceController.deleteInvoice);

module.exports = router; 