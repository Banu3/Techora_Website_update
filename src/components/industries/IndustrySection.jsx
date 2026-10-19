import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export default function IndustrySection({
  industry,
  index = 0,
  onEnquire,
  isPreview = false,
}) {
  const {
    slug,
    name,
    tagline,
    composition = 'image-left',
    overview,
    workforceChallenges = [],
    services = [],
    image,
    imageAlt,
    ctaLabel,
  } = industry;

  const sectionId = `sector-${slug}`;

  // Helper for Workforce Challenges Ruled List
  const renderChallenges = () => (
    <div style={{ marginTop: '20px' }}>
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: composition === 'photo-band' ? 'var(--sky-500)' : 'var(--navy-900)',
          marginBottom: '10px',
        }}
      >
        Sector Workforce Challenges:
      </div>
      <div style={{ borderTop: `1px solid ${composition === 'photo-band' ? 'rgba(255,255,255,0.15)' : 'var(--line)'}` }}>
        {workforceChallenges.map((challenge, cIdx) => (
          <div
            key={cIdx}
            style={{
              padding: '10px 0',
              borderBottom: `1px solid ${composition === 'photo-band' ? 'rgba(255,255,255,0.1)' : 'var(--line)'}`,
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: composition === 'photo-band' ? 'rgba(255,255,255,0.85)' : 'var(--ink-600)',
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
            }}
          >
            <span style={{ color: 'var(--sky-500)', fontWeight: 700, fontSize: '0.8rem' }}>0{cIdx + 1}</span>
            <span>{challenge}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Helper for How TECHORA Can Support Links
  const renderServices = () => (
    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: composition === 'photo-band' ? 'var(--sky-500)' : 'var(--navy-900)',
          marginBottom: '10px',
        }}
      >
        How TECHORA Can Support:
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {services.map((svc, sIdx) => (
          <div
            key={sIdx}
            style={{
              backgroundColor: composition === 'photo-band' ? 'rgba(255,255,255,0.06)' : 'var(--mist-50)',
              border: `1px solid ${composition === 'photo-band' ? 'rgba(255,255,255,0.15)' : 'var(--line)'}`,
              padding: '12px 16px',
              borderRadius: '2px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: composition === 'photo-band' ? 'var(--white)' : 'var(--navy-900)',
                }}
              >
                {svc.title}
              </span>
              <Link
                to={svc.link}
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  color: 'var(--sky-500)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                Learn More <ChevronRight size={13} />
              </Link>
            </div>
            <p
              style={{
                fontSize: '0.8125rem',
                lineHeight: 1.5,
                color: composition === 'photo-band' ? 'rgba(255,255,255,0.75)' : 'var(--ink-600)',
                margin: 0,
              }}
            >
              {svc.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // Actions footer (Read More detail link + Enquire button)
  const renderActions = () => (
    <div
      style={{
        marginTop: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      <button
        type="button"
        onClick={() => {
          if (onEnquire) onEnquire(name);
        }}
        className={composition === 'photo-band' ? 'btn-sky' : 'btn-navy'}
        style={{
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 700,
        }}
      >
        {ctaLabel || `Enquire About ${name}`}
      </button>

      <Link
        to={`/expertise/industries/${slug}${isPreview ? '?previewIndustries=1' : ''}`}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: composition === 'photo-band' ? 'var(--white)' : 'var(--navy-900)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          borderBottom: '1.5px solid var(--sky-500)',
          paddingBottom: '2px',
        }}
      >
        Read more about {name} <ArrowRight size={14} color="var(--sky-500)" />
      </Link>
    </div>
  );

  // Variant B: Full-width photographic band with text over navy overlay
  if (composition === 'photo-band') {
    return (
      <section
        id={sectionId}
        style={{
          position: 'relative',
          backgroundColor: 'var(--navy-900)',
          color: 'var(--white)',
          padding: '80px 0',
          overflow: 'hidden',
          borderBottom: '1px solid var(--line)',
        }}
        aria-label={name}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <img
            src={image}
            alt={imageAlt || name}
            width="1200"
            height="800"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(11,31,58,0.97) 0%, rgba(11,31,58,0.92) 55%, rgba(11,31,58,0.7) 100%)',
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
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
              Sector 0{index + 1} &mdash; {tagline}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.3rem)',
                fontWeight: 800,
                color: 'var(--white)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '14px',
              }}
            >
              {name}
            </h3>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              {overview}
            </p>

            {renderChallenges()}
            {renderServices()}
            {renderActions()}
          </div>
        </div>
      </section>
    );
  }

  // Variant C: Text-led two-column with thin vertical divider and small image
  if (composition === 'split-minimal') {
    return (
      <section
        id={sectionId}
        style={{
          padding: '80px 0',
          backgroundColor: 'var(--mist-50)',
          borderBottom: '1px solid var(--line)',
        }}
        aria-label={name}
      >
        <div className="container">
          <div style={{ marginBottom: '28px' }}>
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
              Sector 0{index + 1} &mdash; {tagline}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.3rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {name}
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--line)',
              padding: 'clamp(28px, 4vw, 40px)',
            }}
          >
            {/* Left Column: Overview + Challenges */}
            <div style={{ borderRight: '1px solid var(--line)', paddingRight: '24px' }}>
              <p style={{ fontSize: '1rem', lineHeight: 1.68, color: 'var(--ink-600)', marginBottom: '20px' }}>
                {overview}
              </p>
              {renderChallenges()}
            </div>

            {/* Right Column: Small image accent + Services + Actions */}
            <div>
              <div
                style={{
                  border: '1px solid var(--line)',
                  overflow: 'hidden',
                  marginBottom: '20px',
                }}
              >
                <img
                  src={image}
                  alt={imageAlt || name}
                  width="800"
                  height="450"
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {renderServices()}
              {renderActions()}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variant A: Image left, text right (Default)
  return (
    <section
      id={sectionId}
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--white)',
        borderBottom: '1px solid var(--line)',
      }}
      aria-label={name}
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
          {/* Image Left with Subtle Frame */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                border: '1px solid var(--line)',
                overflow: 'hidden',
                backgroundColor: 'var(--mist-50)',
                boxShadow: '0 6px 24px rgba(11,31,58,0.04)',
              }}
            >
              <img
                src={image}
                alt={imageAlt || name}
                width="1200"
                height="800"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '16/11',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Text Right */}
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
              Sector 0{index + 1} &mdash; {tagline}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.3rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              {name}
            </h3>

            <p style={{ fontSize: '1rem', lineHeight: 1.68, color: 'var(--ink-600)', margin: 0 }}>
              {overview}
            </p>

            {renderChallenges()}
            {renderServices()}
            {renderActions()}
          </div>
        </div>
      </div>
    </section>
  );
}
