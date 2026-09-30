import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { StaffLayout } from '../layouts/StaffLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { MenuPage } from '../pages/public/MenuPage';
import { FoodDetailPage } from '../pages/public/FoodDetailPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ReservationPage } from '../pages/public/ReservationPage';
import { ContactPage } from '../pages/public/ContactPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { MyOrdersPage } from '../pages/customer/MyOrdersPage';
import { OrderDetailsPage } from '../pages/customer/OrderDetailsPage';
import { MyReservationsPage } from '../pages/customer/MyReservationsPage';
import { FavoritesPage } from '../pages/customer/FavoritesPage';
import { MyReviewsPage } from '../pages/customer/MyReviewsPage';
import { ProfilePage } from '../pages/customer/ProfilePage';

// Staff Pages
import { StaffDashboard } from '../pages/staff/StaffDashboard';
import { KitchenOrdersPage } from '../pages/staff/KitchenOrdersPage';
import { StaffTablesPage } from '../pages/staff/StaffTablesPage';
import { StaffProfilePage } from '../pages/staff/StaffProfilePage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { FoodManagementPage } from '../pages/admin/FoodManagementPage';
import { CategoryManagementPage } from '../pages/admin/CategoryManagementPage';
import { OrderManagementPage } from '../pages/admin/OrderManagementPage';
import { ReservationManagementPage } from '../pages/admin/ReservationManagementPage';
import { TableManagementPage } from '../pages/admin/TableManagementPage';
import { CustomerManagementPage } from '../pages/admin/CustomerManagementPage';
import { StaffManagementPage } from '../pages/admin/StaffManagementPage';
import { PaymentManagementPage } from '../pages/admin/PaymentManagementPage';
import { ReviewManagementPage } from '../pages/admin/ReviewManagementPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<FoodDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Customer Cart & Checkout under public layout */}
        <Route path="/customer/cart" element={<CartPage />} />
        <Route path="/customer/checkout" element={<CheckoutPage />} />
      </Route>

      {/* Customer Protected Portal */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'STAFF']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="orders" element={<MyOrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="reservations" element={<MyReservationsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="reviews" element={<MyReviewsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Staff / Kitchen Portal */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="orders" element={<KitchenOrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="tables" element={<StaffTablesPage />} />
        <Route path="profile" element={<StaffProfilePage />} />
      </Route>

      {/* Admin Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="foods" element={<FoodManagementPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="reservations" element={<ReservationManagementPage />} />
        <Route path="tables" element={<TableManagementPage />} />
        <Route path="customers" element={<CustomerManagementPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="payments" element={<PaymentManagementPage />} />
        <Route path="reviews" element={<ReviewManagementPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Catch All */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
