import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { features } from '../../config/features';

export default function LockedNavItem({ isMobile = false, onCloseMobile, isDark = false }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowTooltip(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When enabled, render standard active link
  if (features.clientsEnabled) {
    if (isMobile) {
      return (
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <Link
            to="/clients"
            onClick={onCloseMobile}
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: location.pathname === '/clients' ? 'var(--sky-500)' : 'var(--navy-900)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <span>Clients</span>
          </Link>
        </div>
      );
    }

    return (
      <Link
        to="/clients"
        className={`nav-link-item ${location.pathname === '/clients' ? 'active' : ''}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        Clients
      </Link>
    );
  }

  // Locked mode (features.clientsEnabled === false)
  if (isMobile) {
    return (
      <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', position: 'relative' }}>
        <button
          type="button"
          tabIndex={-1}
          aria-disabled="true"
          aria-describedby="mobile-clients-tooltip"
          onClick={(e) => {
            e.preventDefault();
            setShowTooltip((prev) => !prev);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowTooltip((prev) => !prev);
            }
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--ink-600)',
            opacity: 0.72,
            cursor: 'not-allowed',
            background: 'none',
            border: 'none',
            padding: 0,
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>Clients</span>
            <Lock size={13} color="var(--ink-600)" aria-hidden="true" />
            <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              Clients, locked, section being prepared
            </span>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Coming Soon
          </span>
        </button>

        {showTooltip && (
          <div
            id="mobile-clients-tooltip"
            role="tooltip"
            style={{
              marginTop: '8px',
              padding: '6px 10px',
              backgroundColor: 'var(--navy-900)',
              color: 'var(--white)',
              fontSize: '0.75rem',
              borderRadius: '2px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            This section is being prepared. Contact TECHORA to discuss partnerships.
          </div>
        )}
      </div>
    );
  }

  // Desktop Locked Nav Item
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-disabled="true"
        aria-describedby="desktop-clients-tooltip"
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          padding: '8px 0',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-nav)',
          fontWeight: 600,
          color: isDark ? 'rgba(255, 255, 255, 0.72)' : 'var(--ink-600)',
          opacity: 0.85,
          cursor: 'not-allowed',
          textDecoration: 'none',
          transition: 'color 250ms ease',
        }}
      >
        <span>Clients</span>
        <Lock size={13} color={isDark ? 'rgba(255, 255, 255, 0.72)' : 'var(--ink-600)'} aria-hidden="true" />
        <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Clients, locked, section being prepared
        </span>
      </button>

      {/* Accessible Tooltip */}
      {showTooltip && (
        <div
          id="desktop-clients-tooltip"
          role="tooltip"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--navy-900)',
            color: 'var(--white)',
            padding: '6px 12px',
            borderRadius: '2px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: '0 6px 16px rgba(11,31,58,0.18)',
            zIndex: 1100,
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease forwards',
          }}
        >
          Coming soon
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: '4px solid var(--navy-900)',
            }}
          />
        </div>
      )}
    </div>
  );
}
