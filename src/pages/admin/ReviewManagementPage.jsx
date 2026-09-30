import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Star, CheckCircle, EyeOff, Trash2, Search } from 'lucide-react';

export const ReviewManagementPage = () => {
  const { reviews, updateReviewStatus, deleteReview } = useRestaurant();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const filteredReviews = reviews.filter((r) => {
    return (
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.foodItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleStatusChange = async (id, status) => {
    await updateReviewStatus(id, status);
    addToast(`Review marked as ${status}`, 'success');
  };

  const handleDeleteConfirm = async () => {
    if (reviewToDelete) {
      await deleteReview(reviewToDelete.id);
      addToast('Review deleted', 'info');
      setReviewToDelete(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text-main)' }}>Customer Reviews Moderation</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Inspect guest testimonials, ratings, and moderate public feedback visibility
        </p>
      </div>

      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px' }}
            placeholder="Search reviews by customer or dish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={rev.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                  alt={rev.customerName}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{rev.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDate(rev.date)}</div>
                </div>
              </div>

              <StatusBadge status={rev.status} />
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < rev.foodRating ? '#F59E0B' : '#E5E7EB'}
                  color={i < rev.foodRating ? '#F59E0B' : '#E5E7EB'}
                />
              ))}
            </div>

            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Dish: {rev.foodItem}
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '1.25rem', flex: 1 }}>
              "{rev.comment}"
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Order: #{rev.orderId}</span>

              <div style={{ display: 'flex', gap: '6px' }}>
                {rev.status !== 'Approved' ? (
                  <button
                    onClick={() => handleStatusChange(rev.id, 'Approved')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: 'var(--color-success)' }}
                    title="Approve & Publish"
                  >
                    <CheckCircle size={13} />
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(rev.id, 'Hidden')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: 'var(--color-warning)' }}
                    title="Hide review"
                  >
                    <EyeOff size={13} />
                    Hide
                  </button>
                )}

                <button
                  onClick={() => setReviewToDelete(rev)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: 'var(--color-danger)' }}
                  title="Delete review"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to permanently delete this customer review?"
      />
    </div>
  );
};
