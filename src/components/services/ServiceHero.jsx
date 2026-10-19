import React from 'react';
import Breadcrumbs from '../Breadcrumbs';
import { ArrowRight } from 'lucide-react';

export default function ServiceHero({
  breadcrumbs = [],
  eyebrow,
  title,
  subtitle,
  primaryCtaText,
  primaryCtaLink = '#contact-section',
  onPrimaryCtaClick,
  secondaryCtaText,
  secondaryCtaLink,
  imageSrc = '/images/recruitment-interview.webp',
  imageAlt = 'TECHORA Advisory Service Practice',
  objectPosition = 'center 30%',
  children,
}) {
  return (
    <header
      className="hero-full-bleed"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(440px, 58vh, 600px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--navy-950)',
      }}
      aria-label="Service Header"
    >
      {/* 100% Full-Bleed Background Photography */}
      <img
        src={imageSrc}
        alt={imageAlt}
        width="1920"
        height="1080"
        loading="eager"
        fetchPriority="high"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: objectPosition,
          zIndex: 0,
          filter: 'contrast(1.02)',
        }}
      />

      {/* Directional Overlay */}
      <div
        className="hero-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Hero Typography & CTAs on Left */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: '64px',
          paddingBottom: '64px',
          width: '100%',
        }}
      >
        <div
          className="hero-content"
          style={{
            maxWidth: '720px',
            padding: 0,
          }}
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div style={{ marginBottom: '18px', opacity: 0.9 }}>
              <Breadcrumbs items={breadcrumbs} isLight />
            </div>
          )}

          {eyebrow && (
            <div
              className="eyebrow-label"
              style={{
                marginBottom: '14px',
                color: 'var(--sky-500)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              {eyebrow}
            </div>
          )}

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--fs-page-title)',
              color: '#FFFFFF',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              marginBottom: '18px',
              textWrap: 'balance',
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'rgba(255, 255, 255, 0.90)',
                lineHeight: 1.68,
                maxWidth: '65ch',
                marginBottom: '28px',
                textWrap: 'pretty',
              }}
            >
              {subtitle}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {primaryCtaText && (
              <a
                href={primaryCtaLink}
                onClick={(e) => {
                  if (onPrimaryCtaClick) {
                    e.preventDefault();
                    onPrimaryCtaClick();
                  }
                }}
                className="btn-navy"
                style={{
                  backgroundColor: 'var(--sky-500)',
                  borderColor: 'var(--sky-500)',
                  color: 'var(--navy-950)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {primaryCtaText} <ArrowRight size={16} />
              </a>
            )}

            {secondaryCtaText && secondaryCtaLink && (
              <a
                href={secondaryCtaLink}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--sky-500)',
                  paddingBottom: '2px',
                  transition: 'color var(--transition-smooth)',
                }}
              >
                {secondaryCtaText} <ArrowRight size={14} color="var(--sky-500)" />
              </a>
            )}
          </div>

          {children && <div style={{ marginTop: '24px' }}>{children}</div>}
        </div>
      </div>
    </header>
  );
}
