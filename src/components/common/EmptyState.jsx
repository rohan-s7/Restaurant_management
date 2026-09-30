import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Nothing Found',
  description = 'There are no items to display at this moment.',
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--color-border)',
        margin: '1.5rem 0'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--color-bg-subtle)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.925rem',
          color: 'var(--color-text-muted)',
          maxWidth: '400px',
          marginBottom: actionText ? '1.5rem' : '0',
          lineHeight: 1.5
        }}
      >
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && !actionLink && (
        <button onClick={onActionClick} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
