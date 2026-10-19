import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../SectionHeading';

const TALENT_SERVICES = [
  {
    num: '01',
    title: 'Candidate Sourcing',
    desc: 'Proactive market mapping and discreet outreach to qualified leaders across specialized sectors.',
  },
  {
    num: '02',
    title: 'Screening & Qualification',
    desc: 'Structured competency verification, leadership assessment, and professional credential evaluation.',
  },
  {
    num: '03',
    title: 'Interview Coordination',
    desc: 'End-to-end management of confidential briefing cycles, executive schedules, and candidate feedback.',
  },
  {
    num: '04',
    title: 'Recruitment Process Support',
    desc: 'Advisory on offer structuring, remuneration benchmarking, and strategic onboarding integration.',
  },
];

export default function TalentFeature() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--navy-950)',
      }}
    >
      {/* Full-Width Background Photo */}
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
          src="/images/recruitment-interview-closeup.webp"
          alt="Executive talent acquisition and corporate interview session"
          width="1800"
          height="900"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      {/* Navy-Tinted Left-Side Directional Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
        className="talent-band-overlay"
      />

      {/* Content Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 3,
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <SectionHeading
            variant="on-dark"
            label="02 — Specialization"
            title="Expertise in Talent Acquisition"
            italicWord="Acquisition"
            subtitle="Securing key professionals requires more than matching resumes; it demands deep sector intelligence, discreet relationship management, and an understanding of organizational culture."
          />

          {/* Four concise items in a thin-ruled numbered list */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
            {TALENT_SERVICES.map((item, idx) => (
              <div
                key={item.num}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: '16px',
                  padding: '16px 0',
                  borderTop: idx === 0 ? '1px solid rgba(217, 226, 236, 0.2)' : 'none',
                  borderBottom: '1px solid rgba(217, 226, 236, 0.2)',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--sky-500)',
                  }}
                >
                  {item.num}
                </span>

                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      marginBottom: '4px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/services/recruitment"
            className="btn-navy"
            style={{
              backgroundColor: 'var(--sky-500)',
              borderColor: 'var(--sky-500)',
              color: 'var(--navy-950)',
              fontWeight: 700,
            }}
          >
            Explore Recruitment <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        .talent-band-overlay {
          background: linear-gradient(90deg, rgba(7, 20, 38, 0.90) 0%, rgba(7, 20, 38, 0.72) 48%, rgba(7, 20, 38, 0.15) 85%);
        }
        @media (max-width: 768px) {
          .talent-band-overlay {
            background: linear-gradient(0deg, rgba(7, 20, 38, 0.94) 0%, rgba(7, 20, 38, 0.75) 60%, rgba(7, 20, 38, 0.20) 100%) !important;
          }
        }
      `}</style>
    </section>
  );
}
