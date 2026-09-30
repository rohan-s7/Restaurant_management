import React from 'react';

export const LoadingSkeleton = ({ type = 'card', count = 4 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
        {items.map((_, i) => (
          <div key={i} className="card" style={{ height: '360px', padding: '0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '180px', background: '#EAE5DF', animation: 'pulse 1.5s infinite' }} />
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              <div style={{ height: '20px', width: '70%', background: '#EAE5DF', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '14px', width: '40%', background: '#EAE5DF', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '36px', width: '100%', background: '#EAE5DF', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="table-responsive" style={{ padding: '1rem' }}>
        {items.map((_, i) => (
          <div key={i} style={{ height: '48px', background: '#EAE5DF', borderRadius: '6px', marginBottom: '0.75rem', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
    </div>
  );
};
