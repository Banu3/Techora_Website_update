import React from 'react';
import SectionHeading from '../SectionHeading';

export default function IntroSection() {
  return (
    <section
      style={{
        backgroundColor: 'var(--white)',
        borderBottom: '1px solid var(--line)',
        padding: '96px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="welcome-techora-section"
    >
      <div
        className="container"
        style={{
          maxWidth: '840px',
          margin: '0 auto',
          textAlign: 'center',
          animation: 'fadeUpOnce 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        <SectionHeading
          variant="ornament"
          label="Welcome to"
          title="TECHORA"
          subtitle="TECHORA Consultant brings businesses and people together through recruitment, talent acquisition, payroll support, and business-focused consulting. We focus on understanding organizational needs and creating professional connections that support long-term business relationships."
        />
      </div>

      <style>{`
        @keyframes fadeUpOnce {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
