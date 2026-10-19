import React from 'react';

export default function SplitSection({
  eyebrow,
  title,
  subtitle,
  children,
  imageSrc,
  imageAlt,
  imageOnLeft = false,
  badgeText,
  bgColor = 'var(--white)',
}) {
  return (
    <section style={{ backgroundColor: bgColor, padding: '88px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Content Column */}
          <div style={{ order: imageOnLeft ? 2 : 1 }}>
            {eyebrow && (
              <div className="eyebrow-label" style={{ marginBottom: '12px' }}>
                {eyebrow}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: 'var(--fs-section-title)', color: 'var(--navy-900)', lineHeight: 'var(--lh-section-title)' }}>
                {title}
              </h2>
              <span className="accent-line" style={{ flexShrink: 0 }} />
            </div>

            {subtitle && (
              <p style={{ fontSize: '1.0625rem', color: 'var(--ink-600)', lineHeight: 1.68, marginBottom: '24px' }}>
                {subtitle}
              </p>
            )}

            {children}
          </div>

          {/* Media Column */}
          {imageSrc && (
            <div style={{ order: imageOnLeft ? 1 : 2, position: 'relative' }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  border: '1px solid var(--line)',
                  boxShadow: '0 8px 24px -4px rgba(11, 31, 58, 0.08)',
                }}
              >
                <img
                  src={imageSrc}
                  alt={imageAlt || 'TECHORA Corporate Consulting'}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {badgeText && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-16px',
                    right: '24px',
                    backgroundColor: 'var(--navy-900)',
                    color: 'var(--white)',
                    padding: '12px 20px',
                    borderRadius: '3px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    boxShadow: '0 6px 16px rgba(11,31,58,0.25)',
                    borderLeft: '3px solid var(--sky-500)',
                  }}
                >
                  {badgeText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
