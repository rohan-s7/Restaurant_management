import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Topbar } from '../components/common/Topbar';
import { ToastContainer } from '../components/common/ToastContainer';
import { DemoHelper } from '../components/common/DemoHelper';

export const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = () => {
    const path = location.pathname;
    if (path === '/admin') return { title: 'Executive Dashboard', subtitle: 'Revenue, order volume, live occupancy, and KPIs' };
    if (path.includes('/foods')) return { title: 'Food Menu Management', subtitle: 'Create, update, delete dishes and toggle availability' };
    if (path.includes('/categories')) return { title: 'Menu Categories', subtitle: 'Organize dishes into culinary classifications' };
    if (path.includes('/orders')) return { title: 'Order Master Management', subtitle: 'Search, filter, and inspect all customer orders' };
    if (path.includes('/reservations')) return { title: 'Table Reservations', subtitle: 'Manage dining guest bookings & confirmations' };
    if (path.includes('/tables')) return { title: 'Table & Seating Management', subtitle: 'Configure dining tables, capacity, and layouts' };
    if (path.includes('/customers')) return { title: 'Customer Registry', subtitle: 'Manage registered patrons and account statuses' };
    if (path.includes('/staff')) return { title: 'Staff & Shift Management', subtitle: 'Manage restaurant team members, roles, and shifts' };
    if (path.includes('/payments')) return { title: 'Payment Ledger', subtitle: 'Audit transaction records, methods, and settlements' };
    if (path.includes('/reviews')) return { title: 'Customer Reviews Moderation', subtitle: 'Approve, moderate, and inspect customer feedback' };
    if (path.includes('/reports')) return { title: 'Analytics & Financial Reports', subtitle: 'Sales graphs, item popularity, and print reports' };
    if (path.includes('/settings')) return { title: 'Restaurant Configuration', subtitle: 'Business profile, tax rates, fees, and alerts' };
    return { title: 'Admin Administration', subtitle: 'The Grand Table Management System' };
  };

  const meta = getPageMeta();

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-wrapper ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <Sidebar role="ADMIN" onCloseMobile={() => setMobileSidebarOpen(false)} />
      </div>

      {mobileSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} />
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
        .sidebar-wrapper { display: flex; }
        @media (max-width: 992px) {
          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: -260px;
            bottom: 0;
            z-index: 1050;
            transition: left 0.3s ease;
          }
          .sidebar-wrapper.mobile-open { left: 0; }
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
