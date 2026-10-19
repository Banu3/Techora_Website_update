import React from 'react';
import SectionLabel from '../profile/SectionLabel';
import { Check, X, ShieldAlert } from 'lucide-react';

export default function ScopePanel({
  id = 'scope',
  label = 'Service Scope & Operational Boundaries',
  heading = 'What This Service Is — And What It Is Not',
  subheading = 'Clear boundaries ensure transparency, legal compliance, and aligned expectations.',
  reviewNotice,
  whatItIs = { title: '', points: [] },
  whatItIsNot = { title: '', points: [] },
  officialDisclaimerText,
}) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: 'var(--mist-50)',
        padding: '96px 0',
        borderBottom: '1px solid var(--line)',
      }}
      aria-label="Service Scope and Boundaries"
    >
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '44px', maxWidth: '820px' }}>
          <SectionLabel label={label} />
          {heading && (
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.8vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginTop: '8px',
                marginBottom: '10px',
              }}
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'var(--ink-600)',
                margin: 0,
              }}
            >
              {subheading}
            </p>
          )}

          {reviewNotice && (
            <div
              style={{
                display: 'inline-block',
                marginTop: '12px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: 'var(--navy-700)',
                backgroundColor: 'rgba(47, 164, 231, 0.12)',
                border: '1px dashed var(--sky-500)',
                padding: '3px 8px',
                borderRadius: '2px',
              }}
            >
              {reviewNotice}
            </div>
          )}
        </div>

        {/* Two-Column Split with Thin Divider */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 18px rgba(11,31,58,0.03)',
          }}
        >
          {/* Column 1: What it is */}
          <div
            style={{
              padding: 'clamp(32px, 5vw, 48px)',
              borderRight: '1px solid var(--line)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--navy-900)',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(47, 164, 231, 0.15)',
                  color: 'var(--sky-500)',
                }}
              >
                <Check size={14} strokeWidth={2.8} />
              </span>
              <span>{whatItIs.title || 'What This Service Is'}</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {whatItIs.points.map((pt, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: 'var(--ink-600)',
                  }}
                >
                  <span style={{ color: 'var(--sky-500)', fontWeight: 700, marginTop: '2px' }}>&mdash;</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: What it is NOT */}
          <div
            style={{
              padding: 'clamp(32px, 5vw, 48px)',
              backgroundColor: '#FAFCFE',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--navy-900)',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(11, 31, 58, 0.08)',
                  color: 'var(--navy-700)',
                }}
              >
                <X size={14} strokeWidth={2.8} />
              </span>
              <span>{whatItIsNot.title || 'What This Service Is NOT'}</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {whatItIsNot.points.map((pt, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: 'var(--ink-600)',
                  }}
                >
                  <span style={{ color: 'var(--navy-700)', fontWeight: 700, marginTop: '2px' }}>&mdash;</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Official Statutory Disclaimer Band */}
        {officialDisclaimerText && (
          <div
            style={{
              marginTop: '24px',
              padding: '20px 24px',
              backgroundColor: 'var(--white)',
              borderLeft: '4px solid var(--sky-500)',
              borderTop: '1px solid var(--line)',
              borderRight: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}
          >
            <ShieldAlert size={20} color="var(--sky-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--navy-900)',
                  marginBottom: '4px',
                }}
              >
                Statutory &amp; Legal Notice
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--ink-600)',
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                {officialDisclaimerText}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
