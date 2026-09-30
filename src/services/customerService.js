import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialCustomers } from '../data/initialUserData';

const LOCAL_STORAGE_KEY = 'rms_customers';

const isUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const getLocalCustomers = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialCustomers;
  } catch {
    return initialCustomers;
  }
};

const setLocalCustomers = (customers) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error('Failed saving customers to localStorage:', e);
  }
};

const normalizeCustomer = (u, orders = []) => {
  if (!u) return null;

  const customerOrders = orders.filter(
    (o) => o.customer_id === u.id || o.customerId === u.id || o.customerEmail === u.email
  );
  const totalSpent = customerOrders.reduce((sum, o) => sum + Number(o.total_amount || o.total || 0), 0);

  return {
    id: u.id,
    name: u.full_name || u.name || 'Valued Guest',
    full_name: u.full_name || u.name || 'Valued Guest',
    email: u.email || '',
    phone: u.phone || '+91 98765 00000',
    address: u.address || '',
    role: 'CUSTOMER',
    status: u.status || 'Active',
    avatar: u.profile_image || u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    profile_image: u.profile_image || u.avatar,
    ordersCount: customerOrders.length > 0 ? customerOrders.length : Number(u.ordersCount || 1),
    totalSpent: totalSpent > 0 ? totalSpent : Number(u.totalSpent || 450),
    joinDate: u.created_at ? u.created_at.split('T')[0] : u.joinDate || '2026-01-15'
  };
};

export const customerService = {
  /**
   * Get all customers from Supabase or fallback
   */
  getAllCustomers: async () => {
    if (!isSupabaseConfigured) {
      return getLocalCustomers().map((c) => normalizeCustomer(c));
    }

    try {
      const { data: usersData, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (error || !usersData || usersData.length === 0) {
        console.warn('Error fetching customers from Supabase, using local fallback:', error);
        return getLocalCustomers().map((c) => normalizeCustomer(c));
      }

      // Also get orders to compute stats
      let orders = [];
      const { data: ordersData } = await supabase.from('orders').select('customer_id, total_amount');
      if (ordersData) orders = ordersData;

      return usersData.map((u) => normalizeCustomer(u, orders));
    } catch (err) {
      console.warn('Customers query failed, using local fallback:', err);
      return getLocalCustomers().map((c) => normalizeCustomer(c));
    }
  },

  /**
   * Toggle customer active / inactive status
   */
  toggleCustomerStatus: async (id) => {
    const customers = getLocalCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index !== -1) {
      customers[index].status = customers[index].status === 'Active' ? 'Inactive' : 'Active';
      setLocalCustomers(customers);
      return normalizeCustomer(customers[index]);
    }

    return null;
  },

  /**
   * Update customer profile in Supabase
   */
  updateCustomer: async (id, data) => {
    if (isSupabaseConfigured && isUUID(id)) {
      try {
        const updatePayload = {};
        if (data.name) updatePayload.full_name = data.name;
        if (data.phone) updatePayload.phone = data.phone;
        if (data.address) updatePayload.address = data.address;
        if (data.avatar) updatePayload.profile_image = data.avatar;

        const { data: updatedUser, error } = await supabase
          .from('users')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (!error && updatedUser) {
          return normalizeCustomer(updatedUser);
        }
      } catch (err) {
        console.warn('Supabase customer update failed:', err);
      }
    }

    // Fallback to local storage
    const customers = getLocalCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return { id, ...data };
    }

    customers[index] = { ...customers[index], ...data };
    setLocalCustomers(customers);
    return normalizeCustomer(customers[index]);
  }
};
