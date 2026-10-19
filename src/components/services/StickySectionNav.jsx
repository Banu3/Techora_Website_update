import React, { useState, useEffect } from 'react';

export default function StickySectionNav({ items = [], ctaText, ctaTarget = '#contact-section' }) {
  const [activeId, setActiveId] = useState(items[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 'var(--nav-height)',
        zIndex: 900,
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--line)',
        boxShadow: '0 2px 10px rgba(11,31,58,0.04)',
      }}
      aria-label="Payroll Sections Navigation"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          paddingTop: '4px',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={scrollTo(item.id)}
                style={{
                  display: 'inline-block',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? 'var(--navy-900)' : 'var(--ink-600)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid var(--sky-500)' : '2px solid transparent',
                  transition: 'all 0.18s ease',
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {ctaText && (
          <div style={{ paddingLeft: '16px' }}>
            <a
              href={ctaTarget}
              onClick={scrollTo(ctaTarget.replace('#', ''))}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--sky-500)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                padding: '6px 14px',
                border: '1px solid var(--sky-500)',
                borderRadius: '2px',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sky-500)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--sky-500)';
              }}
            >
              {ctaText} &rarr;
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
