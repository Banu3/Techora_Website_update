import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

/**
 * =======================================================================
 * SERVICE CARD IMAGES - SOURCES & LICENSING (ROYALTY-FREE COMMERCIAL USE)
 * =======================================================================
 *
 * 1. Executive Talent Acquisition
 *    - Destination File: /public/images/services/executive-talent.webp
 *    - Source: Unsplash (Commercial Use License)
 *    - Source URL: https://images.unsplash.com/photo-1521791136064-7986c2920216
 *    - Photographer: Cytonn Photography (@cytonn_photography)
 *    - Description: Authentic senior-level executive interview agreement and handshake
 *                   across a modern corporate meeting desk with professional business attire.
 *                   Candid natural lighting, no stiff poses, subtle cool navy grading.
 *    - Aspect Ratio: 16:10 | Dimensions: 1200x750 | WebP: ~47.6 KB (< 150 KB)
 *
 * 2. Payroll Solutions and Statutory Governance
 *    - Destination File: /public/images/services/payroll-governance.webp
 *    - Source: Unsplash (Commercial Use License)
 *    - Source URL: https://images.unsplash.com/photo-1454165804606-c3d57bc86b40
 *    - Photographer: Scott Graham (@homajob)
 *    - Description: Close-up of corporate finance specialist hands reviewing payroll
 *                   spreadsheets, calculations, calculator, and statutory compliance
 *                   documentation on a clean desk.
 *    - Aspect Ratio: 16:10 | Dimensions: 1200x750 | WebP: ~50.3 KB (< 150 KB)
 *
 * 3. Strategic Workforce Advisory
 *    - Destination File: /public/images/services/workforce-advisory.webp
 *    - Source: Unsplash (Commercial Use License)
 *    - Source URL: https://images.unsplash.com/photo-1542744173-8e7e53415bb0
 *    - Photographer: Campaign Creators (@campaign_creators)
 *    - Description: Modern corporate boardroom strategy meeting with a diverse executive
 *                   team actively analyzing charts, workforce data, and organizational growth metrics.
 *    - Aspect Ratio: 16:10 | Dimensions: 1200x750 | WebP: ~82.1 KB (< 150 KB)
 * =======================================================================
 */

const SERVICES_DATA = [
  {
    id: 'recruitment',
    title: 'Executive Talent Acquisition',
    description:
      'Specialized in placing C-Suite officers, Vice Presidents, and high-impact functional leaders who steer organizational transformation.',
    link: '/services/recruitment',
    image: '/images/services/executive-talent.webp',
    alt: 'Executive search interview and candidate assessment handshake across corporate desk',
  },
  {
    id: 'payroll',
    title: 'Payroll Solutions and Statutory Governance',
    description:
      'Protecting enterprise reputation through disciplined payroll administration, tax withholdings, and statutory oversight with complete audit transparency.',
    link: '/services/payroll',
    image: '/images/services/payroll-governance.webp',
    alt: 'Corporate payroll administration, financial spreadsheet review, and statutory compliance documentation',
  },
  {
    id: 'advisory',
    title: 'Strategic Workforce Advisory',
    description:
      'Partner-led consultation, data-backed talent mapping, and direct integration with corporate compliance teams to achieve dependable operational outcomes.',
    link: '/profile/about-us',
    image: '/images/services/workforce-advisory.webp',
    alt: 'Corporate consulting leadership team analyzing workforce strategy, organizational data, and charts in boardroom',
  },
];

import { useSiteContent } from '../../context/SiteContentContext';

export default function ThreeColumnCards() {
  const { t } = useSiteContent();
  const [imgErrors, setImgErrors] = useState({});
  const [customImages, setCustomImages] = useState({});

  useEffect(() => {
    // Check for admin-customized images in localStorage (syncs with Admin Dashboard)
    const stored = {};
    SERVICES_DATA.forEach((service) => {
      const customImg = localStorage.getItem(`techora_service_card_image_${service.id}`);
      if (customImg) {
        stored[service.id] = customImg;
      }
    });
    setCustomImages(stored);
  }, []);

  const handleImageError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      style={{
        backgroundColor: 'var(--mist)',
        padding: '96px 0',
        borderBottom: '1px solid var(--line)',
      }}
      className="three-column-services-section"
    >
      <div className="container">
        <ScrollReveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
            }}
            className="services-cards-grid"
          >
            {SERVICES_DATA.map((service) => {
              const imageSrc = customImages[service.id] || service.image;
              const hasError = !!imgErrors[service.id];

              return (
                <div key={service.id} className="stagger-card" style={{ height: '100%' }}>
                  <article className="service-card">
                    {/* Landscape Image on Top (16:10 aspect ratio, rounded corners via parent card) */}
                    <div className="service-card-img-wrap">
                      {hasError ? (
                        /* Fallback navy-gradient placeholder if image fails to load */
                        <div
                          className="service-card-img-fallback"
                          role="img"
                          aria-label={`${service.title} placeholder`}
                        >
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                            }}
                          >
                            <ImageIcon size={20} style={{ color: 'var(--sky-400, #38BDF8)' }} />
                          </div>
                          <span
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              letterSpacing: '0.02em',
                              color: '#FFFFFF',
                            }}
                          >
                            TECHORA Practice
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'rgba(255, 255, 255, 0.65)',
                              marginTop: '4px',
                            }}
                          >
                            {service.title}
                          </span>
                        </div>
                      ) : (
                        <>
                          <img
                            src={imageSrc}
                            alt={service.alt}
                            width="1200"
                            height="750"
                            loading="lazy"
                            onError={() => handleImageError(service.id)}
                            className="service-card-img"
                          />
                          {/* Subtle navy gradient overlay (10-15%) to blend with theme */}
                          <div className="service-card-img-overlay" aria-hidden="true" />
                        </>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div className="service-card-body">
                      {/* Bold Title */}
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--navy-900)',
                          marginBottom: '12px',
                          lineHeight: 1.25,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {service.id === 'recruitment'
                          ? t('home.servicesCards.card1Title', service.title)
                          : service.id === 'payroll'
                          ? t('home.servicesCards.card2Title', service.title)
                          : t('home.servicesCards.card3Title', service.title)}
                      </h3>

                      {/* 2-line Description with Fade */}
                      <p className="service-card-desc-2line">
                        {service.id === 'recruitment'
                          ? t('home.servicesCards.card1Description', service.description)
                          : service.id === 'payroll'
                          ? t('home.servicesCards.card2Description', service.description)
                          : t('home.servicesCards.card3Description', service.description)}
                      </p>

                      {/* "Read more" Link */}
                      <Link
                        to={service.link}
                        className="service-card-link"
                        aria-label={`Read more about ${service.title}`}
                      >
                        <span>Read more</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .services-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
