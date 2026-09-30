import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (currentUser?.role === 'ADMIN') return '/admin';
    if (currentUser?.role === 'STAFF') return '/staff';
    return '/customer';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(20, 17, 15, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-dark-border)',
        color: '#FFFFFF'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
            }}
          >
            <UtensilsCrossed size={22} color="#FFFFFF" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                display: 'block',
                lineHeight: 1.1
              }}
            >
              The Grand Table
            </span>
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-primary-light)', display: 'block' }}>
              Fine Dining & Bistro
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-inverse-muted)',
              fontWeight: 600,
              fontSize: '0.95rem'
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-inverse-muted)',
              fontWeight: 600,
              fontSize: '0.95rem'
            })}
          >
            Menu
          </NavLink>
          <NavLink
            to="/reservations"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-inverse-muted)',
              fontWeight: 600,
              fontSize: '0.95rem'
            })}
          >
            Reservations
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-inverse-muted)',
              fontWeight: 600,
              fontSize: '0.95rem'
            })}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-inverse-muted)',
              fontWeight: 600,
              fontSize: '0.95rem'
            })}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Utility Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Cart Icon */}
          <Link
            to="/customer/cart"
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              transition: 'all 0.2s ease'
            }}
            title="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--color-dark)'
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                  alt={currentUser.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }} className="hide-mobile">
                  {currentUser.name?.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    background: 'var(--color-primary)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}
                >
                  {currentUser.role}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '210px',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--color-border)',
                    padding: '0.5rem',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '0.6rem', borderBottom: '1px solid var(--color-border-light)', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.email}
                    </div>
                  </div>

                  <Link
                    to={getDashboardLink()}
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'var(--color-text-main)'
                    }}
                  >
                    <LayoutDashboard size={16} />
                    {currentUser.role === 'ADMIN' ? 'Admin Panel' : currentUser.role === 'STAFF' ? 'Staff Portal' : 'My Dashboard'}
                  </Link>

                  {currentUser.role === 'CUSTOMER' && (
                    <Link
                      to="/customer/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: 'var(--color-text-main)'
                      }}
                    >
                      <Heart size={16} />
                      My Favorites
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'var(--color-danger)',
                      width: '100%',
                      marginTop: '0.2rem',
                      borderTop: '1px solid var(--color-border-light)'
                    }}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <User size={16} />
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: '#FFFFFF', display: 'flex' }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-dark)',
            borderTop: '1px solid var(--color-dark-border)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', fontWeight: 600 }}>
            Home
          </Link>
          <Link to="/menu" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', fontWeight: 600 }}>
            Menu
          </Link>
          <Link to="/reservations" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', fontWeight: 600 }}>
            Reservations
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', fontWeight: 600 }}>
            About
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', fontWeight: 600 }}>
            Contact
          </Link>
          {isAuthenticated && (
            <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              {currentUser?.role} Dashboard
            </Link>
          )}
        </div>
      )}

      {/* CSS helper for responsive nav */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 600px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </header>
  );
};
