import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Star } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ReviewModal = ({ order, isOpen, onClose }) => {
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addReview } = useRestaurant();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please enter a short review comment', 'warning');
      return;
    }

    const itemsSummary = order.items?.map((i) => i.name).join(', ') || 'Delicious food';

    await addReview({
      customerName: currentUser?.name || order.customerName || 'Happy Guest',
      customerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      orderId: order.id,
      foodItem: itemsSummary,
      foodRating,
      serviceRating,
      comment
    });

    addToast('Thank you! Your review has been submitted.', 'success');
    setComment('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review Order #${order.id}`} maxWidth="500px">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Food Taste & Quality Rating</label>
          <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setFoodRating(star)}
                style={{ padding: '4px' }}
              >
                <Star
                  size={28}
                  fill={star <= foodRating ? '#F59E0B' : 'none'}
                  color={star <= foodRating ? '#F59E0B' : 'var(--color-border)'}
                />
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Service & Delivery Rating</label>
          <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setServiceRating(star)}
                style={{ padding: '4px' }}
              >
                <Star
                  size={28}
                  fill={star <= serviceRating ? '#F59E0B' : 'none'}
                  color={star <= serviceRating ? '#F59E0B' : 'var(--color-border)'}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Your Feedback / Comments</label>
          <textarea
            className="form-control"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you loved about the dishes or our service..."
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  );
};
