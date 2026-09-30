import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { Grid, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const StaffTablesPage = () => {
  const { tables, updateTableStatus } = useRestaurant();
  const { addToast } = useToast();

  const handleToggleStatus = async (tableId, newStatus) => {
    await updateTableStatus(tableId, newStatus);
    addToast(`Table ${tableId} updated to ${newStatus}`, 'success');
  };

  const availableCount = tables.filter((t) => t.status === 'Available').length;
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'Reserved').length;

  return (
    <div>
      {/* Header with summary stats */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--color-text-main)' }}>Dining Room Table Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Click table status pills to instantly seat guests or mark tables available
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--color-bg-subtle)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{availableCount} Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-danger)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{occupiedCount} Occupied</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-warning)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{reservedCount} Reserved</span>
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {tables.map((table) => {
          const isAvail = table.status === 'Available';
          const isOcc = table.status === 'Occupied';
          const isRes = table.status === 'Reserved';

          return (
            <div
              key={table.id}
              className="card"
              style={{
                padding: '1.5rem',
                borderLeft: `5px solid ${isAvail ? 'var(--color-success)' : isOcc ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.3rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    Table {table.number}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: isAvail ? 'var(--color-success-bg)' : isOcc ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                      color: isAvail ? 'var(--color-success)' : isOcc ? 'var(--color-danger)' : 'var(--color-warning)'
                    }}
                  >
                    {table.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <Users size={15} />
                  <span>Capacity: <strong>{table.capacity} Guests</strong></span>
                </div>

                {table.location && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: '1.25rem' }}>
                    Section: {table.location}
                  </div>
                )}
              </div>

              {/* Status Action Buttons */}
              <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                <button
                  onClick={() => handleToggleStatus(table.id, 'Available')}
                  className={`btn btn-sm ${isAvail ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.72rem', padding: '0.35rem 0.2rem' }}
                >
                  Free
                </button>
                <button
                  onClick={() => handleToggleStatus(table.id, 'Occupied')}
                  className={`btn btn-sm ${isOcc ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ fontSize: '0.72rem', padding: '0.35rem 0.2rem' }}
                >
                  Seat
                </button>
                <button
                  onClick={() => handleToggleStatus(table.id, 'Reserved')}
                  className={`btn btn-sm ${isRes ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.72rem', padding: '0.35rem 0.2rem' }}
                >
                  Reserve
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
