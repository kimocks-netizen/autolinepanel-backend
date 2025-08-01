// models/supabaseModel.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = {
  supabase,

  async createQuote(quoteData) {
    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select('*');
    return { data, error };
  },
  async getQuotes() {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false }); // 🔁 sort DESCENDING (latest first)

    return { data, error };
  },
  async getAdminByEmail(email) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },
    async updateQuoteStatus(id, status) {
    const { data, error } = await supabase
      .from('quotes')
      .update({ status })
      .eq('id', id)
      .select('*');

    return { data, error };
  },
  async createInvoice(invoiceData, repairItems) {
    // Start a transaction
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select('*');

    if (invoiceError) {
      return { data: null, error: invoiceError };
    }

    // Create invoice items
    if (repairItems && repairItems.length > 0) {
      const itemsToInsert = repairItems.map(item => ({
        invoice_id: invoice[0].id,
        repair_type: item.repair_type,
        description: item.description,
        amount: parseFloat(item.amount) || 0
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) {
        return { data: null, error: itemsError };
      }
    }

    return { data: invoice, error: null };
  },
  async getInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (
          id,
          repair_type,
          description,
          amount
        )
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },
  async getInvoiceById(id) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (
          id,
          repair_type,
          description,
          amount
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },
  async updateInvoice(id, updateData) {
    const { data, error } = await supabase
      .from('invoices')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select('*');
    return { data, error };
  },
  async generateInvoiceNumber() {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      return 'INV-001';
    }
    
    const lastNumber = data[0].invoice_number;
    const match = lastNumber.match(/INV-(\d+)/);
    if (match) {
      const nextNumber = parseInt(match[1]) + 1;
      return `INV-${nextNumber.toString().padStart(3, '0')}`;
    }
    
    return 'INV-001';
  }
};
