import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Topbar } from '../components/common/Topbar';
import { ToastContainer } from '../components/common/ToastContainer';
import { DemoHelper } from '../components/common/DemoHelper';

export const CustomerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = () => {
    const path = location.pathname;
    if (path === '/customer') return { title: 'Customer Dashboard', subtitle: 'Overview of your active orders and bookings' };
    if (path.includes('/orders')) return { title: 'My Orders', subtitle: 'Track and reorder your favorite meals' };
    if (path.includes('/reservations')) return { title: 'My Table Reservations', subtitle: 'Manage your dining bookings' };
    if (path.includes('/favorites')) return { title: 'Favorite Dishes', subtitle: 'Dishes you loved most' };
    if (path.includes('/reviews')) return { title: 'My Reviews', subtitle: 'Your dining experience feedback' };
    if (path.includes('/profile')) return { title: 'Customer Profile', subtitle: 'Manage your contact details and address' };
    return { title: 'Customer Portal', subtitle: 'The Grand Table Experience' };
  };

  const meta = getPageMeta();

  return (
    <div className="dashboard-layout">
      {/* Sidebar for desktop & mobile drawer */}
      <div className={`sidebar-wrapper ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <Sidebar role="CUSTOMER" onCloseMobile={() => setMobileSidebarOpen(false)} />
      </div>

      {mobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="dashboard-main">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      <DemoHelper />
      <ToastContainer />

      <style>{`
        .sidebar-wrapper {
          display: flex;
        }
        @media (max-width: 992px) {
          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: -260px;
            bottom: 0;
            z-index: 1050;
            transition: left 0.3s ease;
          }
          .sidebar-wrapper.mobile-open {
            left: 0;
          }
          .sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 1040;
          }
        }
      `}</style>
    </div>
  );
};
