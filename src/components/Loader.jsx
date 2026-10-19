import React from 'react';

export default function Loader({ message = 'Loading institutional intelligence...' }) {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 20px',
        gap: '16px',
        color: 'var(--navy-700)',
      }}
      role="status"
      aria-live="polite"
    >
      <div 
        style={{
          width: '36px',
          height: '36px',
          border: '2.5px solid var(--line)',
          borderTopColor: 'var(--sky-500)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
        {message}
      </span>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
