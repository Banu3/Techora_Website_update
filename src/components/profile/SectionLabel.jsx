import React from 'react';

export default function SectionLabel({ num, text }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
      {num && (
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--sky-500)',
            letterSpacing: '0.1em',
          }}
        >
          {num} &mdash;
        </span>
      )}
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--sky-500)',
        }}
      >
        {text}
      </span>
    </div>
  );
}
