import React from 'react';

export default function EditorialSplit({
  label,
  num,
  headline,
  leftContent,
  rightContent,
  reversed = false,
  bgColor = 'var(--white)',
}) {
  return (
    <section
      style={{
        backgroundColor: bgColor,
        padding: '96px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="container">
        {(num || label) && (
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
              {label}
            </span>
          </div>
        )}

        {headline && (
          <div style={{ maxWidth: '820px', marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-section-title)',
                lineHeight: 'var(--lh-section-title)',
                color: 'var(--navy-900)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginBottom: '16px',
              }}
            >
              {headline}
            </h2>
            <div className="thin-sky-rule" />
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          <div style={{ order: reversed ? 2 : 1 }}>
            {leftContent}
          </div>
          <div style={{ order: reversed ? 1 : 2 }}>
            {rightContent}
          </div>
        </div>
      </div>
    </section>
  );
}
