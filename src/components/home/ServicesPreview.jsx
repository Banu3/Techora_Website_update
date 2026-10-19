import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../SectionHeading';

export default function ServicesPreview() {
  return (
    <div style={{ width: '100%' }}>
      {/* =========================================================================
          Composition A: Recruitment (White Background, Crisp Layout)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--white)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            {/* Image Left */}
            <div>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/11',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  border: '1px solid var(--line)',
                  boxShadow: '0 12px 28px -6px rgba(7, 20, 38, 0.08)',
                  backgroundColor: 'var(--white)',
                }}
              >
                <img
                  src="/images/recruitment-interview-closeup.webp"
                  alt="TECHORA executive search and professional candidate interview"
                  width="1200"
                  height="825"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>
            </div>

            {/* Text Right */}
            <div>
              <SectionHeading
                variant="index"
                index="04"
                label="Core Practice"
                title="Retained Executive Recruitment"
                italicWord="Recruitment"
              />

              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  color: 'var(--ink)',
                  marginBottom: '20px',
                }}
              >
                Specialized in placing C-Suite officers, Vice Presidents, and high-impact functional leaders who steer organizational transformation. We conduct discreet talent mapping backed by rigorous competency verification.
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.9375rem',
                  color: 'var(--ink)',
                  marginBottom: '32px',
                  paddingLeft: 0,
                }}
              >
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--sky-600)" />
                  <span>Confidential executive search for regulated sectors</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--sky-600)" />
                  <span>Objective leadership benchmarks &amp; cultural fit assessment</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--sky-600)" />
                  <span>Structured onboarding &amp; 12-month retention commitments</span>
                </li>
              </ul>

              <Link
                to="/services/recruitment"
                className="slide-link"
                style={{ color: 'var(--navy-900)', fontSize: '0.9375rem', fontWeight: 600 }}
              >
                Explore Recruitment Practice <ArrowRight size={16} color="var(--sky-600)" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Composition B: Payroll (Navy-950 Background, White Text)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--navy-950)', color: 'var(--white)', padding: '96px 0', borderBottom: '1px solid var(--navy-800)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            {/* Text Left */}
            <div style={{ order: 1 }}>
              <SectionHeading
                variant="ghost"
                index="05"
                label="Compliance Practice"
                title="Payroll Solutions & Statutory Governance"
                italicWord="Governance"
                className="on-dark"
                style={{ color: 'white' }}
              />

              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: '20px',
                }}
              >
                Protecting enterprise reputation through disciplined payroll administration, tax withholdings, and statutory oversight. We support multi-jurisdictional teams with complete audit transparency.
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.9375rem',
                  color: 'rgba(255, 255, 255, 0.80)',
                  marginBottom: '32px',
                  paddingLeft: 0,
                }}
              >
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--sky-500)" />
                  <span>Statutory labor regulation &amp; withholding tax compliance</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--sky-500)" />
                  <span>Executive deferred compensation &amp; variable payroll design</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--sky-500)" />
                  <span>Independent payroll audits &amp; risk management advisory</span>
                </li>
              </ul>

              <Link
                to="/services/payroll"
                className="btn-navy"
                style={{
                  backgroundColor: 'var(--sky-500)',
                  borderColor: 'var(--sky-500)',
                  color: 'var(--navy-950)',
                  fontWeight: 700,
                }}
              >
                Explore Payroll Solutions <ArrowRight size={16} />
              </Link>
            </div>

            {/* Image Right */}
            <div style={{ order: 2 }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                  marginLeft: 'auto',
                }}
              >
                <img
                  src="/images/payroll-hr-desk.webp"
                  alt="Financial analytics and enterprise payroll statutory documentation review"
                  width="1000"
                  height="750"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
