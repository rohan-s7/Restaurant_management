import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../services/storageService';
import { initialSettings } from '../data/initialSettingsData';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => getStoredItem(STORAGE_KEYS.CART, []));
  const [orderType, setOrderType] = useState('Dine-in'); // 'Dine-in' | 'Takeaway' | 'Delivery'
  const [selectedTable, setSelectedTable] = useState('03');

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.CART, cart);
  }, [cart]);

  const addToCart = (foodItem, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === foodItem.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { ...foodItem, quantity }];
      }
    });
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === foodId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (foodId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== foodId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Financial calculations
  const settings = getStoredItem(STORAGE_KEYS.SETTINGS, initialSettings);
  const taxRate = settings.taxRate || 5;
  const serviceChargeRate = settings.serviceChargeRate || 5;
  const deliveryFee = orderType === 'Delivery' ? (settings.deliveryFee || 40) : 0;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number(((subtotal * taxRate) / 100).toFixed(2));
  const serviceCharge = Number(((subtotal * serviceChargeRate) / 100).toFixed(2));
  const total = Number((subtotal + tax + serviceCharge + (subtotal > 0 ? deliveryFee : 0)).toFixed(2));
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        serviceCharge,
        deliveryFee,
        total,
        totalItems,
        orderType,
        setOrderType,
        selectedTable,
        setSelectedTable,
        taxRate,
        serviceChargeRate
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
