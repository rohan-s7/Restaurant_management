import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialReservations } from '../data/initialReservationData';
import { generateReservationId } from '../utils/helpers';
import { tableService } from './tableService';

const LOCAL_STORAGE_KEY = 'rms_reservations';

const getLocalReservations = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialReservations;
  } catch {
    return initialReservations;
  }
};

const setLocalReservations = (res) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res));
  } catch (e) {
    console.error(e);
  }
};

const normalizeReservation = (r) => {
  if (!r) return null;
  const rawStatus = (r.status || 'pending').toLowerCase();
  const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

  return {
    id: r.id,
    customer_id: r.customer_id,
    table_id: r.table_id,
    customerName: r.users?.full_name || r.customerName || 'Valued Guest',
    customerEmail: r.users?.email || r.customerEmail || '',
    customerPhone: r.users?.phone || r.customerPhone || '',
    date: r.reservation_date || r.date,
    reservation_date: r.reservation_date || r.date,
    time: r.reservation_time ? r.reservation_time.slice(0, 5) : (r.time || '19:30'),
    reservation_time: r.reservation_time || r.time,
    guests: Number(r.guest_count || r.guests || 2),
    guest_count: Number(r.guest_count || r.guests || 2),
    tableNumber: r.restaurant_tables?.table_number || r.tableNumber || '01',
    table_number: r.restaurant_tables?.table_number || r.tableNumber || '01',
    status: displayStatus,
    db_status: rawStatus,
    specialRequest: r.specialRequest || r.special_request || '',
    created_at: r.created_at || r.createdAt
  };
};

export const reservationService = {
  /**
   * Get all reservations
   */
  getReservations: async () => {
    if (!isSupabaseConfigured) {
      return getLocalReservations().map(normalizeReservation);
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('*, users(id, full_name, email, phone), restaurant_tables(id, table_number)')
      .order('reservation_date', { ascending: false });

    if (error) {
      console.warn('Error fetching reservations from Supabase, using local fallback:', error);
      return getLocalReservations().map(normalizeReservation);
    }

    if (!data || data.length === 0) {
      return getLocalReservations().map(normalizeReservation);
    }

    return data.map(normalizeReservation);
  },

  getAllReservations: async () => {
    return reservationService.getReservations();
  },

  /**
   * Filter reservations by customer email
   */
  getReservationsByEmail: async (email) => {
    const all = await reservationService.getReservations();
    if (!email) return all;
    return all.filter((r) => r.customerEmail?.toLowerCase() === email.toLowerCase());
  },

  /**
   * Create a new reservation
   */
  createReservation: async (resData) => {
    const rawStatus = (resData.status || 'confirmed').toLowerCase();

    if (!isSupabaseConfigured) {
      const reservations = getLocalReservations();
      const newRes = {
        ...resData,
        id: generateReservationId(),
        status: rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1),
        created_at: new Date().toISOString()
      };
      const updated = [newRes, ...reservations];
      setLocalReservations(updated);
      return normalizeReservation(newRes);
    }

    // Try resolving table_id if table number was passed
    let tableId = resData.table_id;
    if (!tableId && resData.tableNumber) {
      const tables = await tableService.getTables();
      const match = tables.find((t) => t.number === resData.tableNumber || t.table_number === resData.tableNumber);
      if (match) tableId = match.id;
    }

    // Resolve user customer_id if auth session is active
    let customerId = resData.customer_id;
    if (!customerId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();
        if (profile) customerId = profile.id;
      }
    }

    const payload = {
      customer_id: customerId || null,
      table_id: tableId || null,
      reservation_date: resData.date || resData.reservation_date,
      reservation_time: resData.time || resData.reservation_time,
      guest_count: Number(resData.guests || resData.guest_count || 2),
      status: rawStatus
    };

    const { data, error } = await supabase
      .from('reservations')
      .insert([payload])
      .select('*, users(id, full_name, email, phone), restaurant_tables(id, table_number)')
      .single();

    if (error) {
      console.warn('Error inserting reservation into Supabase, using local fallback:', error);
      const reservations = getLocalReservations();
      const newRes = {
        ...resData,
        id: generateReservationId(),
        status: rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1),
        created_at: new Date().toISOString()
      };
      setLocalReservations([newRes, ...reservations]);
      return normalizeReservation(newRes);
    }

    return normalizeReservation(data);
  },

  /**
   * Update reservation status ('pending' | 'confirmed' | 'completed' | 'cancelled')
   */
  updateReservation: async (id, status) => {
    const rawStatus = status.toLowerCase();

    if (!isSupabaseConfigured) {
      const reservations = getLocalReservations();
      const index = reservations.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Reservation not found');

      reservations[index].status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
      setLocalReservations(reservations);
      return normalizeReservation(reservations[index]);
    }

    const { data, error } = await supabase
      .from('reservations')
      .update({ status: rawStatus })
      .eq('id', id)
      .select('*, users(id, full_name, email, phone), restaurant_tables(id, table_number)')
      .single();

    if (error) {
      console.error('Error updating reservation in Supabase:', error);
      throw error;
    }

    return normalizeReservation(data);
  },

  updateReservationStatus: async (id, status) => {
    return reservationService.updateReservation(id, status);
  }
};

export default reservationService;
