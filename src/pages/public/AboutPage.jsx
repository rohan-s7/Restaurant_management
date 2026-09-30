import React from 'react';
import { Utensils, Heart, Award, Users, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)' }}>
      {/* Hero Banner */}
      <section
        style={{
          background: 'var(--color-dark)',
          color: '#FFFFFF',
          padding: '5rem 0',
          textAlign: 'center',
          backgroundImage:
            'linear-gradient(rgba(20, 17, 15, 0.9), rgba(20, 17, 15, 0.9)), url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <span className="section-subtitle" style={{ color: 'var(--color-primary-light)' }}>
            Heritage & Craft
          </span>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '1.25rem' }}>
            Our Story & Passion
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-inverse-muted)', lineHeight: 1.7 }}>
            Born out of a genuine love for gourmet dining and authentic hospitality, The Grand Table represents the pinnacle of multi-cuisine culinary art in Bengaluru.
          </p>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center', marginBottom: '5rem' }}>
            <div>
              <span className="section-subtitle">Since 2018</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
                Elevating Every Meal into an Unforgettable Celebration
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                At The Grand Table, we believe that food is not simply sustenance—it is an art form, a sensory journey, and a reason to bring loved ones together around the table.
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Our ingredients are ethically procured every morning from local partner farms. From hand-stretched sourdough pizzas baked in wood-fired stone ovens to slow-dum biryanis infused with Kashmiri saffron, each dish is created with perfection in mind.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)' }}>100%</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Fresh & Natural Ingredients</div>
                </div>
                <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)' }}>30,000+</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Delighted Guests Served</div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"
                  alt="Restaurant interior"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Master Chefs Showcase */}
          <div className="section-header">
            <span className="section-subtitle">Culinary Masters</span>
            <h2 className="section-title">Meet Our Executive Chefs</h2>
            <p className="section-description">
              Meet the passionate culinary artists responsible for every recipe and flavor pairing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80"
                alt="Executive Chef"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.25rem', border: '3px solid var(--color-primary)' }}
              />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Chef Vikram Singh</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                Executive Head Chef
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                20+ years of classical French and Royal Awadhi culinary experience across luxury hotels.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <img
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80"
                alt="Sous Chef"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.25rem', border: '3px solid var(--color-primary)' }}
              />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Chef Marco Rossi</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                Artisan Pizzaiolo & Pasta Lead
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Master of hand-tossed Neapolitan pizzas and traditional Italian cream emulsifications.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <img
                src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&auto=format&fit=crop&q=80"
                alt="Pastry Chef"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.25rem', border: '3px solid var(--color-primary)' }}
              />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Chef Ananya Deshmukh</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                Pastry & Dessert Specialist
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Trained in Belgium for artisanal chocolaterie and delicate seasonal patisserie craft.
              </p>
            </div>
          </div>

          {/* Restaurant Gallery Section */}
          <div className="section-header">
            <span className="section-subtitle">Visual Experience</span>
            <h2 className="section-title">Restaurant Atmosphere</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '240px' }}>
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" alt="Ambiance 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '240px' }}>
              <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" alt="Ambiance 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '240px' }}>
              <img src="https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80" alt="Ambiance 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/reservations" className="btn btn-primary btn-lg">
              Book Your Table Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
