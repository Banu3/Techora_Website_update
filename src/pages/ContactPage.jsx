import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SERVICE_OPTIONS } from '../data/servicesData';
import { validateContactForm } from '../utils/validators';
import { submitContactForm } from '../utils/api';
import { useContent } from '../context/ContentContext';
import { SEOMeta } from '../components/SEOMeta';
import { Toast } from '../components/Toast';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Building2, User, MessageSquare } from 'lucide-react';

export const ContactPage = ({ selectedServiceTitle }) => {
  const { content } = useContent();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    service_required: selectedServiceTitle || 'IT Strategy & Consulting',
    message: ''
  });

  useEffect(() => {
    if (selectedServiceTitle) {
      setFormData(prev => ({ ...prev, service_required: selectedServiceTitle }));
    }
  }, [selectedServiceTitle]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: valErrors } = validateContactForm(formData);

    if (!isValid) {
      setErrors(valErrors);
      setToast({ message: 'Please correct highlighted errors in the form.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        setToast({ message: res.message || 'Enquiry submitted successfully! Our team will contact you shortly.', type: 'success' });
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          company_name: '',
          service_required: 'IT Strategy & Consulting',
          message: ''
        });
        setErrors({});
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to submit enquiry. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOMeta
        title="Contact Our Advisory Team — Techora"
        description="Connect with Techora's senior consultants for strategic IT advisory, infrastructure audits, or statutory payroll operations."
      />

      {/* CONTACT HERO (Luminous Sky Blue Canvas) */}
      <section className="pt-36 pb-16 relative overflow-hidden bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF] border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-6">
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-white border border-[#BAE6FD] text-[#0C4A6E] text-xs font-bold uppercase tracking-wider shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{content.contactHeroBadge || 'Direct Enterprise Consultation'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#092342] tracking-tight leading-tight"
          >
            {content.contactHeroTitle || 'Connect With Our Enterprise Practice Specialists'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-[#2D425A] text-lg sm:text-xl leading-relaxed font-medium"
          >
            {content.contactHeroSubtitle || 'Share your business requirements and our senior consultants will prepare a clear, practical evaluation plan.'}
          </motion.p>

        </div>
      </section>

      {/* MAIN FORM & CONTACT DETAILS (Clean White Background) */}
      <section className="py-20 relative bg-white border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#EBF5FE] p-7 sm:p-8 rounded-xl border border-[#BAE6FD] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block mb-1 font-mono">
                    DIRECT ENGAGEMENT
                  </span>
                  <h3 className="text-2xl font-bold text-[#092342]">
                    Enterprise Advisory Desk
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-white border border-[#BAE6FD] text-[#0284C7] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#2D425A] block mb-0.5 font-semibold">Corporate Inquiries</span>
                      <a href={`mailto:${content.contactEmail || 'contact@techora.com'}`} className="text-[#092342] font-bold text-base hover:text-[#0284C7] transition-colors">
                        {content.contactEmail || 'contact@techora.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-white border border-[#BAE6FD] text-[#0284C7] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#2D425A] block mb-0.5 font-semibold">Direct Hotline</span>
                      <a href={`tel:${content.contactPhone || '+918000555832'}`} className="text-[#092342] font-bold text-base hover:text-[#0284C7] transition-colors">
                        {content.contactPhone || '+91 (8000) 555-832'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-white border border-[#BAE6FD] text-[#0284C7] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#2D425A] block mb-0.5 font-semibold">Global Headquarters</span>
                      <p className="text-[#2D425A] text-sm leading-relaxed font-normal">
                        {content.hqAddress || 'Techora Enterprise Tower, 500 Financial Way, Tech Hub Suite 1400, NY 10005'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#BAE6FD] space-y-2.5">
                  <div className="flex items-center space-x-2 text-xs text-[#2D425A] font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Non-Disclosure Agreement (NDA) supported upon request</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-[#2D425A] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Guaranteed response within 24 business hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#EBF5FE] p-7 sm:p-9 rounded-xl border border-[#BAE6FD] shadow-xs relative">
                
                <h3 className="text-2xl font-bold text-[#092342] mb-1">Request Consultation</h3>
                <p className="text-[#2D425A] text-sm mb-7 font-medium">
                  Provide your project or operational requirements to initiate consultation.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#092342] mb-2">
                        Full Name <span className="text-[#0284C7]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#2D425A] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          placeholder="e.g. Kishore Kumar"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                            errors.full_name ? 'border-red-500 text-red-900' : 'border-[#BAE6FD] text-[#092342] focus:border-[#0284C7]'
                          } text-sm focus:outline-none focus:ring-1 focus:ring-[#0284C7] transition-colors`}
                        />
                      </div>
                      {errors.full_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.full_name}</p>}
                    </div>

                    {/* Business Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#092342] mb-2">
                        Business Email <span className="text-[#0284C7]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#2D425A] absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. kishore@company.com"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                            errors.email ? 'border-red-500 text-red-900' : 'border-[#BAE6FD] text-[#092342] focus:border-[#0284C7]'
                          } text-sm focus:outline-none focus:ring-1 focus:ring-[#0284C7] transition-colors`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#092342] mb-2">
                        Phone Number <span className="text-[#0284C7]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#2D425A] absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +91 98765 43210"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                            errors.phone ? 'border-red-500 text-red-900' : 'border-[#BAE6FD] text-[#092342] focus:border-[#0284C7]'
                          } text-sm focus:outline-none focus:ring-1 focus:ring-[#0284C7] transition-colors`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#092342] mb-2">
                        Company Name <span className="text-[#0284C7]">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-[#2D425A] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleChange}
                          placeholder="e.g. Acme Enterprises"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                            errors.company_name ? 'border-red-500 text-red-900' : 'border-[#BAE6FD] text-[#092342] focus:border-[#0284C7]'
                          } text-sm focus:outline-none focus:ring-1 focus:ring-[#0284C7] transition-colors`}
                        />
                      </div>
                      {errors.company_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.company_name}</p>}
                    </div>
                  </div>

                  {/* Service Required Dropdown */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#092342] mb-2">
                      Service Required <span className="text-[#0284C7]">*</span>
                    </label>
                    <select
                      name="service_required"
                      value={formData.service_required}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#BAE6FD] text-[#092342] text-sm focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition-colors"
                    >
                      <optgroup label="IT CONSULTING SERVICES">
                        {SERVICE_OPTIONS.filter(s => s.category === 'IT Consulting').map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="PAYROLL SERVICES">
                        {SERVICE_OPTIONS.filter(s => s.category === 'Payroll').map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {errors.service_required && <p className="text-red-500 text-xs mt-1 font-medium">{errors.service_required}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#092342] mb-2">
                      Message / Operational Scope <span className="text-[#0284C7]">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-[#2D425A] absolute left-3.5 top-3.5" />
                      <textarea
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your technical architecture goals or payroll workforce scale..."
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                          errors.message ? 'border-red-500 text-red-900' : 'border-[#BAE6FD] text-[#092342] focus:border-[#0284C7]'
                        } text-sm focus:outline-none focus:ring-1 focus:ring-[#0284C7] transition-colors resize-none`}
                      />
                    </div>
                    {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message}</p>}
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Submitting Consultation Request...</span>
                    ) : (
                      <>
                        <span>Submit Consultation Request</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TOAST NOTIFICATION */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </>
  );
};
