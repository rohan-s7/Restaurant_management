import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, Mail, Phone, Clock, Award, Shield } from 'lucide-react';

export const StaffProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '1.5rem' }}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }}
          />
          <div>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{currentUser?.name || 'Vikram Singh'}</h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 700 }}>
              {currentUser?.station || 'Head Chef / Kitchen Lead'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Staff ID: STF-01 • Active Duty
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <Mail size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Staff Email</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currentUser?.email || 'staff@restaurant.com'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <Phone size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Phone Number</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currentUser?.phone || '+91 98765 11223'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <Clock size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Assigned Shift</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Morning Shift (09:00 AM - 05:00 PM)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <Award size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Kitchen Certifications</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>FSSAI Food Safety Master & Gastronomy Lead</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
