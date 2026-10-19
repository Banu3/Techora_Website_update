import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function HomeSplitSection() {
  return (
    <section
      style={{
        backgroundColor: 'var(--white)',
        padding: '108px 0',
        borderBottom: '1px solid var(--line)',
      }}
      className="split-content-section"
    >
      <div className="container">
        <ScrollReveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
            className="home-split-grid"
          >
            {/* Left Column: Bold Heading, Accent Divider, Paragraph, Outlined Pill Button */}
            <div style={{ maxWidth: '560px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 3.4vw, 2.75rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: 'var(--navy-900)',
                  fontWeight: 700,
                  textWrap: 'balance',
                }}
              >
                Governance, Precision and Discretion
              </h2>

              {/* Accent Divider */}
              <div
                style={{
                  width: '42px',
                  height: '3px',
                  backgroundColor: 'var(--sky-600)',
                  margin: '20px 0 24px',
                  borderRadius: '2px',
                }}
              />

              {/* Paragraph from existing content */}
              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.72,
                  color: 'var(--ink)',
                  marginBottom: '36px',
                  textWrap: 'pretty',
                }}
              >
                Fiduciary integrity, unwavering discretion, statutory accountability, and collaborative partnership with every client organization we serve. Partner-led consultation, data-backed talent mapping, and direct integration with corporate compliance teams ensure dependable operational outcomes.
              </p>

              {/* Outlined Pill Button ("Our Clients") */}
              <div>
                <Link
                  to="/clients"
                  className="btn-pill-outline-navy"
                >
                  Our Clients <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Column: Landscape Professional Image linking directly to /clients */}
            <div>
              <Link
                to="/clients"
                className="split-image-container"
                aria-label="Navigate to institutional clients and partner engagements"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/11',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--line)',
                  boxShadow: '0 18px 40px -8px rgba(7, 20, 38, 0.15)',
                  backgroundColor: 'var(--navy-900)',
                  cursor: 'pointer',
                  display: 'block',
                  textDecoration: 'none',
                }}
              >
                {/* User Reference Corporate Video Poster Image */}
                <img
                  src="/images/clients-meeting-room-v2.webp"
                  alt="TECHORA corporate delegation strategic partnership boardroom meeting"
                  width="1200"
                  height="825"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="split-poster-img"
                />

                {/* Interactive Blue Arrow Action Button (Matching User Uploaded Style) */}
                <div
                  className="interactive-play-btn"
                  aria-hidden="true"
                >
                  <div className="play-ripple" />
                  <div className="play-circle-core">
                    <ArrowRight size={28} color="#FFFFFF" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Subtitle tag on hover */}
                <div className="video-hover-badge">
                  <span>Explore Institutional Clients &bull; View Mandates &rarr;</span>
                </div>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        /* Hover zoom on poster */
        .split-image-container:hover .split-poster-img {
          transform: scale(1.04);
        }

        /* Interactive Blue Button (Matching user screenshot) */
        .interactive-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .play-circle-core {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #0F7FC4;
          border: 3px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 30px rgba(15, 127, 196, 0.6);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease;
        }

        .split-image-container:hover .play-circle-core {
          transform: scale(1.12);
          background: #0284C7;
          box-shadow: 0 12px 36px rgba(2, 132, 199, 0.75);
        }

        /* Ambient ripple animation */
        @keyframes pulseRipple {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .play-ripple {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid rgba(47, 164, 231, 0.8);
          animation: pulseRipple 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
        }

        /* Hover Badge */
        .video-hover-badge {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(7, 20, 38, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #FFFFFF;
          padding: 7px 18px;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          border: 1px solid rgba(255, 255, 255, 0.25);
          opacity: 0;
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
          white-space: nowrap;
        }

        .split-image-container:hover .video-hover-badge {
          opacity: 1;
          transform: translateX(-50%) translateY(-2px);
        }

        @media (max-width: 860px) {
          .home-split-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
