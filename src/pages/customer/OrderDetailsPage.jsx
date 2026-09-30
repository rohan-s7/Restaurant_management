import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderTracker } from '../../components/customer/OrderTracker';
import { ReviewModal } from '../../components/customer/ReviewModal';
import { ArrowLeft, RotateCcw, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const { orders } = useRestaurant();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [reviewOpen, setReviewOpen] = useState(false);

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h3>Order not found</h3>
        <Link to="/customer/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const handleReorder = () => {
    order.items?.forEach((item) => {
      addToCart(item, item.quantity || 1);
    });
    addToast(`Added ${order.items?.length} items to cart!`, 'success');
    navigate('/customer/cart');
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link
          to="/customer/orders"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleReorder} className="btn btn-secondary btn-sm">
            <RotateCcw size={14} />
            Reorder
          </button>
          {order.status === 'Completed' && (
            <button onClick={() => setReviewOpen(true)} className="btn btn-primary btn-sm">
              <Star size={14} />
              Write Review
            </button>
          )}
        </div>
      </div>

      <OrderTracker order={order} />

      <ReviewModal
        order={order}
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </div>
  );
};
