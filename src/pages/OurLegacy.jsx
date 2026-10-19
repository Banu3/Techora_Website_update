import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Quote,
  ShieldCheck,
  Lock,
  FileCheck2,
  Users,
  Layers,
  Sparkles,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Compass,
  Building2,
  Calendar,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { legacyContent } from '../data/legacy';

export default function OurLegacy({ onOpenConsultModal }) {
  useEffect(() => {
    document.title = legacyContent.seo.title;

    // Inject BreadcrumbList JSON-LD
    const jsonLdId = 'legacy-breadcrumbs-schema';
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
          { '@type': 'ListItem', position: 2, name: 'Profile', item: 'https://techora.consulting/profile/about-us' },
          { '@type': 'ListItem', position: 3, name: 'Our Legacy', item: 'https://techora.consulting/profile/our-legacy' },
        ],
      });
      document.head.appendChild(script);
    }
  }, []);

  const principleIcons = [ShieldCheck, Lock, FileCheck2, Users];
  const architectureIcons = [Lock, ShieldCheck, Users, BarChart3];

  return (
    <div style={{ backgroundColor: 'var(--white)' }}>
      {/* =========================================================================
          1. HERO
          ========================================================================= */}
      <PageHeader
        breadcrumbs={legacyContent.hero.breadcrumbs}
        eyebrow={legacyContent.hero.eyebrow}
        title={legacyContent.hero.heading}
        subtitle={legacyContent.hero.subtext}
        imageSrc={legacyContent.hero.image}
        imageAlt={legacyContent.hero.imageAlt}
        objectPosition="center 35%"
      >
        <Link
          to={legacyContent.hero.buttonLink}
          className="btn-navy"
          style={{
            backgroundColor: 'var(--sky-500)',
            borderColor: 'var(--sky-500)',
            color: 'var(--navy-950)',
            fontWeight: 700,
          }}
        >
          {legacyContent.hero.buttonText} <ArrowRight size={16} />
        </Link>
      </PageHeader>

      {/* =========================================================================
          2. OUR STORY (Founded 2026)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--white)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sky-500)' }}>
              {legacyContent.story.eyebrow}
            </span>
          </div>

          <div style={{ maxWidth: '820px', marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-section-title)',
                lineHeight: 'var(--lh-section-title)',
                color: 'var(--navy-900)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginBottom: '16px',
              }}
            >
              {legacyContent.story.heading}
            </h2>
            <div className="thin-sky-rule" />
          </div>

          {/* Editorial Two-Column Text */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              marginBottom: '48px',
            }}
          >
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.76, color: 'var(--ink)', margin: 0 }}>
              {legacyContent.story.paragraph1}
            </p>
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.76, color: 'var(--ink)', margin: 0 }}>
              {legacyContent.story.paragraph2}
            </p>
          </div>

          {/* Highlight line card */}
          <div
            style={{
              backgroundColor: 'var(--mist-50)',
              borderLeft: '4px solid var(--sky-500)',
              padding: '24px 32px',
              borderRadius: '0 4px 4px 0',
              border: '1px solid var(--line)',
              borderLeftWidth: '4px',
              maxWidth: '820px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--navy-900)',
                margin: 0,
              }}
            >
              {legacyContent.story.highlight}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. OUR FOUNDING PRINCIPLES (4 cards)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--mist-50)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sky-500)' }}>
                {legacyContent.principles.eyebrow}
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-section-title)',
                lineHeight: 'var(--lh-section-title)',
                color: 'var(--navy-900)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              {legacyContent.principles.heading}
            </h2>
            <div className="thin-sky-rule" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '28px',
            }}
          >
            {legacyContent.principles.items.map((item, idx) => {
              const IconComponent = principleIcons[idx % principleIcons.length];
              return (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--line)',
                    borderRadius: '4px',
                    padding: '36px 28px',
                    boxShadow: '0 4px 18px rgba(7, 20, 38, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  className="legacy-principle-card"
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(14, 165, 233, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <IconComponent size={22} color="var(--sky-600)" />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--navy-900)',
                      marginBottom: '12px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.96rem',
                      lineHeight: 1.68,
                      color: 'var(--ink-600)',
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. OPERATING ARCHITECTURE (Replaces Duplicate Vision & Mission)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--white)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sky-500)' }}>
                {legacyContent.architecture.eyebrow}
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-section-title)',
                lineHeight: 'var(--lh-section-title)',
                color: 'var(--navy-900)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              {legacyContent.architecture.heading}
            </h2>
            <div className="thin-sky-rule" style={{ marginBottom: '20px' }} />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.08rem',
                lineHeight: 1.68,
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              {legacyContent.architecture.subtext}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {legacyContent.architecture.items.map((arch, idx) => {
              const IconComp = architectureIcons[idx % architectureIcons.length];
              return (
                <div
                  key={arch.title}
                  style={{
                    backgroundColor: 'var(--mist-50)',
                    border: '1px solid var(--line)',
                    borderTop: '3.5px solid var(--navy-900)',
                    borderRadius: '4px',
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 18px rgba(7, 20, 38, 0.04)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-top-color 0.25s ease',
                  }}
                  className="legacy-arch-card"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '4px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--line)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(7, 20, 38, 0.05)',
                        }}
                      >
                        <IconComp size={22} color="var(--sky-600)" />
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          color: 'rgba(14, 165, 233, 0.45)',
                          letterSpacing: '-0.03em',
                        }}
                      >
                        {arch.number}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--navy-900)',
                        marginBottom: '6px',
                        lineHeight: 1.3,
                      }}
                    >
                      {arch.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: 'var(--sky-600)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '16px',
                      }}
                    >
                      {arch.subtitle}
                    </p>

                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.96rem',
                        lineHeight: 1.7,
                        color: 'var(--ink-600)',
                        marginBottom: '24px',
                      }}
                    >
                      {arch.description}
                    </p>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--line)',
                      paddingTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <CheckCircle2 size={15} color="var(--sky-500)" />
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--navy-900)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {arch.metrics}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. STRATEGIC HORIZON & ROADMAP (Replaces Basic Upcoming Timeline)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--mist-50)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sky-500)' }}>
                {legacyContent.roadmap.eyebrow}
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-section-title)',
                lineHeight: 'var(--lh-section-title)',
                color: 'var(--navy-900)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              {legacyContent.roadmap.heading}
            </h2>
            <div className="thin-sky-rule" style={{ marginBottom: '20px' }} />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.08rem',
                lineHeight: 1.68,
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              {legacyContent.roadmap.subtext}
            </p>
          </div>

          {/* Executive Roadmap Phase Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {legacyContent.roadmap.phases.map((phase) => {
              const isCurrent = phase.isCurrent;
              return (
                <div
                  key={phase.phase}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isCurrent ? '2px solid var(--sky-500)' : '1px solid var(--line)',
                    borderRadius: '6px',
                    padding: '36px 36px',
                    boxShadow: isCurrent ? '0 8px 30px rgba(14, 165, 233, 0.12)' : '0 4px 18px rgba(7, 20, 38, 0.04)',
                    position: 'relative',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  className="legacy-roadmap-card"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginBottom: '20px',
                      borderBottom: '1px solid var(--line)',
                      paddingBottom: '18px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          backgroundColor: isCurrent ? 'var(--navy-900)' : 'var(--mist-50)',
                          color: isCurrent ? '#FFFFFF' : 'var(--navy-900)',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.8125rem',
                          fontWeight: 800,
                          padding: '6px 14px',
                          borderRadius: '4px',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          border: isCurrent ? 'none' : '1px solid var(--line)',
                        }}
                      >
                        {phase.phase}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: 'var(--sky-600)',
                        }}
                      >
                        {phase.timeframe}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        backgroundColor: isCurrent ? 'rgba(14, 165, 233, 0.14)' : 'rgba(100, 116, 139, 0.1)',
                        color: isCurrent ? 'var(--sky-600)' : 'var(--ink-600)',
                        border: isCurrent ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid var(--line)',
                      }}
                    >
                      {isCurrent && (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--sky-500)',
                            display: 'inline-block',
                          }}
                        />
                      )}
                      {phase.status}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: 'var(--navy-900)',
                      marginBottom: '12px',
                    }}
                  >
                    {phase.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.025rem',
                      lineHeight: 1.74,
                      color: 'var(--ink)',
                      marginBottom: '24px',
                    }}
                  >
                    {phase.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div
                    style={{
                      backgroundColor: 'var(--mist-50)',
                      borderRadius: '4px',
                      padding: '20px 24px',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--navy-900)',
                        marginBottom: '14px',
                      }}
                    >
                      Key Strategic Deliverables:
                    </p>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {phase.deliverables.map((item, dIdx) => (
                        <div key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <CheckCircle2
                            size={16}
                            color={isCurrent ? 'var(--sky-500)' : 'var(--sky-600)'}
                            style={{ flexShrink: 0, marginTop: '3px' }}
                          />
                          <span
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.925rem',
                              color: 'var(--ink-600)',
                              lineHeight: 1.55,
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. OUR COMMITMENT (short quote-style block)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--white)', padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: 'var(--mist-50)',
              borderLeft: '4px solid var(--sky-500)',
              padding: '36px 40px',
              borderRadius: '2px',
              border: '1px solid var(--line)',
              borderLeftWidth: '4px',
              boxShadow: '0 8px 24px rgba(7, 20, 38, 0.04)',
            }}
          >
            <Quote size={28} color="var(--sky-500)" style={{ marginBottom: '14px', opacity: 0.8 }} />
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)',
                lineHeight: 1.6,
                color: 'var(--navy-900)',
                fontStyle: 'italic',
                fontWeight: 600,
                margin: 0,
              }}
            >
              &ldquo;{legacyContent.commitment.quote}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. LEADERSHIP NOTE (Authentic Executive Message)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--mist-50)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              padding: '48px 44px',
              boxShadow: '0 8px 28px rgba(7, 20, 38, 0.05)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="eyebrow-label">{legacyContent.leadershipNote.role}</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.7rem, 2.8vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                letterSpacing: '-0.02em',
                marginBottom: '24px',
              }}
            >
              {legacyContent.leadershipNote.heading}
            </h2>

            <div className="thin-sky-rule" style={{ marginBottom: '24px' }} />

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.08rem',
                lineHeight: 1.8,
                color: 'var(--ink)',
                marginBottom: '24px',
              }}
            >
              {legacyContent.leadershipNote.text}
            </p>

            <div
              style={{
                borderTop: '1px solid var(--line)',
                paddingTop: '20px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  color: 'var(--ink-400)',
                  marginBottom: '4px',
                  fontStyle: 'italic',
                }}
              >
                {legacyContent.leadershipNote.signOff}
              </p>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                }}
              >
                {legacyContent.leadershipNote.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CTA BAND
          ========================================================================= */}
      <section
        style={{
          backgroundColor: 'var(--navy-950)',
          color: '#FFFFFF',
          padding: '88px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.4vw, 2.85rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              color: '#FFFFFF',
            }}
          >
            {legacyContent.cta.heading}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '36px',
            }}
          >
            {legacyContent.cta.subtext}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to={legacyContent.cta.primaryLink}
              className="btn-navy"
              style={{
                backgroundColor: 'var(--sky-500)',
                borderColor: 'var(--sky-500)',
                color: 'var(--navy-950)',
                fontWeight: 700,
                padding: '14px 32px',
                borderRadius: '3px',
              }}
            >
              {legacyContent.cta.primaryButton} <ArrowRight size={16} />
            </Link>

            <Link
              to={legacyContent.cta.secondaryLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '3px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              className="btn-explore-services"
            >
              {legacyContent.cta.secondaryButton}
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .legacy-principle-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(7, 20, 38, 0.08) !important;
        }

        .legacy-arch-card:hover {
          transform: translateY(-4px);
          border-top-color: var(--sky-500) !important;
          box-shadow: 0 12px 32px rgba(7, 20, 38, 0.08) !important;
        }

        .legacy-roadmap-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(7, 20, 38, 0.08) !important;
        }

        .btn-explore-services:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}
