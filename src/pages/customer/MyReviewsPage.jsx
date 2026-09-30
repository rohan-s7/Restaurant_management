import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatDate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyReviewsPage = () => {
  const { currentUser } = useAuth();
  const { reviews } = useRestaurant();

  const userReviews = reviews.filter(
    (r) => r.customerName?.toLowerCase() === currentUser?.name?.toLowerCase()
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-text-main)' }}>My Dining Reviews</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Your shared feedback and ratings on past gourmet orders
        </p>
      </div>

      {userReviews.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {userReviews.map((rev) => (
            <div key={rev.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                    {rev.foodItem}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Order #{rev.orderId} • {formatDate(rev.date)}
                  </div>
                </div>
                <StatusBadge status={rev.status} />
              </div>

              {/* Star ratings */}
              <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--color-bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Food Rating</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span>{rev.foodRating} / 5</span>
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Service Rating</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span>{rev.serviceRating || 5} / 5</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.5, fontStyle: 'italic', margin: 0, flex: 1 }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No Reviews Written Yet"
          description="You can review any of your completed meals from the Orders page to share your experience with other food enthusiasts."
          actionText="View My Orders"
          actionLink="/customer/orders"
        />
      )}
    </div>
  );
};
