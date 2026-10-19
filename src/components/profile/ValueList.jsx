import React from 'react';

export default function ValueList({ num, label, headline, items = [], values = [] }) {
  const displayItems = items.length > 0 ? items : values;
  return (
    <section style={{ backgroundColor: 'var(--white)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
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
          <div style={{ maxWidth: '820px', marginBottom: '48px' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {displayItems.map((item, idx) => (
            <div
              key={item.num || idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                gap: '24px',
                padding: '24px 0',
                borderTop: idx === 0 ? '1px solid var(--line)' : 'none',
                borderBottom: '1px solid var(--line)',
                alignItems: 'baseline',
              }}
              className="value-item-row"
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--sky-500)',
                }}
              >
                {item.num}
              </span>

              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    marginBottom: '6px',
                  }}
                >
                  {item.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.65,
                    color: 'var(--ink-600)',
                    margin: 0,
                  }}
                >
                  {item.description ? item.description.replace(/^\[Confirm values\]\s*/i, '') : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
