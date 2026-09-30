import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialFoodData, initialFoodCategories } from '../data/initialFoodData';
import { categoryService } from './categoryService';

const LOCAL_STORAGE_KEY = 'rms_foods';

const getLocalFoods = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialFoodData;
  } catch {
    return initialFoodData;
  }
};

const setLocalFoods = (foods) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(foods));
  } catch (e) {
    console.error(e);
  }
};

// Normalize database fields to be 100% compatible with existing frontend
const normalizeFoodItem = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    category_id: item.category_id,
    category: item.categories?.name ? item.categories.name.toLowerCase().replace(/\s+/g, '-') : (item.category || 'main-course'),
    category_name: item.categories?.name || item.category || 'Main Course',
    name: item.name,
    description: item.description,
    ingredients: Array.isArray(item.ingredients)
      ? item.ingredients
      : typeof item.ingredients === 'string'
      ? item.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    price: Number(item.price),
    image: item.image_url || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    image_url: item.image_url || item.image,
    rating: Number(item.rating || 5.0),
    reviewsCount: item.reviewsCount || Math.floor(Math.random() * 80 + 20),
    isVeg: item.is_vegetarian !== undefined ? item.is_vegetarian : (item.isVeg ?? false),
    is_vegetarian: item.is_vegetarian !== undefined ? item.is_vegetarian : (item.isVeg ?? false),
    available: item.availability !== undefined ? item.availability : (item.available ?? true),
    availability: item.availability !== undefined ? item.availability : (item.available ?? true),
    isPopular: item.isPopular ?? true,
    isSpecial: item.isSpecial ?? false,
    preparationTime: item.preparationTime || '15-20 mins',
    created_at: item.created_at
  };
};

