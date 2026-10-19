import React, { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { contactConfig } from '../config/contactConfig';
import { ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Privacy({ onOpenConsultModal }) {
  useEffect(() => {
    document.title = 'Privacy & Data Protection Policy | TECHORA Consultant';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'TECHORA data governance, candidate resume privacy, institutional enquiry protection standards, and statutory retention policy.';

    // Inject JSON-LD Breadcrumbs
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://techoraconsultant.com/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Privacy Policy', 'item': 'https://techoraconsultant.com/privacy' }
      ]
    });
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '80vh' }}>
      <PageHeader
        eyebrow="Governance &amp; Statutory Compliance"
        title="Privacy &amp; Data Protection Policy"
        subtitle="Our institutional framework governing candidate credentials, client confidentiality, and data retention standards."
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <section style={{ padding: '64px 0 96px 0' }}>
        <div className="container">
          {/* Statutory Legal Notice Alert */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              padding: '20px 24px',
              backgroundColor: 'var(--mist)',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              marginBottom: '48px',
            }}
          >
            <ShieldCheck size={24} color="var(--sky-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '4px' }}>
                Statutory Counsel Notice
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--body-text)', margin: 0, lineHeight: 1.6 }}>
                This policy outlines TECHORA Consultant’s current operational data handling architectures. [Formal statutory counsel review scheduled prior to next regulatory cycle]. All submissions remain governed under professional non-disclosure standards.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px',
              maxWidth: '960px',
            }}
          >
            {/* Main Content Column */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <article>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '14px' }}>
                    1. Fiduciary Commitment to Discretion
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--body-text)', lineHeight: 1.7, marginBottom: '12px' }}>
                    TECHORA Consultant operates as a fiduciary advisor in executive talent placement, institutional restructuring, and statutory payroll compliance. We strictly treat all received resumes, executive biographies, client mandates, and compensation figures as confidential commercial materials.
                  </p>
                </article>

                <article>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '14px' }}>
                    2. Candidate Applications &amp; Resume Ingestion
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--body-text)', lineHeight: 1.7, marginBottom: '12px' }}>
                    When you submit your curriculum vitae or resume through TECHORA’s candidate mandate portal:
                  </p>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9375rem', color: 'var(--body-text)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>
                      <strong>Private Isolated Storage:</strong> Resumes are saved in a protected, non-public directory with randomized UUID filenames and are never served statically.
                    </li>
                    <li>
                      <strong>Automated In-Memory Parsing:</strong> File contents are processed strictly in-memory to assist your form entry. Unconfirmed fields remain blank and demographic categories (gender, date of birth) are never inferred.
                    </li>
                    <li>
                      <strong>Zero Third-Party Distribution:</strong> Your candidate credentials will never be broadcast or presented to client organizations without your explicit prior authorization.
                    </li>
                  </ul>
                </article>

                <article>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '14px' }}>
                    3. Corporate Client Inquiries &amp; Mandate Briefs
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--body-text)', lineHeight: 1.7, marginBottom: '12px' }}>
                    Information provided via the Partner With Us mandate portal is routed strictly to senior practice directors. Communications are covered by pre-engagement non-disclosure protocols to protect organizational restructuring, confidential searches, and compliance audits.
                  </p>
                </article>

                <article>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '14px' }}>
                    4. Statutory Retention Periods
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--body-text)', lineHeight: 1.7, marginBottom: '12px' }}>
                    In accordance with governance standards, candidate submissions and partnership inquiries are retained for a maximum of <strong>{contactConfig.retentionDays} days</strong> (12 calendar months) from initial receipt, after which they are systematically purged via automated retention scripts.
                  </p>
                </article>

                <article>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '14px' }}>
                    5. Right to Erasure &amp; Access Requests
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--body-text)', lineHeight: 1.7, marginBottom: '12px' }}>
                    You hold the unconditional right to request an extract of stored records or demand the immediate, verified erasure of your resume and application history. Direct all data subject requests to our compliance desk:
                  </p>
                  <div
                    style={{
                      padding: '16px 20px',
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--line)',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: 'var(--navy-900)',
                    }}
                  >
                    Compliance Desk: {contactConfig.privacyEmail}
                  </div>
                </article>
              </div>
            </div>

            {/* Sidebar Metadata */}
            <div>
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  padding: '28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Lock size={18} color="var(--sky-500)" />
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--navy-900)' }}>
                    Policy Meta
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--ink-600)', display: 'block', fontSize: '0.75rem' }}>Effective Version</span>
                    <strong style={{ color: 'var(--navy-900)' }}>v1.4 (October 2026)</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--ink-600)', display: 'block', fontSize: '0.75rem' }}>Operating Legal Entity</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{contactConfig.legalEntity}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--ink-600)', display: 'block', fontSize: '0.75rem' }}>Statutory Retention</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{contactConfig.retentionDays} Days</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--ink-600)', display: 'block', fontSize: '0.75rem' }}>Governance Hub</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{contactConfig.headquarters.city}, {contactConfig.headquarters.country}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
