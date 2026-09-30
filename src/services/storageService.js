import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialFoodData, initialFoodCategories } from '../data/initialFoodData';
import { initialOrders } from '../data/initialOrderData';
import { initialTables } from '../data/initialTableData';
import { initialReservations } from '../data/initialReservationData';
import { initialCustomers, initialStaff, demoCredentials } from '../data/initialUserData';
import { initialReviews } from '../data/initialReviewData';
import { initialSettings } from '../data/initialSettingsData';

export const STORAGE_KEYS = {
  CURRENT_USER: 'rms_current_user',
  FOODS: 'rms_foods',
  CATEGORIES: 'rms_categories',
  ORDERS: 'rms_orders',
  RESERVATIONS: 'rms_reservations',
  TABLES: 'rms_tables',
  STAFF: 'rms_staff',
  CUSTOMERS: 'rms_customers',
  REVIEWS: 'rms_reviews',
  SETTINGS: 'rms_settings',
  FAVORITES: 'rms_favorites',
  CART: 'rms_cart'
};

export const getStoredItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.FOODS)) {
    setStoredItem(STORAGE_KEYS.FOODS, initialFoodData);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setStoredItem(STORAGE_KEYS.CATEGORIES, initialFoodCategories);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    setStoredItem(STORAGE_KEYS.ORDERS, initialOrders);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
    setStoredItem(STORAGE_KEYS.TABLES, initialTables);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    setStoredItem(STORAGE_KEYS.RESERVATIONS, initialReservations);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    setStoredItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
    setStoredItem(STORAGE_KEYS.STAFF, initialStaff);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    setStoredItem(STORAGE_KEYS.REVIEWS, initialReviews);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStoredItem(STORAGE_KEYS.SETTINGS, initialSettings);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, demoCredentials.customer);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    setStoredItem(STORAGE_KEYS.FAVORITES, ['food-1', 'food-3', 'food-5', 'food-18']);
  }
};

export const storageService = {
  /**
   * Upload an image file to Supabase Storage
   * @param {'food-images' | 'profile-images' | 'restaurant-images'} bucketName
   * @param {File} file
   * @param {string} path - Optional custom path
   * @returns {Promise<{ publicUrl: string, path: string }>}
   */
  uploadImage: async (bucketName, file, path = null) => {
    if (!isSupabaseConfigured) {
      // In offline/demo mode, create a local object URL or return placeholder
      const mockUrl = URL.createObjectURL(file);
      return { publicUrl: mockUrl, path: file.name };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error(`Error uploading to ${bucketName}:`, uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return {
      publicUrl: data.publicUrl,
      path: filePath
    };
  },

  /**
   * Delete an image from Supabase Storage
   * @param {'food-images' | 'profile-images' | 'restaurant-images'} bucketName
   * @param {string} path
   */
  deleteImage: async (bucketName, path) => {
    if (!isSupabaseConfigured || !path) return true;

    const { error } = await supabase.storage.from(bucketName).remove([path]);
    if (error) {
      console.error(`Error deleting from ${bucketName}:`, error);
      throw error;
    }
    return true;
  },

  /**
   * Get public URL for a file in Supabase Storage
   * @param {'food-images' | 'profile-images' | 'restaurant-images'} bucketName
   * @param {string} path
   */
  getPublicUrl: (bucketName, path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
      return path;
    }
    if (!isSupabaseConfigured) return path;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return data.publicUrl;
  }
};

export default storageService;
