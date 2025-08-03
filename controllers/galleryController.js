const supabaseModel = require('../models/supabaseModel');

module.exports = {
  // Get all gallery items (public)
  async getGalleryItems(req, res) {
    try {
      const { data, error } = await supabaseModel.getGalleryItems();
      
      if (error) {
        console.error('Error fetching gallery items:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch gallery items' });
      }

      res.json({ status: 'success', data });
    } catch (error) {
      console.error('Error in getGalleryItems:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  // Get all gallery items (admin)
  async getAdminGalleryItems(req, res) {
    try {
      const { data, error } = await supabaseModel.getAdminGalleryItems();
      
      if (error) {
        console.error('Error fetching admin gallery items:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch gallery items' });
      }

      res.json({ status: 'success', data });
    } catch (error) {
      console.error('Error in getAdminGalleryItems:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  // Create new gallery item
  async createGalleryItem(req, res) {
    try {
      const { title, description, before_image_url, after_image_url } = req.body;

      if (!title) {
        return res.status(400).json({ status: 'error', message: 'Title is required' });
      }

      const { data, error } = await supabaseModel.createGalleryItem({
        title,
        description,
        before_image_url,
        after_image_url
      });

      if (error) {
        console.error('Error creating gallery item:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to create gallery item' });
      }

      res.json({ status: 'success', message: 'Gallery item created successfully', data });
    } catch (error) {
      console.error('Error in createGalleryItem:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  // Update gallery item
  async updateGalleryItem(req, res) {
    try {
      const { id } = req.params;
      const { title, description, before_image_url, after_image_url, display_order, is_active } = req.body;

      if (!title) {
        return res.status(400).json({ status: 'error', message: 'Title is required' });
      }

      const { data, error } = await supabaseModel.updateGalleryItem(id, {
        title,
        description,
        before_image_url,
        after_image_url,
        display_order,
        is_active
      });

      if (error) {
        console.error('Error updating gallery item:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to update gallery item' });
      }

      res.json({ status: 'success', message: 'Gallery item updated successfully', data });
    } catch (error) {
      console.error('Error in updateGalleryItem:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  // Delete gallery item
  async deleteGalleryItem(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabaseModel.deleteGalleryItem(id);

      if (error) {
        console.error('Error deleting gallery item:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to delete gallery item' });
      }

      res.json({ status: 'success', message: 'Gallery item deleted successfully' });
    } catch (error) {
      console.error('Error in deleteGalleryItem:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  // Upload gallery image
  async uploadGalleryImage(req, res) {
    try {
      const { imageType } = req.params; // 'before' or 'after'
      const { imageData, fileName } = req.body;

      if (!imageData || !fileName) {
        return res.status(400).json({ status: 'error', message: 'Image data and filename are required' });
      }

      const { data, error } = await supabaseModel.uploadGalleryImage(imageData, fileName, imageType);

      if (error) {
        console.error('Error uploading gallery image:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to upload image' });
      }

      res.json({ status: 'success', message: 'Image uploaded successfully', data });
    } catch (error) {
      console.error('Error in uploadGalleryImage:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
}; 