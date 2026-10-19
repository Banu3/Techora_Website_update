import React, { useState } from 'react';
import FormField from './FormField';
import Button from './Button';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ContactForm({ onSuccess, defaultService = 'General Advisory' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_interest: defaultService,
    project_scope: 'Standard Consultation',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: 'success',
          message: data.message || 'Consultation request received. A Senior Partner will contact you within 24h.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service_interest: defaultService,
          project_scope: 'Standard Consultation',
          message: '',
        });
        if (onSuccess) onSuccess();
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to submit consultation mandate.',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network error. Please verify your connection or try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <FormField
          label="Full Name"
          id="name"
          placeholder="e.g. Richard Vance"
          value={formData.name}
          onChange={handleChange('name')}
          required
        />
        <FormField
          label="Corporate Email"
          id="email"
          type="email"
          placeholder="e.g. r.vance@enterprise.com"
          value={formData.email}
          onChange={handleChange('email')}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <FormField
          label="Organization / Company"
          id="company"
          placeholder="Enterprise Name"
          value={formData.company}
          onChange={handleChange('company')}
        />
        <FormField
          label="Direct Phone"
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={handleChange('phone')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <FormField
          label="Practice Interest"
          id="service_interest"
          as="select"
          value={formData.service_interest}
          onChange={handleChange('service_interest')}
          options={[
            { value: 'Retained Executive Search', label: 'Retained Executive Search' },
            { value: 'Payroll & Statutory Governance', label: 'Payroll & Statutory Governance' },
            { value: 'Corporate Advisory & Restructuring', label: 'Corporate Advisory & Restructuring' },
            { value: 'Industry Specialization Mandate', label: 'Industry Specialization Mandate' },
            { value: 'General Advisory', label: 'General Corporate Consultation' },
          ]}
        />
        <FormField
          label="Engagement Scope"
          id="project_scope"
          as="select"
          value={formData.project_scope}
          onChange={handleChange('project_scope')}
          options={[
            { value: 'Immediate Mandate (< 30 days)', label: 'Immediate Mandate (< 30 days)' },
            { value: 'Strategic Quarter Planning', label: 'Strategic Quarter Planning' },
            { value: 'Multi-Jurisdiction Retainer', label: 'Multi-Jurisdiction Retainer' },
            { value: 'Confidential Discretionary Review', label: 'Confidential Discretionary Review' },
          ]}
        />
      </div>

      <FormField
        label="Consultation Brief & Objectives"
        id="message"
        as="textarea"
        rows={4}
        placeholder="Briefly outline your organization's talent acquisition, payroll compliance, or consulting requirements..."
        value={formData.message}
        onChange={handleChange('message')}
        required
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--ink-600)' }}>
        <ShieldCheck size={16} color="var(--sky-500)" />
        <span>Fiduciary non-disclosure applies. Your consultation details remain strictly confidential.</span>
      </div>

      {status.type === 'success' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '3px', color: '#065F46', fontSize: '0.875rem' }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{status.message}</span>
        </div>
      )}

      {status.type === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '3px', color: '#991B1B', fontSize: '0.875rem' }}>
          <AlertCircle size={18} color="#DC2626" />
          <span>{status.message}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={submitting}
        style={{ width: '100%', marginTop: '6px', minHeight: '50px' }}
      >
        {submitting ? 'Transmitting Secure Mandate...' : 'Submit Strategic Consultation Request'}
      </Button>
    </form>
  );
}
