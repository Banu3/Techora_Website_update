import React, { useState, useEffect } from 'react';
import Button from '../Button';
import FormField from '../FormField';
import { CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export default function IndustryEnquiryForm({
  selectedIndustry = '',
  industriesList = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: selectedIndustry || '',
    service_interest: 'Recruitment & Talent Acquisition',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  useEffect(() => {
    if (selectedIndustry) {
      setFormData((prev) => ({
        ...prev,
        industry: selectedIndustry,
        message: prev.message || `Requesting preliminary consultation regarding ${selectedIndustry} workforce parameters.`,
      }));
    }
  }, [selectedIndustry]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please provide your full name, business email, and requirements.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        service: formData.service_interest,
        service_interest: formData.service_interest,
        project_scope: formData.industry ? `Industry Mandate: ${formData.industry}` : 'General Sector Mandate',
        message: formData.industry
          ? `[Industry: ${formData.industry}] ${formData.message}`
          : formData.message,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: 'success',
          message: data.message || 'Industry consultation request securely received. A sector specialist will review your details promptly.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          industry: selectedIndustry || '',
          service_interest: 'Recruitment & Talent Acquisition',
          message: '',
        });
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
      id="industry-enquiry"
      style={{
        backgroundColor: 'var(--navy-900)',
        color: 'var(--white)',
        padding: '96px 0',
      }}
      aria-label="Industry Sector Consultation Enquiry"
    >
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Context */}
          <div>
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
              Sector Mandate
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.9rem, 3.2vw, 2.65rem)',
                fontWeight: 800,
                color: 'var(--white)',
                lineHeight: 1.25,
                letterSpacing: '-0.025em',
                marginBottom: '18px',
              }}
            >
              Discuss Your Industry Requirements
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '28px',
              }}
            >
              Whether structuring a confidential leadership search or reviewing payroll operations for a specialized workforce, our sector practice partners provide objective guidance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="var(--sky-500)" />
                <span>Strict institutional non-disclosure and mandate discretion</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--sky-500)" />
                <span>Direct consultation with practice principals</span>
              </div>
            </div>
          </div>

          {/* Right Form Container */}
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
                marginBottom: '6px',
              }}
            >
              Initiate Sector Consultation
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-600)', marginBottom: '20px' }}>
              Submit your operational context to receive a structured response.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FormField
                label="Full Name"
                id="ind-name"
                placeholder="e.g. David Vance"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormField
                  label="Corporate Email"
                  id="ind-email"
                  type="email"
                  placeholder="name@enterprise.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                />
                <FormField
                  label="Organization"
                  id="ind-company"
                  placeholder="Enterprise Ltd"
                  value={formData.company}
                  onChange={handleChange('company')}
                />
              </div>

              {/* Industry Selector / Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="ind-sector"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                  }}
                >
                  Sector Specialization
                </label>
                <select
                  id="ind-sector"
                  value={formData.industry}
                  onChange={handleChange('industry')}
                  style={{
                    padding: '10px 12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--navy-900)',
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: '2px',
                    outline: 'none',
                  }}
                >
                  <option value="">Select or specify industry...</option>
                  {industriesList.map((ind) => (
                    <option key={ind.slug} value={ind.name}>
                      {ind.name}
                    </option>
                  ))}
                  <option value="General Corporate Sector">Other Corporate Sector</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="ind-msg"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                  }}
                >
                  Workforce &amp; Practice Objectives *
                </label>
                <textarea
                  id="ind-msg"
                  rows={3}
                  required
                  placeholder="Outline key operational objectives, scale, and functional priorities..."
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
                {submitting ? 'Transmitting Request...' : 'Submit Industry Enquiry'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
