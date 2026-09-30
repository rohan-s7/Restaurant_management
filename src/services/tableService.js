import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialTables } from '../data/initialTableData';

const LOCAL_STORAGE_KEY = 'rms_tables';

const getLocalTables = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialTables;
  } catch {
    return initialTables;
  }
};

const setLocalTables = (tables) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tables));
  } catch (e) {
    console.error(e);
  }
};

const normalizeTable = (t) => {
  if (!t) return null;
  const rawStatus = (t.status || 'available').toLowerCase();
  const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

  return {
    id: t.id,
    number: t.table_number || t.number || '01',
    table_number: t.table_number || t.number || '01',
    capacity: Number(t.capacity || 4),
    status: displayStatus,
    db_status: rawStatus,
    location: t.location || `Dining Section ${(t.table_number || t.number || '01')}`,
    created_at: t.created_at
  };
};

export const tableService = {
  /**
   * Get all restaurant tables
   */
  getTables: async () => {
    if (!isSupabaseConfigured) {
      return getLocalTables().map(normalizeTable);
    }

    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .order('table_number');

    if (error) {
      console.warn('Error fetching tables from Supabase, using local fallback:', error);
      return getLocalTables().map(normalizeTable);
    }

    if (!data || data.length === 0) {
      return getLocalTables().map(normalizeTable);
    }

    return data.map(normalizeTable);
  },

  getAllTables: async () => {
    return tableService.getTables();
  },

  /**
   * Update table status ('available' | 'reserved' | 'occupied')
   */
  updateTableStatus: async (tableIdOrNumber, status) => {
    const normalizedStatus = status.toLowerCase();

    if (!isSupabaseConfigured) {
      const tables = getLocalTables();
      const index = tables.findIndex((t) => t.id === tableIdOrNumber || t.number === tableIdOrNumber || t.table_number === tableIdOrNumber);
      if (index === -1) throw new Error('Table not found');

      tables[index].status = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
      setLocalTables(tables);
      return normalizeTable(tables[index]);
    }

    // Check if UUID or table_number was passed
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tableIdOrNumber);
    const query = supabase
      .from('restaurant_tables')
      .update({ status: normalizedStatus });

    const { data, error } = isUuid
      ? await query.eq('id', tableIdOrNumber).select().single()
      : await query.eq('table_number', tableIdOrNumber).select().single();

    if (error) {
      console.error('Error updating table status in Supabase:', error);
      throw error;
    }

    return normalizeTable(data);
  },

  /**
   * Add a new table
   */
  addTable: async (tableData) => {
    const rawStatus = (tableData.status || 'available').toLowerCase();

    if (!isSupabaseConfigured) {
      const tables = getLocalTables();
      const newTable = {
        ...tableData,
        id: `T-${String(tables.length + 1).padStart(2, '0')}`,
        table_number: tableData.number || tableData.table_number || String(tables.length + 1).padStart(2, '0'),
        number: tableData.number || tableData.table_number || String(tables.length + 1).padStart(2, '0'),
        capacity: Number(tableData.capacity || 4),
        status: rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
      };
      const updated = [...tables, newTable];
      setLocalTables(updated);
      return normalizeTable(newTable);
    }

    const payload = {
      table_number: tableData.number || tableData.table_number,
      capacity: Number(tableData.capacity),
      status: rawStatus
    };

    const { data, error } = await supabase
      .from('restaurant_tables')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error adding table to Supabase:', error);
      throw error;
    }

    return normalizeTable(data);
  },

  /**
   * Update table configuration
   */
  updateTable: async (id, tableData) => {
    const rawStatus = (tableData.status || 'available').toLowerCase();

    if (!isSupabaseConfigured) {
      const tables = getLocalTables();
      const index = tables.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Table not found');

      tables[index] = {
        ...tables[index],
        ...tableData,
        number: tableData.number || tableData.table_number || tables[index].number,
        table_number: tableData.number || tableData.table_number || tables[index].table_number,
        capacity: Number(tableData.capacity || tables[index].capacity),
        status: rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
      };
      setLocalTables(tables);
      return normalizeTable(tables[index]);
    }

    const payload = {
      table_number: tableData.number || tableData.table_number,
      capacity: Number(tableData.capacity),
      status: rawStatus
    };

    const { data, error } = await supabase
      .from('restaurant_tables')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating table in Supabase:', error);
      throw error;
    }

    return normalizeTable(data);
  },

  /**
   * Delete a table
   */
  deleteTable: async (id) => {
    if (!isSupabaseConfigured) {
      const tables = getLocalTables();
      const filtered = tables.filter((t) => t.id !== id);
      setLocalTables(filtered);
      return true;
    }

    const { error } = await supabase
      .from('restaurant_tables')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting table from Supabase:', error);
      throw error;
    }

    return true;
  }
};

export default tableService;
