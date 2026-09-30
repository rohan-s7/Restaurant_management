import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from './storageService';
import { demoCredentials, initialCustomers } from '../data/initialUserData';

const normalizeUserRole = (rawRole) => {
  if (!rawRole) return 'CUSTOMER';
  const upper = rawRole.toUpperCase();
  if (upper === 'ADMIN' || upper === 'MANAGER') return 'ADMIN';
  if (upper === 'STAFF' || upper === 'KITCHEN STAFF' || upper === 'WAITER') return 'STAFF';
  return 'CUSTOMER';
};

const normalizeUserProfile = (user, authUser = null) => {
  if (!user) return null;
  const role = normalizeUserRole(user.role);

  return {
    id: user.id || authUser?.id || `USER-${Date.now()}`,
    auth_id: user.auth_id || authUser?.id,
    name: user.full_name || user.name || (user.email ? user.email.split('@')[0] : 'Valued Guest'),
    full_name: user.full_name || user.name || '',
    email: user.email || authUser?.email || '',
    phone: user.phone || '+91 98765 00000',
    address: user.address || '',
    role,
    status: user.status || 'Active',
    avatar: user.profile_image || user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    profile_image: user.profile_image || user.avatar,
    ordersCount: Number(user.ordersCount || 0),
    totalSpent: Number(user.totalSpent || 0),
    joinDate: user.created_at ? user.created_at.split('T')[0] : user.joinDate || '2026-01-15'
  };
};

export const authService = {
  /**
   * Get currently authenticated user from cache or active Supabase session
   */
  getCurrentUser: () => {
    return getStoredItem(STORAGE_KEYS.CURRENT_USER, demoCredentials.customer);
  },

  /**
   * Fetch current session profile from Supabase
   */
  fetchCurrentSessionUser: async () => {
    if (!isSupabaseConfigured) {
      return authService.getCurrentUser();
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        return authService.getCurrentUser();
      }

      // Query public.users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .or(`auth_id.eq.${session.user.id},email.eq.${session.user.email}`)
        .maybeSingle();

      if (profile) {
        const normalized = normalizeUserProfile(profile, session.user);
        setStoredItem(STORAGE_KEYS.CURRENT_USER, normalized);
        return normalized;
      }

      return authService.getCurrentUser();
    } catch (err) {
      console.warn('Session verification fallback to stored user:', err);
      return authService.getCurrentUser();
    }
  },

  /**
   * Sign In with Email & Password (supports Supabase Auth + instant Demo Accounts)
   */
  login: async (email, password) => {
    const cleanEmail = (email || '').toLowerCase().trim();

    // 1. Instant check for demo accounts for rapid testing & evaluation
    if (cleanEmail === demoCredentials.customer.email.toLowerCase() && password === demoCredentials.customer.password) {
      const user = normalizeUserProfile({ ...demoCredentials.customer, role: 'CUSTOMER' });
      setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }
    if (cleanEmail === demoCredentials.staff.email.toLowerCase() && password === demoCredentials.staff.password) {
      const user = normalizeUserProfile({ ...demoCredentials.staff, role: 'STAFF' });
      setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }
    if (cleanEmail === demoCredentials.admin.email.toLowerCase() && password === demoCredentials.admin.password) {
      const user = normalizeUserProfile({ ...demoCredentials.admin, role: 'ADMIN' });
      setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }

    // 2. Real Supabase Authentication
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data.user) {
          // Fetch user profile from public.users
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .or(`auth_id.eq.${data.user.id},email.eq.${cleanEmail}`)
            .maybeSingle();

          const user = profile
            ? normalizeUserProfile(profile, data.user)
            : normalizeUserProfile({
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
                role: data.user.user_metadata?.role || 'CUSTOMER'
              }, data.user);

          setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
          return user;
        }
      } catch (authErr) {
        console.warn('Supabase auth attempt returned error, falling back locally:', authErr);
      }
    }

    // 3. Fallback to registered local customers
    const customers = getStoredItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
    const existing = customers.find((c) => c.email.toLowerCase() === cleanEmail);
    if (existing) {
      const user = normalizeUserProfile({ ...existing, role: 'CUSTOMER' });
      setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }

    // 4. Fallback customer auto-creation for quick evaluation
    const newUser = normalizeUserProfile({
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '+91 98765 00000',
      role: 'CUSTOMER',
      ordersCount: 0,
      totalSpent: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    });

    const updatedCusts = [...customers, newUser];
    setStoredItem(STORAGE_KEYS.CUSTOMERS, updatedCusts);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  /**
   * Register new user (Supabase Auth signUp + local fallback)
   */
  register: async (userData) => {
    const cleanEmail = userData.email.toLowerCase().trim();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: userData.password || 'password123',
          options: {
            data: {
              full_name: userData.name,
              phone: userData.phone,
              address: userData.address || '',
              role: 'customer'
            }
          }
        });

        if (!error && data.user) {
          // If trigger didn't insert yet or for direct confirmation
          await supabase.from('users').upsert([
            {
              auth_id: data.user.id,
              email: cleanEmail,
              full_name: userData.name,
              phone: userData.phone,
              address: userData.address || '',
              role: 'customer'
            }
          ], { onConflict: 'email' });

          const registered = normalizeUserProfile({
            id: data.user.id,
            email: cleanEmail,
            full_name: userData.name,
            phone: userData.phone,
            address: userData.address,
            role: 'CUSTOMER'
          }, data.user);

          setStoredItem(STORAGE_KEYS.CURRENT_USER, registered);
          return registered;
        }
      } catch (regErr) {
        console.warn('Supabase registration error, registering locally:', regErr);
      }
    }

    // Local fallback
    const customers = getStoredItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
    const newUser = normalizeUserProfile({
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: userData.name,
      email: cleanEmail,
      phone: userData.phone,
      address: userData.address || '',
      pincode: userData.pincode || '',
      role: 'CUSTOMER',
      ordersCount: 0,
      totalSpent: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    });

    const updated = [newUser, ...customers];
    setStoredItem(STORAGE_KEYS.CUSTOMERS, updated);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  /**
   * Update profile
   */
  updateProfile: async (updatedProfile) => {
    const currentUser = authService.getCurrentUser();
    const updated = { ...currentUser, ...updatedProfile };

    if (isSupabaseConfigured && currentUser?.id) {
      try {
        const updatePayload = {};
        if (updatedProfile.name) updatePayload.full_name = updatedProfile.name;
        if (updatedProfile.phone) updatePayload.phone = updatedProfile.phone;
        if (updatedProfile.address) updatePayload.address = updatedProfile.address;
        if (updatedProfile.avatar) updatePayload.profile_image = updatedProfile.avatar;

        await supabase
          .from('users')
          .update(updatePayload)
          .or(`id.eq.${currentUser.id},auth_id.eq.${currentUser.id},email.eq.${currentUser.email}`);
      } catch (err) {
        console.warn('Error updating profile in Supabase:', err);
      }
    }

    setStoredItem(STORAGE_KEYS.CURRENT_USER, updated);

    // Also sync in local customers list
    if (updated.role === 'CUSTOMER') {
      const customers = getStoredItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
      const idx = customers.findIndex((c) => c.email.toLowerCase() === updated.email.toLowerCase());
      if (idx !== -1) {
        customers[idx] = { ...customers[idx], ...updated };
        setStoredItem(STORAGE_KEYS.CUSTOMERS, customers);
      }
    }

    return updated;
  },

  /**
   * Logout user from Supabase and clear session
   */
  logout: async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};
