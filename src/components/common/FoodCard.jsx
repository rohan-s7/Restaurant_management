import React from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';

export const FoodCard = ({ food, onClickDetails }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useRestaurant();
  const { addToast } = useToast();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!food.available) {
      addToast(`${food.name} is currently out of stock`, 'warning');
      return;
    }
    addToCart(food, 1);
    addToast(`Added "${food.name}" to your cart!`, 'success');
  };

  const handleToggleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(food.id);
    const favStatus = !isFavorite(food.id);
    addToast(
      favStatus ? `Added to favorites` : `Removed from favorites`,
      'success'
    );
  };

  const fav = isFavorite(food.id);

  return (
    <div
      className="card card-hoverable"
      onClick={() => onClickDetails && onClickDetails(food)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Food Image Container */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={food.image}
          alt={food.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Veg/Non-Veg Tag & Category Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span className={`dietary-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'} />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'rgba(20, 17, 15, 0.85)',
              color: '#FFFFFF',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(4px)',
              textTransform: 'capitalize'
            }}
          >
            {food.category?.replace('-', ' ')}
          </span>
        </div>

        {/* Favorite Icon Button */}
        <button
          onClick={handleToggleFav}
          aria-label="Toggle Favorite"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: fav ? '#E11D48' : '#665E57',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart size={18} fill={fav ? '#E11D48' : 'none'} />
        </button>

        {!food.available && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(20, 17, 15, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            Currently Unavailable
          </div>
        )}
      </div>

      {/* Food Content Info */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <h4
            style={{
              fontSize: '1.15rem',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-main)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={food.name}
          >
            {food.name}
          </h4>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.6rem' }}>
          <Star size={15} fill="#F59E0B" color="#F59E0B" />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            {food.rating || '4.8'}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            ({food.reviewsCount || 45})
          </span>
        </div>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.45,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}
        >
          {food.description}
        </p>

        {/* Price & Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {formatCurrency(food.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!food.available}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.5rem 1rem',
              opacity: food.available ? 1 : 0.6,
              cursor: food.available ? 'pointer' : 'not-allowed'
            }}
          >
            <ShoppingBag size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
