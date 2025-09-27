const supabaseModel = require('../models/supabaseModel');

module.exports = {
  // Get all services (public)
  async getServices(req, res) {
    try {
      const { data, error } = await supabaseModel.getServices();
      
      if (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch services' });
      }

      res.json({ status: 'success', data });
    } catch (error) {
      console.error('Error in getServices:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  // Get all services (admin)
  async getAdminServices(req, res) {
    try {
      const { data, error } = await supabaseModel.getAdminServices();
      
      if (error) {
        console.error('Error fetching admin services:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch services' });
      }

      res.json({ status: 'success', data });
    } catch (error) {
      console.error('Error in getAdminServices:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  // Create new service
  async createService(req, res) {
    try {
      const { title, description, image_url, details } = req.body;

      if (!title) {
        return res.status(400).json({ status: 'error', message: 'Title is required' });
      }

      const { data, error } = await supabaseModel.createService({
        title,
        description,
        image_url,
        details
      });

      if (error) {
        console.error('Error creating service:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to create service' });
      }

      res.json({ status: 'success', message: 'Service created successfully', data });
    } catch (error) {
      console.error('Error in createService:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  // Update service
  async updateService(req, res) {
    try {
      const { id } = req.params;
      const { title, description, image_url, details, display_order, is_active } = req.body;

      console.log('Update request received:', { 
        id, 
        title, 
        is_active, 
        is_active_type: typeof is_active,
        display_order,
        full_body: req.body 
      });

      if (!title) {
        return res.status(400).json({ status: 'error', message: 'Title is required' });
      }

      const { data, error } = await supabaseModel.updateService(id, {
        title,
        description,
        image_url,
        details,
        display_order,
        is_active
      });

      if (error) {
        console.error('Error updating service:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return res.status(500).json({ status: 'error', message: `Failed to update service: ${error.message}` });
      }

      console.log('Service updated successfully:', data);
      res.json({ status: 'success', message: 'Service updated successfully', data });
    } catch (error) {
      console.error('Error in updateService:', error);
      res.status(500).json({ status: 'error', message: `Internal server error: ${error.message}` });
    }
  },

  // Delete service
  async deleteService(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabaseModel.deleteService(id);

      if (error) {
        console.error('Error deleting service:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to delete service' });
      }

      res.json({ status: 'success', message: 'Service deleted successfully' });
    } catch (error) {
      console.error('Error in deleteService:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },


};
