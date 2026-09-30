import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  ShoppingBag,
  CalendarCheck,
  Grid,
  Users,
  UserCheck,
  CreditCard,
  Star,
  BarChart3,
  Settings,
  LogOut,
  ChefHat,
  Heart,
  User,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ role = 'ADMIN', onCloseMobile }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/foods', label: 'Food Management', icon: UtensilsCrossed },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck },
    { to: '/admin/tables', label: 'Tables', icon: Grid },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/staff', label: 'Staff Team', icon: UserCheck },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/reports', label: 'Reports & Sales', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  const staffLinks = [
    { to: '/staff', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/staff/orders', label: 'Kitchen Orders', icon: ChefHat },
    { to: '/staff/tables', label: 'Table Status', icon: Grid },
    { to: '/staff/profile', label: 'My Profile', icon: User }
  ];

  const customerLinks = [
    { to: '/customer', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/menu', label: 'Browse Menu', icon: UtensilsCrossed },
    { to: '/customer/orders', label: 'My Orders', icon: ShoppingBag },
    { to: '/customer/reservations', label: 'Reservations', icon: CalendarCheck },
    { to: '/customer/favorites', label: 'Favorites', icon: Heart },
    { to: '/customer/reviews', label: 'My Reviews', icon: Star },
    { to: '/customer/profile', label: 'Profile Settings', icon: User }
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'STAFF' ? staffLinks : customerLinks;

  return (
    <aside className="dashboard-sidebar">
      {/* Sidebar Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-dark-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <UtensilsCrossed size={18} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
            The Grand Table
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            {role} PORTAL
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.to} className="sidebar-nav-item">
              <NavLink
                to={link.to}
                end={link.end}
                onClick={onCloseMobile}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* User Info & Footer */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--color-dark-border)' }}>
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-inverse-muted)',
            marginBottom: '0.5rem'
          }}
        >
          <ArrowLeft size={14} />
          Back to Public Website
        </NavLink>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
              alt={currentUser?.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-inverse-muted)' }}>
                {role}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{ color: 'var(--color-danger)', padding: '6px', borderRadius: '6px' }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
