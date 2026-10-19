import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Lock, Compass, Sparkles } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    align: 'left',
    eyebrow: '01 • RETAINED EXECUTIVE SEARCH',
    headlineMain: 'Talent',
    headlineAccent: 'Acquisition',
    theme: 'serif-prestige',
    icon: Sparkles,
    description:
      'Securing key professionals requires more than matching resumes; it demands deep sector intelligence, discreet relationship management, and an understanding of organizational culture.',
    buttonText: 'Know More',
    buttonLink: '/services/recruitment',
    image: '/images/hero-1-handshake.webp',
    alt: 'Two corporate business executives exchanging a handshake in an executive boardroom',
  },
  {
    id: 2,
    align: 'left', // Executives are on the right; text on the left over the scenic window leaves faces completely clear
    eyebrow: '02 • STATUTORY AUDIT & COMPLIANCE',
    headlineMain: 'Payroll Solutions &',
    headlineAccent: 'Statutory Governance',
    theme: 'geometric-vault',
    icon: ShieldCheck,
    description:
      'Protecting enterprise reputation through disciplined payroll administration, tax withholdings, and statutory oversight. We support multi-jurisdictional teams with complete audit transparency.',
    buttonText: 'Know More',
    buttonLink: '/services/payroll',
    image: '/images/hero-4-recruiter-candidate.webp',
    alt: 'Senior executive interviewer conducting a candidate screening and evaluation',
  },
  {
    id: 3,
    align: 'right', // Real corporate leadership team assembled on the left; text on the right
    eyebrow: '03 • INSTITUTIONAL ADVISORY',
    headlineMain: 'Governance Precision',
    headlineAccent: 'and Discretion',
    theme: 'editorial-italic',
    icon: Lock,
    description:
      'To provide corporate leaders with dependable talent intelligence, rigorous compliance governance, and bespoke workforce advisory that drives measurable enterprise advancement.',
    buttonText: 'Know More',
    buttonLink: '/profile/about-us',
    image: '/images/home/hero-strategy-conference.webp',
    alt: 'Executive corporate leadership team assembled for strategic advisory and governance conference',
  },
  {
    id: 4,
    align: 'right', // Authentic executive boardroom conference; text on the right
    eyebrow: '04 • WORKFORCE INTELLIGENCE',
    headlineMain: 'Strategic Workforce',
    headlineAccent: 'Advisory',
    theme: 'display-modern',
    icon: Compass,
    description:
      'Partner-led consultation, data-backed talent mapping, and direct integration with corporate compliance teams to achieve dependable operational outcomes across regulated sectors.',
    buttonText: 'Know More',
    buttonLink: '/partner-with-us',
    image: '/images/clients-meeting-room-v2.webp',
    alt: 'Corporate executives and advisors in institutional board meeting discussion',
  },
];

import { useSiteContent } from '../../context/SiteContentContext';

