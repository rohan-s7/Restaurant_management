import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';

export const RevenueBarChart = ({ data = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  if (!data.length) return null;

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 60000);
  const chartHeight = 220;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: `${chartHeight}px`, gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
        {data.map((item, idx) => {
          const barHeight = Math.round((item.revenue / maxRevenue) * (chartHeight - 40));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.day}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: `${barHeight + 35}px`,
                    background: 'var(--color-dark)',
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {formatCurrency(item.revenue)} ({item.orders} orders)
                </div>
              )}

              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${barHeight}px`,
                  background: isHovered
                    ? 'linear-gradient(180deg, #D97706 0%, #B45309 100%)'
                    : 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.2s ease'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '0',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: isHovered ? 'var(--color-primary)' : 'var(--color-text-muted)'
                }}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CategoryDonutChart = ({ data = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', height: '18px', borderRadius: 'var(--radius-full)', overflow: 'hidden', width: '100%', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
        {data.map((cat) => (
          <div
            key={cat.name}
            style={{
              width: `${cat.percentage}%`,
              backgroundColor: cat.color,
              height: '100%'
            }}
            title={`${cat.name}: ${cat.percentage}%`}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
        {data.map((cat) => (
          <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
              {cat.name}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginLeft: 'auto', fontWeight: 700 }}>
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StatusDistributionBar = ({ data = [] }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {data.map((item) => {
        const percent = Math.round((item.count / total) * 100);
        return (
          <div key={item.status}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{item.status}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>
                {item.count} orders ({percent}%)
              </span>
            </div>
            <div style={{ height: '8px', background: 'var(--color-bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${percent}%`,
                  height: '100%',
                  backgroundColor: item.color,
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
