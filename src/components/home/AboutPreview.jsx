import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../SectionHeading';

const ABOUT_ROWS = [
  {
    label: 'Purpose',
    text: 'To provide corporate leaders with dependable talent intelligence, rigorous compliance governance, and bespoke workforce advisory that drives measurable enterprise advancement.',
  },
  {
    label: 'Values',
    text: 'Fiduciary integrity, unwavering discretion, statutory accountability, and collaborative partnership with every client organization we serve.',
  },
  {
    label: 'Approach',
    text: 'Partner-led consultation, data-backed talent mapping, and direct integration with corporate compliance teams to achieve dependable operational outcomes.',
  },
];

export default function AboutPreview() {
  return (
    <section style={{ backgroundColor: 'var(--mist)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
          className="about-preview-grid"
        >
          {/* Left Column: Natural-light Indian leadership meeting photo */}
          <div>
            <div
              style={{
                width: '100%',
                aspectRatio: '4/3',
                overflow: 'hidden',
                borderRadius: '4px',
                border: '1px solid var(--line)',
                backgroundColor: 'var(--white)',
                boxShadow: '0 12px 32px -6px rgba(7, 20, 38, 0.08)',
              }}
            >
              <img
                src="/images/about-leadership-meeting.webp"
                alt="Senior consulting practice directors at TECHORA Consultant in a strategy meeting"
                width="1200"
                height="900"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 30%',
                }}
              />
            </div>
          </div>

          {/* Right Column: Purpose, Values, Approach */}
          <div>
            <SectionHeading
              variant="rule"
              label="03 — Strategic Foundation"
              title="Committed to Governance, Precision & Discretion"
              italicWord="Governance"
            />

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '36px' }}>
              {ABOUT_ROWS.map((row, idx) => (
                <div
                  key={row.label}
                  style={{
                    padding: '20px 0',
                    borderTop: idx === 0 ? '1px solid var(--line)' : 'none',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--sky-600)',
                      marginBottom: '6px',
                    }}
                  >
                    {row.label}
                  </div>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.68,
                      color: 'var(--ink)',
                      margin: 0,
                    }}
                  >
                    {row.text}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/profile/about-us"
              className="btn-navy"
            >
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
