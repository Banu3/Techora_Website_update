import React from 'react';
import Breadcrumbs from './Breadcrumbs';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumbs = [],
  imageSrc = '/images/about-team.webp',
  imageAlt = 'TECHORA Consultant Institutional Advisory Practice',
  objectPosition = 'center 35%',
  centered = false,
  children,
}) {
  return (
    <section
      className="hero-full-bleed"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minHeight: centered ? 'clamp(320px, 42vh, 440px)' : 'clamp(420px, 58vh, 580px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: centered ? 'center' : 'flex-start',
        overflow: 'hidden',
        backgroundColor: 'var(--navy-950)',
      }}
    >
      {/* Full-Bleed Background Photography */}
      <img
        src={imageSrc}
        alt={imageAlt}
        width="1920"
        height="1080"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: objectPosition,
          zIndex: 0,
        }}
      />

      {/* Edge-to-edge directional overlay */}
      <div
        className="hero-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: centered
            ? 'linear-gradient(90deg, rgba(7, 20, 38, 0.5) 0%, rgba(7, 30, 58, 0.82) 40%, rgba(7, 20, 38, 0.92) 100%)'
            : undefined,
          zIndex: 1,
        }}
      />

      {/* Hero Typography & Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: '64px',
          paddingBottom: '64px',
          width: '100%',
          display: 'flex',
          justifyContent: centered ? 'center' : 'flex-start',
        }}
      >
        <div
          className="hero-content"
          style={{
            maxWidth: centered ? '800px' : '720px',
            textAlign: centered ? 'center' : 'left',
            margin: centered ? '0 auto' : undefined,
            padding: 0,
          }}
        >
          {/* Eyebrow Label (if not centered) */}
          {!centered && eyebrow && (
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

          {/* Page Title */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: centered ? 'clamp(2.4rem, 4.2vw, 3.4rem)' : 'var(--fs-page-title)',
              color: '#FFFFFF',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              marginBottom: centered ? '14px' : '16px',
              textWrap: 'balance',
            }}
          >
            {title}
          </h1>

          {/* Breadcrumbs: Below title if centered (like Image 4), above title if standard */}
          {breadcrumbs.length > 0 && (
            <div
              style={{
                marginBottom: centered ? '20px' : '18px',
                order: centered ? 2 : -1,
                opacity: 0.92,
                display: 'flex',
                justifyContent: centered ? 'center' : 'flex-start',
              }}
            >
              <Breadcrumbs items={breadcrumbs} isLight />
            </div>
          )}

          {subtitle && (
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'rgba(255, 255, 255, 0.90)',
                lineHeight: 1.68,
                maxWidth: '65ch',
                textWrap: 'pretty',
                margin: centered ? '0 auto 24px' : '0 0 32px 0',
              }}
            >
              {subtitle}
            </p>
          )}

          {children && (
            <div
              style={{
                display: 'flex',
                justifyContent: centered ? 'center' : 'flex-start',
                marginTop: centered ? '16px' : '0',
              }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