export const foodService = {
  /**
   * Get all food items with category join
   */
  getFoods: async () => {
    if (!isSupabaseConfigured) {
      return getLocalFoods().map(normalizeFoodItem);
    }

    const { data, error } = await supabase
      .from('food_items')
      .select('*, categories(id, name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching foods from Supabase, using local fallback:', error);
      return getLocalFoods().map(normalizeFoodItem);
    }

    if (!data || data.length === 0) {
      return getLocalFoods().map(normalizeFoodItem);
    }

    return data.map(normalizeFoodItem);
  },

  getAllFoods: async () => {
    return foodService.getFoods();
  },

  /**
   * Get single food item by ID
   */
  getFoodById: async (id) => {
    if (!isSupabaseConfigured) {
      const foods = getLocalFoods();
      const found = foods.find((f) => f.id === id);
      return normalizeFoodItem(found);
    }

    const { data, error } = await supabase
      .from('food_items')
      .select('*, categories(id, name)')
      .eq('id', id)
      .single();

    if (error) {
      console.warn('Error fetching food item by ID:', error);
      const foods = getLocalFoods();
      return normalizeFoodItem(foods.find((f) => f.id === id));
    }

    return normalizeFoodItem(data);
  },

  /**
   * Add new food item
   */
  addFood: async (foodData) => {
    const isVeg = foodData.is_vegetarian !== undefined ? foodData.is_vegetarian : (foodData.isVeg ?? true);
    const isAvailable = foodData.availability !== undefined ? foodData.availability : (foodData.available ?? true);
    const ingredientsStr = Array.isArray(foodData.ingredients)
      ? foodData.ingredients.join(', ')
      : (foodData.ingredients || '');

    if (!isSupabaseConfigured) {
      const foods = getLocalFoods();
      const newFood = {
        ...foodData,
        id: `food-${Date.now()}`,
        isVeg,
        is_vegetarian: isVeg,
        available: isAvailable,
        availability: isAvailable,
        image: foodData.image || foodData.image_url,
        image_url: foodData.image || foodData.image_url,
        rating: 5.0,
        reviewsCount: 0,
        created_at: new Date().toISOString()
      };
      const updated = [newFood, ...foods];
      setLocalFoods(updated);
      return normalizeFoodItem(newFood);
    }

    // Resolve category_id if slug or name is passed
    let categoryId = foodData.category_id;
    if (!categoryId && foodData.category) {
      const categories = await categoryService.getCategories();
      const match = categories.find(
        (c) => c.name.toLowerCase() === foodData.category.toLowerCase() ||
               c.name.toLowerCase().replace(/\s+/g, '-') === foodData.category.toLowerCase() ||
               c.id === foodData.category
      );
      if (match) categoryId = match.id;
    }

    const payload = {
      name: foodData.name,
      description: foodData.description || '',
      ingredients: ingredientsStr,
      price: Number(foodData.price),
      image_url: foodData.image_url || foodData.image,
      is_vegetarian: isVeg,
      availability: isAvailable,
      rating: 5.0,
      category_id: categoryId || null
    };

    const { data, error } = await supabase
      .from('food_items')
      .insert([payload])
      .select('*, categories(id, name)')
      .single();

    if (error) {
      console.error('Error inserting food item into Supabase:', error);
      throw error;
    }

    return normalizeFoodItem(data);
  },

  /**
   * Update existing food item
   */
  updateFood: async (id, updatedData) => {
    const isVeg = updatedData.is_vegetarian !== undefined ? updatedData.is_vegetarian : (updatedData.isVeg ?? true);
    const isAvailable = updatedData.availability !== undefined ? updatedData.availability : (updatedData.available ?? true);
    const ingredientsStr = Array.isArray(updatedData.ingredients)
      ? updatedData.ingredients.join(', ')
      : (updatedData.ingredients || '');

    if (!isSupabaseConfigured) {
      const foods = getLocalFoods();
      const index = foods.findIndex((f) => f.id === id);
      if (index === -1) throw new Error('Food item not found');

      foods[index] = {
        ...foods[index],
        ...updatedData,
        isVeg,
        is_vegetarian: isVeg,
        available: isAvailable,
        availability: isAvailable,
        image: updatedData.image || updatedData.image_url || foods[index].image,
        image_url: updatedData.image_url || updatedData.image || foods[index].image_url
      };
      setLocalFoods(foods);
      return normalizeFoodItem(foods[index]);
    }

    // Resolve category_id
    let categoryId = updatedData.category_id;
    if (!categoryId && updatedData.category) {
      const categories = await categoryService.getCategories();
      const match = categories.find(
        (c) => c.name.toLowerCase() === updatedData.category.toLowerCase() ||
               c.name.toLowerCase().replace(/\s+/g, '-') === updatedData.category.toLowerCase() ||
               c.id === updatedData.category
      );
      if (match) categoryId = match.id;
    }

    const payload = {
      name: updatedData.name,
      description: updatedData.description,
      ingredients: ingredientsStr,
      price: Number(updatedData.price),
      image_url: updatedData.image_url || updatedData.image,
      is_vegetarian: isVeg,
      availability: isAvailable
    };
    if (categoryId) payload.category_id = categoryId;

    const { data, error } = await supabase
      .from('food_items')
      .update(payload)
      .eq('id', id)
      .select('*, categories(id, name)')
      .single();

    if (error) {
      console.error('Error updating food item in Supabase:', error);
      throw error;
    }

    return normalizeFoodItem(data);
  },

  /**
   * Delete food item
   */
  deleteFood: async (id) => {
    if (!isSupabaseConfigured) {
      const foods = getLocalFoods();
      const filtered = foods.filter((f) => f.id !== id);
      setLocalFoods(filtered);
      return true;
    }

    const { error } = await supabase
      .from('food_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting food item from Supabase:', error);
      throw error;
    }

    return true;
  },

  /**
   * Toggle availability
   */
  toggleAvailability: async (id) => {
    const current = await foodService.getFoodById(id);
    if (!current) return null;

    const newAvailability = !current.available;
    return foodService.updateFood(id, {
      ...current,
      availability: newAvailability,
      available: newAvailability
    });
  },

  /**
   * Re-export categories methods for backward compatibility
   */
  getAllCategories: async () => {
    return categoryService.getCategories();
  },
  addCategory: async (cat) => {
    return categoryService.addCategory(cat);
  },
  deleteCategory: async (id) => {
    return categoryService.deleteCategory(id);
  }
};

export default foodService;
