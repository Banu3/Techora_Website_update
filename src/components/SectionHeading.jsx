import React from 'react';

/**
 * SectionHeading Component — 5 Reusable Distinct Architectural Heading Variants:
 *  - 'index' (A): "01" + 48px sky line + small caps label, then heading
 *  - 'rule' (B): 4px x 56px sky vertical bar left of heading, with label above
 *  - 'ghost' (C): Huge outlined numeral (1px navy at 10%) behind the heading
 *  - 'ornament' (D): Centered ornament with diamond and double thin rules (Welcome & Final CTA)
 *  - 'on-dark' (E): White heading, sky label, full-width white 25% hairline below
 */
export default function SectionHeading({
  variant = 'index',
  index = '01',
  label = '',
  title = '',
  italicWord = '',
  subtitle = '',
  align = 'left',
  style = {},
  className = '',
  children,
}) {
  // Helper to render title with one key word in italic Fraunces
  const renderTitle = (titleText, wordToItalicize, isDark = false) => {
    if (!wordToItalicize || !titleText.includes(wordToItalicize)) {
      return titleText;
    }
    const parts = titleText.split(wordToItalicize);
    return (
      <>
        {parts[0]}
        <em
          style={{
            fontStyle: 'italic',
            fontFamily: 'var(--font-heading)',
            color: isDark ? 'var(--sky-500)' : 'var(--sky-600)',
            fontWeight: 'inherit',
          }}
        >
          {wordToItalicize}
        </em>
        {parts[1]}
      </>
    );
  };

  // VARIANT A: Index ("01" + 48px sky line + small caps label, then heading)
  if (variant === 'index') {
    return (
      <div className={`section-heading variant-index ${className}`} style={{ marginBottom: '28px', ...style }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--sky-600)',
              letterSpacing: '0.04em',
            }}
          >
            {index}
          </span>
          <span
            style={{
              display: 'inline-block',
              width: '48px',
              height: '2px',
              backgroundColor: 'var(--sky-500)',
            }}
          />
          {label && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-600)',
              }}
            >
              {label}
            </span>
          )}
        </div>
        <h2
          style={{
            fontSize: 'var(--fs-section-title)',
            lineHeight: 1.12,
            color: 'var(--navy-900)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          {renderTitle(title, italicWord, false)}
        </h2>
        {subtitle && (
          <p style={{ marginTop: '14px', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.65 }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    );
  }

  // VARIANT B: Rule (4px x 56px sky vertical bar left of heading, with label above)
  if (variant === 'rule') {
    return (
      <div className={`section-heading variant-rule ${className}`} style={{ marginBottom: '28px', ...style }}>
        {label && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--sky-600)',
              marginBottom: '10px',
            }}
          >
            {label}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '4px',
              height: '56px',
              backgroundColor: 'var(--sky-500)',
              borderRadius: '2px',
              flexShrink: 0,
              marginTop: '4px',
            }}
          />
          <div>
            <h2
              style={{
                fontSize: 'var(--fs-section-title)',
                lineHeight: 1.12,
                color: 'var(--navy-900)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              {renderTitle(title, italicWord, false)}
            </h2>
            {subtitle && (
              <p style={{ marginTop: '12px', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.65 }}>
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  }

  // VARIANT C: Ghost Numeral (huge outlined numeral 1px navy at 10% behind the heading)
  if (variant === 'ghost') {
    const isDark = style?.color === 'white' || className.includes('on-dark') || className.includes('dark');
    return (
      <div
        className={`section-heading variant-ghost ${className}`}
        style={{ position: 'relative', marginBottom: '28px', overflow: 'hidden', paddingTop: '10px', ...style }}
      >
        <span
          style={{
            position: 'absolute',
            top: '-20px',
            right: '20px',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(5rem, 10vw, 8.5rem)',
            fontWeight: 800,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: isDark ? '1px rgba(255, 255, 255, 0.18)' : '1px rgba(11, 31, 58, 0.12)',
            userSelect: 'none',
            zIndex: 0,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {index}
        </span>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {label && (
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: isDark ? 'var(--sky-500)' : 'var(--sky-600)',
                marginBottom: '10px',
              }}
            >
              {label}
            </div>
          )}
          <h2
            style={{
              fontSize: 'var(--fs-section-title)',
              lineHeight: 1.12,
              color: isDark ? 'var(--white)' : 'var(--navy-900)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {renderTitle(title, italicWord, isDark)}
          </h2>
          {subtitle && (
            <p style={{ marginTop: '14px', fontSize: '1rem', color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'var(--ink)', lineHeight: 1.65 }}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    );
  }

  // VARIANT D: Ornament (Centered, diamond + double thin rules, used for Welcome to TECHORA and final CTA)
  if (variant === 'ornament') {
    const isDark = style?.color === 'white' || className.includes('on-dark') || className.includes('dark');
    return (
      <div
        className={`section-heading variant-ornament ${className}`}
        style={{ textAlign: 'center', margin: '0 auto 36px auto', maxWidth: '780px', ...style }}
      >
        {label && (
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: isDark ? 'var(--sky-500)' : 'var(--sky-600)',
              marginBottom: '6px',
            }}
          >
            {label}
          </div>
        )}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
            lineHeight: 1.12,
            color: isDark ? 'var(--white)' : 'var(--navy-900)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '18px',
          }}
        >
          {renderTitle(title, italicWord, isDark)}
        </h2>

        {/* Double thin rule with center sky-blue diamond */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '14px 0 20px 0' }}>
          <span style={{ width: '64px', height: '1px', backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'var(--line)' }} />
          <span
            style={{
              width: '7px',
              height: '7px',
              backgroundColor: 'var(--sky-500)',
              transform: 'rotate(45deg)',
              display: 'inline-block',
            }}
          />
          <span style={{ width: '64px', height: '1px', backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'var(--line)' }} />
        </div>

        {subtitle && (
          <p
            style={{
              fontSize: '1.125rem',
              color: isDark ? 'rgba(255,255,255,0.85)' : 'var(--ink)',
              lineHeight: 1.7,
              maxWidth: '62ch',
              margin: '0 auto',
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    );
  }

  // VARIANT E: On-Dark (white heading, sky label, full-width white 25% hairline below)
  if (variant === 'on-dark') {
    return (
      <div className={`section-heading variant-on-dark ${className}`} style={{ marginBottom: '32px', ...style }}>
        {label && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--sky-500)',
              marginBottom: '10px',
            }}
          >
            {label}
          </div>
        )}
        <h2
          style={{
            fontSize: 'var(--fs-section-title)',
            lineHeight: 1.12,
            color: 'var(--white)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
          }}
        >
          {renderTitle(title, italicWord, true)}
        </h2>
        {/* Full-width 25% white hairline */}
        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.25)', marginBottom: '20px' }} />
        {subtitle && (
          <p style={{ marginTop: '12px', fontSize: '1.0625rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.65 }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    );
  }

  return null;
}
