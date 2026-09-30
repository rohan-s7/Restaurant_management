import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { demoCredentials } from '../data/initialUserData';
import { initializeLocalStorage } from '../services/storageService';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocalStorage();

    // Check for cached user or active Supabase session
    const loadInitialUser = async () => {
      try {
        const user = await authService.fetchCurrentSessionUser();
        setCurrentUser(user);
      } catch (e) {
        console.warn('Initial auth load fallback:', e);
        setCurrentUser(authService.getCurrentUser());
      } finally {
        setLoading(false);
      }
    };

    loadInitialUser();

    // Listen to Supabase auth state change events
    if (isSupabaseConfigured) {
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const user = await authService.fetchCurrentSessionUser();
          setCurrentUser(user);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const user = await authService.register(userData);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    const updated = await authService.updateProfile(data);
    setCurrentUser(updated);
    return updated;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  // Quick switch between demo roles (Customer, Staff, Admin)
  const switchDemoRole = async (roleKey) => {
    if (demoCredentials[roleKey]) {
      const user = { ...demoCredentials[roleKey] };
      await authService.login(user.email, user.password);
      setCurrentUser(user);
      return user;
    }
  };

  const isAuthenticated = !!currentUser;
  const isCustomer = currentUser?.role === 'CUSTOMER';
  const isStaff = currentUser?.role === 'STAFF';
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated,
        isCustomer,
        isStaff,
        isAdmin,
        login,
        register,
        updateProfile,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
