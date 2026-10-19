import React from 'react';
import ScrollReveal from './ScrollReveal';
import { useSiteContent } from '../../context/SiteContentContext';

export default function WelcomeIntro() {
  const { t } = useSiteContent();

  return (
    <section
      style={{
        backgroundColor: 'var(--white)',
        padding: '108px 24px',
        borderBottom: '1px solid var(--line)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="welcome-section"
    >
      <div className="container" style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
        <ScrollReveal>
          {/* Small italic serif line */}
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              fontSize: '1.25rem',
              color: 'var(--sky-600)',
              marginBottom: '18px',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {t('home.welcome.eyebrow', 'Welcome to TECHORA')}
          </p>

          {/* Large centered paragraph using existing company intro text */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.15rem, 2vw, 1.35rem)',
              lineHeight: 1.78,
              color: 'var(--navy-900)',
              fontWeight: 500,
              maxWidth: '820px',
              margin: '0 auto 28px',
              textWrap: 'pretty',
            }}
          >
            {t('home.welcome.bodyText', 'TECHORA Consultant brings businesses and people together through recruitment, talent acquisition, payroll support, and business-focused consulting. We focus on understanding organizational needs and creating professional connections that support long-term business relationships.')}
          </p>

          {/* Short accent line divider under it */}
          <div
            style={{
              width: '48px',
              height: '3px',
              backgroundColor: 'var(--sky-600)',
              margin: '0 auto',
              borderRadius: '2px',
            }}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
