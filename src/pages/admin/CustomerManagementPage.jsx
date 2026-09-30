import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Users, ShieldAlert, CheckCircle, Ban } from 'lucide-react';

export const CustomerManagementPage = () => {
  const { customers, toggleCustomerStatus } = useRestaurant();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleToggle = async (customer) => {
    await toggleCustomerStatus(customer.id);
    const newStatus = customer.status === 'Active' ? 'Inactive' : 'Active';
    addToast(`Customer ${customer.name} marked as ${newStatus}`, 'info');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text-main)' }}>Customer Registry</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Manage registered dining patrons, order activity, and membership status
        </p>
      </div>

      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px' }}
            placeholder="Search patron by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id}>
                <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  {cust.id}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={cust.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                      alt={cust.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{cust.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{cust.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{cust.phone}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={cust.address}>
                  {cust.address || 'Bengaluru, KA'}
                </td>
                <td style={{ fontWeight: 700 }}>{cust.ordersCount || 0}</td>
                <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  {formatCurrency(cust.totalSpent || 0)}
                </td>
                <td>
                  <StatusBadge status={cust.status || 'Active'} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggle(cust)}
                    className={`btn btn-sm ${cust.status === 'Active' ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    {cust.status === 'Active' ? (
                      <>
                        <Ban size={13} color="var(--color-danger)" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle size={13} />
                        Activate
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
