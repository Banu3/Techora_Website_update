import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../SectionHeading';

export default function PartnerCTA({ onOpenConsultModal }) {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: 'var(--navy-950)',
        color: 'var(--white)',
        padding: '108px 0',
        overflow: 'hidden',
        borderTop: '1px solid var(--navy-800)',
      }}
    >
      {/* Full-Bleed Top-down Handshake Photo Background */}
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
          alt="Top-down business handshake over corporate consulting documentation and laptop"
          width="1920"
          height="1080"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      {/* Navy Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(7, 20, 38, 0.88) 0%, rgba(7, 20, 38, 0.96) 100%)',
          zIndex: 2,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <SectionHeading
            variant="ornament"
            label="Corporate Partnership"
            title="Let's Build a Stronger Business Partnership"
            italicWord="Partnership"
            subtitle="Whether you require executive search, comprehensive statutory payroll support, or strategic workforce consulting, TECHORA Consultant provides dedicated partner-level attention."
            className="on-dark"
            style={{ color: 'white' }}
          />

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              marginTop: '32px',
            }}
          >
            <Link
              to="/partner-with-us"
              className="btn-white-filled"
            >
              Partner With Us <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={onOpenConsultModal}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#FFFFFF',
                textDecoration: 'underline',
                textUnderlineOffset: '6px',
                textDecorationColor: 'var(--sky-500)',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '8px 16px',
              }}
            >
              Request Quick Consultation &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
