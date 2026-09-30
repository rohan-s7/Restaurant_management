import React from 'react';
import { Users, CheckCircle } from 'lucide-react';

export const TableSelector = ({ tables = [], selectedTableNumber, onSelectTable, requiredCapacity }) => {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-success)' }} />
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-warning)' }} />
          <span>Reserved</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-danger)' }} />
          <span>Occupied</span>
        </div>
      </div>

      <div className="table-matrix-grid">
        {tables.map((table) => {
          const isAvailable = table.status === 'Available';
          const isSelected = selectedTableNumber === table.number;
          const statusClass = isSelected
            ? 'selected'
            : table.status.toLowerCase();

          return (
            <div
              key={table.id}
              className={`table-card ${statusClass}`}
              onClick={() => isAvailable && onSelectTable(table.number)}
              style={{
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', color: 'var(--color-primary)' }}>
                  <CheckCircle size={18} />
                </div>
              )}

              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                Table {table.number}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
                <Users size={14} />
                <span>{table.capacity} Seats</span>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isAvailable ? 'var(--color-success)' : table.status === 'Reserved' ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                {isSelected ? 'SELECTED' : table.status.toUpperCase()}
              </div>

              {table.location && (
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                  {table.location}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
