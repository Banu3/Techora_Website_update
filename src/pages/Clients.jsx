import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { features } from '../config/features';

export default function Clients() {
  const isLocked = !features.clientsEnabled;

  useEffect(() => {
    document.title = 'Our Client Network | TECHORA Consultant';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'TECHORA corporate client network and institutional partnership portal.';

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (isLocked) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        document.head.appendChild(metaRobots);
      }
      metaRobots.content = 'noindex, nofollow';
    } else if (metaRobots) {
      metaRobots.content = 'index, follow';
    }
  }, [isLocked]);

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Clients' },
  ];

  return (
    <div className="page-clients" style={{ backgroundColor: 'var(--white)' }}>
      {/* Full-Bleed Photography Header with handshake-topdown.webp & Directional Overlay */}
      <header
        className="hero-full-bleed"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'clamp(460px, 60vh, 620px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--navy-950)',
        }}
        aria-label="Clients Header"
      >
        {/* Full-Bleed Background Image */}
        <img
          src="/images/handshake-topdown.webp"
          alt="Top-down business handshake representing TECHORA institutional client partnerships"
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
            objectPosition: 'center 40%',
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

        {/* Content on Left */}
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
              maxWidth: '680px',
              padding: 0,
            }}
          >
            <div style={{ marginBottom: '18px', opacity: 0.9 }}>
              <Breadcrumbs items={breadcrumbs} isLight />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                marginBottom: '18px',
              }}
            >
              <Lock size={13} color="var(--sky-500)" />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--sky-500)',
                }}
              >
                Clients
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-page-title)',
                fontWeight: 700,
                color: 'var(--white)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                marginBottom: '18px',
                textWrap: 'balance',
              }}
            >
              Our Client Network
            </h1>

            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.68,
                color: 'rgba(255, 255, 255, 0.90)',
                marginBottom: '32px',
                maxWidth: '62ch',
                textWrap: 'pretty',
              }}
            >
              This section is being prepared. Contact TECHORA to discuss our services and business partnerships.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <Link
                to="/partner-with-us"
                className="btn-navy"
                style={{
                  backgroundColor: 'var(--sky-500)',
                  borderColor: 'var(--sky-500)',
                  color: 'var(--navy-950)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Partner With Us <ArrowRight size={16} />
              </Link>

              <Link
                to="/services/recruitment"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--sky-500)',
                  paddingBottom: '2px',
                }}
              >
                Explore Practice Services
              </Link>
            </div>

            <div
              style={{
                marginTop: '36px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.8125rem',
                color: 'rgba(255, 255, 255, 0.75)',
              }}
            >
              <ShieldCheck size={16} color="var(--sky-500)" />
              <span>Client engagements are protected under mutual non-disclosure standards.</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
