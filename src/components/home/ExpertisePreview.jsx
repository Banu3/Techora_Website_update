import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import SectionHeading from '../SectionHeading';

const INDUSTRIES_LIST = [
  {
    id: 'finance',
    name: 'Banking & Financial Services',
    focus: 'Institutional finance, capital markets, quantitative risk, and fintech leadership.',
    image: '/images/home/industry-finance.webp',
    alt: 'Banking and financial district high-rise architecture',
  },
  {
    id: 'tech',
    name: 'Information Technology & Software',
    focus: 'Cloud architecture, engineering directorships, cybersecurity, and tech infrastructure.',
    image: '/images/home/industry-tech.webp',
    alt: 'Software engineering team collaborating on enterprise systems',
  },
  {
    id: 'retail',
    name: 'Retail & Modern E-Commerce',
    focus: 'Omnichannel management, supply chain execution, and shift-based workforce compliance.',
    image: '/images/home/industry-retail.webp',
    alt: 'Modern commercial storefront and omnichannel retail distribution',
  },
  {
    id: 'corporate',
    name: 'Professional Services & Consulting',
    focus: 'Partner-level lateral placement, corporate restructuring, and statutory advisory.',
    image: '/images/home/industry-corporate.webp',
    alt: 'Corporate consulting partners in an executive advisory discussion',
  },
];

export default function ExpertisePreview() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section style={{ backgroundColor: 'var(--mist)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '20px' }}>
          <div>
            <SectionHeading
              variant="rule"
              label="06 — Sector Specialization"
              title="Industries We Advise"
              italicWord="Advise"
            />
          </div>

          <Link
            to="/expertise/industries"
            className="slide-link"
            style={{ color: 'var(--navy-900)', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '28px' }}
          >
            View All Industries <ArrowRight size={16} color="var(--sky-600)" />
          </Link>
        </div>

        {/* Interactive Image-Led List Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '56px',
            alignItems: 'center',
          }}
          className="expertise-grid"
        >
          {/* Left: Dynamic Large Image */}
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/11',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: 'var(--navy-900)',
                border: '1px solid var(--line)',
                boxShadow: '0 14px 32px -6px rgba(7, 20, 38, 0.1)',
              }}
            >
              {INDUSTRIES_LIST.map((item, idx) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt={item.alt}
                  width="1200"
                  height="825"
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: activeIdx === idx ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    zIndex: activeIdx === idx ? 2 : 1,
                  }}
                />
              ))}

              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  backgroundColor: 'rgba(7, 20, 38, 0.90)',
                  backdropFilter: 'blur(4px)',
                  color: 'var(--white)',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderLeft: '2px solid var(--sky-500)',
                  zIndex: 10,
                }}
              >
                {INDUSTRIES_LIST[activeIdx].name}
              </div>
            </div>
          </div>

          {/* Right: Vertical List of Industries */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {INDUSTRIES_LIST.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onFocus={() => setActiveIdx(idx)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid var(--line)',
                    borderLeft: isActive ? '3px solid var(--sky-600)' : '3px solid transparent',
                    backgroundColor: isActive ? 'var(--white)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    borderRadius: '4px',
                  }}
                  className="industry-row-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: isActive ? 'var(--navy-900)' : 'var(--navy-800)',
                        margin: 0,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.name}
                    </h3>
                    <ChevronRight
                      size={18}
                      style={{
                        color: isActive ? 'var(--sky-600)' : 'var(--line)',
                        transform: isActive ? 'translateX(4px)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--ink)',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {item.focus}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
