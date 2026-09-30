import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialOrders } from '../data/initialOrderData';
import { generateOrderId } from '../utils/helpers';

const LOCAL_STORAGE_KEY = 'rms_orders';

const isUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const getLocalOrders = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialOrders;
  } catch {
    return initialOrders;
  }
};

const setLocalOrders = (orders) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed saving orders to localStorage:', e);
  }
};

const formatOrderType = (raw) => {
  if (!raw) return 'Dine-in';
  const lower = raw.toLowerCase().replace('_', '-');
  if (lower.includes('dine')) return 'Dine-in';
  if (lower.includes('delivery')) return 'Delivery';
  if (lower.includes('takeaway')) return 'Takeaway';
  return 'Dine-in';
};

const toDbOrderType = (raw) => {
  if (!raw) return 'dine_in';
  const lower = raw.toLowerCase();
  if (lower.includes('dine')) return 'dine_in';
  if (lower.includes('delivery')) return 'delivery';
  if (lower.includes('takeaway')) return 'takeaway';
  return 'dine_in';
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const normalizeOrder = (order) => {
  if (!order) return null;

  const rawStatus = (order.order_status || order.status || 'new').toLowerCase();
  const displayStatus =
    rawStatus === 'preparing'
      ? 'Preparing'
      : rawStatus === 'ready'
      ? 'Ready'
      : rawStatus === 'confirmed'
      ? 'Confirmed'
      : rawStatus === 'completed'
      ? 'Completed'
      : rawStatus === 'cancelled'
      ? 'Cancelled'
      : 'New';

  const items = Array.isArray(order.order_items) && order.order_items.length > 0
    ? order.order_items.map((item) => ({
        id: item.food_id || item.food?.id || item.id,
        food_id: item.food_id,
        name: item.food?.name || item.name || 'Gourmet Dish',
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        image: item.food?.image_url || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
      }))
    : Array.isArray(order.items)
    ? order.items
    : [];

  const customerName =
    order.customer?.full_name ||
    order.customerName ||
    order.customer_name ||
    'Valued Guest';

  const customerEmail =
    order.customer?.email ||
    order.customerEmail ||
    'customer@restaurant.com';

  const customerPhone =
    order.customer?.phone ||
    order.customerPhone ||
    '+91 98765 00000';

  const total = Number(order.total_amount || order.total || 0);
  const paymentMethod =
    order.payments?.[0]?.payment_method
      ? capitalize(order.payments[0].payment_method)
      : order.paymentMethod || 'UPI';

  const paymentStatus =
    order.payments?.[0]?.payment_status
      ? capitalize(order.payments[0].payment_status)
      : capitalize(order.payment_status || order.paymentStatus || 'Paid');

  return {
    id: order.id,
    orderId: order.id,
    customerId: order.customer_id || order.customerId,
    customer_id: order.customer_id || order.customerId,
    customerName,
    customerEmail,
    customerPhone,
    orderType: formatOrderType(order.order_type || order.orderType),
    order_type: toDbOrderType(order.order_type || order.orderType),
    tableNumber: order.tableNumber || (order.order_type === 'dine_in' ? '03' : null),
    deliveryAddress: order.deliveryAddress || (order.order_type === 'delivery' ? 'Flat 4B, Green Meadows, Koramangala' : null),
    items,
    subtotal: order.subtotal || Math.round(total * 0.9),
    tax: order.tax || Math.round(total * 0.05 * 100) / 100,
    serviceCharge: order.serviceCharge || Math.round(total * 0.05 * 100) / 100,
    total,
    total_amount: total,
    paymentMethod,
    paymentStatus,
    payment_status: paymentStatus.toLowerCase(),
    status: displayStatus,
    order_status: rawStatus,
    createdAt: order.created_at || order.createdAt || new Date().toISOString(),
    created_at: order.created_at || order.createdAt || new Date().toISOString(),
    estimatedTime: order.estimatedTime || (rawStatus === 'completed' ? 'Delivered' : '20-25 mins'),
    notes: order.notes || ''
  };
};

export const orderService = {
  /**
   * Fetch all orders with relations (customer, order items, payments)
   */
  getAllOrders: async () => {
    if (!isSupabaseConfigured) {
      return getLocalOrders().map(normalizeOrder);
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:users!customer_id (id, full_name, email, phone),
          order_items (
            id,
            food_id,
            quantity,
            price,
            food:food_items!food_id (id, name, image_url)
          ),
          payments (
            id,
            amount,
            payment_method,
            payment_status,
            transaction_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching orders from Supabase, using local fallback:', error);
        return getLocalOrders().map(normalizeOrder);
      }

      if (!data || data.length === 0) {
        return getLocalOrders().map(normalizeOrder);
      }

      return data.map(normalizeOrder);
    } catch (err) {
      console.warn('Orders query failed, using local fallback:', err);
      return getLocalOrders().map(normalizeOrder);
    }
  },

  /**
   * Get single order by ID
   */
  getOrderById: async (id) => {
    if (!isSupabaseConfigured || !isUUID(id)) {
      const orders = getLocalOrders();
      return orders.find((o) => o.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:users!customer_id (id, full_name, email, phone),
          order_items (
            id,
            food_id,
            quantity,
            price,
            food:food_items!food_id (id, name, image_url)
          ),
          payments (
            id,
            amount,
            payment_method,
            payment_status,
            transaction_id
          )
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        const local = getLocalOrders().find((o) => o.id === id);
        return local ? normalizeOrder(local) : null;
      }

      return normalizeOrder(data);
    } catch (err) {
      console.warn('Error getting order by id:', err);
      const local = getLocalOrders().find((o) => o.id === id);
      return local ? normalizeOrder(local) : null;
    }
  },

  /**
   * Get orders placed by a specific customer
   */
  getOrdersByCustomerId: async (customerId) => {
    if (!isSupabaseConfigured) {
      const orders = getLocalOrders();
      return orders
        .filter((o) => o.customerId === customerId || o.customerEmail === customerId)
        .map(normalizeOrder);
    }

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer:users!customer_id (id, full_name, email, phone),
          order_items (
            id,
            food_id,
            quantity,
            price,
            food:food_items!food_id (id, name, image_url)
          ),
          payments (
            id,
            amount,
            payment_method,
            payment_status
          )
        `)
        .order('created_at', { ascending: false });

      if (isUUID(customerId)) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        const orders = getLocalOrders();
        return orders
          .filter((o) => o.customerId === customerId || o.customerEmail === customerId)
          .map(normalizeOrder);
      }

      return data.map(normalizeOrder);
    } catch (err) {
      console.warn('Error fetching customer orders:', err);
      const orders = getLocalOrders();
      return orders
        .filter((o) => o.customerId === customerId || o.customerEmail === customerId)
        .map(normalizeOrder);
    }
  },

  /**
   * Create new order in Supabase with line items and payment record
   */
  createOrder: async (orderData) => {
    const defaultCustomerId = 'a0000000-0000-0000-0000-000000000003';
    const effectiveCustomerId = isUUID(orderData.customerId)
      ? orderData.customerId
      : defaultCustomerId;

    if (!isSupabaseConfigured) {
      const orders = getLocalOrders();
      const newOrder = {
        ...orderData,
        id: generateOrderId(),
        status: 'New',
        createdAt: new Date().toISOString(),
        estimatedTime: '20-25 mins',
        paymentStatus: orderData.paymentMethod === 'Cash' ? 'Pending' : 'Paid'
      };
      setLocalOrders([newOrder, ...orders]);
      return normalizeOrder(newOrder);
    }

    try {
      const insertPayload = {
        customer_id: effectiveCustomerId,
        order_type: toDbOrderType(orderData.orderType),
        total_amount: Number(orderData.total || 0),
        payment_status: (orderData.paymentMethod || '').toLowerCase() === 'cash' ? 'pending' : 'paid',
        order_status: 'new'
      };

      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert([insertPayload])
        .select()
        .single();

      if (orderError) {
        console.warn('Error inserting order into Supabase, saving locally:', orderError);
        const orders = getLocalOrders();
        const fallbackOrder = {
          ...orderData,
          id: generateOrderId(),
          status: 'New',
          createdAt: new Date().toISOString(),
          estimatedTime: '20-25 mins',
          paymentStatus: orderData.paymentMethod === 'Cash' ? 'Pending' : 'Paid'
        };
        setLocalOrders([fallbackOrder, ...orders]);
        return normalizeOrder(fallbackOrder);
      }

      // Insert line items into order_items
      if (Array.isArray(orderData.items) && orderData.items.length > 0) {
        const lineItems = orderData.items.map((item) => ({
          order_id: createdOrder.id,
          food_id: isUUID(item.id) ? item.id : 'f0000000-0000-0000-0000-000000000001',
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0)
        }));

        await supabase.from('order_items').insert(lineItems);
      }

      // Insert payment record
      const paymentPayload = {
        order_id: createdOrder.id,
        amount: Number(orderData.total || 0),
        payment_method: (orderData.paymentMethod || 'upi').toLowerCase(),
        payment_status: (orderData.paymentMethod || '').toLowerCase() === 'cash' ? 'pending' : 'paid',
        transaction_id: `TXN-${Date.now()}`
      };

      await supabase.from('payments').insert([paymentPayload]);

      // Return composite normalized order
      const fullOrder = {
        ...createdOrder,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        serviceCharge: orderData.serviceCharge,
        deliveryFee: orderData.deliveryFee,
        tableNumber: orderData.tableNumber,
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: paymentPayload.payment_status
      };

      // Also sync to local cache
      const localOrders = getLocalOrders();
      setLocalOrders([normalizeOrder(fullOrder), ...localOrders]);

      return normalizeOrder(fullOrder);
    } catch (err) {
      console.warn('Order creation failed with error, falling back locally:', err);
      const orders = getLocalOrders();
      const fallbackOrder = {
        ...orderData,
        id: generateOrderId(),
        status: 'New',
        createdAt: new Date().toISOString(),
        estimatedTime: '20-25 mins',
        paymentStatus: orderData.paymentMethod === 'Cash' ? 'Pending' : 'Paid'
      };
      setLocalOrders([fallbackOrder, ...orders]);
      return normalizeOrder(fallbackOrder);
    }
  },

  /**
   * Update order status (New -> Confirmed -> Preparing -> Ready -> Completed / Cancelled)
   */
  updateOrderStatus: async (orderId, newStatus) => {
    const rawStatus = newStatus.toLowerCase();

    if (!isSupabaseConfigured || !isUUID(orderId)) {
      const orders = getLocalOrders();
      const index = orders.findIndex((o) => o.id === orderId);
      if (index === -1) {
        return { id: orderId, status: newStatus };
      }
      orders[index].status = newStatus;
      orders[index].order_status = rawStatus;
      if (newStatus === 'Completed') {
        orders[index].estimatedTime = 'Completed';
      }
      setLocalOrders(orders);
      return normalizeOrder(orders[index]);
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: rawStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.warn('Error updating order status in Supabase:', error);
        const orders = getLocalOrders();
        const index = orders.findIndex((o) => o.id === orderId);
        if (index !== -1) {
          orders[index].status = newStatus;
          setLocalOrders(orders);
          return normalizeOrder(orders[index]);
        }
      }

      // Also update local cache
      const localOrders = getLocalOrders();
      const idx = localOrders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        localOrders[idx].status = newStatus;
        localOrders[idx].order_status = rawStatus;
        setLocalOrders(localOrders);
      }

      return normalizeOrder(data);
    } catch (err) {
      console.warn('Update order status exception, falling back locally:', err);
      const orders = getLocalOrders();
      const index = orders.findIndex((o) => o.id === orderId);
      if (index !== -1) {
        orders[index].status = newStatus;
        setLocalOrders(orders);
        return normalizeOrder(orders[index]);
      }
      return { id: orderId, status: newStatus };
    }
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId) => {
    return orderService.updateOrderStatus(orderId, 'Cancelled');
  },

  /**
   * Supabase Realtime subscription for real-time live kitchen / manager updates
   */
  subscribeToOrders: (callback) => {
    if (!isSupabaseConfigured) {
      return {
        unsubscribe: () => {}
      };
    }

    try {
      const channel = supabase
        .channel('public:orders:realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            if (callback) {
              callback(payload);
            }
          }
        )
        .subscribe();

      return {
        unsubscribe: () => {
          supabase.removeChannel(channel);
        }
      };
    } catch (err) {
      console.warn('Could not establish orders realtime channel:', err);
      return {
        unsubscribe: () => {}
      };
    }
  }
};
