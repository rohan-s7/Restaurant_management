import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, Clock, CheckCircle2, AlertCircle, Grid, ArrowRight, Utensils } from 'lucide-react';
import { KitchenCard } from '../../components/staff/KitchenCard';
import { OrderDetailModal } from '../../components/admin/OrderDetailModal';

export const StaffDashboard = () => {
  const { orders, tables, updateOrderStatus } = useRestaurant();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Group orders
  const newOrders = orders.filter((o) => o.status === 'New');
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');
  const readyOrders = orders.filter((o) => o.status === 'Ready');
  const completedToday = orders.filter((o) => o.status === 'Completed');

  const availableTables = tables.filter((t) => t.status === 'Available').length;
  const occupiedTables = tables.filter((t) => t.status === 'Occupied').length;

  const urgentQueue = [...newOrders, ...preparingOrders].slice(0, 4);

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => navigate('/staff/orders')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-title">New Orders</div>
            <div className="kpi-value" style={{ color: 'var(--color-info)' }}>{newOrders.length}</div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/staff/orders')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-title">In Kitchen (Preparing)</div>
            <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>{preparingOrders.length}</div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <ChefHat size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/staff/orders')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-title">Ready for Pickup / Table</div>
            <div className="kpi-value" style={{ color: 'var(--color-success)' }}>{readyOrders.length}</div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/staff/orders')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-title">Completed Today</div>
            <div className="kpi-value">{completedToday.length}</div>
          </div>
          <div className="kpi-icon-wrapper">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Orders & Floor Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Urgent Kitchen Backlog */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Active Kitchen Priority Queue</h3>
            <Link to="/staff/orders" className="btn btn-secondary btn-sm">
              Open Full Kanban
            </Link>
          </div>

          {urgentQueue.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {urgentQueue.map((order) => (
                <KitchenCard
                  key={order.id}
                  order={order}
                  onStatusChange={(id, status) => updateOrderStatus(id, status)}
                  onViewDetails={(o) => setSelectedOrder(o)}
                />
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <CheckCircle2 size={36} color="var(--color-success)" style={{ margin: '0 auto 0.75rem' }} />
              <h4>All caught up!</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No pending orders waiting in the queue.</p>
            </div>
          )}
        </div>

        {/* Live Table Floor Glance */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Live Dining Room Floor Status</h3>
            <Link to="/staff/tables" className="btn btn-secondary btn-sm">
              Manage Tables
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: '1.5rem', background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-success)' }}>{availableTables}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Available</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-danger)' }}>{occupiedTables}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Occupied</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-warning)' }}>{tables.length - availableTables - occupiedTables}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Reserved</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
              {tables.slice(0, 12).map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '0.6rem 0.4rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid',
                    borderColor: t.status === 'Available' ? 'var(--color-success)' : t.status === 'Occupied' ? 'var(--color-danger)' : 'var(--color-warning)',
                    background: t.status === 'Available' ? 'var(--color-success-bg)' : t.status === 'Occupied' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>T-{t.number}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{t.capacity}p</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};
