import React from 'react';
import { CheckCircle2, Clock, ChefHat, PackageCheck, Truck, Utensils, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { StatusBadge } from '../common/StatusBadge';

export const OrderTracker = ({ order }) => {
  if (!order) return null;

  const steps = [
    { key: 'Placed', label: 'Order Placed', icon: CheckCircle2, desc: 'We have received your order.' },
    { key: 'Confirmed', label: 'Confirmed', icon: Clock, desc: 'Order confirmed by restaurant.' },
    { key: 'Preparing', label: 'In Kitchen', icon: ChefHat, desc: 'Chef is crafting your fresh food.' },
    { key: 'Ready', label: order.orderType === 'Delivery' ? 'Out for Delivery' : 'Ready to Serve', icon: order.orderType === 'Delivery' ? Truck : PackageCheck, desc: 'Order is packed and ready.' },
    { key: 'Completed', label: 'Completed', icon: Utensils, desc: 'Enjoy your meal!' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'New': return 0;
      case 'Confirmed': return 1;
      case 'Preparing': return 2;
      case 'Ready': return 3;
      case 'Completed': return 4;
      default: return 0;
    }
  };

  const isCancelled = order.status === 'Cancelled';
  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="card" style={{ padding: '2rem' }}>
      {/* Header info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Order {order.id}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Placed on {formatDateTime(order.createdAt)} • Type: <strong>{order.orderType}</strong>
            {order.tableNumber && ` • Table ${order.tableNumber}`}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Estimated Time</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {order.estimatedTime || '15-20 mins'}
          </div>
        </div>
      </div>

      {/* Stepper visualization */}
      {isCancelled ? (
        <div style={{ background: 'var(--color-danger-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-danger)', marginBottom: '2rem' }}>
          <AlertCircle size={32} />
          <div>
            <h4 style={{ margin: 0, color: 'var(--color-danger)' }}>This order was cancelled</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>If payment was deducted, refund will be processed within 2-3 business days.</p>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '0 auto', maxWidth: '800px' }}>
            {/* Progress line behind */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                height: '4px',
                background: 'var(--color-border)',
                zIndex: 1
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'var(--color-primary)',
                  width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                  transition: 'width 0.5s ease'
                }}
              />
            </div>

            {steps.map((step, idx) => {
              const isPast = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const Icon = step.icon;

              return (
                <div
                  key={step.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    width: '90px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isPast ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: isPast ? '#FFFFFF' : 'var(--color-text-subtle)',
                      border: `2px solid ${isPast ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(217, 119, 6, 0.25)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: isCurrent ? 800 : isPast ? 600 : 500, color: isPast ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Item List & Receipt Breakdown */}
      <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
          Order Items ({order.items?.length || 0})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                  {item.quantity}x
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                  {item.name}
                </span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span>GST & Service Charge</span>
            <span>{formatCurrency((order.tax || 0) + (order.serviceCharge || 0))}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text-main)', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid var(--color-border)' }}>
            <span>Total Paid ({order.paymentMethod})</span>
            <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(order.total)}</span>
          </div>
        </div>

        {order.deliveryAddress && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <strong>Delivery To:</strong> {order.deliveryAddress}
          </div>
        )}
      </div>
    </div>
  );
};
