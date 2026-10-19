import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Shield, RefreshCw, Send, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import ServiceIcon from './ServiceIcon';

const enquiryClientSchema = z.object({
  name: z.string().trim().min(2, 'Please provide your full name (at least 2 characters).'),
  company: z.string().trim().min(2, 'Please provide your company or organization name.'),
  email: z.string().trim().email('Please enter a valid corporate email address.'),
  mobile: z.string().trim().min(10, 'Please enter a valid 10-digit mobile number.'),
  service: z.string().trim().min(1, 'Please select an engagement practice service.'),
  message: z.string().trim().min(10, 'Please provide at least 10 characters describing your requirement.'),
});

export default function EnquiryModal({ isOpen, onClose, preselectedService = '', servicesList = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    mobile: '',
    service: preselectedService || 'Permanent Recruitment',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [serverError, setServerError] = useState('');

  // Update preselected service when prop changes
  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  // Handle escape key and body overflow
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setServerError('');
    setFormErrors({});
    if (submitSuccess) {
      setSubmitSuccess(null);
      setFormData({
        name: '',
        company: '',
        email: '',
        mobile: '',
        service: preselectedService || 'Permanent Recruitment',
        message: '',
      });
    }
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Zod Client-Side Validation
    const validationResult = enquiryClientSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors = {};
      validationResult.error.issues.forEach((err) => {
        const fieldName = err.path[0];
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = err.message;
        }
      });
      setFormErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          service: formData.service,
          message: formData.message.trim(),
          source_page: window.location.pathname + window.location.hash,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(data);
      } else {
        setServerError(data.error || 'Submission failed. Please check your information and try again.');
      }
    } catch (err) {
      console.error('Enquiry submission error:', err);
      setServerError('A network connectivity error occurred. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Group services if servicesList provided
  const recruitmentServices = servicesList.filter((s) => s.line === 'RECRUITMENT');
  const payrollServices = servicesList.filter((s) => s.line === 'PAYROLL');

  const isPayroll =
    /payroll|salary|payslip|pf|esi|attendance|settlement|leave/i.test(formData.service) ||
    payrollServices.some((p) => p.title.toLowerCase() === formData.service.toLowerCase());

  const matchedService = servicesList.find((s) => s.title.toLowerCase() === formData.service.toLowerCase());

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(7, 20, 38, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 2100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: 'var(--white)',
          borderRadius: '8px',
          border: '1px solid var(--line)',
          boxShadow: '0 24px 48px -12px rgba(7, 20, 38, 0.35)',
          padding: '32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
          <div>
            <div className="eyebrow-label" style={{ marginBottom: '4px' }}>
              PRACTICE MANDATE INTAKE
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--navy-900)', fontWeight: 700, margin: 0 }}>
              Service Consultation Enquiry
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-600)', marginTop: '4px', marginBottom: 0 }}>
              Engage with TECHORA practice directors for retained recruitment and statutory payroll solutions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: '6px',
              color: 'var(--ink-600)',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Confirmation View */}
        {submitSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#F0FDF4',
                border: '2px solid #86EFAC',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <span
              style={{
                display: 'inline-block',
                fontFamily: 'monospace',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--navy-900)',
                backgroundColor: 'var(--mist)',
                border: '1px solid var(--line)',
                padding: '6px 14px',
                borderRadius: '4px',
                marginBottom: '16px',
              }}
            >
              REF: {submitSuccess.referenceNo}
            </span>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
              Mandate Intake Received
            </h3>

            <p style={{ fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 24px' }}>
              {submitSuccess.message || 'Your inquiry has been securely registered in the TECHORA ATS repository. A senior practice partner will contact you directly within 24 hours.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn-navy"
                style={{ padding: '10px 24px', fontSize: '0.875rem' }}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {serverError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  color: '#991B1B',
                  fontSize: '0.875rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Row 1: Name & Company */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '6px' }}>
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arun Kumar"
                  value={formData.name}
                  onChange={handleChange('name')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    border: `1px solid ${formErrors.name ? '#EF4444' : 'var(--line)'}`,
                    outline: 'none',
                    backgroundColor: 'var(--white)',
                  }}
                />
                {formErrors.name && (
                  <span style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                    {formErrors.name}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '6px' }}>
                  Company / Organization <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Enterprises Pvt Ltd"
                  value={formData.company}
                  onChange={handleChange('company')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    border: `1px solid ${formErrors.company ? '#EF4444' : 'var(--line)'}`,
                    outline: 'none',
                    backgroundColor: 'var(--white)',
                  }}
                />
                {formErrors.company && (
                  <span style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                    {formErrors.company}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Email & Mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '6px' }}>
                  Business Email <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@company.in"
                  value={formData.email}
                  onChange={handleChange('email')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    border: `1px solid ${formErrors.email ? '#EF4444' : 'var(--line)'}`,
                    outline: 'none',
                    backgroundColor: 'var(--white)',
                  }}
                />
                {formErrors.email && (
                  <span style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                    {formErrors.email}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '6px' }}>
                  Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={handleChange('mobile')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    border: `1px solid ${formErrors.mobile ? '#EF4444' : 'var(--line)'}`,
                    outline: 'none',
                    backgroundColor: 'var(--white)',
                  }}
                />
                {formErrors.mobile && (
                  <span style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                    {formErrors.mobile}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3: Selected Service of Interest (Directly selected - no dropdown) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                  Selected Service of Interest <span style={{ color: '#0F7FC4' }}>• Direct Engagement</span>
                </label>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: isPayroll ? '#F0FDF4' : '#EFF6FF',
                    color: isPayroll ? '#166534' : '#1E40AF',
                    border: `1px solid ${isPayroll ? '#BBF7D0' : '#BFDBFE'}`,
                  }}
                >
                  {isPayroll ? 'Payroll Practice' : 'Recruitment Practice'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#FAF8F5',
                  border: '1.5px solid var(--sky-500)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(15, 127, 196, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      backgroundColor: isPayroll ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 127, 196, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ServiceIcon
                      name={matchedService?.icon || (isPayroll ? 'Calculator' : 'UserCheck')}
                      size={20}
                      color={isPayroll ? '#059669' : 'var(--sky-600)'}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--navy-900)',
                        lineHeight: 1.25,
                      }}
                    >
                      {formData.service}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink)', marginTop: '2px' }}>
                      {matchedService?.description ||
                        (isPayroll
                          ? 'Accurate execution, statutory PF & ESI compliance, and audit records.'
                          : 'Full-cycle talent acquisition, executive search, and staffing solutions.')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, color: 'var(--sky-600)', fontSize: '0.78rem', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  <span>Selected</span>
                </div>
              </div>
              <input type="hidden" name="service" value={formData.service} />
            </div>

            {/* Row 4: Message */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '6px' }}>
                Requirement Details / Message <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Please summarize your talent search parameters, headcounts, payroll size, or timeline..."
                value={formData.message}
                onChange={handleChange('message')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.875rem',
                  borderRadius: '4px',
                  border: `1px solid ${formErrors.message ? '#EF4444' : 'var(--line)'}`,
                  outline: 'none',
                  backgroundColor: 'var(--white)',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              {formErrors.message && (
                <span style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                  {formErrors.message}
                </span>
              )}
            </div>

            {/* Institutional Assurance Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--ink-600)',
                backgroundColor: 'var(--mist)',
                padding: '10px 14px',
                borderRadius: '4px',
                border: '1px solid var(--line)',
              }}
            >
              <Shield size={14} color="var(--sky-600)" style={{ flexShrink: 0 }} />
              <span>Strict Non-Disclosure Governance. Your corporate information is shared solely with senior practice directors.</span>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--navy-900)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-navy"
                style={{
                  padding: '10px 24px',
                  fontSize: '0.875rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.8 : 1,
                }}
              >
                {submitting ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Submitting Mandate...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
