import React from 'react';

export default function PhotoBand({
  num,
  label,
  headline,
  subheading,
  image,
  steps = [],
}) {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        backgroundColor: 'var(--navy-900)',
        color: 'var(--white)',
        padding: '100px 0',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Navy Gradient Overlay on left */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(7, 20, 38, 0.88) 0%, rgba(7, 20, 38, 0.65) 40%, rgba(7, 20, 38, 0.15) 75%, rgba(7, 20, 38, 0.05) 100%)',
          zIndex: 2,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '780px', marginBottom: '56px' }}>
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

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--fs-section-title)',
              lineHeight: 'var(--lh-section-title)',
              color: 'var(--white)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              marginBottom: '16px',
            }}
          >
            {headline}
          </h2>

          <div className="thin-sky-rule" style={{ marginBottom: '20px' }} />

          {subheading && (
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.68, color: 'rgba(255, 255, 255, 0.85)' }}>
              {subheading}
            </p>
          )}
        </div>

        {/* 3-4 short steps in a horizontal ruled row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '36px',
          }}
          className="photoband-steps"
        >
          {steps.map((st) => (
            <div
              key={st.step}
              style={{
                borderLeft: '2px solid var(--sky-500)',
                paddingLeft: '18px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--sky-500)',
                  marginBottom: '8px',
                  letterSpacing: '0.08em',
                }}
              >
                STAGE {st.step}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginBottom: '8px',
                }}
              >
                {st.title}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                  color: 'rgba(255, 255, 255, 0.72)',
                  margin: 0,
                }}
              >
                {st.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
