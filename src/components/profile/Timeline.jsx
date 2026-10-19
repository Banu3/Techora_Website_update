import React from 'react';

export default function Timeline({ num, label, headline, subheading, items = [] }) {
  return (
    <section style={{ backgroundColor: 'var(--mist-50)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
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
          <div style={{ maxWidth: '820px', marginBottom: '64px' }}>
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
            <div className="thin-sky-rule" style={{ marginBottom: '16px' }} />
            {subheading && (
              <p style={{ fontSize: '1.0625rem', color: 'var(--ink-600)', lineHeight: 1.68 }}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Timeline Container */}
        <div style={{ position: 'relative', width: '100%', margin: '0 auto', maxWidth: '1080px' }}>
          {/* Vertical Central Line on Desktop / Left Line on Mobile */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              bottom: '24px',
              left: '50%',
              width: '2px',
              backgroundColor: 'var(--sky-500)',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
            className="timeline-center-line"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '72px' }}>
            {items.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.year || idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '64px',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2,
                  }}
                  className="timeline-row"
                >
                  {/* Left Column */}
                  <div
                    style={{
                      order: isEven ? 1 : 2,
                      textAlign: isEven ? 'right' : 'left',
                      paddingRight: isEven ? '32px' : '0',
                      paddingLeft: isEven ? '0' : '32px',
                    }}
                    className={`timeline-text-side ${isEven ? 'text-right-col' : 'text-left-col'}`}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        color: 'var(--sky-500)',
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--line)',
                        padding: '4px 12px',
                        borderRadius: '2px',
                        marginBottom: '12px',
                        boxShadow: '0 2px 6px rgba(11,31,58,0.04)',
                      }}
                    >
                      {item.year}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--navy-900)',
                        marginBottom: '10px',
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--ink-600)',
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Right Column: Image */}
                  <div
                    style={{
                      order: isEven ? 2 : 1,
                      paddingLeft: isEven ? '32px' : '0',
                      paddingRight: isEven ? '0' : '32px',
                    }}
                    className="timeline-image-side"
                  >
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '16/10',
                        overflow: 'hidden',
                        borderRadius: '3px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--white)',
                        boxShadow: '0 8px 24px -4px rgba(11, 31, 58, 0.08)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        width="800"
                        height="500"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-center-line {
            left: 20px !important;
            transform: none !important;
          }
          .timeline-row {
            display: flex !important;
            flex-direction: column !important;
            padding-left: 48px !important;
            gap: 24px !important;
          }
          .timeline-text-side {
            order: 1 !important;
            text-align: left !important;
            padding-right: 0 !important;
            padding-left: 0 !important;
          }
          .timeline-image-side {
            order: 2 !important;
            padding-right: 0 !important;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
