import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Shield, MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function Footer() {
  const { t } = useSiteContent();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* =========================================================================
          1. LIGHT MULTI-OFFICE / CONTACT SECTION (4 COLUMNS)
          ========================================================================= */}
      <div
        style={{
          backgroundColor: 'var(--mist)',
          color: 'var(--ink)',
          borderTop: '1px solid var(--line)',
          paddingTop: '80px',
          paddingBottom: '64px',
        }}
        className="footer-light-section"
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '48px',
            }}
            className="footer-four-columns"
          >
            {/* Column 1: Organization & Legacy */}
            <div>
              <Link
                to="/"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '18px' }}
                aria-label="TECHORA Consultant Home"
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    backgroundColor: 'var(--navy-900)',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sky-500)',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  T
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      color: 'var(--navy-900)',
                      lineHeight: 1,
                    }}
                  >
                    TECHORA
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--sky-600)',
                      marginTop: '3px',
                    }}
                  >
                    Consultant
                  </div>
                </div>
              </Link>

              <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '18px' }}>
                {t('global.shortDescription', 'Strategic Corporate Consulting, Retained Executive Search, and Enterprise Payroll Governance. Serving market-leading institutions with discretion and regulatory compliance.')}
              </p>

              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--navy-800)', fontWeight: 600, marginBottom: '20px' }}>
                Founded in 2026. Built on fiduciary integrity, statutory accountability, and collaborative enterprise partnership.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--sky-600)',
                  backgroundColor: 'var(--white)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--line)',
                }}
              >
                <Shield size={15} color="var(--sky-600)" />
                <span>Enterprise Compliance Assured</span>
              </div>
            </div>

            {/* Column 2: Core Practices */}
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--navy-900)',
                  marginBottom: '20px',
                }}
              >
                Core Practices
              </h4>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>
                  <Link to="/services#recruitment" className="footer-nav-link">
                    Recruitment Services
                  </Link>
                </li>
                <li>
                  <Link to="/services#payroll" className="footer-nav-link">
                    Payroll Services
                  </Link>
                </li>
                <li>
                  <Link to="/profile/about-us" className="footer-nav-link">
                    Strategic Workforce Advisory
                  </Link>
                </li>
                <li>
                  <Link to="/expertise/industries" className="footer-nav-link">
                    Banking &amp; Financial Services
                  </Link>
                </li>
                <li>
                  <Link to="/expertise/industries" className="footer-nav-link">
                    Enterprise Technology &amp; Cloud
                  </Link>
                </li>
                <li>
                  <Link to="/expertise/industries" className="footer-nav-link">
                    Retail &amp; Modern E-Commerce
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Corporate Profile */}
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--navy-900)',
                  marginBottom: '20px',
                }}
              >
                Corporate Profile
              </h4>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>
                  <Link to="/profile/about-us" className="footer-nav-link">
                    About TECHORA
                  </Link>
                </li>
                <li>
                  <Link to="/profile/our-legacy" className="footer-nav-link">
                    Our Legacy &amp; Standards
                  </Link>
                </li>
                <li>
                  <Link to="/profile/leadership" className="footer-nav-link">
                    Executive Leadership Team
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="footer-nav-link">
                    Career Page &amp; Mandates
                  </Link>
                </li>
                <li>
                  <Link to="/partner-with-us" className="footer-nav-link">
                    Partner With Us
                  </Link>
                </li>
                <li>
                  <Link to="/clients" className="footer-nav-link">
                    Corporate Client Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Multi-Office Coordinates */}
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--navy-900)',
                  marginBottom: '20px',
                }}
              >
                Offices &amp; Contact
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
                {/* Headquarters */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <MapPin size={18} color="var(--sky-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '2px' }}>Corporate Headquarters</div>
                    <div style={{ color: 'var(--ink)', lineHeight: 1.5 }}>
                      Nariman Point Corporate Tower, Level 14<br />
                      Mumbai, Maharashtra 400021, India
                    </div>
                  </div>
                </div>

                {/* Operating Hubs */}
                <div style={{ paddingLeft: '28px', color: 'var(--ink)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.8125rem', marginBottom: '2px' }}>Operating Hubs:</div>
                  <div style={{ fontSize: '0.8125rem', lineHeight: 1.4 }}>
                    Mumbai • Bengaluru • Chennai • Singapore
                  </div>
                </div>

                {/* Inquiries Email */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Mail size={16} color="var(--sky-600)" style={{ flexShrink: 0 }} />
                  <a href={`mailto:${t('global.email', 'partnerships@techora.consulting')}`} className="footer-nav-link" style={{ fontWeight: 500 }}>
                    {t('global.email', 'partnerships@techora.consulting')}
                  </a>
                </div>

                {/* Switchboard Phone */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} color="var(--sky-600)" style={{ flexShrink: 0 }} />
                  <a href={`tel:${t('global.phone', '+91 22 4900 8800')}`} className="footer-nav-link" style={{ fontWeight: 500 }}>
                    {t('global.phone', '+91 (0) 22 4900 8800')}
                  </a>
                </div>

                {/* Business Hours */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Clock size={16} color="var(--sky-600)" style={{ flexShrink: 0 }} />
                  <span style={{ color: 'var(--ink)' }}>{t('global.workingHours', 'Mon – Fri, 09:00 – 18:00 IST')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DARK BOTTOM STRIP
          ========================================================================= */}
      <div
        style={{
          backgroundColor: 'var(--navy-950)',
          color: 'rgba(255, 255, 255, 0.65)',
          padding: '24px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.8125rem',
          }}
        >
          {/* Strict Rule: "© 2026 TECHORA Consultant. Est. 2026. All rights reserved." */}
          <div>
            &copy; 2026 TECHORA Consultant. Est. 2026. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none' }} className="footer-strip-link">
              Privacy Notice &amp; Retention
            </Link>
            <Link to="/partner-with-us" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none' }} className="footer-strip-link">
              Partner With Us
            </Link>
            <Link to="/admin" style={{ color: 'rgba(255, 255, 255, 0.45)', textDecoration: 'none' }} className="footer-strip-link">
              Mandate Administration
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. FLOATING SQUARE BACK-TO-TOP BUTTON
          ========================================================================= */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        <ChevronUp size={22} />
      </button>

      <style>{`
        .footer-nav-link {
          color: var(--ink);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }
        .footer-nav-link:hover {
          color: var(--sky-600);
          transform: translateX(2px);
        }
        .footer-strip-link:hover {
          color: var(--sky-500) !important;
        }
        @media (max-width: 768px) {
          .footer-four-columns {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </footer>
  );
}
