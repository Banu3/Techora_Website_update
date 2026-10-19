import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageHeader from '../components/PageHeader';
import PortraitCard from '../components/profile/PortraitCard';
import CTASection from '../components/CTASection';
import { leadershipContent } from '../content/leadershipContent';

export default function Leadership({ onOpenConsultModal }) {
  useEffect(() => {
    document.title = leadershipContent.seo.title;

    // Inject BreadcrumbList JSON-LD
    const jsonLdId = 'leadership-breadcrumbs-schema';
    let script = document.getElementById(jsonLdId);
    if (!script) {
      script = document.createElement('script');
      script.id = jsonLdId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://techora.consulting/' },
          { '@type': 'ListItem', position: 2, name: 'Profile', item: 'https://techora.consulting/profile/leadership' },
          { '@type': 'ListItem', position: 3, name: 'Leadership Team', item: 'https://techora.consulting/profile/leadership' },
        ],
      });
      document.head.appendChild(script);
    }
  }, []);

  const featuredLeader = leadershipContent.leaders.find((l) => l.isFeatured) || leadershipContent.leaders[0];
  const otherLeaders = leadershipContent.leaders.filter((l) => l.id !== featuredLeader.id);

  return (
    <div style={{ backgroundColor: 'var(--white)' }}>
      {/* =========================================================================
          HERO: Full-bleed canonical photography with left overlay
          ========================================================================= */}
      <PageHeader
        breadcrumbs={[{ label: 'Profile', to: '/profile/about-us' }, { label: 'Our Leadership Team' }]}
        eyebrow={leadershipContent.hero.eyebrow}
        title={leadershipContent.hero.heading}
        subtitle={leadershipContent.hero.introLine}
        imageSrc="/images/home-hero-3.webp"
        imageAlt="TECHORA Senior Leadership Advisory Board"
        objectPosition="center 30%"
      />

      {/* =========================================================================
          LEADERSHIP SHOWCASE
          1. Large featured composition (portrait 4:5 left, text right)
          2. Remaining leaders using refined alternating row layout / 2-column portrait grid
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--white)', padding: '80px 0 96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          {/* Featured Leader Card */}
          {featuredLeader && (
            <PortraitCard leader={featuredLeader} isFeatured={true} />
          )}

          {/* Practice Principals Header */}
          <div style={{ marginBottom: '36px' }}>
            <div className="eyebrow-label" style={{ marginBottom: '8px' }}>
              Practice Leadership
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  margin: 0,
                }}
              >
                Practice Directors &amp; Senior Consultants
              </h2>
              <div className="thin-sky-rule" />
            </div>
          </div>

          {/* Remaining Leaders in 2-Column Portrait Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '32px',
            }}
            className="other-leaders-grid"
          >
            {otherLeaders.map((leader) => (
              <PortraitCard key={leader.id} leader={leader} isFeatured={false} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CTA BAND: "Work With Our Team" linking to /partner-with-us
          ========================================================================= */}
      <CTASection
        eyebrow={leadershipContent.cta.eyebrow}
        title={leadershipContent.cta.heading}
        description={leadershipContent.cta.subheading}
        primaryActionText={leadershipContent.cta.buttonText}
        onPrimaryAction={onOpenConsultModal}
        secondaryActionText="Explore Our Legacy"
        secondaryActionTo="/profile/our-legacy"
      />

      <style>{`
        @media (max-width: 600px) {
          .other-leaders-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
