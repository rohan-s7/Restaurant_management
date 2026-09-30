import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ReviewModal } from '../../components/customer/ReviewModal';
import { EmptyState } from '../../components/common/EmptyState';
import { ShoppingBag, Eye, RotateCcw, Star, Search, Filter } from 'lucide-react';

export const MyOrdersPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useRestaurant();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);

  const userOrders = orders.filter(
    (o) => o.customerId === currentUser?.id || o.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReorder = (order) => {
    order.items?.forEach((item) => {
      addToCart(item, item.quantity || 1);
    });
    addToast(`Added ${order.items?.length} items from order #${order.id} to cart`, 'success');
    navigate('/customer/cart');
  };

  return (
    <div>
      {/* Header Filters & Search Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '380px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by Order ID or dish name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Orders</option>
            <option value="New">New</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Items Ordered</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const itemsSummary = order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ');
                const isCompleted = order.status === 'Completed';

                return (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                      #{order.id}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={itemsSummary}>
                        {itemsSummary}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                        {order.items?.length} item(s)
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td>
                      <StatusBadge status={order.orderType} />
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <Link
                          to={`/customer/orders/${order.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="View Details & Track"
                        >
                          <Eye size={14} />
                          Details
                        </Link>

                        <button
                          onClick={() => handleReorder(order)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.65rem', color: 'var(--color-primary)' }}
                          title="Reorder this meal"
                        >
                          <RotateCcw size={14} />
                          Reorder
                        </button>

                        {isCompleted && (
                          <button
                            onClick={() => setSelectedOrderForReview(order)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.35rem 0.65rem' }}
                            title="Rate & Review"
                          >
                            <Star size={14} />
                            Review
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Found"
          description="You don't have any orders matching your criteria. Order some delicious food now!"
          actionText="Explore Menu"
          actionLink="/menu"
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        order={selectedOrderForReview}
        isOpen={!!selectedOrderForReview}
        onClose={() => setSelectedOrderForReview(null)}
      />
    </div>
  );
};
