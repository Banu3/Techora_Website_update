import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Lock, Menu, X, ArrowRight, ShieldAlert } from 'lucide-react';
import LockedNavItem from './navigation/LockedNavItem';

export default function Navbar({ onOpenConsultModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'profile' | 'services' | 'expertise' | null
  const [clientsPromptOpen, setClientsPromptOpen] = useState(false);
  const [clientAccessKey, setClientAccessKey] = useState('');
  const [clientAccessError, setClientAccessError] = useState('');

  // Mobile Accordion state
  const [mobileAccordions, setMobileAccordions] = useState({
    profile: false,
    services: false,
    expertise: false,
  });

  const [isHovered, setIsHovered] = useState(false);

  const location = useLocation();
  const navRef = useRef(null);
  const mobileDrawerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Smooth hover entry and exit with generous grace period
  const handleDropdownEnter = (name) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 240); // 240ms grace period prevents menu from closing while mouse travels down
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Scroll detection (triggers as soon as user begins scrolling)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current page has a full-bleed hero
  const heroRoutes = [
    '/',
    '/partner-with-us',
    '/careers',
    '/profile/about-us',
    '/profile/our-legacy',
    '/profile/leadership',
    '/services/recruitment',
    '/services/payroll',
    '/expertise/industries',
    '/clients',
  ];
  const hasFullBleedHero = heroRoutes.some(
    (p) => location.pathname === p || (p !== '/' && location.pathname.startsWith(p))
  );

  // Active Glass State: Navy glass at top of full-bleed hero; frosted white on scroll > 24px, on hover/focus, or on non-hero pages
  const isNavyGlass = hasFullBleedHero && !scrolled && !isHovered && openDropdown === null && !mobileMenuOpen;

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
        setClientsPromptOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus trap for mobile menu
  useEffect(() => {
    if (mobileMenuOpen && mobileDrawerRef.current) {
      document.body.style.overflow = 'hidden';
      const focusable = mobileDrawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const toggleAccordion = (name) => {
    setMobileAccordions((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleClientsSubmit = (e) => {
    e.preventDefault();
    if (!clientAccessKey.trim()) {
      setClientAccessError('Please enter your Corporate Client Access Key.');
      return;
    }
    setClientAccessError('Access restricted: Authorized client portal verification in progress.');
  };

  const isCurrent = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`main-navbar ${isNavyGlass ? 'nav-glass-navy' : 'nav-glass-scrolled'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={(e) => {
          if (navRef.current && !navRef.current.contains(e.relatedTarget)) {
            setIsHovered(false);
          }
        }}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          height: scrolled ? '72px' : 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          background: scrolled
            ? 'linear-gradient(180deg, rgba(7, 20, 38, 0.90) 0%, rgba(5, 14, 26, 0.84) 100%)'
            : 'linear-gradient(180deg, rgba(7, 20, 38, 0.72) 0%, rgba(7, 20, 38, 0.48) 100%)',
          backdropFilter: 'blur(28px) saturate(210%)',
          WebkitBackdropFilter: 'blur(28px) saturate(210%)',
          borderBottom: scrolled
            ? '1px solid rgba(47, 164, 231, 0.35)'
            : '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: scrolled
            ? '0 16px 45px -8px rgba(0, 0, 0, 0.65), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)'
            : '0 8px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
          transition:
            'background 300ms ease, backdrop-filter 300ms ease, -webkit-backdrop-filter 300ms ease, border-color 300ms ease, box-shadow 300ms ease, height 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo: TECHORA wordmark */}
          <Link
            to="/"
            style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
            aria-label="TECHORA Consultant Home"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  color: '#FFFFFF',
                  lineHeight: 1,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
                }}
              >
                TECHORA
              </span>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--sky-500)',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(47, 164, 231, 0.8)',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--sky-400)',
                marginTop: '3px',
              }}
            >
              Consultant
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{ display: 'none', alignItems: 'center', gap: '34px' }}
            className="desktop-nav"
            aria-label="Main Navigation"
          >
            {/* Home */}
            <Link
              to="/"
              className={`nav-link-item ${isCurrent('/') ? 'active' : ''}`}
            >
              Home
            </Link>

            {/* Profile ▾ */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => handleDropdownEnter('profile')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenDropdown(openDropdown === 'profile' ? null : 'profile');
                  }
                }}
                className={`nav-link-item ${isCurrent('/profile') || isCurrent('/about-us') || openDropdown === 'profile' ? 'active' : ''}`}
                aria-expanded={openDropdown === 'profile'}
                aria-haspopup="true"
              >
                Profile <ChevronDown size={15} style={{ transform: openDropdown === 'profile' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {openDropdown === 'profile' && (
                <div
                  className="nav-dropdown-menu"
                  onMouseEnter={() => handleDropdownEnter('profile')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="dropdown-sky-bar" />
                  <Link 
                    to="/profile/about-us" 
                    className={`dropdown-item ${location.pathname.includes('about') ? 'active-dropdown-item' : ''}`}
                  >
                    <span className="dropdown-item-title">About Us</span>
                    <ChevronRight size={14} className="dropdown-arrow" />
                  </Link>
                  <Link 
                    to="/profile/our-legacy" 
                    className={`dropdown-item ${location.pathname.includes('legacy') ? 'active-dropdown-item' : ''}`}
                  >
                    <span className="dropdown-item-title">Our Legacy</span>
                    <ChevronRight size={14} className="dropdown-arrow" />
                  </Link>
                  <Link 
                    to="/profile/leadership" 
                    className={`dropdown-item ${location.pathname.includes('leadership') ? 'active-dropdown-item' : ''}`}
                  >
                    <span className="dropdown-item-title">Our Leadership Team</span>
                    <ChevronRight size={14} className="dropdown-arrow" />
                  </Link>
                </div>
              )}
            </div>

            {/* Services ▾ */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => handleDropdownEnter('services')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenDropdown(openDropdown === 'services' ? null : 'services');
                  }
                }}
                className={`nav-link-item ${isCurrent('/services') || openDropdown === 'services' ? 'active' : ''}`}
                aria-expanded={openDropdown === 'services'}
                aria-haspopup="true"
              >
                Services <ChevronDown size={15} style={{ transform: openDropdown === 'services' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {openDropdown === 'services' && (
                <div
                  className="nav-dropdown-menu"
                  onMouseEnter={() => handleDropdownEnter('services')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="dropdown-sky-bar" />
                  <Link
                    to="/services#recruitment"
                    onClick={() => {
                      setOpenDropdown(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`dropdown-item ${location.pathname === '/services' && (location.hash === '#recruitment' || !location.hash) ? 'active-dropdown-item' : ''}`}
                  >
                    <span className="dropdown-item-title">Recruitment</span>
                    <ChevronRight size={14} className="dropdown-arrow" />
                  </Link>
                  <Link
                    to="/services#payroll"
                    onClick={() => {
                      setOpenDropdown(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`dropdown-item ${location.pathname === '/services' && location.hash === '#payroll' ? 'active-dropdown-item' : ''}`}
                  >
                    <span className="dropdown-item-title">Payroll</span>
                    <ChevronRight size={14} className="dropdown-arrow" />
                  </Link>
                </div>
              )}
            </div>

            {/* Clients (Locked when features.clientsEnabled === false) */}
            <LockedNavItem isDark={isNavyGlass} />

            {/* Expertise ▾ */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => handleDropdownEnter('expertise')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'expertise' ? null : 'expertise')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenDropdown(openDropdown === 'expertise' ? null : 'expertise');
                  }
                }}
                className={`nav-link-item ${isCurrent('/expertise') || openDropdown === 'expertise' ? 'active' : ''}`}
                aria-expanded={openDropdown === 'expertise'}
                aria-haspopup="true"
              >
                Expertise <ChevronDown size={15} style={{ transform: openDropdown === 'expertise' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {openDropdown === 'expertise' && (
                <div
                  className="nav-dropdown-menu"
                  onMouseEnter={() => handleDropdownEnter('expertise')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="dropdown-sky-bar" />
                  <Link
                    to="/expertise/industries"
                    className={`dropdown-item ${location.pathname.startsWith('/expertise/industries') ? 'active-dropdown-item' : ''}`}
                  >
                    <span className="dropdown-item-title">Industries</span>
                    <ChevronRight size={14} className="dropdown-arrow" />
                  </Link>
                </div>
              )}
            </div>

            {/* Career Page */}
            <Link
              to="/careers"
              className={`nav-link-item ${isCurrent('/careers') ? 'active' : ''}`}
            >
              Career Page
            </Link>
          </nav>

          {/* Right Aligned CTA: Partner With Us */}
          <div style={{ display: 'none', alignItems: 'center' }} className="desktop-cta">
            <Link
              to="/partner-with-us"
              className="btn-nav-glass"
              style={{ padding: '12px 24px', fontSize: '0.9375rem', fontWeight: 700 }}
            >
              Partner With Us
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              color: isNavyGlass ? '#FFFFFF' : 'var(--navy-900)',
              transition: 'color 250ms ease',
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Full-Height Slide-in Drawer with Frosted Glass Panel */}
        {mobileMenuOpen && (
          <div
            ref={mobileDrawerRef}
            className="mobile-drawer-glass"
            style={{
              position: 'fixed',
              top: 'var(--nav-height)',
              left: 0,
              width: '100%',
              height: 'calc(100vh - var(--nav-height))',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(16px) saturate(160%)',
              WebkitBackdropFilter: 'blur(16px) saturate(160%)',
              borderTop: '1px solid var(--line)',
              zIndex: 1001,
              overflowY: 'auto',
              padding: '28px 24px 48px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'drawerSlide 0.22s ease-out forwards',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Link
                to="/"
                style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-900)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Profile Accordion */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('profile')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                  }}
                >
                  <span>Profile</span>
                  <ChevronDown size={18} style={{ transform: mobileAccordions.profile ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>
                {mobileAccordions.profile && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '12px 0 4px 12px' }}>
                    <Link
                      to="/profile/about-us"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        color: location.pathname.includes('about') ? 'var(--sky-500)' : 'var(--ink-600)',
                        fontWeight: location.pathname.includes('about') ? 700 : 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      About Us
                    </Link>
                    <Link
                      to="/profile/our-legacy"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        color: location.pathname.includes('legacy') ? 'var(--sky-500)' : 'var(--ink-600)',
                        fontWeight: location.pathname.includes('legacy') ? 700 : 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      Our Legacy
                    </Link>
                    <Link
                      to="/profile/leadership"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        color: location.pathname.includes('leadership') ? 'var(--sky-500)' : 'var(--ink-600)',
                        fontWeight: location.pathname.includes('leadership') ? 700 : 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      Our Leadership Team
                    </Link>
                  </div>
                )}
              </div>

              {/* Services Accordion */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('services')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                  }}
                >
                  <span>Services</span>
                  <ChevronDown size={18} style={{ transform: mobileAccordions.services ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>
                {mobileAccordions.services && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '12px 0 4px 12px' }}>
                    <Link
                      to="/services#recruitment"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        color: location.pathname === '/services' && (location.hash === '#recruitment' || !location.hash) ? 'var(--sky-500)' : 'var(--ink-600)',
                        fontWeight: location.pathname === '/services' && (location.hash === '#recruitment' || !location.hash) ? 700 : 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      Recruitment
                    </Link>
                    <Link
                      to="/services#payroll"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        color: location.pathname === '/services' && location.hash === '#payroll' ? 'var(--sky-500)' : 'var(--ink-600)',
                        fontWeight: location.pathname === '/services' && location.hash === '#payroll' ? 700 : 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      Payroll
                    </Link>
                  </div>
                )}
              </div>

              {/* Clients (Locked when features.clientsEnabled === false) */}
              <LockedNavItem isMobile={true} onCloseMobile={() => setMobileMenuOpen(false)} />

              {/* Expertise Accordion */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('expertise')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                  }}
                >
                  <span>Expertise</span>
                  <ChevronDown size={18} style={{ transform: mobileAccordions.expertise ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>
                {mobileAccordions.expertise && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '12px 0 4px 12px' }}>
                    <Link
                      to="/expertise/industries"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        color: location.pathname.startsWith('/expertise/industries') ? 'var(--sky-500)' : 'var(--ink-600)',
                        fontWeight: location.pathname.startsWith('/expertise/industries') ? 700 : 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      Industries
                    </Link>
                  </div>
                )}
              </div>

              {/* Career Page */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <Link
                  to="/careers"
                  style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Career Page
                </Link>
              </div>
            </div>

            <div style={{ marginTop: '36px', borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
              <Link
                to="/partner-with-us"
                className="btn-navy"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Partner With Us
              </Link>
            </div>
          </div>
        )}

        {/* Clients Locked Portal Dialog */}
        {clientsPromptOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(11, 31, 58, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setClientsPromptOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: 'var(--white)',
                borderRadius: '4px',
                padding: '32px',
                border: '1px solid var(--line)',
                boxShadow: '0 20px 40px rgba(11, 31, 58, 0.25)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--mist-50)', border: '1px solid var(--line)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={18} color="var(--sky-500)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', fontWeight: 700 }}>Corporate Client Portal</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Encrypted Access</span>
                  </div>
                </div>
                <button type="button" onClick={() => setClientsPromptOpen(false)}>
                  <X size={20} color="var(--ink-600)" />
                </button>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: '20px' }}>
                The TECHORA Client Management Portal provides confidential executive candidate rosters, ongoing mandate metrics, and payroll audit documentation for authorized enterprise partners.
              </p>

              <form onSubmit={handleClientsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label htmlFor="clientKey" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-700)', marginBottom: '6px' }}>
                    Corporate Partner Access Key
                  </label>
                  <input
                    id="clientKey"
                    type="password"
                    placeholder="Enter your enterprise access token"
                    value={clientAccessKey}
                    onChange={(e) => { setClientAccessKey(e.target.value); setClientAccessError(''); }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '0.9rem',
                      border: '1px solid var(--line)',
                      borderRadius: '3px',
                      outline: 'none',
                    }}
                  />
                </div>

                {clientAccessError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontSize: '0.8125rem' }}>
                    <ShieldAlert size={14} />
                    <span>{clientAccessError}</span>
                  </div>
                )}

                <button type="submit" className="btn-navy" style={{ width: '100%', marginTop: '4px' }}>
                  Authenticate Client Access
                </button>
              </form>
            </div>
          </div>
        )}

        <style>{`
          .main-navbar {
            position: -webkit-sticky !important;
            position: sticky !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            z-index: 1000 !important;
          }
          @media (min-width: 992px) {
            .desktop-nav { display: flex !important; }
            .desktop-cta { display: flex !important; }
            .mobile-nav-toggle { display: none !important; }
          }
          .nav-link-item {
            color: #FFFFFF !important;
            transition: all 220ms ease;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          }
          .nav-link-item:hover, .nav-link-item:focus {
            color: #38bdf8 !important;
          }
          .nav-link-item.active {
            color: #38bdf8 !important;
            border-bottom: 2px solid #38bdf8;
            padding-bottom: 2px;
          }
          .btn-nav-glass {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(47, 164, 231, 0.22) 0%, rgba(15, 127, 196, 0.35) 100%);
            color: #FFFFFF !important;
            border: 1px solid rgba(56, 189, 248, 0.55);
            border-radius: 6px;
            font-family: var(--font-body);
            font-weight: 700;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            box-shadow: 0 4px 16px rgba(15, 127, 196, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.35);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
          }
          .btn-nav-glass:hover {
            background-color: #FFFFFF;
            border-color: #FFFFFF;
            color: var(--navy-950) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
          }
          .nav-dropdown-menu {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            min-width: 220px;
            width: max-content;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(11, 31, 58, 0.08);
            border-radius: 8px;
            box-shadow: 0 20px 48px -6px rgba(7, 20, 38, 0.16), 0 0 0 1px rgba(7, 20, 38, 0.04);
            padding: 8px 6px;
            z-index: 100;
            animation: dropdownRise 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transition: background 0.2s ease, box-shadow 0.2s ease;
          }
          /* Invisible hover bridge: covers the gap completely so mouse never leaves hover zone */
          .nav-dropdown-menu::before {
            content: '';
            position: absolute;
            top: -18px;
            left: 0;
            width: 100%;
            height: 18px;
            background: transparent;
            pointer-events: auto;
          }
          .dropdown-sky-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--sky-500) 0%, var(--sky-600) 100%);
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            box-shadow: 0 2px 8px rgba(15, 127, 196, 0.35);
          }
          .dropdown-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 14px;
            margin: 2px 0;
            border-radius: 6px;
            text-decoration: none;
            transition: all 0.18s ease;
          }
          .dropdown-item:hover, .dropdown-item:focus {
            background-color: rgba(15, 127, 196, 0.08);
            outline: none;
            transform: translateX(3px);
          }
          .dropdown-item-title {
            font-family: var(--font-heading);
            font-size: 0.9375rem;
            font-weight: 600;
            color: var(--navy-900);
            white-space: nowrap;
            transition: color 0.15s ease;
          }
          .dropdown-item:hover .dropdown-item-title {
            color: var(--sky-600);
          }
          .dropdown-arrow {
            color: var(--sky-600);
            opacity: 0;
            transform: translateX(-4px);
            transition: all 0.18s ease;
            flex-shrink: 0;
            margin-left: 16px;
          }
          .dropdown-item:hover .dropdown-arrow {
            opacity: 1;
            transform: translateX(0);
          }
          .active-dropdown-item {
            background-color: rgba(15, 127, 196, 0.06);
            border-left: 3px solid var(--sky-600);
          }
          .active-dropdown-item .dropdown-item-title {
            color: var(--sky-600);
          }
          /* Solid Fallback when backdrop-filter is unsupported */
          @supports not (backdrop-filter: blur(14px)) {
            .nav-glass-navy {
              background-color: rgba(7, 20, 38, 0.95) !important;
            }
            .nav-glass-scrolled {
              background-color: #FFFFFF !important;
            }
            .nav-dropdown-menu {
              background-color: #FFFFFF !important;
            }
            .mobile-drawer-glass {
              background-color: #FFFFFF !important;
            }
          }
          @keyframes dropdownRise {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes drawerSlide {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </header>
    </>
  );
}
