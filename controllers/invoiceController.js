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
        total_amount,
        repair_items,
        document_type = 'invoice'
      } = req.body;

      // Generate document number based on type
      const invoice_number = document_type === 'quote' 
        ? await supabaseModel.generateQuoteNumber()
        : await supabaseModel.generateInvoiceNumber();

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
        total_amount: total_amount || 0,
        document_type
      };

      const { data, error } = await supabaseModel.createInvoice(invoiceData, repair_items);

      if (error) {
        return res.status(500).json({ status: 'error', message: error.message });
      }

      const message = document_type === 'quote' ? 'Quote created successfully!' : 'Invoice created successfully!';
      res.json({ status: 'success', message, data: data[0] });
    } catch (error) {
      console.error('Error creating document:', error);
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
  },

  async convertDocument(req, res) {
    try {
      const { id } = req.params;
      const { newType } = req.body; // 'invoice' or 'quote'

      console.log('Converting document:', { id, newType });

      if (!['invoice', 'quote'].includes(newType)) {
        return res.status(400).json({ status: 'error', message: 'Invalid document type' });
      }

      console.log('Calling supabaseModel.convertDocument...');
      const { data, error } = await supabaseModel.convertDocument(id, newType);

      if (error) {
        console.error('Conversion error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return res.status(500).json({ status: 'error', message: error.message });
      }

      console.log('Conversion successful:', { originalId: id, newData: data });
      const message = newType === 'quote' ? 'Document converted to quote successfully!' : 'Document converted to invoice successfully!';
      res.json({ status: 'success', message, data });
    } catch (error) {
      console.error('Error converting document:', error);
      console.error('Full error object:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  async deleteInvoice(req, res) {
    try {
      const { id } = req.params;

      console.log('Deleting invoice:', { id });

      const { error } = await supabaseModel.deleteInvoice(id);

      if (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ status: 'error', message: error.message });
      }

      console.log('Invoice deleted successfully');
      res.json({ status: 'success', message: 'Invoice deleted successfully!' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
}; 