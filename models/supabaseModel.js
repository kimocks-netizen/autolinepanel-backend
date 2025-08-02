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

    // Create invoice items if table exists
    if (repairItems && repairItems.length > 0) {
      try {
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
          console.log('Invoice items creation failed, but invoice was created:', itemsError);
          // Don't fail the whole operation if invoice_items table doesn't exist
        }
      } catch (error) {
        console.log('Invoice items table might not exist yet:', error);
        // Continue with invoice creation even if items fail
      }
    }

    return { data: invoice, error: null };
  },
  async getInvoices() {
    try {
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
    } catch (error) {
      // Fallback if invoice_items table doesn't exist yet
      const { data, error: fallbackError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error: fallbackError };
    }
  },
  async getInvoiceById(id) {
    try {
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
    } catch (error) {
      // Fallback if invoice_items table doesn't exist yet
      const { data, error: fallbackError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error: fallbackError };
    }
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
  },

  async generateQuoteNumber() {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('document_type', 'quote')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      return 'QUO-001';
    }
    
    const lastNumber = data[0].invoice_number;
    const match = lastNumber.match(/QUO-(\d+)/);
    if (match) {
      const nextNumber = parseInt(match[1]) + 1;
      return `QUO-${nextNumber.toString().padStart(3, '0')}`;
    }
    
    return 'QUO-001';
  },

  async convertDocument(id, newType) {
    try {
      // Get the current document
      const { data: currentDoc, error: fetchError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        return { data: null, error: fetchError };
      }

      // Generate new number based on type
      const newNumber = newType === 'quote' ? await this.generateQuoteNumber() : await this.generateInvoiceNumber();

      // Create new document
      const newDocData = {
        ...currentDoc,
        id: undefined, // Let it generate new ID
        invoice_number: newNumber,
        document_type: newType,
        status: newType === 'quote' ? 'draft' : 'draft',
        original_invoice_id: currentDoc.original_invoice_id || currentDoc.id,
        converted_from_id: currentDoc.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      delete newDocData.id;

      const { data: newDoc, error: createError } = await supabase
        .from('invoices')
        .insert([newDocData])
        .select('*');

      if (createError) {
        return { data: null, error: createError };
      }

      return { data: newDoc[0], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
