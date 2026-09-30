import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialStaff } from '../data/initialUserData';

const LOCAL_STORAGE_KEY = 'rms_staff';

const isUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const getLocalStaff = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialStaff;
  } catch {
    return initialStaff;
  }
};

const setLocalStaff = (staff) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(staff));
  } catch (e) {
    console.error('Failed saving staff to localStorage:', e);
  }
};

const normalizeStaff = (member) => {
  if (!member) return null;

  // Supabase users table with staff_details joined
  const details = Array.isArray(member.staff_details)
    ? member.staff_details[0]
    : member.staff_details;

  const rawStatus = (details?.status || member.status || 'active').toLowerCase();
  const displayStatus = rawStatus === 'active' ? 'Active' : 'Inactive';

  return {
    id: member.id,
    name: member.full_name || member.name || 'Staff Member',
    full_name: member.full_name || member.name || 'Staff Member',
    email: member.email || '',
    phone: member.phone || '+91 98765 00000',
    role: (details?.designation || member.role || 'Staff').toUpperCase(),
    designation: details?.designation || member.role || member.designation || 'Kitchen Staff',
    shift: member.shift || 'Day (8:00 AM - 4:00 PM)',
    status: displayStatus,
    joinedDate: member.created_at ? member.created_at.split('T')[0] : member.joinedDate || '2026-02-01',
    avatar: member.profile_image || member.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    profile_image: member.profile_image || member.avatar
  };
};

export const staffService = {
  /**
   * Get all staff members
   */
  getAllStaff: async () => {
    if (!isSupabaseConfigured) {
      return getLocalStaff().map(normalizeStaff);
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          phone,
          role,
          profile_image,
          created_at,
          staff_details (
            id,
            designation,
            status
          )
        `)
        .in('role', ['staff', 'admin'])
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Error fetching staff from Supabase, using local fallback:', error);
        return getLocalStaff().map(normalizeStaff);
      }

      return data.map(normalizeStaff);
    } catch (err) {
      console.warn('Staff query failed, using local fallback:', err);
      return getLocalStaff().map(normalizeStaff);
    }
  },

  /**
   * Add new staff member
   */
  addStaff: async (staffData) => {
    if (!isSupabaseConfigured) {
      const staff = getLocalStaff();
      const newStaff = {
        ...staffData,
        id: `STF-${String(staff.length + 1).padStart(2, '0')}`,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: staffData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      };
      const updated = [newStaff, ...staff];
      setLocalStaff(updated);
      return normalizeStaff(newStaff);
    }

    try {
      // Insert into public.users
      const userPayload = {
        full_name: staffData.name || staffData.full_name,
        email: staffData.email,
        phone: staffData.phone || '+91 98765 00000',
        role: (staffData.designation === 'Manager' || staffData.role === 'ADMIN') ? 'admin' : 'staff',
        profile_image: staffData.avatar || staffData.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      };

      const { data: createdUser, error: userError } = await supabase
        .from('users')
        .insert([userPayload])
        .select()
        .single();

      if (userError || !createdUser) {
        console.warn('Failed inserting staff user, using local fallback:', userError);
        const staff = getLocalStaff();
        const fallback = {
          ...staffData,
          id: `STF-${String(staff.length + 1).padStart(2, '0')}`,
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0]
        };
        setLocalStaff([fallback, ...staff]);
        return normalizeStaff(fallback);
      }

      // Insert into staff_details
      const detailsPayload = {
        user_id: createdUser.id,
        designation: staffData.designation || staffData.role || 'Kitchen Staff',
        status: 'active'
      };

      await supabase.from('staff_details').insert([detailsPayload]);

      const completeStaff = {
        ...createdUser,
        staff_details: [detailsPayload],
        shift: staffData.shift || 'Day (8:00 AM - 4:00 PM)'
      };

      // Sync local cache
      const localStaff = getLocalStaff();
      setLocalStaff([normalizeStaff(completeStaff), ...localStaff]);

      return normalizeStaff(completeStaff);
    } catch (err) {
      console.warn('Add staff exception:', err);
      const staff = getLocalStaff();
      const fallback = {
        ...staffData,
        id: `STF-${String(staff.length + 1).padStart(2, '0')}`,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setLocalStaff([fallback, ...staff]);
      return normalizeStaff(fallback);
    }
  },

  /**
   * Update staff member
   */
  updateStaff: async (id, data) => {
    if (isSupabaseConfigured && isUUID(id)) {
      try {
        const updatePayload = {};
        if (data.name) updatePayload.full_name = data.name;
        if (data.phone) updatePayload.phone = data.phone;
        if (data.email) updatePayload.email = data.email;
        if (data.avatar) updatePayload.profile_image = data.avatar;

        if (Object.keys(updatePayload).length > 0) {
          await supabase.from('users').update(updatePayload).eq('id', id);
        }

        if (data.designation || data.status) {
          const detailUpdates = {};
          if (data.designation) detailUpdates.designation = data.designation;
          if (data.status) detailUpdates.status = data.status.toLowerCase();
          await supabase.from('staff_details').update(detailUpdates).eq('user_id', id);
        }
      } catch (err) {
        console.warn('Update staff in Supabase failed:', err);
      }
    }

    const staff = getLocalStaff();
    const index = staff.findIndex((s) => s.id === id);
    if (index !== -1) {
      staff[index] = { ...staff[index], ...data };
      setLocalStaff(staff);
      return normalizeStaff(staff[index]);
    }

    return normalizeStaff({ id, ...data });
  },

  /**
   * Toggle staff status (Active <-> Inactive)
   */
  toggleStaffStatus: async (id) => {
    const staff = getLocalStaff();
    const index = staff.findIndex((s) => s.id === id);
    const newStatus = index !== -1 && staff[index].status === 'Active' ? 'Inactive' : 'Active';

    if (isSupabaseConfigured && isUUID(id)) {
      try {
        await supabase
          .from('staff_details')
          .update({ status: newStatus.toLowerCase() })
          .eq('user_id', id);
      } catch (err) {
        console.warn('Toggle staff status in Supabase error:', err);
      }
    }

    if (index !== -1) {
      staff[index].status = newStatus;
      setLocalStaff(staff);
      return normalizeStaff(staff[index]);
    }

    return null;
  },

  /**
   * Delete staff member
   */
  deleteStaff: async (id) => {
    if (isSupabaseConfigured && isUUID(id)) {
      try {
        await supabase.from('users').delete().eq('id', id);
      } catch (err) {
        console.warn('Delete staff in Supabase error:', err);
      }
    }

    const staff = getLocalStaff();
    const filtered = staff.filter((s) => s.id !== id);
    setLocalStaff(filtered);
    return true;
  }
};
