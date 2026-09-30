import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Star, Heart, Plus, Minus, ShoppingBag, Clock, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';

export const FoodDetailsModal = ({ food, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useRestaurant();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, food]);

  if (!food) return null;

  const fav = isFavorite(food.id);

  const handleAddToCart = () => {
    if (!food.available) {
      addToast(`${food.name} is currently out of stock`, 'warning');
      return;
    }
    addToCart(food, quantity);
    addToast(`Added ${quantity}x "${food.name}" to cart!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={food.name} maxWidth="640px">
      <div>
        {/* Large Image Header */}
        <div style={{ position: 'relative', height: '260px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
            }}
          />

          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
            <span className={`dietary-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                background: 'rgba(20, 17, 15, 0.85)',
                color: '#FFFFFF',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                textTransform: 'capitalize'
              }}
            >
              {food.category?.replace('-', ' ')}
            </span>
          </div>

          <button
            onClick={() => {
              toggleFavorite(food.id);
              addToast(!fav ? 'Added to favorites' : 'Removed from favorites', 'success');
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: fav ? '#E11D48' : '#665E57'
            }}
          >
            <Heart size={20} fill={fav ? '#E11D48' : 'none'} />
          </button>
        </div>

        {/* Rating and Prep Time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={18} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>{food.rating || '4.8'}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              ({food.reviewsCount || 45} customer reviews)
            </span>
          </div>

          {food.preparationTime && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <Clock size={16} />
              <span>{food.preparationTime}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          {food.description}
        </p>

        {/* Ingredients */}
        {food.ingredients && food.ingredients.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-subtle)', marginBottom: '0.6rem' }}>
              Fresh Ingredients
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {food.ingredients.map((ing, i) => (
                <span
                  key={i}
                  style={{
                    background: 'var(--color-bg-subtle)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 500,
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price & Quantity Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            background: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            marginTop: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Unit Price</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {formatCurrency(food.price)}
            </div>
          </div>

          {/* Quantity selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="btn btn-secondary btn-icon"
              style={{ width: '32px', height: '32px' }}
            >
              <Minus size={14} />
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="btn btn-secondary btn-icon"
              style={{ width: '32px', height: '32px' }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Total & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Subtotal: </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              {formatCurrency(food.price * quantity)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!food.available}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </Modal>
  );
};
