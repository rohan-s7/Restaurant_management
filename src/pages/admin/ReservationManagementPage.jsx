import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, CalendarCheck, Check, X, Clock } from 'lucide-react';

export const ReservationManagementPage = () => {
  const { reservations, updateReservationStatus, updateTableStatus } = useRestaurant();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (resId, newStatus, tableNumber) => {
    await updateReservationStatus(resId, newStatus);
    if (newStatus === 'Completed' || newStatus === 'Cancelled') {
      if (tableNumber) await updateTableStatus(tableNumber, 'Available');
    }
    addToast(`Reservation #${resId} updated to ${newStatus}`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text-main)' }}>Guest Table Reservations</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Manage dining room booking requests, confirm guest allocations and seat assignments
        </p>
      </div>

      {/* Filter and search */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px' }}
            placeholder="Search reservation or guest name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['ALL', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Res ID</th>
              <th>Guest Name</th>
              <th>Contact</th>
              <th>Date & Time</th>
              <th>Guests</th>
              <th>Table</th>
              <th>Special Request</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res.id}>
                <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  {res.id}
                </td>
                <td style={{ fontWeight: 600 }}>{res.customerName}</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{res.customerPhone}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{res.customerEmail}</div>
                </td>
                <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  <div>{formatDate(res.date)}</div>
                  <strong style={{ color: 'var(--color-primary)' }}>{res.time}</strong>
                </td>
                <td style={{ fontWeight: 700 }}>{res.guests}p</td>
                <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  Table {res.tableNumber}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.specialRequest}>
                  {res.specialRequest || 'None'}
                </td>
                <td>
                  <StatusBadge status={res.status} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.78rem', display: 'inline-block' }}
                    value={res.status}
                    onChange={(e) => handleStatusChange(res.id, e.target.value, res.tableNumber)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
