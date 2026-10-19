import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function FullWidthBanner({ onOpenConsultModal }) {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--navy-950)',
      }}
      className="full-width-banner-root"
    >
      {/* 1. Wide Landscape Image (Subject on the Left) */}
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
          src="/images/partner-handshake-topdown.webp"
          alt="Corporate business partnership and executive consultation"
          width="1920"
          height="1080"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'left center',
          }}
        />
      </div>

      {/* 2. Dark Overlay: Darker on the RIGHT so text is crystal clear */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
        className="full-width-banner-overlay"
      />

      {/* 3. Content on the RIGHT */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 4,
          paddingTop: '80px',
          paddingBottom: '80px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{ maxWidth: '620px', width: '100%' }}>
          <ScrollReveal>
            {/* Heading from existing content */}
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.5vw, 2.85rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                fontWeight: 700,
                marginBottom: '18px',
                textWrap: 'balance',
              }}
            >
              Let's Build a Stronger Business Partnership
            </h2>

            {/* Short line from existing content */}
            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.88)',
                marginBottom: '32px',
                textWrap: 'pretty',
              }}
            >
              Whether you require executive search, comprehensive statutory payroll support, or strategic workforce consulting, TECHORA Consultant provides dedicated partner-level attention.
            </p>

            {/* Accent Filled Pill Button ("Contact Us") */}
            <div>
              <Link
                to="/partner-with-us"
                className="btn-pill-accent"
              >
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        .full-width-banner-overlay {
          background: linear-gradient(270deg, rgba(7, 20, 38, 0.95) 0%, rgba(7, 20, 38, 0.86) 48%, rgba(7, 20, 38, 0.40) 75%, rgba(7, 20, 38, 0.15) 100%);
        }
        @media (max-width: 860px) {
          .full-width-banner-root {
            min-height: 420px !important;
          }
          .full-width-banner-overlay {
            background: linear-gradient(0deg, rgba(7, 20, 38, 0.96) 0%, rgba(7, 20, 38, 0.85) 60%, rgba(7, 20, 38, 0.35) 100%) !important;
          }
          .container {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
