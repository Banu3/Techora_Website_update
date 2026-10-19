import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, FileCheck2, Users, Building2, Briefcase, Target, Compass } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageHeader from '../components/PageHeader';
import ValueList from '../components/profile/ValueList';
import PhotoBand from '../components/profile/PhotoBand';
import CTASection from '../components/CTASection';
import { aboutContent } from '../content/aboutContent';
import { useSiteContent } from '../context/SiteContentContext';

export default function AboutUs({ onOpenConsultModal }) {
  const { t } = useSiteContent();
  useEffect(() => {
    document.title = aboutContent.seo.title;
    
    // Inject BreadcrumbList JSON-LD
    const jsonLdId = 'about-breadcrumbs-schema';
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
          { '@type': 'ListItem', position: 3, name: 'About Us', item: 'https://techora.consulting/profile/about-us' },
        ],
      });
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--white)', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* =========================================================================
          HERO BANNER: Centered 'About Us' with 'Home > About Us' breadcrumb
          ========================================================================= */}
      <PageHeader
        breadcrumbs={[{ label: 'About Us' }]}
        title="About Us"
        imageSrc="/images/hero-2-conversation.webp"
        imageAlt="TECHORA corporate consulting team in strategic session"
        objectPosition="left 25%"
        centered={true}
      />

      {/* =========================================================================
          01 WHO WE ARE & WHAT WE DO (Matching Reference Image 1)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--white)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          {/* Subtle Italic Serif Eyebrow */}
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              fontSize: '1.2rem',
              color: '#8b9bb4',
              marginBottom: '10px',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {t('about.hero.eyebrow', 'About TECHORA Consultant')}
          </p>

          {/* Main Headline: "Who we are & What we do" with Accent Underscore */}
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.1rem, 3.5vw, 2.85rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--navy-900)',
              fontWeight: 800,
              marginBottom: '38px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <span>Who we are &amp; What we do</span>
            <span
              style={{
                display: 'inline-block',
                width: '44px',
                height: '4px',
                backgroundColor: 'var(--sky-500)',
                borderRadius: '2px',
              }}
              aria-hidden="true"
            />
          </h2>

          {/* Two-Column Text Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
            }}
            className="about-two-col-grid"
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.76,
                  color: 'var(--ink)',
                  margin: 0,
                  textWrap: 'pretty',
                }}
              >
                TECHORA Consultant is an executive talent acquisition and corporate advisory enterprise established in 2026 by recruitment leaders in industry who come with rich experience in corporate recruitment and statutory governance. We provide cutting-edge talent intelligence and bespoke consulting to varied enterprise clients across regulated industries.
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.76,
                  color: 'var(--ink)',
                  margin: 0,
                  textWrap: 'pretty',
                }}
              >
                We are committed to building organizations with professional talent who can help our clients compete and lead in global markets. We provide dependable solutions for the human resource needs of our clients through long-term client relationships built on experience, insight, and fiduciary teamwork. We have a multifaceted team of consultants who are highly experienced and specialize in the verticals they serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02 OUR MISSION & OUR VISION
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--mist-50)', padding: '88px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                fontSize: '1.15rem',
                color: '#8b9bb4',
                marginBottom: '8px',
                fontWeight: 500,
              }}
            >
              Guiding Purpose &amp; Institutional Direction
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.2vw, 2.7rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: 'var(--navy-900)',
                fontWeight: 800,
                margin: 0,
              }}
            >
              Our Mission &amp; Our Vision
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'stretch',
            }}
            className="mission-vision-grid"
          >
            {/* Our Mission Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '40px 36px',
                border: '1px solid var(--line)',
                borderTop: '4px solid #ea580c',
                boxShadow: '0 8px 24px rgba(7, 20, 38, 0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="mission-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(234, 88, 12, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Target size={24} color="#ea580c" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: 'var(--navy-900)',
                    margin: 0,
                  }}
                >
                  Our Mission
                </h3>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  lineHeight: 1.6,
                  color: 'var(--navy-900)',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                To empower organizations to scale with confidence by placing transformational executive leaders and establishing airtight statutory payroll governance.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.98rem',
                  lineHeight: 1.7,
                  color: 'var(--ink)',
                  margin: 0,
                }}
              >
                We exist to eliminate the talent shortages and regulatory liabilities that impede strategic corporate expansion, delivering fiduciary integrity in every client mandate.
              </p>
            </div>

            {/* Our Vision Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '40px 36px',
                border: '1px solid var(--line)',
                borderTop: '4px solid var(--sky-500)',
                boxShadow: '0 8px 24px rgba(7, 20, 38, 0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="vision-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(14, 165, 233, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Compass size={24} color="var(--sky-600)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: 'var(--navy-900)',
                    margin: 0,
                  }}
                >
                  Our Vision
                </h3>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  lineHeight: 1.6,
                  color: 'var(--navy-900)',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                To be the most trusted corporate workforce consultancy, renowned for discretion, institutional standards, and enduring client partnerships.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.98rem',
                  lineHeight: 1.7,
                  color: 'var(--ink)',
                  margin: 0,
                }}
              >
                Setting the benchmark for how executive talent acquisition and statutory compliance operate as unified, value-driving engines for national and global enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03 WE WORK ALONGSIDE NATIONAL & INTERNATIONAL FIRMS (Matching Reference Image 2)
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
            className="about-alongside-grid"
          >
            {/* Left Content Column */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  fontSize: '1.2rem',
                  color: '#8b9bb4',
                  marginBottom: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                What we do
              </p>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 3.2vw, 2.7rem)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: 'var(--navy-900)',
                  fontWeight: 800,
                  marginBottom: '20px',
                }}
              >
                We work alongside national and international firms
              </h2>

              <div
                style={{
                  width: '44px',
                  height: '4px',
                  backgroundColor: '#ea580c',
                  borderRadius: '2px',
                  marginBottom: '28px',
                }}
                aria-hidden="true"
              />

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.76,
                  color: 'var(--ink)',
                  marginBottom: '36px',
                  textWrap: 'pretty',
                }}
              >
                Our ability to attract the best talent has enabled us to achieve dependable operational heights, defining our stature today. Equipped with industry-validated evaluation techniques and rigorous market intelligence, we deliver disciplined quality assurance in our commitment to our clients. Our core practice leaders strictly honor the discipline of monitoring the evolving governance needs of clients, ensuring enduring enterprise advancement in dynamic operating environments.
              </p>

              <div>
                <button
                  type="button"
                  onClick={onOpenConsultModal}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 34px',
                    borderRadius: '9999px',
                    border: '2px solid #ea580c',
                    backgroundColor: 'transparent',
                    color: '#ea580c',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  className="btn-request-consult-orange"
                >
                  Request Consultation
                </button>
              </div>
            </div>

            {/* Right Image Column: Clickable link to /partner-with-us matching Reference Image 1 */}
            <div>
              <Link
                to="/partner-with-us"
                className="about-alongside-card"
                aria-label="Navigate to TECHORA Institutional Partnerships page"
                style={{
                  display: 'block',
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/11',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--line)',
                  boxShadow: '0 16px 36px -6px rgba(7, 20, 38, 0.14)',
                  backgroundColor: 'var(--navy-900)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <img
                  src="/images/about-work-alongside.webp"
                  alt="TECHORA executive leadership and enterprise client consultation meeting"
                  width="1200"
                  height="825"
                  loading="lazy"
                  className="alongside-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
                  }}
                />
                {/* Central Play / Explore Overlay Icon */}
                <div
                  className="alongside-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(7, 20, 38, 0.15)',
                    transition: 'background-color 0.25s ease',
                  }}
                >
                  <div
                    className="alongside-play-btn"
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.92)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(7, 20, 38, 0.4)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: '#FFFFFF', marginLeft: '3px' }}
                    >
                      <polygon points="6 3 20 12 6 21 6 3" fill="rgba(255, 255, 255, 0.95)" stroke="none" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          04 GROUP DIVISIONS & STRATEGIC SYNERGIES (Matching Reference Image 3)
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--mist-50)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'start',
            }}
            className="about-group-grid"
          >
            {/* Left Column: Shared Vision Statement + Practice Badges */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.76,
                  color: 'var(--ink)',
                  marginBottom: '36px',
                  textWrap: 'pretty',
                }}
              >
                Our group consists of specialized corporate advisory services, statutory compliance audit, and executive search practices operating under a shared vision and fiduciary leadership. These specialized practices are interconnected through common ownership and executive governance, allowing us to leverage synergies and resources across our operations. This strategic alignment enables us to provide cohesive services and solutions while maintaining distinct focus and identities for each specialized division.
              </p>

              {/* Division Logo / Emblem Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 20px',
                    backgroundColor: 'var(--navy-950)',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  <Briefcase size={20} color="var(--sky-500)" />
                  <span>TECHORA <span style={{ color: 'var(--sky-500)' }}>SEARCH</span></span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 20px',
                    backgroundColor: 'var(--navy-900)',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    letterSpacing: '0.04em',
                    border: '1px solid var(--line-dark)',
                  }}
                >
                  <Building2 size={20} color="#ea580c" />
                  <span>TECHORA <span style={{ color: '#ea580c' }}>GOVERNANCE</span></span>
                </div>
              </div>
            </div>

            {/* Right Column: Division Profiles (Matching Reference Image 3) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Division 1 */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#ea580c',
                    marginBottom: '8px',
                  }}
                >
                  TECHORA Executive Search — Founded in 2026
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.98rem',
                    lineHeight: 1.7,
                    color: 'var(--ink)',
                    margin: 0,
                    textWrap: 'pretty',
                  }}
                >
                  Backed by a team of seasoned experts in executive leadership and corporate talent mapping, TECHORA Executive Search drives organizational transformation across Banking, Financial Services, Enterprise Technology, and Cloud Infrastructure. Headquartered in India, our mission is to empower national and multinational enterprises with dependable leadership capabilities and strategic human capital advisory.
                </p>
              </div>

              {/* Division 2 */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: 'var(--sky-600)',
                    marginBottom: '8px',
                  }}
                >
                  TECHORA Statutory &amp; Payroll Solutions — Founded in 2026
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.98rem',
                    lineHeight: 1.7,
                    color: 'var(--ink)',
                    margin: 0,
                    textWrap: 'pretty',
                  }}
                >
                  Enterprise Statutory &amp; Workforce Advisory dealing with institutional payroll administration, multi-jurisdictional tax compliance, and regulatory governance. We ensure complete audit transparency, internal statutory controls, and customized workforce compliance frameworks tailored strictly to enterprise client requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          05 CORE INSTITUTIONAL VALUES
          ========================================================================= */}
      <section style={{ backgroundColor: 'var(--white)', padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sky-500)' }}>
                05 &mdash;
              </span>
              <span className="eyebrow-label">{aboutContent.values.label}</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.2vw, 2.7rem)',
                lineHeight: 1.2,
                color: 'var(--navy-900)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              {aboutContent.values.headline}
            </h2>
            <div className="thin-sky-rule" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
            className="about-values-grid"
          >
            {aboutContent.values.items.map((item, idx) => {
              const icons = [ShieldCheck, FileCheck2, Users, CheckCircle2];
              const IconComp = icons[idx % icons.length];
              return (
                <div
                  key={item.num || idx}
                  style={{
                    backgroundColor: 'var(--mist-50)',
                    border: '1px solid var(--line)',
                    borderRadius: '4px',
                    padding: '36px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  }}
                  className="tenet-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={20} color="var(--sky-600)" />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--sky-500)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.num}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: 'var(--navy-900)',
                      marginBottom: '12px',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      lineHeight: 1.68,
                      color: 'var(--ink)',
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

      {/* 06 Methodology Approach Photo Band */}
      {aboutContent.approach && (
        <PhotoBand
          num={aboutContent.approach.sectionNum}
          label={aboutContent.approach.label}
          headline={aboutContent.approach.headline}
          subheading={aboutContent.approach.subheading}
          image={aboutContent.approach.image}
          steps={aboutContent.approach.steps}
        />
      )}

      {/* CTA Section */}
      <CTASection
        title="Ready to Strengthen Your Leadership or Workforce Operations?"
        subtitle="Consult directly with TECHORA's practice directors for confidential executive talent mapping or statutory payroll governance."
        primaryAction={{
          label: 'Request Consultation',
          onClick: onOpenConsultModal,
        }}
        secondaryAction={{
          label: 'Explore Our Services',
          href: '/services/recruitment',
        }}
      />

      <style>{`
        .btn-request-consult-orange:hover {
          background-color: #ea580c !important;
          color: #FFFFFF !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(234, 88, 12, 0.35);
        }

        .mission-card:hover,
        .vision-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(7, 20, 38, 0.1) !important;
        }

        .tenet-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(7, 20, 38, 0.08) !important;
          border-color: var(--sky-500) !important;
        }

        .about-alongside-card:hover .alongside-img {
          transform: scale(1.04);
        }

        .about-alongside-card:hover .alongside-overlay {
          background-color: rgba(7, 20, 38, 0.28) !important;
        }

        .about-alongside-card:hover .alongside-play-btn {
          transform: scale(1.12);
          background-color: var(--sky-600) !important;
          border-color: #FFFFFF !important;
          box-shadow: 0 12px 32px rgba(15, 127, 196, 0.5) !important;
        }

        @media (max-width: 860px) {
          .about-two-col-grid,
          .mission-vision-grid,
          .about-alongside-grid,
          .about-group-grid,
          .about-values-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
