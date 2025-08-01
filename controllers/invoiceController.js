const supabaseModel = require('../models/supabaseModel');

module.exports = {
  async createInvoice(req, res) {
    try {
      const {
        quote_id,
        customer_name,
        customer_phone,
        car_model,
        vehicle_reg_number,
        repair_type,
        description,
        invoice_date,
        total_amount
      } = req.body;

      // Generate invoice number
      const invoice_number = await supabaseModel.generateInvoiceNumber();

      const invoiceData = {
        invoice_number,
        quote_id: quote_id || null,
        customer_name,
        customer_phone,
        car_model,
        vehicle_reg_number,
        repair_type,
        description,
        invoice_date: invoice_date || new Date().toISOString().split('T')[0],
        total_amount: total_amount || 0
      };

      const { data, error } = await supabaseModel.createInvoice(invoiceData);

      if (error) {
        return res.status(500).json({ status: 'error', message: error.message });
      }

      res.json({ status: 'success', message: 'Invoice created successfully!', data: data[0] });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  async getAllInvoices(req, res) {
    try {
      const { data, error } = await supabaseModel.getInvoices();
      
      if (error) {
        return res.status(500).json({ status: 'error', message: error.message });
      }

      res.json({ status: 'success', data });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  async getInvoiceById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseModel.getInvoiceById(id);
      
      if (error) {
        return res.status(500).json({ status: 'error', message: error.message });
      }

      if (!data) {
        return res.status(404).json({ status: 'error', message: 'Invoice not found' });
      }

      res.json({ status: 'success', data });
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  async updateInvoice(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabaseModel.updateInvoice(id, updateData);

      if (error) {
        return res.status(500).json({ status: 'error', message: error.message });
      }

      res.json({ status: 'success', message: 'Invoice updated successfully!', data: data[0] });
    } catch (error) {
      console.error('Error updating invoice:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
}; 