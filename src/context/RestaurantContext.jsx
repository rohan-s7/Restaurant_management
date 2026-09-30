import React, { createContext, useContext, useState, useEffect } from 'react';
import { foodService } from '../services/foodService';
import { orderService } from '../services/orderService';
import { reservationService } from '../services/reservationService';
import { tableService } from '../services/tableService';
import { staffService } from '../services/staffService';
import { customerService } from '../services/customerService';
import { reviewService } from '../services/reviewService';
import { getStoredItem, setStoredItem, STORAGE_KEYS, initializeLocalStorage } from '../services/storageService';
import { initialSettings } from '../data/initialSettingsData';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(() => getStoredItem(STORAGE_KEYS.SETTINGS, initialSettings));
  const [favorites, setFavorites] = useState(() => getStoredItem(STORAGE_KEYS.FAVORITES, ['food-1', 'food-3', 'food-5', 'food-18']));
  const [loading, setLoading] = useState(true);

  const refreshAllData = async () => {
    try {
      initializeLocalStorage();
      const [f, c, o, r, t, s, cust, rev] = await Promise.all([
        foodService.getAllFoods(),
        foodService.getAllCategories(),
        orderService.getAllOrders(),
        reservationService.getAllReservations(),
        tableService.getAllTables(),
        staffService.getAllStaff(),
        customerService.getAllCustomers(),
        reviewService.getAllReviews()
      ]);

      setFoods(f);
      setCategories(c);
      setOrders(o);
      setReservations(r);
      setTables(t);
      setStaffList(s);
      setCustomers(cust);
      setReviews(rev);
    } catch (err) {
      console.error('Error loading restaurant data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();

    // Attach Supabase Realtime listener for live order changes
    const orderSubscription = orderService.subscribeToOrders((payload) => {
      // Reload orders whenever a new order is inserted or status changed
      orderService.getAllOrders().then((updatedOrders) => {
        if (Array.isArray(updatedOrders)) {
          setOrders(updatedOrders);
        }
      });
    });

    return () => {
      orderSubscription?.unsubscribe?.();
    };
  }, []);

  // Favorites logic
  const toggleFavorite = (foodId) => {
    setFavorites((prev) => {
      const next = prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId];
      setStoredItem(STORAGE_KEYS.FAVORITES, next);
      return next;
    });
  };

  const isFavorite = (foodId) => favorites.includes(foodId);

  // Food actions
  const addFood = async (foodData) => {
    const newFood = await foodService.addFood(foodData);
    setFoods((prev) => [newFood, ...prev]);
    return newFood;
  };

  const updateFood = async (id, foodData) => {
    const updated = await foodService.updateFood(id, foodData);
    setFoods((prev) => prev.map((f) => (f.id === id ? updated : f)));
    return updated;
  };

  const deleteFood = async (id) => {
    await foodService.deleteFood(id);
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleFoodAvailability = async (id) => {
    const updated = await foodService.toggleAvailability(id);
    if (updated) {
      setFoods((prev) => prev.map((f) => (f.id === id ? updated : f)));
    }
  };

  // Category actions
  const addCategory = async (catData) => {
    const newCat = await foodService.addCategory(catData);
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const deleteCategory = async (id) => {
    await foodService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Order actions
  const createOrder = async (orderData) => {
    const newOrder = await orderService.createOrder(orderData);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, newStatus);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    return updated;
  };

  // Reservation actions
  const createReservation = async (resData) => {
    const newRes = await reservationService.createReservation(resData);
    setReservations((prev) => [newRes, ...prev]);
    return newRes;
  };

  const updateReservationStatus = async (id, status) => {
    const updated = await reservationService.updateReservationStatus(id, status);
    setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  // Table actions
  const updateTableStatus = async (tableId, status) => {
    const updated = await tableService.updateTableStatus(tableId, status);
    setTables((prev) => prev.map((t) => (t.id === tableId || t.number === tableId ? updated : t)));
    return updated;
  };

  const addTable = async (tableData) => {
    const newTable = await tableService.addTable(tableData);
    setTables((prev) => [...prev, newTable]);
    return newTable;
  };

  const updateTable = async (id, tableData) => {
    const updated = await tableService.updateTable(id, tableData);
    setTables((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTable = async (id) => {
    await tableService.deleteTable(id);
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  // Staff actions
  const addStaff = async (data) => {
    const newStaff = await staffService.addStaff(data);
    setStaffList((prev) => [...prev, newStaff]);
    return newStaff;
  };

  const updateStaff = async (id, data) => {
    const updated = await staffService.updateStaff(id, data);
    setStaffList((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const toggleStaffStatus = async (id) => {
    const updated = await staffService.toggleStaffStatus(id);
    if (updated) {
      setStaffList((prev) => prev.map((s) => (s.id === id ? updated : s)));
    }
  };

  const deleteStaff = async (id) => {
    await staffService.deleteStaff(id);
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  // Customer actions
  const toggleCustomerStatus = async (id) => {
    const updated = await customerService.toggleCustomerStatus(id);
    if (updated) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
  };

  // Reviews actions
  const addReview = async (revData) => {
    const newRev = await reviewService.addReview(revData);
    setReviews((prev) => [newRev, ...prev]);
    return newRev;
  };

  const updateReviewStatus = async (id, status) => {
    const updated = await reviewService.updateReviewStatus(id, status);
    if (updated) {
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
  };

  const deleteReview = async (id) => {
    await reviewService.deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Settings update
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    setStoredItem(STORAGE_KEYS.SETTINGS, newSettings);
  };

  return (
    <RestaurantContext.Provider
      value={{
        foods,
        categories,
        orders,
        reservations,
        tables,
        staffList,
        customers,
        reviews,
        settings,
        favorites,
        loading,
        refreshAllData,
        toggleFavorite,
        isFavorite,
        addFood,
        updateFood,
        deleteFood,
        toggleFoodAvailability,
        addCategory,
        deleteCategory,
        createOrder,
        updateOrderStatus,
        createReservation,
        updateReservationStatus,
        updateTableStatus,
        addTable,
        updateTable,
        deleteTable,
        addStaff,
        updateStaff,
        toggleStaffStatus,
        deleteStaff,
        toggleCustomerStatus,
        addReview,
        updateReviewStatus,
        deleteReview,
        updateSettings
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