export default function HomeHero() {
  const { t } = useSiteContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [transitionKey, setTransitionKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = HERO_SLIDES.length;

  const slides = HERO_SLIDES.map((slide, idx) => {
    const key = `slide${idx + 1}`;
    return {
      ...slide,
      eyebrow: t(`home.hero.${key}.eyebrow`, slide.eyebrow),
      headlineMain: t(`home.hero.${key}.headlineMain`, slide.headlineMain),
      headlineAccent: t(`home.hero.${key}.headlineAccent`, slide.headlineAccent),
      description: t(`home.hero.${key}.description`, slide.description),
      buttonText: t(`home.hero.${key}.buttonText`, slide.buttonText),
    };
  });

  // Preload all 4 corporate people images
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  const changeSlide = useCallback((newIndex) => {
    if (newIndex === currentSlide) return;
    setPrevSlide(currentSlide);
    setCurrentSlide(newIndex);
    setTransitionKey((k) => k + 1);
    setIsTransitioning(true);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    changeSlide((currentSlide + 1) % totalSlides);
  }, [changeSlide, currentSlide, totalSlides]);

  const prevSlideAction = useCallback(() => {
    changeSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }, [changeSlide, currentSlide, totalSlides]);

  // Reset transition lock when the slower 1200ms shutter animation completes
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPrevSlide(null);
    }, 1220);
    return () => clearTimeout(timer);
  }, [transitionKey, isTransitioning]);

  // Auto-advance every 6 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="TECHORA Corporate Hero Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '85vh',
        aspectRatio: '16/9',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--navy-950)',
      }}
      className="hero-slider-root"
    >
      {/* 1. Slow, Professional Top-to-Bottom Shutter Screen Drop (1200ms) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isCurrent = idx === currentSlide;
          const isPrevious = idx === prevSlide;

          let zIndex = 1;
          let isVisible = false;
          let shouldAnimateShutter = false;

          if (isCurrent) {
            zIndex = 4;
            isVisible = true;
            shouldAnimateShutter = isTransitioning;
          } else if (isPrevious) {
            zIndex = 2; // Stays stationary below so new slide drops cleanly over it
            isVisible = true;
          }

          return (
            <div
              key={`${slide.id}-${isCurrent ? transitionKey : 'idle'}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${totalSlides}: ${slide.headlineMain} ${slide.headlineAccent}`}
              aria-hidden={!isCurrent}
              className={`hero-slide-pane ${shouldAnimateShutter ? 'slide-shutter-down' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex,
                visibility: isVisible ? 'visible' : 'hidden',
                opacity: isVisible ? 1 : 0,
                willChange: shouldAnimateShutter ? 'clip-path' : 'auto',
              }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                width="1920"
                height="1080"
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                className={shouldAnimateShutter ? 'slide-image-glider' : 'carousel-slide-img'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 35%',
                }}
              />

              {/* Directional Overlay: Tailored to each image's negative space so the people/faces side is 100% CRYSTAL CLEAR transparent */}
              <div
                className={`hero-slide-directional-overlay overlay-${slide.align}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })}

        {/* Shutter Leading Beam Line traveling strictly from top to bottom (1200ms) */}
        {isTransitioning && (
          <div key={`beam-${transitionKey}`} className="shutter-edge-beam" aria-hidden="true" />
        )}
      </div>

      {/* 2. Content Container: Bespoke typography and design per slide */}
      <div
        className="container hero-content-container"
        style={{
          position: 'relative',
          zIndex: 8,
          paddingTop: '64px',
          paddingBottom: '88px',
          width: '100%',
          display: 'flex',
          justifyContent: activeSlideData.align === 'right' ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          className={`hero-text-col hero-text-col-${activeSlideData.align}`}
          style={{
            maxWidth: '520px',
            width: '100%',
          }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            if (!isActive) return null;

            return (
              <div
                key={`text-${slide.id}-${transitionKey}`}
                className={`hero-slide-active-content theme-${slide.theme}`}
              >
                {/* Bespoke Headline Typography per Slide */}
                <h1 className={`hero-headline headline-${slide.theme}`}>
                  <span className="headline-main">{slide.headlineMain}</span>{' '}
                  <span className="headline-accent">{slide.headlineAccent}</span>
                </h1>

                {/* Bespoke Glass Card per Slide */}
                <div className={`hero-desc-glass-card card-${slide.theme}`}>
                  <p className="hero-desc-paragraph">
                    {slide.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="hero-btn-wrap">
                  <Link
                    to={slide.buttonLink}
                    className={`btn-hero-action btn-theme-${slide.theme}`}
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight size={15} style={{ marginLeft: '6px' }} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Transparent Glass Square Navigation Arrows (Slightly larger, frosted glass) */}
      <button
        type="button"
        onClick={prevSlideAction}
        className="ref-square-arrow ref-arrow-left"
        aria-label="Previous slide"
      >
        <ChevronLeft size={26} strokeWidth={2.4} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="ref-square-arrow ref-arrow-right"
        aria-label="Next slide"
      >
        <ChevronRight size={26} strokeWidth={2.4} />
      </button>

      <style>{`
        /* ==========================================================================
           1. SLOW & FULLY PROFESSIONAL TOP-TO-BOTTOM SHUTTER DROP (1200ms)
           ========================================================================== */
        @keyframes shutterDropSlow {
          0% {
            clip-path: inset(0 0 100% 0);
          }
          100% {
            clip-path: inset(0 0 0% 0);
          }
        }

        .slide-shutter-down {
          animation: shutterDropSlow 1200ms cubic-bezier(0.65, 0, 0.15, 1) forwards;
        }

        /* Subtle vertical counter-glide for deep 3D optical perspective */
        @keyframes imageDropGlide {
          0% {
            transform: scale(1.05) translateY(-24px);
          }
          100% {
            transform: scale(1.00) translateY(0);
          }
        }

        .slide-image-glider {
          animation: imageDropGlide 1200ms cubic-bezier(0.65, 0, 0.15, 1) forwards;
          will-change: transform;
        }

        /* Shutter Leading Beam Rail (Sweeps smoothly from top to bottom over 1200ms) */
        @keyframes shutterBeamTravelSlow {
          0% {
            top: 0%;
            opacity: 1;
          }
          96% {
            top: 100%;
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        .shutter-edge-beam {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            90deg,
            rgba(47, 164, 231, 0) 0%,
            rgba(47, 164, 231, 0.95) 15%,
            #FFFFFF 50%,
            rgba(47, 164, 231, 0.95) 85%,
            rgba(47, 164, 231, 0) 100%
          );
          box-shadow: 0 4px 24px rgba(47, 164, 231, 0.95), 0 2px 8px rgba(0, 0, 0, 0.7);
          pointer-events: none;
          z-index: 5;
          animation: shutterBeamTravelSlow 1200ms cubic-bezier(0.65, 0, 0.15, 1) forwards;
        }

        /* ==========================================================================
           2. DIRECTIONAL OVERLAYS (FACES ARE 100% UNTOUCHED AND BRIGHT)
           ========================================================================== */
        .overlay-left {
          background: linear-gradient(
            90deg,
            rgba(7, 20, 38, 0.95) 0%,
            rgba(7, 20, 38, 0.84) 34%,
            rgba(7, 20, 38, 0.18) 46%,
            transparent 54%
          );
        }

        .overlay-right {
          background: linear-gradient(
            270deg,
            rgba(7, 20, 38, 0.95) 0%,
            rgba(7, 20, 38, 0.84) 34%,
            rgba(7, 20, 38, 0.18) 46%,
            transparent 54%
          );
        }

        /* Gutter spacing to clear the side square arrows */
        .hero-text-col-left {
          margin-right: auto;
          margin-left: clamp(24px, 4.5vw, 64px);
          text-align: left;
        }

        .hero-text-col-right {
          margin-left: auto;
          margin-right: clamp(24px, 4.5vw, 64px);
          text-align: left;
        }

        /* ==========================================================================
           3. CHOREOGRAPHED TOP-TO-BOTTOM CASCADE
           ========================================================================== */
        @keyframes contentCascadeDown {
          0% {
            opacity: 0;
            transform: translateY(-24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-slide-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(14, 165, 233, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: #7dd3fc;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: contentCascadeDown 800ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both;
        }

        .eyebrow-icon {
          color: #38bdf8;
        }

        /* Base Headline */
        .hero-headline {
          margin-bottom: 20px;
          line-height: 1.15;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.85);
          text-wrap: balance;
          animation: contentCascadeDown 850ms cubic-bezier(0.16, 1, 0.3, 1) 160ms both;
        }

        /* Slide 1: Serif Prestige Typography */
        .headline-serif-prestige {
          font-family: var(--font-heading);
          font-size: clamp(2.3rem, 4.2vw, 3.65rem);
          font-weight: 700;
          color: #FFFFFF;
        }
        .headline-serif-prestige .headline-accent {
          color: #38bdf8;
          font-style: italic;
          display: block;
        }

        /* Slide 2: Geometric Vault Bold */
        .headline-geometric-vault {
          font-family: var(--font-body);
          font-size: clamp(2.05rem, 3.6vw, 3.15rem);
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.03em;
        }
        .headline-geometric-vault .headline-accent {
          color: #67e8f9;
          display: block;
        }

        /* Slide 3: Editorial Italic */
        .headline-editorial-italic {
          font-family: var(--font-heading);
          font-size: clamp(2.2rem, 3.9vw, 3.45rem);
          font-weight: 700;
          color: #FFFFFF;
        }
        .headline-editorial-italic .headline-accent {
          font-style: italic;
          color: #93c5fd;
          display: block;
        }

        /* Slide 4: Display Modern (Exact to image 1) */
        .headline-display-modern {
          font-family: var(--font-body);
          font-size: clamp(2.2rem, 3.9vw, 3.4rem);
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.02em;
        }
        .headline-display-modern .headline-accent {
          color: #FFFFFF;
          display: block;
        }

        /* ==========================================================================
           4. BESPOKE GLASS CARDS PER SLIDE
           ========================================================================== */
        .hero-desc-glass-card {
          margin-bottom: 26px;
          padding: 18px 22px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45);
          animation: contentCascadeDown 900ms cubic-bezier(0.16, 1, 0.3, 1) 280ms both;
        }

        /* Card 1: Top luminous border */
        .card-serif-prestige {
          background: rgba(7, 20, 38, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-top: 3px solid #38bdf8;
          border-radius: 4px;
        }

        /* Card 2: Cyan Vault Dual Border */
        .card-geometric-vault {
          background: rgba(11, 31, 58, 0.68);
          border: 1px solid rgba(103, 232, 249, 0.2);
          border-left: 4px solid #06b6d4;
          border-radius: 0 8px 8px 0;
        }

        /* Card 3: Minimal Frost with Soft Glow */
        .card-editorial-italic {
          background: rgba(7, 20, 38, 0.58);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-left: 3px solid #60a5fa;
          border-radius: 2px;
        }

        /* Card 4: High-contrast Blue Slate (Matches image 1) */
        .card-display-modern {
          background: rgba(7, 20, 38, 0.68);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-left: 3.5px solid #38bdf8;
          border-radius: 0 8px 8px 0;
        }

        .hero-desc-paragraph {
          font-family: var(--font-body);
          font-size: clamp(0.95rem, 1.35vw, 1.08rem);
          line-height: 1.62;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          text-wrap: pretty;
        }

        .hero-btn-wrap {
          animation: contentCascadeDown 900ms cubic-bezier(0.16, 1, 0.3, 1) 380ms both;
        }

        /* ==========================================================================
           5. PILL BUTTONS PER SLIDE
           ========================================================================== */
        .btn-hero-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #FFFFFF;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          padding: 12px 32px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
        }

        .btn-hero-action:hover {
          background-color: #FFFFFF;
          color: var(--navy-950);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .btn-theme-geometric-vault:hover {
          background-color: #06b6d4;
          border-color: #06b6d4;
          color: #071426;
        }

        .btn-theme-serif-prestige:hover {
          background-color: #38bdf8;
          border-color: #38bdf8;
          color: #071426;
        }

        /* ==========================================================================
           6. TRANSPARENT GLASS SQUARE ARROWS (Matches image 2, slightly bigger)
           ========================================================================== */
        .ref-square-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 15;
          width: 52px;
          height: 58px;
          border-radius: 4px;
          background: rgba(7, 20, 38, 0.42);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: #FFFFFF;
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ref-square-arrow:hover {
          background: rgba(47, 164, 231, 0.4);
          border-color: #38bdf8;
          color: #FFFFFF;
          transform: translateY(-50%) scale(1.06);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45), 0 0 20px rgba(56, 189, 248, 0.4);
        }

        .ref-arrow-left {
          left: 0;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .ref-arrow-right {
          right: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        @media (max-width: 900px) {
          .hero-slider-root {
            min-height: 75vh;
          }
          .hero-text-col-left,
          .hero-text-col-right {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
            max-width: 92%;
          }
          .hero-headline {
            font-size: 2.1rem !important;
          }
          .overlay-left,
          .overlay-right {
            background: linear-gradient(
              180deg,
              rgba(7, 20, 38, 0.7) 0%,
              rgba(7, 20, 38, 0.9) 70%,
              rgba(7, 20, 38, 0.98) 100%
            );
          }
          .ref-square-arrow {
            width: 44px;
            height: 48px;
          }
        }
      `}</style>
    </section>
  );
}
