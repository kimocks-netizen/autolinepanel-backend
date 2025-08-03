const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/gallery', galleryController.getGalleryItems);

// Admin routes (protected)
router.get('/admin/gallery', authMiddleware, galleryController.getAdminGalleryItems);
router.post('/admin/gallery', authMiddleware, galleryController.createGalleryItem);
router.put('/admin/gallery/:id', authMiddleware, galleryController.updateGalleryItem);
router.delete('/admin/gallery/:id', authMiddleware, galleryController.deleteGalleryItem);
router.post('/admin/gallery/upload/:imageType', authMiddleware, galleryController.uploadGalleryImage);

module.exports = router; 