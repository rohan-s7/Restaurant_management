import React, { useState } from 'react';
import { Clock, CheckSquare, Square, ChevronRight, AlertCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';
import { StatusBadge } from '../common/StatusBadge';

export const KitchenCard = ({ order, onStatusChange, onViewDetails }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItemCheck = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'New':
        return { label: 'Accept & Cook', nextStatus: 'Preparing', btnClass: 'btn-primary' };
      case 'Confirmed':
        return { label: 'Start Preparing', nextStatus: 'Preparing', btnClass: 'btn-primary' };
      case 'Preparing':
        return { label: 'Mark as Ready', nextStatus: 'Ready', btnClass: 'btn-warning' };
      case 'Ready':
        return { label: 'Complete Order', nextStatus: 'Completed', btnClass: 'btn-success' };
      default:
        return null;
    }
  };

  const action = getNextAction(order.status);

  return (
    <div className="kanban-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
            #{order.id}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            {formatDateTime(order.createdAt).split(',')[1]}
          </div>
        </div>

        <StatusBadge status={order.orderType} />
      </div>

      {order.tableNumber && (
        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.6rem' }}>
          Table: {order.tableNumber}
        </div>
      )}

      {/* Item checklist */}
      <div style={{ borderTop: '1px solid var(--color-border-light)', borderBottom: '1px solid var(--color-border-light)', padding: '0.6rem 0', margin: '0.6rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {order.items?.map((item, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleItemCheck(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {isChecked ? (
                <CheckSquare size={16} color="var(--color-success)" />
              ) : (
                <Square size={16} color="var(--color-text-subtle)" />
              )}
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.quantity}x</span>
              <span style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'var(--color-text-muted)' : 'var(--color-text-main)' }}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {order.notes && (
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', background: '#FFFBEB', padding: '0.4rem 0.6rem', borderRadius: '4px', marginBottom: '0.75rem', borderLeft: '3px solid var(--color-warning)' }}>
          <strong>Note:</strong> {order.notes}
        </div>
      )}

      {/* Status Transition Button */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {action && (
          <button
            onClick={() => onStatusChange(order.id, action.nextStatus)}
            className={`btn btn-sm ${action.btnClass}`}
            style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
          >
            {action.label}
            <ChevronRight size={14} />
          </button>
        )}

        <button
          onClick={() => onViewDetails && onViewDetails(order)}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
        >
          View
        </button>
      </div>
    </div>
  );
};
