import React from 'react';

export default function RuledList({ items = [] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid var(--line)',
      }}
    >
      {items.map((item, index) => {
        const numStr = String(index + 1).padStart(2, '0');
        const title = typeof item === 'string' ? null : (item.title || item.item);
        const desc = typeof item === 'string' ? item : (item.detail || item.desc);

        return (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: 'clamp(40px, 6vw, 60px) 1fr',
              padding: '22px 0',
              borderBottom: '1px solid var(--line)',
              gap: '16px',
              alignItems: 'baseline',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--sky-500)',
                letterSpacing: '0.05em',
              }}
            >
              {numStr}
            </span>

            <div>
              {title && (
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    marginBottom: '4px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </div>
              )}
              {desc && (
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    color: 'var(--ink-600)',
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
