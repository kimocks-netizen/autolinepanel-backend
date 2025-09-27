const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/services', servicesController.getServices);

// Admin routes (protected)
router.get('/admin/services', authMiddleware, servicesController.getAdminServices);
router.post('/admin/services', authMiddleware, servicesController.createService);
router.put('/admin/services/:id', authMiddleware, servicesController.updateService);
router.delete('/admin/services/:id', authMiddleware, servicesController.deleteService);

module.exports = router;
