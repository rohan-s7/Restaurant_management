import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { reportService } from '../../services/reportService';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { RevenueBarChart, CategoryDonutChart, StatusDistributionBar } from '../../components/common/Charts';
import { StatusBadge } from '../../components/common/StatusBadge';
import { OrderDetailModal } from '../../components/admin/OrderDetailModal';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  CalendarCheck,
  Grid,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const { orders } = useRestaurant();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const kpis = reportService.getDashboardKPIs();
  const chartData = reportService.getSalesChartData();

  const recentOrders = orders.slice(0, 6);

  return (
    <div>
      {/* Top KPI Cards Row 1 */}
      <div className="kpi-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Today's Revenue</div>
            <div className="kpi-value" style={{ color: 'var(--color-primary)' }}>
              {formatCurrency(kpis.todayRevenue)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <TrendingUp size={12} /> +14.2% from yesterday
            </div>
          </div>
          <div className="kpi-icon-wrapper">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Orders</div>
            <div className="kpi-value">{kpis.totalOrders}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              86 orders today
            </div>
          </div>
          <div className="kpi-icon-wrapper">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Active Customers</div>
            <div className="kpi-value">{kpis.customersCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', fontWeight: 600 }}>
              +8 new this week
            </div>
          </div>
          <div className="kpi-icon-wrapper">
            <Users size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Reservations</div>
            <div className="kpi-value">{kpis.reservationsCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              For this weekend
            </div>
          </div>
          <div className="kpi-icon-wrapper">
            <CalendarCheck size={24} />
          </div>
        </div>
      </div>

      {/* Secondary KPI Cards Row 2 */}
      <div className="kpi-grid" style={{ marginBottom: '2rem' }}>
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Available Tables</div>
            <div className="kpi-value" style={{ color: 'var(--color-success)' }}>
              {kpis.availableTables}
            </div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <Grid size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Pending Orders</div>
            <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>
              {kpis.pendingOrders}
            </div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Completed Orders</div>
            <div className="kpi-value" style={{ color: 'var(--color-primary)' }}>
              {kpis.completedOrders}
            </div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Cancelled Orders</div>
            <div className="kpi-value" style={{ color: 'var(--color-danger)' }}>
              {kpis.cancelledOrders}
            </div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Weekly Revenue Bar Chart */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Weekly Revenue Trends</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Daily earnings overview</p>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              ₹2,21,400 Total
            </span>
          </div>

          <RevenueBarChart data={chartData.weeklyRevenue} />
        </div>

        {/* Popular Categories Donut */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Category Sales Share</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Contribution by culinary category</p>
          </div>

          <CategoryDonutChart data={chartData.popularCategories} />

          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Order Status Breakdown</h4>
            <StatusDistributionBar data={chartData.orderStatusDistribution} />
          </div>
        </div>
      </div>

      {/* Recent Orders Master Glance */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Customer Orders</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Live incoming transaction feed</p>
          </div>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    #{order.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{order.customerPhone}</div>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td style={{ fontWeight: 800 }}>{formatCurrency(order.total)}</td>
                  <td>
                    <StatusBadge status={order.orderType} />
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
