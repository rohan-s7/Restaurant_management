import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Topbar } from '../components/common/Topbar';
import { ToastContainer } from '../components/common/ToastContainer';
import { DemoHelper } from '../components/common/DemoHelper';

export const StaffLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = () => {
    const path = location.pathname;
    if (path === '/staff') return { title: 'Kitchen & Staff Operations', subtitle: 'Live operational summary & preparation backlog' };
    if (path.includes('/orders')) return { title: 'Kitchen Order Kanban', subtitle: 'Live order status queue & preparation progress' };
    if (path.includes('/tables')) return { title: 'Floor & Table Status', subtitle: 'Real-time dining table seating management' };
    if (path.includes('/profile')) return { title: 'Staff Station Profile', subtitle: 'Shift credentials and kitchen station details' };
    return { title: 'Staff Operations', subtitle: 'The Grand Table Management' };
  };

  const meta = getPageMeta();

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-wrapper ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <Sidebar role="STAFF" onCloseMobile={() => setMobileSidebarOpen(false)} />
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
