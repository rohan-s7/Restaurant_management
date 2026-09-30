import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  let badgeClass = 'badge-neutral';
  const s = String(status).toLowerCase();

  if (['completed', 'paid', 'active', 'available', 'approved'].includes(s)) {
    badgeClass = 'badge-success';
  } else if (['preparing', 'confirmed', 'pending', 'reserved'].includes(s)) {
    badgeClass = 'badge-warning';
  } else if (['cancelled', 'failed', 'inactive', 'occupied'].includes(s)) {
    badgeClass = 'badge-danger';
  } else if (['new', 'ready', 'takeaway', 'dine-in', 'delivery'].includes(s)) {
    badgeClass = 'badge-info';
  }

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};
