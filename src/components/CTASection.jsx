import React from 'react';
import Button from './Button';

export default function CTASection({
  eyebrow = 'Strategic Partnerships',
  title = 'Ready to elevate your leadership bench or streamline payroll compliance?',
  description = 'Consult with a TECHORA Senior Principal to discuss custom corporate talent acquisition or statutory payroll management.',
  primaryActionText = 'Schedule Corporate Consultation',
  onPrimaryAction,
  secondaryActionText = 'Explore Sector Expertise',
  secondaryActionTo = '/expertise/industries',
}) {
  return (
    <section 
      style={{
        backgroundColor: 'var(--mist)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        padding: '88px 0',
      }}
    >
      <div className="container" style={{ textAlign: 'left', maxWidth: '960px' }}>
        {eyebrow && (
          <div className="eyebrow-label" style={{ marginBottom: '12px' }}>
            {eyebrow}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--fs-section-title)', color: 'var(--navy-900)', lineHeight: 'var(--lh-section-title)' }}>
            {title}
          </h2>
          <span className="accent-line" style={{ flexShrink: 0 }} />
        </div>

        {description && (
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-600)', lineHeight: 1.68, marginBottom: '32px' }}>
            {description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
          <Button variant="primary" onClick={onPrimaryAction}>
            {primaryActionText}
          </Button>
          {secondaryActionTo && (
            <Button variant="text" to={secondaryActionTo}>
              {secondaryActionText} &rarr;
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
