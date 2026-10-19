import React from 'react';
import SectionLabel from '../profile/SectionLabel';

export default function ProcessStrip({
  sectionNumber = '07',
  label = 'Recruitment Process Support',
  statusTag = '[Confirm steps]',
  heading,
  steps = [],
}) {
  return (
    <section
      id="how-we-work"
      style={{
        backgroundColor: 'var(--mist-50)',
        padding: '96px 0',
        borderBottom: '1px solid var(--line)',
      }}
      aria-label="Recruitment Process Support"
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '48px', maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <SectionLabel num={sectionNumber} label={label} />
            {statusTag && !statusTag.includes('[Confirm') && !statusTag.includes('[PLACEHOLDER') && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: 'var(--ink-600)',
                  backgroundColor: 'rgba(11,31,58,0.06)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  border: '1px dashed var(--line)',
                }}
              >
                {statusTag}
              </span>
            )}
          </div>

          {heading && (
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.8vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
              }}
            >
              {heading}
            </h2>
          )}
        </div>

        {/* Process Strip: Horizontal row with connecting thin lines on desktop, cleanly stacked on mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '20px',
                borderTop: '2px solid var(--line)',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderTopColor = 'var(--sky-500)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderTopColor = 'var(--line)';
              }}
            >
              {/* Step indicator dot */}
              <div
                style={{
                  position: 'absolute',
                  top: '-6px',
                  left: 0,
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sky-500)',
                }}
              />

              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--sky-500)',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}
              >
                STEP {step.stepNumber}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--navy-900)',
                  marginBottom: '10px',
                  letterSpacing: '-0.01em',
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--ink-600)',
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
