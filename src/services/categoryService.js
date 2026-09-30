import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialFoodCategories } from '../data/initialFoodData';

const LOCAL_STORAGE_KEY = 'rms_categories';

const getLocalCategories = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialFoodCategories;
  } catch {
    return initialFoodCategories;
  }
};

const setLocalCategories = (cats) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cats));
  } catch (e) {
    console.error(e);
  }
};

export const categoryService = {
  /**
   * Get all categories from Supabase
   */
  getCategories: async () => {
    if (!isSupabaseConfigured) {
      return getLocalCategories();
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Error fetching categories from Supabase, using local fallback:', error);
      return getLocalCategories();
    }

    if (!data || data.length === 0) {
      return getLocalCategories();
    }

    return data;
  },

  /**
   * Add a new category
   */
  addCategory: async (categoryData) => {
    const newCategory = {
      name: categoryData.name,
      description: categoryData.description || ''
    };

    if (!isSupabaseConfigured) {
      const local = getLocalCategories();
      const created = {
        ...newCategory,
        id: categoryData.id || `c-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      const updated = [...local, created];
      setLocalCategories(updated);
      return created;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([newCategory])
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update category
   */
  updateCategory: async (id, categoryData) => {
    if (!isSupabaseConfigured) {
      const local = getLocalCategories();
      const updated = local.map((c) => (c.id === id ? { ...c, ...categoryData } : c));
      setLocalCategories(updated);
      return { id, ...categoryData };
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        name: categoryData.name,
        description: categoryData.description
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete category
   */
  deleteCategory: async (id) => {
    if (!isSupabaseConfigured) {
      const local = getLocalCategories();
      const updated = local.filter((c) => c.id !== id);
      setLocalCategories(updated);
      return true;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }

    return true;
  }
};

export default categoryService;
