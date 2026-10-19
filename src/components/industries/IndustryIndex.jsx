import React, { useState, useEffect } from 'react';

export default function IndustryIndex({ industries = [] }) {
  const [activeSlug, setActiveSlug] = useState(industries[0]?.slug || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = industries.length - 1; i >= 0; i--) {
        const item = industries[i];
        const el = document.getElementById(`sector-${item.slug}`);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSlug(item.slug);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [industries]);

  const scrollTo = (slug) => (e) => {
    e.preventDefault();
    const el = document.getElementById(`sector-${slug}`);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSlug(slug);
    }
  };

  if (!industries.length) return null;

  return (
    <aside
      style={{
        position: 'sticky',
        top: 'calc(var(--nav-height) + 40px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderLeft: '2px solid var(--line)',
        paddingLeft: '20px',
      }}
      aria-label="Industry Sector Navigation"
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
            marginBottom: '6px',
          }}
        >
          Sector Index
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            fontWeight: 800,
            color: 'var(--navy-900)',
            letterSpacing: '-0.01em',
          }}
        >
          Active Specializations
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {industries.map((ind) => {
          const isActive = activeSlug === ind.slug;
          return (
            <a
              key={ind.slug}
              href={`#sector-${ind.slug}`}
              onClick={scrollTo(ind.slug)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--navy-900)' : 'var(--ink-600)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0',
                transition: 'color 0.18s ease',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--sky-500)' : 'transparent',
                  border: isActive ? 'none' : '1px solid var(--ink-600)',
                  transition: 'background-color 0.18s ease',
                }}
              />
              <span>{ind.name}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
