import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PortraitCard({ leader, isFeatured = false }) {
  const [expanded, setExpanded] = useState(false);

  if (isFeatured) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'center',
          backgroundColor: 'var(--mist-50)',
          border: '1px solid var(--line)',
          borderRadius: '4px',
          padding: '48px',
          marginBottom: '64px',
        }}
        className="featured-leader-card"
      >
        {/* Left: 4:5 Portrait with Offset Frame & Grayscale-to-Color hover */}
        <div style={{ position: 'relative', maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          {/* Thin sky offset frame */}
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              left: '-12px',
              width: 'calc(100% + 24px)',
              height: 'calc(100% + 24px)',
              border: '1.5px solid var(--sky-500)',
              borderRadius: '3px',
              pointerEvents: 'none',
              opacity: 0.7,
            }}
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              overflow: 'hidden',
              borderRadius: '2px',
              backgroundColor: 'var(--navy-900)',
              boxShadow: '0 16px 36px rgba(11, 31, 58, 0.12)',
            }}
            className="portrait-hover-container"
          >
            <img
              src={leader.image}
              alt={leader.imageAlt || leader.name}
              width="800"
              height="1000"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                transition: 'filter 0.4s ease, transform 0.4s ease',
              }}
              className="portrait-img"
            />
          </div>
        </div>

        {/* Right: Text Information */}
        <div>
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--sky-500)',
              marginBottom: '10px',
            }}
          >
            Practice Leadership &bull; Featured Principal
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--navy-900)',
              marginBottom: '6px',
            }}
          >
            {leader.name}
          </h3>

          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--navy-700)',
              marginBottom: '14px',
            }}
          >
            {leader.designation}
          </div>

          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--sky-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--line)',
            }}
          >
            Area: {leader.area}
          </div>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.68,
              color: 'var(--ink-600)',
              marginBottom: '16px',
            }}
          >
            {leader.bio}
          </p>

          {expanded && leader.extendedBio && (
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.68,
                color: 'var(--ink-600)',
                marginBottom: '16px',
                animation: 'fadeIn 0.25s ease forwards',
              }}
            >
              {leader.extendedBio}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            {leader.extendedBio && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--navy-900)',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--sky-500)',
                  paddingBottom: '2px',
                }}
              >
                <span>{expanded ? 'Collapse Profile' : 'Read Full Executive Profile'}</span>
                {expanded ? <ChevronUp size={16} color="var(--sky-500)" /> : <ChevronDown size={16} color="var(--sky-500)" />}
              </button>
            )}

            {leader.linkedinUrl && (
              <a
                href={leader.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--sky-500)',
                }}
              >
                LinkedIn Profile &rarr;
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Non-featured Leader: 2-column portrait grid / alternating row
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: '36px',
        alignItems: 'start',
        padding: '36px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--line)',
        borderRadius: '3px',
      }}
      className="leader-row-card"
    >
      {/* 4:5 Portrait */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4/5',
            overflow: 'hidden',
            borderRadius: '2px',
            backgroundColor: 'var(--navy-900)',
            border: '1px solid var(--line)',
          }}
          className="portrait-hover-container"
        >
          <img
            src={leader.image}
            alt={leader.imageAlt || leader.name}
            width="600"
            height="750"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              transition: 'filter 0.4s ease, transform 0.4s ease',
            }}
            className="portrait-img"
          />
        </div>
      </div>

      {/* Info */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--navy-900)',
            marginBottom: '4px',
          }}
        >
          {leader.name}
        </h3>

        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--navy-700)',
            marginBottom: '10px',
          }}
        >
          {leader.designation}
        </div>

        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--sky-500)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '14px',
          }}
        >
          {leader.area}
        </div>

        <p
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: 'var(--ink-600)',
            marginBottom: '14px',
          }}
        >
          {leader.bio}
        </p>

        {expanded && leader.extendedBio && (
          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: 1.65,
              color: 'var(--ink-600)',
              marginBottom: '14px',
              animation: 'fadeIn 0.25s ease forwards',
            }}
          >
            {leader.extendedBio}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
          {leader.extendedBio && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--navy-900)',
                cursor: 'pointer',
              }}
            >
              <span>{expanded ? 'Less Details' : 'View Background'}</span>
              {expanded ? <ChevronUp size={14} color="var(--sky-500)" /> : <ChevronDown size={14} color="var(--sky-500)" />}
            </button>
          )}

          {leader.linkedinUrl && (
            <a
              href={leader.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--sky-500)',
              }}
            >
              LinkedIn Profile &rarr;
            </a>
          )}
        </div>
      </div>

      <style>{`
        .portrait-hover-container .portrait-img {
          filter: grayscale(85%);
        }
        .portrait-hover-container:hover .portrait-img {
          filter: grayscale(0%);
          transform: scale(1.03);
        }
        @media (max-width: 768px) {
          .leader-row-card {
            display: flex !important;
            flex-direction: column !important;
            padding: 24px !important;
          }
          .featured-leader-card {
            padding: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
