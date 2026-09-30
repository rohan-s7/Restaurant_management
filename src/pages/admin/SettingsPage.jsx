import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { Save, Store, Receipt, Bell, ShieldCheck } from 'lucide-react';

export const SettingsPage = () => {
  const { settings, updateSettings } = useRestaurant();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    restaurantName: settings.restaurantName || 'The Grand Table',
    tagline: settings.tagline || 'Good Food. Great Moments.',
    phone: settings.phone || '+91 98765 00112',
    email: settings.email || 'contact@grandtable.com',
    address: settings.address || '100 Feet Road, 12th Main, Indiranagar, Bengaluru, KA',
    openingTime: settings.openingTime || '11:00 AM',
    closingTime: settings.closingTime || '11:30 PM',
    taxRate: settings.taxRate || 5,
    serviceChargeRate: settings.serviceChargeRate || 5,
    minOrderAmount: settings.minOrderAmount || 150,
    deliveryFee: settings.deliveryFee || 40,
    notifications: {
      newOrderAlerts: settings.notifications?.newOrderAlerts ?? true,
      reservationAlerts: settings.notifications?.reservationAlerts ?? true,
      reviewAlerts: settings.notifications?.reviewAlerts ?? true
    }
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateSettings(formData);
    addToast('Restaurant system settings saved successfully!', 'success');
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-text-main)' }}>Restaurant System Settings</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Manage restaurant branding, tax calculations, operational hours, and system notification rules
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 1. Restaurant Profile */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
            <Store size={20} color="var(--color-primary)" />
            <h4 style={{ fontSize: '1.15rem', margin: 0 }}>Restaurant Brand & Contact Information</h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Restaurant Brand Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                className="form-control"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Street Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Daily Opening Time</label>
              <input
                type="text"
                className="form-control"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily Closing Time</label>
              <input
                type="text"
                className="form-control"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 2. Order & Financial Calculation Rules */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
            <Receipt size={20} color="var(--color-primary)" />
            <h4 style={{ fontSize: '1.15rem', margin: 0 }}>Taxes & Service Charge Calculations</h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">GST Tax Percentage (%)</label>
              <input
                type="number"
                className="form-control"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                min="0"
                max="28"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Service Charge Percentage (%)</label>
              <input
                type="number"
                className="form-control"
                value={formData.serviceChargeRate}
                onChange={(e) => setFormData({ ...formData, serviceChargeRate: Number(e.target.value) })}
                min="0"
                max="20"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Minimum Order Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Fee (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* 3. Notification Rules */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
            <Bell size={20} color="var(--color-primary)" />
            <h4 style={{ fontSize: '1.15rem', margin: 0 }}>System Notification Preferences</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.925rem' }}>
              <input
                type="checkbox"
                checked={formData.notifications.newOrderAlerts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, newOrderAlerts: e.target.checked }
                  })
                }
              />
              <span>Send instant sound alert & banner on <strong>New Customer Orders</strong></span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.925rem' }}>
              <input
                type="checkbox"
                checked={formData.notifications.reservationAlerts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, reservationAlerts: e.target.checked }
                  })
                }
              />
              <span>Notify host & manager on <strong>New Table Booking Requests</strong></span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.925rem' }}>
              <input
                type="checkbox"
                checked={formData.notifications.reviewAlerts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, reviewAlerts: e.target.checked }
                  })
                }
              />
              <span>Alert when customers submit <strong>New Feedback & Reviews</strong></span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', maxWidth: '280px' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
};
