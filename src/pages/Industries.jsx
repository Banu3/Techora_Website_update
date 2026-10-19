import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ServiceHero from '../components/services/ServiceHero';
import SectionLabel from '../components/profile/SectionLabel';
import IndustryIndex from '../components/industries/IndustryIndex';
import IndustrySection from '../components/industries/IndustrySection';
import IndustryEnquiryForm from '../components/industries/IndustryEnquiryForm';
import Button from '../components/Button';
import { industriesContent } from '../content/industriesContent';
import { ArrowRight, Info } from 'lucide-react';

export default function Industries({ onOpenConsultModal }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Dev-only preview mode: active only in dev when ?previewIndustries=1 is passed
  const isDevPreview = import.meta.env.DEV && searchParams.get('previewIndustries') === '1';

  const [selectedIndustry, setSelectedIndustry] = useState('');

  const {
    seo,
    hero,
    intro,
    industries = [],
    enquirySection,
  } = industriesContent;

  // Filter industries: only enabled ones, or all if in dev preview mode
  const activeIndustries = isDevPreview
    ? industries
    : industries.filter((ind) => ind.enabled === true);

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
    { label: 'Expertise', to: '/expertise/industries' },
    { label: 'Industries' },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://techora.consulting/' },
      { '@type': 'ListItem', position: 2, name: 'Expertise', item: 'https://techora.consulting/expertise/industries' },
      { '@type': 'ListItem', position: 3, name: 'Industries', item: seo.canonical },
    ],
  };

  const handleEnquireFromSection = (industryName) => {
    setSelectedIndustry(industryName);
    const el = document.getElementById('industry-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-industries" style={{ backgroundColor: 'var(--white)' }}>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Dev Preview Mode Notice */}
      {isDevPreview && (
        <div
          style={{
            backgroundColor: '#FFF9E6',
            borderBottom: '1px solid #FFE082',
            padding: '10px 20px',
            fontSize: '0.8125rem',
            color: '#7A5200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Info size={15} />
          <span>
            <strong>Dev Preview Mode Active (?previewIndustries=1):</strong> Rendering all 6 candidate industry layouts with placeholder text for verification. These are unconfirmed and hidden in production until enabled.
          </span>
        </div>
      )}

      {/* Hero Section */}
      <ServiceHero
        variant="editorial"
        breadcrumbs={breadcrumbs}
        eyebrow={hero.eyebrow}
        title={hero.h1}
        subtitle={hero.supportingText}
        primaryCtaText={hero.primaryCtaText}
        primaryCtaLink={hero.primaryCtaLink}
        imageSrc="/images/industries-office.webp"
        imageAlt={hero.imageAlt}
      />

      {/* 01 Intro — Large type statement with narrow side note */}
      <section
        style={{
          padding: '88px 0',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--line)',
        }}
        aria-label="Sector Engagement Model"
      >
        <div className="container">
          <SectionLabel num={intro.sectionNumber} label={intro.label} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
              marginTop: '16px',
            }}
          >
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
                {intro.statement}
              </h2>
              <p
                style={{
                  fontSize: 'clamp(1.05rem, 1.35vw, 1.15rem)',
                  lineHeight: 1.7,
                  color: 'var(--ink-600)',
                  margin: 0,
                }}
              >
                {intro.body}
              </p>
            </div>

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
                {intro.sideNote.title}
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: 'var(--ink-600)',
                  margin: 0,
                }}
              >
                {intro.sideNote.content}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Layout: If activeIndustries is empty (default state), show graceful notice */}
      {activeIndustries.length === 0 ? (
        <section
          style={{
            padding: '100px 0',
            backgroundColor: 'var(--mist-50)',
            borderBottom: '1px solid var(--line)',
            textAlign: 'center',
          }}
          aria-label="Industry Details Pending"
        >
          <div className="container" style={{ maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--sky-500)',
                marginBottom: '16px',
              }}
            >
              Sector Practice Calibration
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.3rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              Industry details are being finalized.
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--ink-600)',
                marginBottom: '32px',
              }}
            >
              TECHORA actively engages across technology, manufacturing, and commercial corporate sectors. Specific sector advisory parameters are currently under stakeholder confirmation. Contact our consulting team directly to evaluate recruitment or payroll mandates for your sector.
            </p>

            <a href="#industry-enquiry" style={{ textDecoration: 'none' }}>
              <Button variant="primary">
                Discuss Your Industry Needs <ArrowRight size={16} />
              </Button>
            </a>
          </div>
        </section>
      ) : (
        /* Enabled Industries: Sticky Index (Desktop) + Alternating Industry Sections */
        <div style={{ position: 'relative' }}>
          <div
            className="container"
            style={{
              paddingTop: '64px',
              paddingBottom: '64px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 260px) 1fr',
                gap: '48px',
                alignItems: 'start',
              }}
              className="industry-main-grid"
            >
              {/* Sticky Industry Index (Desktop) */}
              <div className="desktop-industry-index" style={{ display: 'none' }}>
                <IndustryIndex industries={activeIndustries} />
              </div>

              {/* Industry Sections (Alternating Compositions) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
                {activeIndustries.map((ind, idx) => (
                  <IndustrySection
                    key={ind.slug}
                    industry={ind}
                    index={idx}
                    onEnquire={handleEnquireFromSection}
                    isPreview={isDevPreview}
                  />
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @media (min-width: 1024px) {
              .desktop-industry-index {
                display: block !important;
              }
              .industry-main-grid {
                grid-template-columns: 240px 1fr !important;
              }
            }
          `}</style>
        </div>
      )}

      {/* 04 Enquiry Section — Navy band with short form */}
      <IndustryEnquiryForm
        selectedIndustry={selectedIndustry}
        industriesList={industries}
      />
    </div>
  );
}
