const supabaseModel = require('../models/supabaseModel');

module.exports = {
  async submitQuote(req, res) {
    const { name, phone, carModel, description, images } = req.body;
    
    const { data, error } = await supabaseModel.createQuote({
      name,
      phone,
      car_model: carModel,
      damage_description: description,
      images,
      status: 'pending'
    });

    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }

    res.json({ status: 'success', message: 'Quote submitted!', data });
  },

  async getAllQuotes(req, res) {
    const { data, error } = await supabaseModel.getQuotes();
    
    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }

    res.json({ status: 'success', data });
  }
};