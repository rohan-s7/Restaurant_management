import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { initialReviews } from '../data/initialReviewData';

const LOCAL_STORAGE_KEY = 'rms_reviews';

const isUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const getLocalReviews = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialReviews;
  } catch {
    return initialReviews;
  }
};

const setLocalReviews = (reviews) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed saving reviews to localStorage:', e);
  }
};

const normalizeReview = (r) => {
  if (!r) return null;

  const rawStatus = (r.status || 'approved').toLowerCase();
  const displayStatus =
    rawStatus === 'approved'
      ? 'Approved'
      : rawStatus === 'pending'
      ? 'Pending'
      : 'Hidden';

  const customerName =
    r.customer?.full_name ||
    r.customerName ||
    'Anonymous Diner';

  const customerAvatar =
    r.customer?.profile_image ||
    r.customerAvatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

  const foodItem =
    r.food?.name ||
    r.foodItem ||
    'Chef Special Dish';

  const rating = Number(r.rating || r.foodRating || 5);

  return {
    id: r.id,
    customer_id: r.customer_id,
    customerName,
    customerAvatar,
    orderId: r.orderId || 'ORD-1045',
    food_id: r.food_id,
    foodItem,
    rating,
    foodRating: rating,
    serviceRating: Number(r.serviceRating || rating),
    comment: r.comment || '',
    date: r.created_at ? r.created_at.split('T')[0] : r.date || '2026-09-23',
    created_at: r.created_at || new Date().toISOString(),
    status: displayStatus,
    db_status: rawStatus
  };
};

export const reviewService = {
  /**
   * Get all reviews with customer and food item joins
   */
  getAllReviews: async () => {
    if (!isSupabaseConfigured) {
      return getLocalReviews().map(normalizeReview);
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          customer:users!customer_id (id, full_name, profile_image),
          food:food_items!food_id (id, name, image_url)
        `)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Error fetching reviews from Supabase, using local fallback:', error);
        return getLocalReviews().map(normalizeReview);
      }

      return data.map(normalizeReview);
    } catch (err) {
      console.warn('Reviews query failed, using local fallback:', err);
      return getLocalReviews().map(normalizeReview);
    }
  },

  /**
   * Get approved reviews for public landing page
   */
  getApprovedReviews: async () => {
    const reviews = await reviewService.getAllReviews();
    return reviews.filter((r) => r.status === 'Approved');
  },

  /**
   * Add new customer review
   */
  addReview: async (reviewData) => {
    const defaultCustomerId = 'a0000000-0000-0000-0000-000000000003';
    const defaultFoodId = 'f0000000-0000-0000-0000-000000000001';

    if (!isSupabaseConfigured) {
      const reviews = getLocalReviews();
      const newReview = {
        ...reviewData,
        id: `REV-${String(reviews.length + 1).padStart(2, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Approved'
      };
      const updated = [newReview, ...reviews];
      setLocalReviews(updated);
      return normalizeReview(newReview);
    }

    try {
      const customerId = isUUID(reviewData.customer_id || reviewData.customerId)
        ? (reviewData.customer_id || reviewData.customerId)
        : defaultCustomerId;

      const foodId = isUUID(reviewData.food_id || reviewData.foodId)
        ? (reviewData.food_id || reviewData.foodId)
        : defaultFoodId;

      const payload = {
        customer_id: customerId,
        food_id: foodId,
        rating: Math.min(5, Math.max(1, Math.round(Number(reviewData.foodRating || reviewData.rating || 5)))),
        comment: reviewData.comment || 'Delicious food and pleasant ambiance!',
        status: 'approved'
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert([payload])
        .select(`
          *,
          customer:users!customer_id (id, full_name, profile_image),
          food:food_items!food_id (id, name, image_url)
        `)
        .single();

      if (error || !data) {
        console.warn('Error saving review to Supabase, saving locally:', error);
        const reviews = getLocalReviews();
        const fallback = {
          ...reviewData,
          id: `REV-${String(reviews.length + 1).padStart(2, '0')}`,
          date: new Date().toISOString().split('T')[0],
          status: 'Approved'
        };
        setLocalReviews([fallback, ...reviews]);
        return normalizeReview(fallback);
      }

      const normalized = normalizeReview(data);
      const localReviews = getLocalReviews();
      setLocalReviews([normalized, ...localReviews]);

      return normalized;
    } catch (err) {
      console.warn('Add review exception, saving locally:', err);
      const reviews = getLocalReviews();
      const fallback = {
        ...reviewData,
        id: `REV-${String(reviews.length + 1).padStart(2, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Approved'
      };
      setLocalReviews([fallback, ...reviews]);
      return normalizeReview(fallback);
    }
  },

  /**
   * Update review status (Approved / Hidden / Pending)
   */
  updateReviewStatus: async (id, status) => {
    const rawStatus = (status || 'approved').toLowerCase();

    if (isSupabaseConfigured && isUUID(id)) {
      try {
        await supabase
          .from('reviews')
          .update({ status: rawStatus })
          .eq('id', id);
      } catch (err) {
        console.warn('Update review status in Supabase error:', err);
      }
    }

    const reviews = getLocalReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index !== -1) {
      reviews[index].status = status;
      setLocalReviews(reviews);
      return normalizeReview(reviews[index]);
    }

    return null;
  },

  /**
   * Delete review
   */
  deleteReview: async (id) => {
    if (isSupabaseConfigured && isUUID(id)) {
      try {
        await supabase.from('reviews').delete().eq('id', id);
      } catch (err) {
        console.warn('Delete review in Supabase error:', err);
      }
    }

    const reviews = getLocalReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    setLocalReviews(filtered);
    return true;
  }
};
