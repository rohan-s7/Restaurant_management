import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ChevronUp, ChevronDown, User, ChefHat, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (roleKey, targetPath) => {
    switchDemoRole(roleKey);
    navigate(targetPath);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        zIndex: 8000
      }}
    >
      {isOpen && (
        <div
          style={{
            marginBottom: '0.75rem',
            background: 'var(--color-dark)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            boxShadow: 'var(--shadow-xl)',
            width: '280px',
            border: '1px solid var(--color-dark-border)',
            animation: 'scaleUp 0.2s ease-out'
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary-light)', fontWeight: 700, marginBottom: '0.5rem' }}>
            SE Project Demo Switcher
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-inverse-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
            Click any role to test its specific features instantly:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => handleRoleSelect('customer', '/customer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: currentUser?.role === 'CUSTOMER' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> Customer Portal
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Orders & Tables</span>
            </button>

            <button
              onClick={() => handleRoleSelect('staff', '/staff')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: currentUser?.role === 'STAFF' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChefHat size={16} /> Staff / Kitchen
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Live Kanban</span>
            </button>

            <button
              onClick={() => handleRoleSelect('admin', '/admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: currentUser?.role === 'ADMIN' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} /> Admin Panel
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Full CRUD & Charts</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.6rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-dark)',
          color: '#FFFFFF',
          border: '1.5px solid var(--color-primary)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.825rem',
          fontWeight: 700
        }}
      >
        <ShieldCheck size={18} color="var(--color-primary)" />
        <span>Demo Roles ({currentUser?.role || 'Guest'})</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </div>
  );
};
