import React from 'react';

export default function ImageSection({
  src,
  alt,
  caption,
  eyebrow,
  title,
  text,
  aspectRatio = '16/9',
  overlay = false,
}) {
  return (
    <section style={{ padding: '72px 0', backgroundColor: 'var(--white)' }}>
      <div className="container">
        {(eyebrow || title) && (
          <div style={{ marginBottom: '28px' }}>
            {eyebrow && <div className="eyebrow-label" style={{ marginBottom: '8px' }}>{eyebrow}</div>}
            {title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: 'var(--fs-section-title)', color: 'var(--navy-900)' }}>{title}</h2>
                <span className="accent-line" />
              </div>
            )}
            {text && <p style={{ marginTop: '12px', color: 'var(--ink-600)' }}>{text}</p>}
          </div>
        )}

        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio,
            overflow: 'hidden',
            borderRadius: '4px',
            border: '1px solid var(--line)',
          }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {overlay && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(11,31,58,0.1) 0%, rgba(11,31,58,0.6) 100%)',
              }}
            />
          )}
        </div>

        {caption && (
          <div style={{ marginTop: '12px', fontSize: '0.8125rem', color: 'var(--ink-600)', fontStyle: 'italic' }}>
            {caption}
          </div>
        )}
      </div>
    </section>
  );
}
