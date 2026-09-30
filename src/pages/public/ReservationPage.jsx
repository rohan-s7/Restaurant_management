import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { TableSelector } from '../../components/customer/TableSelector';
import { formatDate } from '../../utils/helpers';
import { CalendarCheck, CheckCircle2, Clock, Users, MapPin, Sparkles } from 'lucide-react';

export const ReservationPage = () => {
  const { tables, createReservation, updateTableStatus } = useRestaurant();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('07:30 PM');
  const [guests, setGuests] = useState(4);
  const [selectedTable, setSelectedTable] = useState('03');
  const [specialRequest, setSpecialRequest] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !selectedTable) {
      addToast('Please fill all reservation details and select an available table', 'warning');
      return;
    }

    const res = await createReservation({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      date,
      time,
      guests: Number(guests),
      tableNumber: selectedTable,
      specialRequest
    });

    // Mark table as Reserved
    await updateTableStatus(selectedTable, 'Reserved');

    setConfirmedReservation(res);
    addToast(`Table reservation confirmed! ID: ${res.id}`, 'success');
  };

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: 'var(--color-bg-light)', minHeight: '80vh' }}>
      <div className="container">
        {confirmedReservation ? (
          /* Confirmation Success Voucher */
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                }}
              >
                <CheckCircle2 size={38} />
              </div>

              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                Reservation Confirmed!
              </h2>

              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Thank you, <strong>{confirmedReservation.customerName}</strong>. We have reserved your table and look forward to welcoming you.
              </p>

              {/* Voucher details box */}
              <div
                style={{
                  background: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  textAlign: 'left',
                  border: '1px dashed var(--color-border)',
                  marginBottom: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Reservation ID:</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{confirmedReservation.id}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Date:</span>
                  <span style={{ fontWeight: 600 }}>{formatDate(confirmedReservation.date)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Time:</span>
                  <span style={{ fontWeight: 600 }}>{confirmedReservation.time}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Party Size:</span>
                  <span style={{ fontWeight: 600 }}>{confirmedReservation.guests} Guests</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Assigned Table:</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>Table {confirmedReservation.tableNumber}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/customer/reservations" className="btn btn-primary">
                  View My Bookings
                </Link>
                <Link to="/" className="btn btn-secondary">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Main Reservation Form */
          <div>
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
              <span className="section-subtitle">Reserve Your Experience</span>
              <h1 className="section-title" style={{ fontSize: '3rem' }}>Book a Dining Table</h1>
              <p className="section-description">
                Select your preferred date, time, party size, and choose your favorite table in our dining room or garden courtyard.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {/* Left: Guest & Schedule Details */}
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={20} color="var(--color-primary)" />
                    1. Guest & Schedule Details
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Time Slot *</label>
                      <select
                        className="form-select"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      >
                        <option value="12:30 PM">12:30 PM (Lunch)</option>
                        <option value="01:30 PM">01:30 PM (Lunch)</option>
                        <option value="07:00 PM">07:00 PM (Dinner)</option>
                        <option value="07:30 PM">07:30 PM (Dinner)</option>
                        <option value="08:00 PM">08:00 PM (Dinner)</option>
                        <option value="08:30 PM">08:30 PM (Dinner)</option>
                        <option value="09:00 PM">09:00 PM (Dinner)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Guests *</label>
                      <select
                        className="form-select"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Occasion or Dietary Notes</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="e.g. Birthday celebration, window seat preference, quiet corner..."
                    />
                  </div>
                </div>

                {/* Right: Table Selection Matrix */}
                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={20} color="var(--color-primary)" />
                      2. Choose Your Table
                    </h3>
                    {selectedTable && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        Selected: Table {selectedTable}
                      </span>
                    )}
                  </div>

                  <TableSelector
                    tables={tables}
                    selectedTableNumber={selectedTable}
                    onSelectTable={(num) => setSelectedTable(num)}
                    requiredCapacity={guests}
                  />

                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                      <CalendarCheck size={20} />
                      Confirm Table Reservation
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
