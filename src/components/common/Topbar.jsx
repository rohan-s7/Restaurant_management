import React from 'react';
import { Menu, Bell, Shield, ChefHat, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ title, subtitle, onToggleMobileSidebar }) => {
  const { currentUser, switchDemoRole } = useAuth();

  return (
    <header className="dashboard-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleMobileSidebar}
          style={{ display: 'flex', color: 'var(--color-text-main)' }}
          className="sidebar-toggle-btn"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--color-text-main)' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Demo Role Switcher Quick Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-bg-subtle)', padding: '4px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }} className="hide-mobile">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', paddingLeft: '4px' }}>
            Demo:
          </span>
          <button
            onClick={() => switchDemoRole('admin')}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: currentUser?.role === 'ADMIN' ? 'var(--color-primary)' : 'transparent',
              color: currentUser?.role === 'ADMIN' ? '#FFFFFF' : 'var(--color-text-muted)'
            }}
          >
            Admin
          </button>
          <button
            onClick={() => switchDemoRole('staff')}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: currentUser?.role === 'STAFF' ? 'var(--color-primary)' : 'transparent',
              color: currentUser?.role === 'STAFF' ? '#FFFFFF' : 'var(--color-text-muted)'
            }}
          >
            Staff
          </button>
          <button
            onClick={() => switchDemoRole('customer')}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: currentUser?.role === 'CUSTOMER' ? 'var(--color-primary)' : 'transparent',
              color: currentUser?.role === 'CUSTOMER' ? '#FFFFFF' : 'var(--color-text-muted)'
            }}
          >
            Customer
          </button>
        </div>

        {/* Current User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
            alt={currentUser?.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div className="hide-mobile">
            <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.1 }}>
              {currentUser?.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              ● {currentUser?.role}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .sidebar-toggle-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
