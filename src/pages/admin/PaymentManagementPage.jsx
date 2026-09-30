import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreditCard, Search, QrCode, Banknote, ShieldCheck } from 'lucide-react';

export const PaymentManagementPage = () => {
  const { orders } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  // Generate simulated payments list from orders
  const payments = orders.map((o, idx) => ({
    paymentId: `PAY-${1000 + idx * 7}`,
    orderId: o.id,
    customer: o.customerName,
    amount: o.total,
    method: o.paymentMethod || 'UPI',
    status: o.paymentStatus || 'Paid',
    date: o.createdAt
  }));

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = filteredPayments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text-main)' }}>Payment Transactions Ledger</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Simulated audit logs for UPI, Cards, and Cash-on-table settlements
          </p>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Filtered Total Collected</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {formatCurrency(totalCollected)}
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px' }}
            placeholder="Search transaction ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'UPI', 'Card', 'Cash'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`btn btn-sm ${methodFilter === m ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem' }}
            >
              {m === 'ALL' ? 'All Methods' : m}
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date & Time</th>
              <th>Method</th>
              <th>Amount</th>
              <th style={{ textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.paymentId}>
                <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  {p.paymentId}
                </td>
                <td style={{ fontWeight: 700 }}>#{p.orderId}</td>
                <td>{p.customer}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {formatDateTime(p.date)}
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
                    {p.method === 'UPI' && <QrCode size={14} color="var(--color-primary)" />}
                    {p.method === 'Card' && <CreditCard size={14} color="var(--color-primary)" />}
                    {p.method === 'Cash' && <Banknote size={14} color="var(--color-success)" />}
                    {p.method}
                  </span>
                </td>
                <td style={{ fontWeight: 800 }}>{formatCurrency(p.amount)}</td>
                <td style={{ textAlign: 'right' }}>
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
