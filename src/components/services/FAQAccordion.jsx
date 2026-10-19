import React, { useState, useRef } from 'react';
import SectionLabel from '../profile/SectionLabel';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({
  sectionNumber = '08',
  label = 'Frequently Asked Questions',
  heading = 'Clarifying Mandate Parameters & Engagement Logistics',
  faqs = [],
  includeJsonLd = true,
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const buttonRefs = useRef([]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % faqs.length;
      buttonRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + faqs.length) % faqs.length;
      buttonRefs.current[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttonRefs.current[faqs.length - 1]?.focus();
    }
  };

  const faqSchema = includeJsonLd && faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <section
      id="faqs"
      style={{
        backgroundColor: 'var(--white)',
        padding: '96px 0',
        borderBottom: '1px solid var(--line)',
      }}
      aria-label="Frequently Asked Questions"
    >
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container" style={{ maxWidth: '920px' }}>
        <div style={{ marginBottom: '44px' }}>
          <SectionLabel num={sectionNumber} label={label} />
          {heading && (
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.8vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--navy-900)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginTop: '8px',
              }}
            >
              {heading}
            </h2>
          )}
        </div>

        <div
          style={{
            borderTop: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-btn-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div
                key={index}
                style={{
                  borderBottom: '1px solid var(--line)',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <h3>
                  <button
                    ref={(el) => (buttonRefs.current[index] = el)}
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleFAQ(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      padding: '24px 8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      gap: '16px',
                      color: isOpen ? 'var(--navy-900)' : 'var(--ink-600)',
                      transition: 'color 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid var(--sky-500)';
                      e.currentTarget.style.outlineOffset = '2px';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none';
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.05rem, 1.4vw, 1.2rem)',
                        fontWeight: 700,
                        color: isOpen ? 'var(--navy-900)' : 'var(--navy-900)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {faq.question}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '2px',
                        backgroundColor: isOpen ? 'var(--sky-100)' : 'var(--mist-50)',
                        color: isOpen ? 'var(--navy-900)' : 'var(--ink-600)',
                        flexShrink: 0,
                        transition: 'transform 0.25s ease, background-color 0.2s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                      }}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  style={{
                    padding: isOpen ? '0 8px 26px 8px' : '0 8px',
                    display: isOpen ? 'block' : 'none',
                  }}
                >
                  <p
                    style={{
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      color: 'var(--ink-600)',
                      margin: 0,
                      maxWidth: '78ch',
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
