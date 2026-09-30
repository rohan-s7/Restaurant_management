import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { ShoppingBag, CalendarCheck, Heart, Clock, ArrowRight, Utensils, Star, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodDetailsModal } from '../../components/customer/FoodDetailsModal';

export const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const { orders, reservations, favorites, foods } = useRestaurant();
  const [selectedFood, setSelectedFood] = useState(null);
  const navigate = useNavigate();

  // Filter user specific data
  const userOrders = orders.filter(
    (o) => o.customerId === currentUser?.id || o.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );
  const userReservations = reservations.filter(
    (r) => r.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const activeOrders = userOrders.filter((o) => ['New', 'Confirmed', 'Preparing', 'Ready'].includes(o.status));
  const latestActiveOrder = activeOrders[0] || userOrders[0];
  const upcomingReservation = userReservations.find((r) => r.status === 'Confirmed' || r.status === 'Pending') || userReservations[0];
  const recommendedFoods = foods.slice(0, 4);

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, var(--color-dark) 0%, var(--color-dark-surface) 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Diner Dashboard
            </span>
            <h1 style={{ fontSize: '2.2rem', color: '#FFFFFF', margin: '0.25rem 0 0.5rem' }}>
              Welcome, {currentUser?.name?.split(' ')[0] || 'Rahul'}!
            </h1>
            <p style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.95rem', margin: 0 }}>
              Ready for another extraordinary culinary journey? Explore chef specials or track your current orders.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/menu" className="btn btn-primary">
              <Utensils size={18} />
              Browse Menu
            </Link>
            <Link to="/reservations" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
              <CalendarCheck size={18} />
              Book Table
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => navigate('/customer/orders')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-title">Active Orders</div>
            <div className="kpi-value">{activeOrders.length}</div>
          </div>
          <div className="kpi-icon-wrapper">
            <Clock size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/customer/reservations')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-title">Reservations</div>
            <div className="kpi-value">{userReservations.length}</div>
          </div>
          <div className="kpi-icon-wrapper">
            <CalendarCheck size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/customer/favorites')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-title">Favorites</div>
            <div className="kpi-value">{favorites.length}</div>
          </div>
          <div className="kpi-icon-wrapper">
            <Heart size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/customer/orders')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-title">Total Orders</div>
            <div className="kpi-value">{userOrders.length}</div>
          </div>
          <div className="kpi-icon-wrapper">
            <ShoppingBag size={24} />
          </div>
        </div>
      </div>

      {/* Active Order & Upcoming Booking Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Latest Active Order Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--color-primary)" />
              Current Order
            </h3>
            {latestActiveOrder && (
              <Link to={`/customer/orders/${latestActiveOrder.id}`} style={{ fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                Live Track →
              </Link>
            )}
          </div>

          {latestActiveOrder ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Order #{latestActiveOrder.id}</span>
                <StatusBadge status={latestActiveOrder.status} />
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Type: <strong>{latestActiveOrder.orderType}</strong> {latestActiveOrder.tableNumber && `(Table ${latestActiveOrder.tableNumber})`} • Est. Time: <strong style={{ color: 'var(--color-primary)' }}>{latestActiveOrder.estimatedTime}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'var(--color-bg-subtle)', padding: '0.9rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                {latestActiveOrder.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Total Amount:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formatCurrency(latestActiveOrder.total)}</span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)' }}>
              <p style={{ margin: '0 0 1rem' }}>No active orders right now.</p>
              <Link to="/menu" className="btn btn-secondary btn-sm">
                Place an Order
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Reservation Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarCheck size={18} color="var(--color-primary)" />
              Upcoming Reservation
            </h3>
            <Link to="/customer/reservations" style={{ fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: 700 }}>
              View All →
            </Link>
          </div>

          {upcomingReservation ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Booking #{upcomingReservation.id}</span>
                <StatusBadge status={upcomingReservation.status} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Date:</span>
                  <strong>{formatDate(upcomingReservation.date)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Time Slot:</span>
                  <strong>{upcomingReservation.time}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Guests:</span>
                  <strong>{upcomingReservation.guests} Persons</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Table Assigned:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>Table {upcomingReservation.tableNumber}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/reservations" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Book Another Table
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)' }}>
              <p style={{ margin: '0 0 1rem' }}>No upcoming table bookings.</p>
              <Link to="/reservations" className="btn btn-secondary btn-sm">
                Book a Table
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Food Dishes */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-text-main)' }}>Recommended For You</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Fresh gourmet selections based on your favorites</p>
          </div>
          <Link to="/menu" className="btn btn-secondary btn-sm">
            View All Dishes
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {recommendedFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onClickDetails={(item) => setSelectedFood(item)}
            />
          ))}
        </div>
      </div>

      {/* Details modal */}
      <FoodDetailsModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
