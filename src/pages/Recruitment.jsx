import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceHero from '../components/services/ServiceHero';
import SectionLabel from '../components/profile/SectionLabel';
import ProcessStrip from '../components/services/ProcessStrip';
import FAQAccordion from '../components/services/FAQAccordion';
import CTASection from '../components/CTASection';
import { recruitmentContent } from '../content/recruitmentContent';
import { Check } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function Recruitment({ onOpenConsultModal }) {
  const { t } = useSiteContent();
  const {
    seo,
    hero,
    overview,
    roleRequirements,
    talentSourcing,
    screeningAndEvaluation,
    interviewCoordination,
    processSupport,
    faqs,
    contactCta,
  } = recruitmentContent;

  useEffect(() => {
    document.title = seo.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seo.description;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonical;
  }, [seo]);

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services/recruitment' },
    { label: 'Recruitment' },
  ];

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Recruitment & Talent Acquisition',
    provider: {
      '@type': 'Organization',
      name: 'TECHORA Consultant',
      url: 'https://techora.consulting',
    },
    description: seo.description,
    url: seo.canonical,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://techora.consulting/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://techora.consulting/services/recruitment' },
      { '@type': 'ListItem', position: 3, name: 'Recruitment', item: seo.canonical },
    ],
  };

  return (
    <div className="page-recruitment" style={{ backgroundColor: 'var(--white)' }}>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section — Editorial Variant (Text Left, Landscape Photo Right bleeding to edge) */}
      <ServiceHero
        variant="editorial"
        breadcrumbs={breadcrumbs}
        eyebrow={t('recruitment.hero.eyebrow', hero.eyebrow)}
        title={t('recruitment.hero.title', hero.h1)}
        subtitle={t('recruitment.hero.subtitle', hero.supportingText)}
        primaryCtaText={hero.primaryCtaText}
        primaryCtaLink={hero.primaryCtaLink}
        onPrimaryCtaClick={onOpenConsultModal}
        secondaryCtaText={hero.secondaryCtaText}
        secondaryCtaLink={hero.secondaryCtaLink}
        imageSrc="/images/recruitment-interview.webp"
        imageAlt={hero.imageAlt}
      />

      {/* 01 Recruitment Overview — Large type intro paragraph with narrow side note on white */}
      <section
        style={{
          padding: '96px 0',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--line)',
        }}
        aria-label="Recruitment Overview"
      >
        <div className="container">
          <SectionLabel num={overview.sectionNumber} label={overview.label} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
              marginTop: '16px',
            }}
          >
            {/* Left: Wide Intro Paragraph */}
            <div style={{ maxWidth: '640px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  marginBottom: '20px',
                }}
              >
                {overview.heading}
              </h2>
              <p
                style={{
                  fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
                  lineHeight: 1.7,
                  color: 'var(--ink-600)',
                  margin: 0,
                }}
              >
                {overview.mainParagraph}
              </p>
            </div>

            {/* Right: Narrow Side Note */}
            <div
              style={{
                backgroundColor: 'var(--mist-50)',
                borderLeft: '3px solid var(--sky-500)',
                padding: '28px 24px',
                borderTop: '1px solid var(--line)',
                borderRight: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--navy-900)',
                  marginBottom: '8px',
                }}
              >
                {overview.sideNote.title}
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: 'var(--ink-600)',
                  margin: 0,
                }}
              >
                {overview.sideNote.content}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 Understanding Role Requirements — Image left (tall, offset thin frame), text right */}
      <section
        style={{
          padding: '96px 0',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--line)',
        }}
        aria-label="Role Requirements"
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            {/* Image Left with Offset Thin Frame */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '-12px',
                  width: '100%',
                  height: '100%',
                  border: '1px solid var(--sky-500)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  backgroundColor: 'var(--mist-50)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={roleRequirements.image}
                  alt={roleRequirements.imageAlt}
                  width="800"
                  height="1000"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '4/5',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Text Right */}
            <div>
              <SectionLabel num={roleRequirements.sectionNumber} label={roleRequirements.label} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.75rem, 2.8vw, 2.35rem)',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  marginTop: '10px',
                  marginBottom: '18px',
                }}
              >
                {roleRequirements.heading}
              </h2>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: 'var(--ink-600)',
                  marginBottom: '26px',
                }}
              >
                {roleRequirements.description}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {roleRequirements.bulletPoints.map((pt, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: 'var(--ink-600)',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--sky-100)',
                        color: 'var(--sky-500)',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Talent Sourcing — Text left, wide landscape image right */}
      <section
        style={{
          padding: '96px 0',
          backgroundColor: 'var(--mist-50)',
          borderBottom: '1px solid var(--line)',
        }}
        aria-label="Talent Sourcing"
      >
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
            <div>
              <SectionLabel num={talentSourcing.sectionNumber} label={talentSourcing.label} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.75rem, 2.8vw, 2.35rem)',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  marginTop: '10px',
                  marginBottom: '18px',
                }}
              >
                {talentSourcing.heading}
              </h2>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: 'var(--ink-600)',
                  marginBottom: '26px',
                }}
              >
                {talentSourcing.description}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {talentSourcing.bulletPoints.map((pt, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: 'var(--ink-600)',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--sky-100)',
                        color: 'var(--sky-500)',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Wide Landscape Image Right */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                padding: '12px',
                boxShadow: '0 4px 18px rgba(11,31,58,0.04)',
              }}
            >
              <img
                src={talentSourcing.image}
                alt={talentSourcing.imageAlt}
                width="1200"
                height="800"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '16/10',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 04 Resume Screening & 05 Candidate Evaluation — Two-column split on mist with thin divider */}
      <section
        style={{
          padding: '96px 0',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--line)',
        }}
        aria-label="Candidate Screening & Evaluation"
      >
        <div className="container">
          <SectionLabel num={screeningAndEvaluation.sectionNumber} label={screeningAndEvaluation.label} />
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              marginTop: '24px',
              backgroundColor: 'var(--mist-50)',
              border: '1px solid var(--line)',
            }}
          >
            {/* Left: Resume Screening */}
            <div
              style={{
                padding: 'clamp(32px, 5vw, 48px)',
                borderRight: '1px solid var(--line)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--sky-500)',
                  letterSpacing: '0.1em',
                  marginBottom: '10px',
                }}
              >
                {screeningAndEvaluation.screening.number} &mdash; {screeningAndEvaluation.screening.title}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.35rem, 2vw, 1.65rem)',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                }}
              >
                {screeningAndEvaluation.screening.statement}
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  color: 'var(--ink-600)',
                  margin: 0,
                }}
              >
                {screeningAndEvaluation.screening.details}
              </p>
            </div>

            {/* Right: Candidate Evaluation */}
            <div
              style={{
                padding: 'clamp(32px, 5vw, 48px)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--sky-500)',
                  letterSpacing: '0.1em',
                  marginBottom: '10px',
                }}
              >
                {screeningAndEvaluation.evaluation.number} &mdash; {screeningAndEvaluation.evaluation.title}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.35rem, 2vw, 1.65rem)',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                }}
              >
                {screeningAndEvaluation.evaluation.statement}
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  color: 'var(--ink-600)',
                  margin: 0,
                }}
              >
                {screeningAndEvaluation.evaluation.details}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 06 Interview Coordination — Full-width photographic band with navy overlay on left */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--navy-900)',
          color: 'var(--white)',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid var(--line)',
        }}
        aria-label="Interview Coordination"
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <img
            src={interviewCoordination.image}
            alt={interviewCoordination.imageAlt}
            width="1920"
            height="800"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(11,31,58,0.96) 0%, rgba(11,31,58,0.85) 50%, rgba(11,31,58,0.4) 100%)',
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '80px 0' }}>
          <div style={{ maxWidth: '680px' }}>
            <SectionLabel num={interviewCoordination.sectionNumber} label={interviewCoordination.label} />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.9rem, 3.2vw, 2.65rem)',
                fontWeight: 800,
                color: 'var(--white)',
                lineHeight: 1.25,
                letterSpacing: '-0.025em',
                marginTop: '10px',
                marginBottom: '18px',
              }}
            >
              {interviewCoordination.heading}
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: '26px',
              }}
            >
              {interviewCoordination.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {interviewCoordination.highlights.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--sky-500)',
                    }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 07 Recruitment Process Support — Horizontal numbered process strip */}
      <ProcessStrip
        sectionNumber={processSupport.sectionNumber}
        label={processSupport.label}
        statusTag={processSupport.statusTag}
        heading={processSupport.heading}
        steps={processSupport.steps}
      />

      {/* 08 FAQs — Accessible accordion */}
      <FAQAccordion
        sectionNumber="08"
        label="Recruitment Inquiries"
        heading="Common Questions on Talent Sourcing &amp; Placement Parameters"
        faqs={faqs}
      />

      {/* 09 Contact CTA — Navy band with "Discuss Your Hiring Needs" */}
      <div id="contact-section">
        <CTASection
          eyebrow={contactCta.eyebrow}
          title={contactCta.heading}
          subtitle={contactCta.subheading}
          primaryBtnText={contactCta.buttonText}
          onPrimaryAction={onOpenConsultModal}
        />
      </div>
    </div>
  );
}
