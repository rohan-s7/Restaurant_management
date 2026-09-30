import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { KitchenCard } from '../../components/staff/KitchenCard';
import { OrderDetailModal } from '../../components/admin/OrderDetailModal';
import { ChefHat, AlertCircle, Clock, CheckCircle2, RotateCcw, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const KitchenOrdersPage = () => {
  const { orders, updateOrderStatus } = useRestaurant();
  const { addToast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((o) => {
    return (
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items?.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const newOrders = filteredOrders.filter((o) => o.status === 'New' || o.status === 'Confirmed');
  const preparingOrders = filteredOrders.filter((o) => o.status === 'Preparing');
  const readyOrders = filteredOrders.filter((o) => o.status === 'Ready');
  const completedOrders = filteredOrders.filter((o) => o.status === 'Completed').slice(0, 8);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    addToast(`Order #${orderId} moved to ${newStatus}`, 'success');
  };

  return (
    <div>
      {/* Top filter bar */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChefHat size={22} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Live Kitchen Kanban Dispatch</h3>
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px', padding: '0.45rem 0.75rem 0.45rem 36px', fontSize: '0.85rem' }}
            placeholder="Search active orders or dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 4-Column Kanban Board */}
      <div className="kanban-board">
        {/* Column 1: NEW / CONFIRMED */}
        <div className="kanban-column" style={{ borderTop: '4px solid var(--color-info)' }}>
          <div className="kanban-column-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={18} color="var(--color-info)" />
              <span className="kanban-column-title">NEW ORDERS</span>
            </div>
            <span className="badge badge-info">{newOrders.length}</span>
          </div>

          <div>
            {newOrders.map((order) => (
              <KitchenCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={(o) => setSelectedOrder(o)}
              />
            ))}
            {newOrders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No new incoming orders
              </div>
            )}
          </div>
        </div>

        {/* Column 2: PREPARING */}
        <div className="kanban-column" style={{ borderTop: '4px solid var(--color-warning)' }}>
          <div className="kanban-column-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChefHat size={18} color="var(--color-warning)" />
              <span className="kanban-column-title">PREPARING</span>
            </div>
            <span className="badge badge-warning">{preparingOrders.length}</span>
          </div>

          <div>
            {preparingOrders.map((order) => (
              <KitchenCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={(o) => setSelectedOrder(o)}
              />
            ))}
            {preparingOrders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No dishes currently in preparation
              </div>
            )}
          </div>
        </div>

        {/* Column 3: READY */}
        <div className="kanban-column" style={{ borderTop: '4px solid var(--color-success)' }}>
          <div className="kanban-column-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={18} color="var(--color-success)" />
              <span className="kanban-column-title">READY TO SERVE</span>
            </div>
            <span className="badge badge-success">{readyOrders.length}</span>
          </div>

          <div>
            {readyOrders.map((order) => (
              <KitchenCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={(o) => setSelectedOrder(o)}
              />
            ))}
            {readyOrders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No orders waiting for pickup
              </div>
            )}
          </div>
        </div>

        {/* Column 4: COMPLETED */}
        <div className="kanban-column" style={{ borderTop: '4px solid var(--color-primary)' }}>
          <div className="kanban-column-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} color="var(--color-primary)" />
              <span className="kanban-column-title">COMPLETED RECENTLY</span>
            </div>
            <span className="badge badge-neutral">{completedOrders.length}</span>
          </div>

          <div>
            {completedOrders.map((order) => (
              <KitchenCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={(o) => setSelectedOrder(o)}
              />
            ))}
            {completedOrders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No completed orders yet today
              </div>
            )}
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
