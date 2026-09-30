import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/helpers';
import { Star, Heart, ArrowLeft, ShoppingBag, Plus, Minus, Clock, CheckCircle } from 'lucide-react';
import { FoodCard } from '../../components/common/FoodCard';

export const FoodDetailPage = () => {
  const { id } = useParams();
  const { foods, toggleFavorite, isFavorite } = useRestaurant();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const food = foods.find((f) => f.id === id) || foods[0];
  const relatedFoods = foods.filter((f) => f.category === food?.category && f.id !== food?.id).slice(0, 3);

  if (!food) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Dish not found</h2>
        <Link to="/menu" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Menu
        </Link>
      </div>
    );
  }

  const fav = isFavorite(food.id);

  const handleAddToCart = () => {
    if (!food.available) {
      addToast(`${food.name} is currently out of stock`, 'warning');
      return;
    }
    addToCart(food, quantity);
    addToast(`Added ${quantity}x "${food.name}" to cart!`, 'success');
  };

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: 'var(--color-bg-light)' }}>
      <div className="container">
        {/* Breadcrumb / Back button */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              color: 'var(--color-text-muted)',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} />
            Back to Menu
          </Link>
        </div>

        {/* Main Details Presentation */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            marginBottom: '4rem'
          }}
        >
          {/* Food Image Hero */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '380px', boxShadow: 'var(--shadow-md)' }}>
            <img
              src={food.image}
              alt={food.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
              }}
            />

            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
              <span className={`dietary-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, background: 'rgba(20, 17, 15, 0.85)', color: '#FFFFFF', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', textTransform: 'capitalize' }}>
                {food.category?.replace('-', ' ')}
              </span>
            </div>

            <button
              onClick={() => toggleFavorite(food.id)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: fav ? '#E11D48' : '#665E57'
              }}
            >
              <Heart size={22} fill={fav ? '#E11D48' : 'none'} />
            </button>
          </div>

          {/* Details & Ordering */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Star size={20} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{food.rating || '4.8'}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                ({food.reviewsCount || 45} guest reviews)
              </span>
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
              {food.name}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              {food.description}
            </p>

            {food.ingredients && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-subtle)', marginBottom: '0.75rem' }}>
                  Ingredients Included:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {food.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'var(--color-bg-subtle)',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Quantity bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                background: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Price</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {formatCurrency(food.price)}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-secondary btn-icon"
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, minWidth: '32px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn btn-secondary btn-icon"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleAddToCart}
                disabled={!food.available}
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
              >
                <ShoppingBag size={20} />
                Add to Cart ({formatCurrency(food.price * quantity)})
              </button>
            </div>
          </div>
        </div>

        {/* Related Dishes */}
        {relatedFoods.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Similar Dishes You Might Enjoy</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {relatedFoods.map((rel) => (
                <FoodCard key={rel.id} food={rel} onClickDetails={() => navigate(`/menu/${rel.id}`)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
