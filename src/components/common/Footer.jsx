import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Globe, Share2, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-dark)', color: '#FFFFFF', paddingTop: '4.5rem', paddingBottom: '2.5rem', borderTop: '1px solid var(--color-dark-border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
          {/* Brand & Story */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <UtensilsCrossed size={20} color="#FFFFFF" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
                The Grand Table
              </span>
            </div>
            <p style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Good Food. Great Moments. Experience gourmet multi-cuisine culinary art, curated ingredients, and world-class hospitality in every bite.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="#website" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }} title="Website">
                <Globe size={18} />
              </a>
              <a href="#share" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }} title="Share">
                <Share2 size={18} />
              </a>
              <a href="#chat" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }} title="Contact">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/reservations" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  Book a Table
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
              Customer Area
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/customer/orders" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/customer/reservations" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  My Reservations
                </Link>
              </li>
              <li>
                <Link to="/customer/favorites" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  Favorite Dishes
                </Link>
              </li>
              <li>
                <Link to="/customer/profile" style={{ color: 'var(--color-text-inverse-muted)', fontSize: '0.9rem' }}>
                  Account Profile
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                  Staff / Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
              Opening Hours & Visit
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', color: 'var(--color-text-inverse-muted)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Mon - Sun: 11:00 AM - 11:30 PM</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Kitchen closes at 11:00 PM</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>100 Feet Road, 12th Main, Indiranagar, Bengaluru, KA 560038</span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>+91 98765 00112</span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>contact@grandtable.com</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          <div>© 2026 The Grand Table. All rights reserved. College SE Project.</div>
          <div>Frontend-only Architecture | Designed with React & Vite</div>
        </div>
      </div>
    </footer>
  );
};
