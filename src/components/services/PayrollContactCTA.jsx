import React, { useState } from 'react';
import Button from '../Button';
import FormField from '../FormField';
import { CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export default function PayrollContactCTA({
  id = 'contact-section',
  eyebrow = 'Workforce Payroll Administration',
  heading = 'Discuss Payroll Requirements',
  subheading = 'Connect with our operations team to evaluate administrative payroll support for your organization.',
  serviceKey = 'Payroll Administration & Records',
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please provide your name, corporate email, and requirements.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: serviceKey,
          service_interest: serviceKey,
          project_scope: 'Payroll Operations Assessment',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: 'success',
          message: data.message || 'Payroll enquiry received. A workforce specialist will review your details promptly.',
        });
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Submission failed. Please verify your details or try again.',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network error. Please try again or reach our team directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id={id}
      style={{
        backgroundColor: 'var(--navy-900)',
        color: 'var(--white)',
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Payroll Enquiry Section"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Context & Assurances */}
          <div>
            {eyebrow && (
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--sky-500)',
                  marginBottom: '14px',
                }}
              >
                {eyebrow}
              </div>
            )}

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                fontWeight: 800,
                color: 'var(--white)',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                marginBottom: '18px',
              }}
            >
              {heading}
            </h2>

            {subheading && (
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '32px',
                  maxWidth: '52ch',
                }}
              >
                {subheading}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                <Shield size={16} color="var(--sky-500)" />
                <span>Strict non-disclosure and employee compensation confidentiality</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} color="var(--sky-500)" />
                <span>Standardized 24-business-hour response from senior operations team</span>
              </div>
            </div>
          </div>

          {/* Right Column: Short Enquiry Form */}
          <div
            style={{
              backgroundColor: 'var(--white)',
              padding: 'clamp(28px, 4vw, 40px)',
              borderRadius: '2px',
              border: '1px solid var(--line)',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--navy-900)',
                marginBottom: '8px',
              }}
            >
              Request Payroll Assessment
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-600)', marginBottom: '22px' }}>
              Submit your organizational requirements for a structured operations review.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormField
                label="Full Name"
                id="payroll-name"
                placeholder="e.g. Eleanor Vance"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormField
                  label="Corporate Email"
                  id="payroll-email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                />
                <FormField
                  label="Company Name"
                  id="payroll-company"
                  placeholder="Enterprise Ltd"
                  value={formData.company}
                  onChange={handleChange('company')}
                />
              </div>

              <FormField
                label="Direct Phone (Optional)"
                id="payroll-phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange('phone')}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="payroll-msg"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                  }}
                >
                  Payroll Scope &amp; Workforce Count *
                </label>
                <textarea
                  id="payroll-msg"
                  rows={3}
                  required
                  placeholder="Briefly state workforce scale, frequency (e.g. monthly), and current processing model..."
                  value={formData.message}
                  onChange={handleChange('message')}
                  style={{
                    padding: '10px 12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--navy-900)',
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: '2px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--sky-500)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--line)';
                  }}
                />
              </div>

              {status.message && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '2px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    backgroundColor: status.type === 'success' ? '#EDF7ED' : '#FDEDED',
                    color: status.type === 'success' ? '#1E4620' : '#5F2120',
                    border: `1px solid ${status.type === 'success' ? '#C8E6C9' : '#FFCDD2'}`,
                  }}
                  role="alert"
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 size={16} color="#2E7D32" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <AlertCircle size={16} color="#D32F2F" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
              >
                {submitting ? 'Transmitting Mandate...' : 'Submit Payroll Enquiry'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
