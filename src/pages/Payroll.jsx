import React, { useEffect } from 'react';
import ServiceHero from '../components/services/ServiceHero';
import StickySectionNav from '../components/services/StickySectionNav';
import SectionLabel from '../components/profile/SectionLabel';
import RuledList from '../components/services/RuledList';
import ScopePanel from '../components/services/ScopePanel';
import FAQAccordion from '../components/services/FAQAccordion';
import PayrollContactCTA from '../components/services/PayrollContactCTA';
import { payrollContent } from '../content/payrollContent';
import { useSiteContent } from '../context/SiteContentContext';

export default function Payroll({ onOpenConsultModal }) {
  const { t } = useSiteContent();
  const {
    seo,
    hero,
    inPageNav,
    overview,
    processingSupport,
    employeeSalaryRecords,
    attendanceCoordination,
    payslipsAndReporting,
    statutorySupport,
    scopeDisclaimer,
    faqs,
    contactCta,
  } = payrollContent;

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
    { label: 'Payroll' },
  ];

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Administrative Payroll Support',
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
      { '@type': 'ListItem', position: 3, name: 'Payroll', item: seo.canonical },
    ],
  };

  return (
    <div className="page-payroll" style={{ backgroundColor: 'var(--white)' }}>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section — Structured Overlay Variant */}
      <ServiceHero
        variant="structured-overlay"
        breadcrumbs={breadcrumbs}
        eyebrow={t('payroll.hero.eyebrow', hero.eyebrow)}
        title={t('payroll.hero.title', hero.h1)}
        subtitle={t('payroll.hero.subtitle', hero.supportingText)}
        primaryCtaText={hero.primaryCtaText}
        primaryCtaLink={hero.primaryCtaLink}
        imageSrc="/images/payroll-hr.webp"
        imageAlt={hero.imageAlt}
      />

      {/* Slim Sticky In-Page Navigation */}
      <StickySectionNav
        items={inPageNav}
        ctaText="Discuss Requirements"
        ctaTarget="#contact-section"
      />

      {/* Structured Two-Column Body Layout on Desktop: Sticky Left Index / Content Column Right */}
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '96px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Left Sticky Index Column (Desktop) */}
          <aside
            style={{
              position: 'sticky',
              top: 'calc(var(--nav-height) + 64px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              borderLeft: '2px solid var(--line)',
              paddingLeft: '24px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--sky-500)',
                  marginBottom: '8px',
                }}
              >
                Framework Index
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Administrative Payroll Operations
              </h2>
            </div>

            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--ink-600)', margin: 0 }}>
              Methodical compensation administration structured into auditable calculation rows and systematic review milestones.
            </p>

            {/* Accent Photo 1: Structured Documentation */}
            <div
              style={{
                marginTop: '12px',
                border: '1px solid var(--line)',
                padding: '8px',
                backgroundColor: 'var(--mist-50)',
              }}
            >
              <img
                src={employeeSalaryRecords.image}
                alt={employeeSalaryRecords.imageAlt}
                width="800"
                height="600"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--ink-600)',
                  paddingTop: '6px',
                  fontFamily: 'var(--font-heading)',
                  textAlign: 'center',
                }}
              >
                Auditable Monthly Salary Registers
              </div>
            </div>
          </aside>

          {/* Right Content Column: Numbered Ruled Rows separated by thin dividers */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '72px' }}>
            
            {/* 01 Payroll Overview */}
            <section id="overview" aria-label="Payroll Overview">
              <SectionLabel num={overview.sectionNumber} label={overview.label} />
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.5rem, 2.3vw, 2rem)',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  marginTop: '10px',
                  marginBottom: '16px',
                }}
              >
                {overview.heading}
              </h3>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'var(--ink-600)',
                  marginBottom: '28px',
                }}
              >
                {overview.description}
              </p>

              <RuledList items={overview.keyAttributes} />
            </section>

            {/* 02 Payroll Processing Support */}
            <section id="processing" aria-label="Payroll Processing Support">
              <SectionLabel num={processingSupport.sectionNumber} label={processingSupport.label} />
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.5rem, 2.3vw, 2rem)',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  marginTop: '10px',
                  marginBottom: '16px',
                }}
              >
                {processingSupport.heading}
              </h3>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'var(--ink-600)',
                  marginBottom: '28px',
                }}
              >
                {processingSupport.description}
              </p>

              <RuledList items={processingSupport.workflowPoints} />
            </section>

            {/* 03 Employee Salary Records */}
            <section id="records" aria-label="Employee Salary Records">
              <SectionLabel num={employeeSalaryRecords.sectionNumber} label={employeeSalaryRecords.label} />
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.5rem, 2.3vw, 2rem)',
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  marginTop: '10px',
                  marginBottom: '16px',
                }}
              >
                {employeeSalaryRecords.heading}
              </h3>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'var(--ink-600)',
                  marginBottom: '28px',
                }}
              >
                {employeeSalaryRecords.description}
              </p>

              <RuledList items={employeeSalaryRecords.recordItems} />
            </section>

            {/* 04 Attendance and Leave Coordination (Render only if show === true) */}
            {attendanceCoordination.show && (
              <section id="attendance" aria-label="Attendance and Leave Coordination">
                <SectionLabel num={attendanceCoordination.sectionNumber} label={attendanceCoordination.label} />
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 2.3vw, 2rem)',
                    fontWeight: 800,
                    color: 'var(--navy-900)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    marginTop: '10px',
                    marginBottom: '16px',
                  }}
                >
                  {attendanceCoordination.heading}
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-600)' }}>
                  {attendanceCoordination.description}
                </p>
              </section>
            )}

            {/* 05 Payslips and Reporting (Render only if show === true) */}
            {payslipsAndReporting.show && (
              <section id="reporting" aria-label="Payslips and Reporting">
                <SectionLabel num={payslipsAndReporting.sectionNumber} label={payslipsAndReporting.label} />
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 2.3vw, 2rem)',
                    fontWeight: 800,
                    color: 'var(--navy-900)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    marginTop: '10px',
                    marginBottom: '16px',
                  }}
                >
                  {payslipsAndReporting.heading}
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-600)' }}>
                  {payslipsAndReporting.description}
                </p>
              </section>
            )}

            {/* 06 Statutory Payroll Support (Render ONLY if verified; otherwise hidden by flag) */}
            {statutorySupport.show && (
              <section id="statutory" aria-label="Statutory Payroll Support">
                <SectionLabel num={statutorySupport.sectionNumber} label={statutorySupport.label} />
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 2.3vw, 2rem)',
                    fontWeight: 800,
                    color: 'var(--navy-900)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    marginTop: '10px',
                    marginBottom: '16px',
                  }}
                >
                  {statutorySupport.heading}
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-600)' }}>
                  {statutorySupport.description}
                </p>
              </section>
            )}

          </main>
        </div>
      </div>

      {/* Scope Panel: "What this service is — and is not" */}
      <ScopePanel
        id={scopeDisclaimer.id}
        label={scopeDisclaimer.label}
        heading={scopeDisclaimer.heading}
        subheading={scopeDisclaimer.subheading}
        reviewNotice={scopeDisclaimer.reviewNotice}
        whatItIs={scopeDisclaimer.whatItIs}
        whatItIsNot={scopeDisclaimer.whatItIsNot}
        officialDisclaimerText={scopeDisclaimer.officialDisclaimerText}
      />

      {/* 07 FAQs — Accessible Accordion */}
      <FAQAccordion
        sectionNumber="07"
        label="Payroll Inquiries"
        heading="Common Questions Regarding Administrative Payroll Logistics"
        faqs={faqs}
      />

      {/* 08 Contact CTA — Split screen with short enquiry form on right */}
      <PayrollContactCTA
        id={contactCta.id}
        eyebrow={contactCta.eyebrow}
        heading={contactCta.heading}
        subheading={contactCta.subheading}
        serviceKey={contactCta.serviceKey}
      />
    </div>
  );
}
