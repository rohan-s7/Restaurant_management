import React from 'react';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { StatusBadge } from '../common/StatusBadge';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';

export const OrderDetailModal = ({ order, isOpen, onClose }) => {
  const { updateOrderStatus } = useRestaurant();
  const { addToast } = useToast();

  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    await updateOrderStatus(order.id, newStatus);
    addToast(`Order ${order.id} status updated to ${newStatus}`, 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order Details: ${order.id}`} maxWidth="600px">
      <div>
        {/* Customer & General info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--color-bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Customer</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.customerName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.customerPhone}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.customerEmail}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Fulfillment</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>{order.orderType}</div>
            {order.tableNumber && <div style={{ fontSize: '0.85rem' }}>Table No: <strong>{order.tableNumber}</strong></div>}
            {order.deliveryAddress && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.deliveryAddress}</div>}
          </div>
        </div>

        {/* Date & Payment Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Placed At: </span>
            <strong>{formatDateTime(order.createdAt)}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Payment: </span>
            <span style={{ fontWeight: 700 }}>{order.paymentMethod}</span>
            <StatusBadge status={order.paymentStatus || 'Paid'} />
          </div>
        </div>

        {/* Status override selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', border: '1.5px solid var(--color-border)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Update Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem', flex: 1 }}
          >
            <option value="New">New</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Items table */}
        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>Items Ordered</h4>
        <div style={{ border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', borderTop: '1px dashed var(--color-border)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span>Items Subtotal:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span>GST & Service Charge:</span>
            <span>{formatCurrency((order.tax || 0) + (order.serviceCharge || 0))}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
            <span>Grand Total:</span>
            <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(order.total)}</span>
          </div>
        </div>

        {order.notes && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#FFFBEB', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: '#92400E' }}>
            <strong>Special Note:</strong> {order.notes}
          </div>
        )}
      </div>
    </Modal>
  );
};
