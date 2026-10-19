import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowRight,
  Briefcase,
  Users,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import contactConfig from '../config/contact.config';
import SectionHeading from '../components/SectionHeading';
import { isValidIndianMobile } from '../utils/indiaFormat';

const COUNTRY_DIAL_CODES = [
  { code: '+91', country: 'India (+91)' },
  { code: '+1', country: 'USA / Canada (+1)' },
  { code: '+44', country: 'United Kingdom (+44)' },
  { code: '+971', country: 'UAE (+971)' },
  { code: '+61', country: 'Australia (+61)' },
  { code: '+49', country: 'Germany (+49)' },
  { code: '+33', country: 'France (+33)' },
  { code: '+81', country: 'Japan (+81)' },
];

export default function PartnerWithUs({ onOpenConsultModal }) {
  const [searchParams] = useSearchParams();

  const prefillService = searchParams.get('service') || 'recruitment';
  const prefillIndustry = searchParams.get('industry') || '';

  const [formStartTimestamp] = useState(Date.now());
  const [dialCode, setDialCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company_name: '',
    designation: '',
    service: ['recruitment', 'payroll', 'other'].includes(prefillService) ? prefillService : 'recruitment',
    company_location: '',
    industry: prefillIndustry,
    message: '',
    consent: false,

    // Conditional Recruitment fields
    recruitment_roles: '',
    recruitment_openings: '1–3 Mandates',
    recruitment_timeline: 'Immediate (< 30 days)',

    // Conditional Payroll fields
    payroll_headcount: '50–250 Employees',
    payroll_software: '',

    // Honeypot
    website_hp: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Partner With TECHORA Consultant | Corporate Advisory Intake';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Submit your executive recruitment, statutory payroll compliance, or workforce restructuring inquiry for partner-level consultation.';
  }, []);

  const getE164Phone = () => {
    const rawDigits = phoneNumber.replace(/\D/g, '');
    if (!rawDigits) return '';
    return `${dialCode}${rawDigits}`;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) errors.full_name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errors.email = 'Please provide your business email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@company.in).';
    }

    if (!phoneNumber.trim()) {
      errors.phone = 'Please provide a contact phone number.';
    } else if (dialCode === '+91' && !isValidIndianMobile(phoneNumber)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.designation.trim()) errors.designation = 'Please enter your corporate designation.';
    if (!formData.company_name.trim()) errors.company_name = 'Please provide your company or organizational name.';
    if (!formData.company_location.trim()) errors.company_location = 'Please state your city / location.';

    if (formData.message.trim().length < 20) {
      errors.message = 'Please provide at least 20 characters describing your inquiry.';
    }

    if (!formData.consent) {
      errors.consent = 'You must grant consent to proceed with this consultation request.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    const phoneE164 = getE164Phone();

    let requirements = {};
    if (formData.service === 'recruitment') {
      requirements = {
        roles: formData.recruitment_roles,
        openings: formData.recruitment_openings,
        timeline: formData.recruitment_timeline,
      };
    } else if (formData.service === 'payroll') {
      requirements = {
        headcount_range: formData.payroll_headcount,
        current_software: formData.payroll_software,
      };
    } else {
      requirements = {
        consultation_type: 'General Corporate Consultation & Restructuring',
      };
    }

    const submissionTimeMs = Date.now() - formStartTimestamp;
    setSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone_e164: phoneE164,
          company_name: formData.company_name.trim(),
          designation: formData.designation.trim(),
          service: formData.service,
          company_location: formData.company_location.trim(),
          industry: formData.industry,
          requirements,
          message: formData.message.trim(),
          source_page: '/partner-with-us',
          consent: formData.consent ? '1' : '0',
          website_hp: formData.website_hp,
          submission_time_ms: submissionTimeMs,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(data);
      } else {
        setErrorMessage(data.error || 'Failed to submit inquiry. Please check your entries and try again.');
      }
    } catch (err) {
      setErrorMessage('Network error encountered. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* 1. Full-Bleed Hero (partner-handshake-topdown) */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--navy-950)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <img
            src="/images/partner-handshake-topdown.webp"
            alt="Top-down business handshake over corporate consulting documentation and laptop"
            width="2400"
            height="1350"
            fetchPriority="high"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>

        {/* Directional Navy Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(7, 20, 38, 0.94) 0%, rgba(7, 20, 38, 0.78) 50%, rgba(7, 20, 38, 0.35) 85%)',
            zIndex: 2,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 3, paddingTop: '64px', paddingBottom: '64px' }}>
          <div style={{ maxWidth: '680px' }}>
            <SectionHeading
              variant="on-dark"
              label="Corporate Engagement"
              title="Partner With TECHORA Consultant"
              italicWord="Consultant"
              subtitle="Initiate a direct consultation for executive search, statutory payroll support, or strategic organizational advisory."
            />
          </div>
        </div>
      </section>

      {/* Main Split Section: Form on Left (60%), Sticky Info Panel on Right (40%) */}
      <section style={{ paddingTop: '64px' }}>
        <div className="container">
          {submitSuccess ? (
            /* Success Panel with Reference Number */
            <div
              style={{
                maxWidth: '680px',
                margin: '0 auto',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '6px',
                padding: '48px',
                textAlign: 'center',
                boxShadow: '0 16px 36px rgba(7, 20, 38, 0.06)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(15, 127, 196, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                <CheckCircle2 size={36} color="var(--sky-600)" />
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--sky-600)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '8px',
                }}
              >
                Inquiry Received
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  color: 'var(--navy-900)',
                  marginBottom: '16px',
                }}
              >
                Thank You, {formData.full_name}
              </h2>

              <p style={{ fontSize: '1.0625rem', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '28px' }}>
                Your mandate brief for <strong style={{ color: 'var(--navy-900)' }}>{formData.company_name}</strong> has been securely logged with our consulting team.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--mist)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  padding: '16px 24px',
                  marginBottom: '32px',
                  display: 'inline-block',
                }}
              >
                <span style={{ fontSize: '0.875rem', color: 'var(--ink)', marginRight: '8px' }}>Reference Number:</span>
                <strong style={{ fontFamily: 'monospace', fontSize: '1.125rem', color: 'var(--navy-900)' }}>
                  {submitSuccess.reference_no}
                </strong>
              </div>

              <div>
                <Link to="/" className="btn-navy" style={{ padding: '13px 28px' }}>
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 1fr)',
                gap: '48px',
                alignItems: 'start',
              }}
              className="partner-split-grid"
            >
              {/* Left Column: 4 Numbered Fieldsets Form (60%) */}
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '40px',
                  boxShadow: '0 8px 28px rgba(7, 20, 38, 0.04)',
                }}
              >
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="website_hp"
                    value={formData.website_hp}
                    onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                    style={{ display: 'none' }}
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  {/* FIELDSET 1: ABOUT YOU */}
                  <fieldset style={{ border: 'none', padding: 0, margin: '0 0 36px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--navy-900)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                        }}
                      >
                        1
                      </span>
                      <legend
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--navy-900)',
                          margin: 0,
                        }}
                      >
                        About You
                      </legend>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                      <div>
                        <label className="field-label">
                          Full Name <span className="req-marker">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="e.g. Arun Kumar"
                          className="partner-input-52"
                        />
                        {formErrors.full_name && <div className="field-error">{formErrors.full_name}</div>}
                      </div>

                      <div>
                        <label className="field-label">
                          Business Email <span className="req-marker">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.in"
                          className="partner-input-52"
                        />
                        {formErrors.email && <div className="field-error">{formErrors.email}</div>}
                      </div>

                      <div>
                        <label className="field-label">
                          Mobile Number <span className="req-marker">*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select
                            value={dialCode}
                            onChange={(e) => setDialCode(e.target.value)}
                            style={{
                              width: '96px',
                              height: '52px',
                              borderRadius: '6px',
                              border: '1px solid var(--line)',
                              backgroundColor: 'var(--white)',
                              fontSize: '14px',
                              padding: '0 8px',
                              fontFamily: 'var(--font-body)',
                              color: 'var(--navy-900)',
                            }}
                          >
                            {COUNTRY_DIAL_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="98765 43210"
                            className="partner-input-52"
                            style={{ flex: 1 }}
                          />
                        </div>
                        {formErrors.phone && <div className="field-error">{formErrors.phone}</div>}
                      </div>

                      <div>
                        <label className="field-label">
                          Designation <span className="req-marker">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.designation}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          placeholder="e.g. Managing Director / Head of HR"
                          className="partner-input-52"
                        />
                        {formErrors.designation && <div className="field-error">{formErrors.designation}</div>}
                      </div>
                    </div>
                  </fieldset>

                  <div className="section-divider" />

                  {/* FIELDSET 2: YOUR COMPANY */}
                  <fieldset style={{ border: 'none', padding: 0, margin: '0 0 36px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--navy-900)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                        }}
                      >
                        2
                      </span>
                      <legend
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--navy-900)',
                          margin: 0,
                        }}
                      >
                        Your Company
                      </legend>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                      <div>
                        <label className="field-label">
                          Company Name <span className="req-marker">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.company_name}
                          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                          placeholder="e.g. Apex Enterprises Pvt. Ltd."
                          className="partner-input-52"
                        />
                        {formErrors.company_name && <div className="field-error">{formErrors.company_name}</div>}
                      </div>

                      <div>
                        <label className="field-label">
                          City / State <span className="req-marker">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.company_location}
                          onChange={(e) => setFormData({ ...formData, company_location: e.target.value })}
                          placeholder="e.g. Chennai, Tamil Nadu"
                          className="partner-input-52"
                        />
                        {formErrors.company_location && <div className="field-error">{formErrors.company_location}</div>}
                      </div>
                    </div>
                  </fieldset>

                  <div className="section-divider" />

                  {/* FIELDSET 3: YOUR REQUIREMENT */}
                  <fieldset style={{ border: 'none', padding: 0, margin: '0 0 36px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--navy-900)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                        }}
                      >
                        3
                      </span>
                      <legend
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--navy-900)',
                          margin: 0,
                        }}
                      >
                        Your Requirement
                      </legend>
                    </div>

                    {/* 3-Option Segmented Selector */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        backgroundColor: 'var(--mist)',
                        padding: '6px',
                        borderRadius: '6px',
                        border: '1px solid var(--line)',
                        marginBottom: '24px',
                      }}
                    >
                      {[
                        { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
                        { id: 'payroll', label: 'Payroll', icon: Users },
                        { id: 'other', label: 'Other', icon: FileCheck },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = formData.service === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, service: tab.id })}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              height: '48px',
                              borderRadius: '4px',
                              border: isSelected ? '1px solid var(--line)' : 'none',
                              backgroundColor: isSelected ? 'var(--white)' : 'transparent',
                              color: isSelected ? 'var(--navy-900)' : 'var(--ink)',
                              fontWeight: isSelected ? 700 : 500,
                              fontSize: '0.9375rem',
                              fontFamily: 'var(--font-body)',
                              cursor: 'pointer',
                              boxShadow: isSelected ? '0 2px 8px rgba(7, 20, 38, 0.06)' : 'none',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Icon size={16} color={isSelected ? 'var(--sky-600)' : 'var(--ink)'} />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Conditional Fields: Recruitment */}
                    {formData.service === 'recruitment' && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: '20px',
                          padding: '20px',
                          backgroundColor: 'var(--mist)',
                          borderRadius: '6px',
                          border: '1px solid var(--line)',
                          animation: 'fadeUp 0.25s ease',
                        }}
                      >
                        <div>
                          <label className="field-label">Target Role / Positions</label>
                          <input
                            type="text"
                            value={formData.recruitment_roles}
                            onChange={(e) => setFormData({ ...formData, recruitment_roles: e.target.value })}
                            placeholder="e.g. Chief Operating Officer, VP Engineering"
                            className="partner-input-52"
                            style={{ backgroundColor: 'var(--white)' }}
                          />
                        </div>
                        <div>
                          <label className="field-label">Hiring Timeline</label>
                          <select
                            value={formData.recruitment_timeline}
                            onChange={(e) => setFormData({ ...formData, recruitment_timeline: e.target.value })}
                            className="partner-input-52"
                            style={{ backgroundColor: 'var(--white)', cursor: 'pointer' }}
                          >
                            <option value="Immediate (< 30 days)">Immediate (&lt; 30 days)</option>
                            <option value="Standard (30–60 days)">Standard (30–60 days)</option>
                            <option value="Strategic Pipeline (Q3/Q4)">Strategic Pipeline (Q3/Q4)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Conditional Fields: Payroll */}
                    {formData.service === 'payroll' && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: '20px',
                          padding: '20px',
                          backgroundColor: 'var(--mist)',
                          borderRadius: '6px',
                          border: '1px solid var(--line)',
                          animation: 'fadeUp 0.25s ease',
                        }}
                      >
                        <div>
                          <label className="field-label">Approximate Headcount</label>
                          <select
                            value={formData.payroll_headcount}
                            onChange={(e) => setFormData({ ...formData, payroll_headcount: e.target.value })}
                            className="partner-input-52"
                            style={{ backgroundColor: 'var(--white)', cursor: 'pointer' }}
                          >
                            <option value="Under 50 Employees">Under 50 Employees</option>
                            <option value="50–250 Employees">50–250 Employees</option>
                            <option value="250–1,000 Employees">250–1,000 Employees</option>
                            <option value="1,000+ Employees">1,000+ Employees</option>
                          </select>
                        </div>
                        <div>
                          <label className="field-label">Current Payroll Software (Optional)</label>
                          <input
                            type="text"
                            value={formData.payroll_software}
                            onChange={(e) => setFormData({ ...formData, payroll_software: e.target.value })}
                            placeholder="e.g. SAP, Workday, QuickBooks, Manual"
                            className="partner-input-52"
                            style={{ backgroundColor: 'var(--white)' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Conditional Fields: Other */}
                    {formData.service === 'other' && (
                      <div
                        style={{
                          padding: '16px 20px',
                          backgroundColor: 'var(--mist)',
                          borderRadius: '6px',
                          border: '1px solid var(--line)',
                          fontSize: '0.875rem',
                          color: 'var(--ink)',
                          lineHeight: 1.6,
                          animation: 'fadeUp 0.25s ease',
                        }}
                      >
                        Please detail your consulting or corporate restructuring requirement in the message field below.
                      </div>
                    )}
                  </fieldset>

                  <div className="section-divider" />

                  {/* FIELDSET 4: MESSAGE & CONSENT */}
                  <fieldset style={{ border: 'none', padding: 0, margin: '0 0 32px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--navy-900)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                        }}
                      >
                        4
                      </span>
                      <legend
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--navy-900)',
                          margin: 0,
                        }}
                      >
                        Message &amp; Consent
                      </legend>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                        <label className="field-label" style={{ margin: 0 }}>
                          Brief Summary of Mandate <span className="req-marker">*</span>
                        </label>
                        <span style={{ fontSize: '0.75rem', color: formData.message.length >= 20 ? 'var(--sky-600)' : 'var(--ink)' }}>
                          {formData.message.length} characters (min 20)
                        </span>
                      </div>
                      <textarea
                        rows="5"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe your key business requirements, hiring objectives, or payroll audit goals..."
                        className="partner-textarea-160"
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink)', marginTop: '4px' }}>
                        Provide context regarding desired outcomes, locations, or special considerations.
                      </div>
                      {formErrors.message && <div className="field-error">{formErrors.message}</div>}
                    </div>

                    {/* Consent checkbox */}
                    <div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: 'var(--ink)',
                          lineHeight: 1.6,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--navy-900)' }}
                          required
                        />
                        <span>
                          I authorize TECHORA Consultant to review these specifications and contact me regarding this advisory inquiry. <span className="req-marker">*</span>
                        </span>
                      </label>
                      {formErrors.consent && <div className="field-error">{formErrors.consent}</div>}
                    </div>
                  </fieldset>

                  {errorMessage && (
                    <div
                      style={{
                        padding: '14px 18px',
                        borderRadius: '4px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #F87171',
                        color: '#991B1B',
                        fontSize: '0.875rem',
                        marginBottom: '24px',
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-navy partner-submit-btn"
                  >
                    {submitting ? 'Submitting Mandate Brief...' : 'Submit Partnership Inquiry'} <ArrowRight size={16} />
                  </button>
                </form>
              </div>

              {/* Right Column: Sticky Navy Info Panel (40%) */}
              <div
                style={{
                  position: 'sticky',
                  top: '96px',
                  backgroundColor: 'var(--navy-950)',
                  color: 'var(--white)',
                  borderRadius: '6px',
                  padding: '36px',
                  border: '1px solid var(--navy-800)',
                  boxShadow: '0 12px 32px rgba(7, 20, 38, 0.15)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--sky-500)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: '10px',
                  }}
                >
                  Consulting Practice
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                    marginBottom: '18px',
                  }}
                >
                  Enterprise Mandate Intake
                </h3>

                <p style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.65, marginBottom: '28px' }}>
                  TECHORA Consultant pairs senior practice partners with enterprise organizations to deliver rigorous leadership search, workforce strategy, and statutory payroll compliance.
                </p>

                {/* Verified Core Principles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <ShieldCheck size={18} color="var(--sky-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.90)' }}>
                      <strong>Partner-Led Engagement:</strong> Direct involvement from practice leaders throughout every phase of the consultation.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <FileCheck size={18} color="var(--sky-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.90)' }}>
                      <strong>Statutory Accountability:</strong> Thorough compliance with national and regional employment and tax regulations.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Building size={18} color="var(--sky-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.90)' }}>
                      <strong>Sector Alignment:</strong> Focused industry expertise across BFSI, Technology, Retail, and Corporate Services.
                    </div>
                  </div>
                </div>

                {/* Render contact block ONLY when values in contactConfig are filled */}
                {(contactConfig.addressLine1 || contactConfig.phone || contactConfig.email || contactConfig.operatingHours) && (
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '20px' }}>
                    {contactConfig.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '10px' }}>
                        <Phone size={16} color="var(--sky-500)" />
                        <span>{contactConfig.phone}</span>
                      </div>
                    )}
                    {contactConfig.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '10px' }}>
                        <Mail size={16} color="var(--sky-500)" />
                        <span>{contactConfig.email}</span>
                      </div>
                    )}
                    {contactConfig.addressLine1 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '10px' }}>
                        <MapPin size={16} color="var(--sky-500)" />
                        <span>{contactConfig.addressLine1}, {contactConfig.city}</span>
                      </div>
                    )}
                    {contactConfig.operatingHours && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                        <Clock size={16} color="var(--sky-500)" />
                        <span>{contactConfig.operatingHours}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .field-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--navy-900);
          margin-bottom: 8px;
        }
        .req-marker {
          color: #E11D48;
        }
        .partner-input-52 {
          width: 100%;
          height: 52px;
          padding: 0 16px;
          font-size: 16px;
          font-family: var(--font-body);
          color: var(--navy-900);
          background-color: var(--white);
          border: 1px solid var(--line);
          border-radius: 6px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .partner-input-52:focus {
          border-color: var(--sky-600);
          box-shadow: 0 0 0 3px rgba(15, 127, 196, 0.15);
        }
        .partner-textarea-160 {
          width: 100%;
          min-height: 160px;
          padding: 14px 16px;
          font-size: 16px;
          font-family: var(--font-body);
          color: var(--navy-900);
          background-color: var(--white);
          border: 1px solid var(--line);
          border-radius: 6px;
          outline: none;
          resize: vertical;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .partner-textarea-160:focus {
          border-color: var(--sky-600);
          box-shadow: 0 0 0 3px rgba(15, 127, 196, 0.15);
        }
        .field-error {
          font-size: 0.8125rem;
          color: #E11D48;
          margin-top: 6px;
        }
        .section-divider {
          width: 100%;
          height: 1px;
          background-color: var(--line);
          margin: 32px 0;
        }
        .partner-submit-btn {
          width: 100%;
          height: 52px;
          font-size: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 10px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .partner-split-grid {
            grid-template-columns: 1fr !important;
          }
          .partner-submit-btn {
            position: sticky;
            bottom: 16px;
            z-index: 30;
            box-shadow: 0 8px 24px rgba(7, 20, 38, 0.25);
          }
        }
      `}</style>
    </div>
  );
}
