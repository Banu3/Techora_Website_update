import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'System Notice',
  message = 'An unexpected error occurred while loading this section. Please refresh or contact support.',
  onRetry,
}) {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 20px',
        textAlign: 'center',
        gap: '16px',
        maxWidth: '540px',
        margin: '0 auto',
      }}
      role="alert"
    >
      <div 
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#DC2626',
        }}
      >
        <AlertCircle size={24} />
      </div>

      <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.9375rem', color: 'var(--ink-600)', lineHeight: 1.6 }}>
        {message}
      </p>

      {onRetry && (
        <Button variant="outline" onClick={onRetry} style={{ marginTop: '8px' }}>
          Retry Request
        </Button>
      )}
    </div>
  );
}
