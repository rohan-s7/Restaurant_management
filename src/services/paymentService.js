import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

const normalizePayment = (p) => {
  if (!p) return null;
  const rawStatus = (p.payment_status || p.status || 'paid').toLowerCase();
  const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
  const rawMethod = (p.payment_method || p.method || 'upi').toLowerCase();
  const displayMethod = rawMethod === 'upi' ? 'UPI' : rawMethod.charAt(0).toUpperCase() + rawMethod.slice(1);

  return {
    id: p.id,
    paymentId: p.transaction_id || p.id,
    orderId: p.order_id || p.orderId,
    customer: p.orders?.users?.full_name || p.customer || 'Customer',
    amount: Number(p.amount || 0),
    method: displayMethod,
    payment_method: rawMethod,
    status: displayStatus,
    payment_status: rawStatus,
    transaction_id: p.transaction_id,
    date: p.created_at || p.date || new Date().toISOString(),
    created_at: p.created_at || p.date
  };
};

export const paymentService = {
  /**
   * Get all payment records from Supabase
   */
  getPayments: async () => {
    if (!isSupabaseConfigured) {
      return [];
    }

    const { data, error } = await supabase
      .from('payments')
      .select('*, orders(id, total_amount, order_type, users(full_name, email))')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching payments from Supabase:', error);
      return [];
    }

    return (data || []).map(normalizePayment);
  },

  /**
   * Record a payment for an order
   */
  createPayment: async (paymentData) => {
    const rawMethod = (paymentData.payment_method || paymentData.method || 'upi').toLowerCase();
    const rawStatus = (paymentData.payment_status || paymentData.status || 'paid').toLowerCase();

    if (!isSupabaseConfigured) {
      return normalizePayment({
        id: `pay-${Date.now()}`,
        ...paymentData,
        created_at: new Date().toISOString()
      });
    }

    const payload = {
      order_id: paymentData.order_id || paymentData.orderId,
      amount: Number(paymentData.amount),
      payment_method: rawMethod,
      payment_status: rawStatus,
      transaction_id: paymentData.transaction_id || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    const { data, error } = await supabase
      .from('payments')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error inserting payment in Supabase:', error);
      throw error;
    }

    return normalizePayment(data);
  }
};

export default paymentService;
