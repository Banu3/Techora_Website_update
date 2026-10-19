import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import NotFound from './NotFound';
import IndustryEnquiryForm from '../components/industries/IndustryEnquiryForm';
import { industriesContent } from '../content/industriesContent';
import { ArrowRight, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

export default function IndustryDetail({ onOpenConsultModal }) {
  const { slug } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDevPreview = import.meta.env.DEV && searchParams.get('previewIndustries') === '1';

  const { industries = [] } = industriesContent;

  // Find matching industry
  const industry = industries.find((ind) => ind.slug === slug);

  // If not found or if disabled (and not in dev preview), render NotFound
  if (!industry || (!industry.enabled && !isDevPreview)) {
    return <NotFound />;
  }

  const {
    name,
    tagline,
    overview,
    workforceChallenges = [],
    services = [],
    image,
    imageAlt,
  } = industry;

  const pageTitle = `${name} Workforce Solutions | TECHORA Consultant`;
  const pageDescription = `Specialized recruitment and administrative payroll solutions for the ${name} sector. Addressing industry-specific workforce realities.`;
  const canonicalUrl = `https://techora.consulting/expertise/industries/${slug}`;

  useEffect(() => {
    document.title = pageTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = pageDescription;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [pageTitle, pageDescription, canonicalUrl]);

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Expertise', to: '/expertise/industries' },
    { label: 'Industries', to: `/expertise/industries${isDevPreview ? '?previewIndustries=1' : ''}` },
    { label: name },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://techora.consulting/' },
      { '@type': 'ListItem', position: 2, name: 'Expertise', item: 'https://techora.consulting/expertise/industries' },
      { '@type': 'ListItem', position: 3, name: 'Industries', item: 'https://techora.consulting/expertise/industries' },
      { '@type': 'ListItem', position: 4, name, item: canonicalUrl },
    ],
  };

  // Other industries for related-industries link row
  const otherIndustries = industries.filter((ind) => ind.slug !== slug && (ind.enabled || isDevPreview));

  return (
    <div className="page-industry-detail" style={{ backgroundColor: 'var(--white)' }}>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Header: Full-bleed with directional overlay */}
      <header
        className="hero-full-bleed"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'clamp(440px, 58vh, 600px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--navy-950)',
        }}
        aria-label="Industry Detail Header"
      >
        <img
          src={image || '/images/industries-office.webp'}
          alt={imageAlt || name}
          width="1920"
          height="1080"
          loading="eager"
          fetchPriority="high"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 35%',
            zIndex: 0,
            filter: 'contrast(1.02)',
          }}
        />

        <div
          className="hero-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        />

        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 2,
            paddingTop: '64px',
            paddingBottom: '64px',
            width: '100%',
          }}
        >
          <div
            className="hero-content"
            style={{
              maxWidth: '720px',
              padding: 0,
            }}
          >
            <div style={{ marginBottom: '18px', opacity: 0.9 }}>
              <Breadcrumbs items={breadcrumbs} isLight />
            </div>

            <div
              className="eyebrow-label"
              style={{
                marginBottom: '14px',
                color: 'var(--sky-500)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Sector Specialization &mdash; {tagline}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-page-title)',
                fontWeight: 700,
                color: 'var(--white)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                marginBottom: '18px',
                textWrap: 'balance',
              }}
            >
              {name}
            </h1>

            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.68,
                color: 'rgba(255, 255, 255, 0.90)',
                marginBottom: '28px',
                maxWidth: '65ch',
                textWrap: 'pretty',
              }}
            >
              {overview}
            </p>

            <a
              href="#industry-enquiry"
              className="btn-navy"
              style={{
                backgroundColor: 'var(--sky-500)',
                borderColor: 'var(--sky-500)',
                color: 'var(--navy-950)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Enquire About {name} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content: Challenges + How TECHORA Supports */}
      <section style={{ padding: '88px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          {/* Workforce Challenges */}
          <div style={{ marginBottom: '64px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--sky-500)',
                marginBottom: '8px',
              }}
            >
              Operational Dynamics
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '24px',
              }}
            >
              Key Workforce Challenges in {name}
            </h2>

            <div style={{ borderTop: '1px solid var(--line)' }}>
              {workforceChallenges.map((challenge, cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    padding: '18px 0',
                    borderBottom: '1px solid var(--line)',
                    display: 'grid',
                    gridTemplateColumns: 'clamp(40px, 6vw, 60px) 1fr',
                    gap: '16px',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--sky-500)' }}>
                    0{cIdx + 1}
                  </span>
                  <span style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--ink-600)' }}>
                    {challenge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Services */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--sky-500)',
                marginBottom: '8px',
              }}
            >
              Practice Capabilities
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '28px',
              }}
            >
              How TECHORA Supports {name}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {services.map((svc, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    backgroundColor: 'var(--mist-50)',
                    border: '1px solid var(--line)',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Briefcase size={16} color="var(--sky-500)" />
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--ink-600)',
                        }}
                      >
                        {svc.type === 'recruitment' ? 'Recruitment Practice' : 'Payroll Practice'}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--navy-900)',
                        marginBottom: '10px',
                      }}
                    >
                      {svc.title}
                    </h3>

                    <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--ink-600)', margin: 0 }}>
                      {svc.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <Link
                      to={svc.link}
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--sky-500)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Explore Service Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Industries Link Row */}
      {otherIndustries.length > 0 && (
        <section style={{ padding: '64px 0', backgroundColor: 'var(--mist-50)', borderBottom: '1px solid var(--line)' }}>
          <div className="container" style={{ maxWidth: '1000px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-600)',
                marginBottom: '16px',
              }}
            >
              Other Industry Sectors
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {otherIndustries.map((other) => (
                <Link
                  key={other.slug}
                  to={`/expertise/industries/${other.slug}${isDevPreview ? '?previewIndustries=1' : ''}`}
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    padding: '8px 16px',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--navy-900)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--sky-500)';
                    e.currentTarget.style.color = 'var(--sky-500)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--line)';
                    e.currentTarget.style.color = 'var(--navy-900)';
                  }}
                >
                  <span>{other.name}</span>
                  <ChevronRight size={13} color="var(--sky-500)" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sector Enquiry Section */}
      <IndustryEnquiryForm
        selectedIndustry={name}
        industriesList={industries}
      />
    </div>
  );
}
