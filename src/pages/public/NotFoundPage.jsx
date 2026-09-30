import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ padding: '6rem 0', textAlign: 'center', backgroundColor: 'var(--color-bg-light)', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <UtensilsCrossed size={40} />
        </div>

        <h1 style={{ fontSize: '4.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', lineHeight: 1, marginBottom: '0.5rem' }}>
          404
        </h1>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
          Table Not Found!
        </h2>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Looks like the page or recipe you are looking for has been moved or doesn't exist on our menu.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            Return Home
          </Link>
          <Link to="/menu" className="btn btn-secondary">
            Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
};
