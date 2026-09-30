import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Utensils,
  CalendarCheck,
  Award,
  Sparkles,
  ChefHat,
  Zap,
  Armchair,
  Star,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodDetailsModal } from '../../components/customer/FoodDetailsModal';
import { formatCurrency } from '../../utils/helpers';

export const HomePage = () => {
  const { foods, reviews } = useRestaurant();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [selectedFood, setSelectedFood] = useState(null);

  const popularDishes = foods.filter((f) => f.isPopular).slice(0, 6);
  const todaySpecial = foods.find((f) => f.isSpecial) || foods[4] || foods[0];
  const approvedReviews = reviews.slice(0, 4);

  const handleOrderSpecial = () => {
    if (todaySpecial) {
      addToCart(todaySpecial, 1);
      addToast(`Added "${todaySpecial.name}" to cart!`, 'success');
      navigate('/customer/cart');
    }
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-dark)',
          color: '#FFFFFF',
          padding: '4rem 0',
          backgroundImage:
            'linear-gradient(to right, rgba(20, 17, 15, 0.95) 30%, rgba(20, 17, 15, 0.65) 100%), url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(217, 119, 6, 0.2)',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary-light)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                letterSpacing: '0.05em'
              }}
            >
              <Sparkles size={16} color="var(--color-primary)" />
              WELCOME TO THE GRAND TABLE
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)',
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                fontWeight: 800
              }}
            >
              Good Food. <br />
              <span style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>Great Moments.</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--color-text-inverse-muted)',
                lineHeight: 1.65,
                marginBottom: '2.5rem',
                maxWidth: '560px'
              }}
            >
              Immerse yourself in authentic gourmet culinary craft, farm-fresh ingredients, and warm hospitality. Order directly to your table or book an unforgettable dining experience.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              <Link to="/menu" className="btn btn-primary btn-lg">
                <Utensils size={20} />
                Explore Menu
              </Link>
              <Link to="/reservations" className="btn btn-outline btn-lg" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
                <CalendarCheck size={20} />
                Book a Table
              </Link>
            </div>

            {/* Quick stats banner */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2.5rem',
                marginTop: '3.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>50+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-inverse-muted)' }}>Artisanal Dishes</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>4.9 ★</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-inverse-muted)' }}>Over 2k Reviews</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>15 Mins</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-inverse-muted)' }}>Average Prep Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DISHES */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Chef's Recommendations</span>
            <h2 className="section-title">Popular Dishes</h2>
            <p className="section-description">
              Hand-picked favorites cherished by our dining patrons. Crafted daily with highest quality ingredients.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}
          >
            {popularDishes.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onClickDetails={(item) => setSelectedFood(item)}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/menu" className="btn btn-secondary btn-lg">
              <span>View Full Menu</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S SPECIAL BANNER */}
      {todaySpecial && (
        <section
          style={{
            background: 'var(--color-dark)',
            color: '#FFFFFF',
            padding: '5rem 0',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3.5rem',
                alignItems: 'center'
              }}
            >
              {/* Left Promo Text */}
              <div>
                <span
                  style={{
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '0.75rem'
                  }}
                >
                  <Award size={18} /> TODAY'S CHEF SPECIAL
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    color: '#FFFFFF',
                    marginBottom: '1rem',
                    lineHeight: 1.2
                  }}
                >
                  {todaySpecial.name}
                </h2>

                <p
                  style={{
                    fontSize: '1.05rem',
                    color: 'var(--color-text-inverse-muted)',
                    lineHeight: 1.7,
                    marginBottom: '1.75rem'
                  }}
                >
                  {todaySpecial.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-inverse-muted)' }}>Special Offer Price</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {formatCurrency(todaySpecial.price)}
                    </div>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-inverse-muted)' }}>Rating</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F59E0B' }}>
                      ★ {todaySpecial.rating || '4.9'} / 5.0
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={handleOrderSpecial} className="btn btn-primary btn-lg">
                    <ShoppingBag size={20} />
                    Order Now
                  </button>
                  <button
                    onClick={() => setSelectedFood(todaySpecial)}
                    className="btn btn-secondary btn-lg"
                    style={{ background: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    View Ingredients
                  </button>
                </div>
              </div>

              {/* Right Promo Image */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    border: '4px solid rgba(255,255,255,0.1)',
                    aspectRatio: '4/3'
                  }}
                >
                  <img
                    src={todaySpecial.image}
                    alt={todaySpecial.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. WHY CHOOSE US (4 FEATURES) */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Promise</span>
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-description">
              We take dining to heart. Every aspect of The Grand Table is engineered to make your meal memorable.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Fresh Ingredients</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Locally sourced organic vegetables, farm-fresh dairy, and premium cuts prepared daily with zero preservatives.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <ChefHat size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Expert Chefs</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Led by world-class culinary masters bringing decades of global gastronomy and heritage Indian recipes to life.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Fast Service</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Seamless digital table ordering, real-time kitchen tracking, and swift table-side delivery in under 20 mins.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <Armchair size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Comfortable Dining</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Luxurious ambient lighting, temperature control, garden courtyard seating, and private VIP chambers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Testimonials</span>
            <h2 className="section-title">What Our Guests Say</h2>
            <p className="section-description">
              Read true experiences from verified diners and food enthusiasts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {approvedReviews.map((rev) => (
              <div key={rev.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < rev.foodRating ? '#F59E0B' : '#E5E7EB'}
                      color={i < rev.foodRating ? '#F59E0B' : '#E5E7EB'}
                    />
                  ))}
                </div>

                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-main)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem', flex: 1 }}>
                  "{rev.comment}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
                  <img
                    src={rev.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                    alt={rev.customerName}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                      {rev.customerName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Reviewed {rev.foodItem}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RESTAURANT INFO STRIP */}
      <section style={{ backgroundColor: 'var(--color-dark-surface)', color: '#FFFFFF', padding: '3.5rem 0', borderTop: '1px solid var(--color-dark-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: 'rgba(217,119,6,0.15)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Opening Hours</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-inverse-muted)' }}>Mon - Sun: 11:00 AM - 11:30 PM</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: 'rgba(217,119,6,0.15)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Location</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-inverse-muted)' }}>100 Feet Rd, Indiranagar, Bengaluru</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: 'rgba(217,119,6,0.15)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Direct Call / Booking</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-inverse-muted)' }}>+91 98765 00112</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Details Modal */}
      <FoodDetailsModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
