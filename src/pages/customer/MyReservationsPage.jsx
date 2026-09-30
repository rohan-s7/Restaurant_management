import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { CalendarCheck, Users, Clock, Plus, XCircle } from 'lucide-react';

export const MyReservationsPage = () => {
  const { currentUser } = useAuth();
  const { reservations, updateReservationStatus, updateTableStatus } = useRestaurant();
  const { addToast } = useToast();

  const userReservations = reservations.filter(
    (r) => r.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const handleCancelReservation = async (res) => {
    await updateReservationStatus(res.id, 'Cancelled');
    if (res.tableNumber) {
      await updateTableStatus(res.tableNumber, 'Available');
    }
    addToast(`Reservation #${res.id} has been cancelled`, 'info');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-text-main)' }}>Your Table Bookings</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Manage your dining reservations and seat allocations
          </p>
        </div>

        <Link to="/reservations" className="btn btn-primary btn-sm">
          <Plus size={16} />
          Book New Table
        </Link>
      </div>

      {userReservations.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {userReservations.map((res) => {
            const isCancellable = ['Pending', 'Confirmed'].includes(res.status);

            return (
              <div key={res.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                      Booking ID
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {res.id}
                    </div>
                  </div>
                  <StatusBadge status={res.status} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Date:</span>
                    <strong>{formatDate(res.date)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Time Slot:</span>
                    <strong>{res.time}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Guests:</span>
                    <strong>{res.guests} Persons</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Table:</span>
                    <strong style={{ color: 'var(--color-primary)' }}>Table {res.tableNumber}</strong>
                  </div>
                </div>

                {res.specialRequest && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
                    Note: "{res.specialRequest}"
                  </div>
                )}

                {isCancellable && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => handleCancelReservation(res)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}
                    >
                      <XCircle size={14} />
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="No Reservations Yet"
          description="You don't have any table reservations booked right now. Experience luxury dining with us!"
          actionText="Book a Table"
          actionLink="/reservations"
        />
      )}
    </div>
  );
};
