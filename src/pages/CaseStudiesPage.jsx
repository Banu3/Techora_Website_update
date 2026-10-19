import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SEOMeta } from '../components/SEOMeta';
import { 
  Building2, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2, Award, Zap, BarChart3, Cloud, Calculator
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

const caseStudiesData = [
  {
    id: 1,
    title: 'Multi-Region Cloud Migration & Infrastructure Modernization',
    client: 'Global Logistics Enterprise (4,000+ Fleet)',
    category: 'IT Consulting',
    image: '/images/cloud-devops.png',
    metrics: [
      { label: 'Cloud Infrastructure Savings', val: '38%' },
      { label: 'Uptime Achieved', val: '99.99%' },
      { label: 'Migration Downtime', val: '0 Hours' }
    ],
    summary: 'Re-architected a legacy monolithic transport management platform into cloud-native AWS microservices, establishing automated CI/CD pipelines and infrastructure security controls.',
    deliverables: [
      'Zero-downtime database migration strategy',
      'Multi-region failover and disaster recovery',
      'Automated deployment pipelines'
    ],
    badge: 'Cloud & Infrastructure'
  },
  {
    id: 2,
    title: 'Automated Multi-State Statutory Payroll & Tax Compliance Engine',
    client: 'Fintech & Financial Services Group (6,500+ Staff)',
    category: 'Payroll Services',
    image: '/images/payroll-analytics.png',
    metrics: [
      { label: 'Processing Speed Gain', val: '5.2x' },
      { label: 'Statutory Filing Accuracy', val: '100%' },
      { label: 'Monthly Disbursal', val: '₹45M+' }
    ],
    summary: 'Implemented Techora’s automated statutory payroll engine across 14 state jurisdictions, automating PF/ESI filing preparation, dual-regime TDS tax computations, and encrypted digital payslips.',
    deliverables: [
      'Biometric time-clock & leave integration',
      'Automated Form 16 Part A & B generation',
      'Self-service employee document vault'
    ],
    badge: 'Statutory Payroll'
  },
  {
    id: 3,
    title: 'Zero-Trust Cybersecurity Framework & Payment Gateway Protection',
    client: 'Apex Banking & Payment Solutions Provider',
    category: 'IT Consulting',
    image: '/images/fintech-banking.png',
    metrics: [
      { label: 'Threat Mitigation Rate', val: '99.9%' },
      { label: 'Audit Compliance Record', val: '100%' },
      { label: 'Security Patch Speed', val: '< 2 Hrs' }
    ],
    summary: 'Formulated and enforced an end-to-end security architecture for financial transaction processing, incorporating automated API authorization controls and vulnerability monitoring.',
    deliverables: [
      'Role-based access control (RBAC) audit',
      'Vulnerability scanning & threat mitigation',
      'Continuous security monitoring integration'
    ],
    badge: 'Cybersecurity'
  },
  {
    id: 4,
    title: 'ERP & CRM Systems Integration for Omnichannel Commerce',
    client: 'Vanguard Retail & Supply Chain Corp',
    category: 'IT Consulting',
    image: '/images/roi-strategy.png',
    metrics: [
      { label: 'Order Processing Speed', val: '+65%' },
      { label: 'Inventory Discrepancy', val: '0.01%' },
      { label: 'ROI Horizon', val: '8 Months' }
    ],
    summary: 'Integrated enterprise ERP with CRM modules and custom middleware, streamlining order-to-cash workflows and inventory synchronization for high-volume transactions.',
    deliverables: [
      'Custom middleware & API integration',
      'Real-time inventory analytics dashboard',
      'Staff onboarding & adoption framework'
    ],
    badge: 'ERP / CRM'
  }
];

export const CaseStudiesPage = ({ setActivePage, setSelectedServiceTitle }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const { content } = useContent();

  const filteredStudies = caseStudiesData.filter(s => 
    filterCategory === 'All' || s.category === filterCategory
  );

  const handleEnquire = (title) => {
    if (setSelectedServiceTitle) {
      setSelectedServiceTitle(title);
    }
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOMeta
        title="Enterprise Case Studies & Client Success — Techora"
        description="Explore how Techora helps enterprise clients modernize IT infrastructure, fortify cybersecurity, and automate complex statutory payroll operations."
      />

      {/* HERO SECTION (Luminous Sky Blue Canvas) */}
      <section className="pt-36 pb-20 relative overflow-hidden border-b border-[#BAE6FD] bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl space-y-6">
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-white border border-[#BAE6FD] text-[#0C4A6E] text-xs font-bold uppercase tracking-wider shadow-xs"
          >
            <Award className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{content.caseStudiesHeroBadge || 'Client Engagement Track Record'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#092342] tracking-tight leading-tight"
          >
            {content.caseStudiesHeroTitle || 'Proven Results. Quantifiable Business Value.'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-[#2D425A] text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-medium"
          >
            {content.caseStudiesHeroSubtitle || 'Discover how organizations partner with Techora to eliminate operational bottlenecks, secure digital infrastructure, and streamline monthly payroll disbursals.'}
          </motion.p>

        </div>
      </section>

      {/* FILTER & CASE STUDIES GRID (Clean White Background) */}
      <section className="py-24 bg-white border-b border-[#BAE6FD] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Category Filter Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD] shadow-xs text-xs font-semibold">
              {['All', 'IT Consulting', 'Payroll Services'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-5 py-2 rounded-md font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-[#2D425A] hover:text-[#092342]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="overflow-hidden rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Visual Header */}
                <div className="p-5 bg-white border-b border-[#BAE6FD] flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#E0F2FE] text-[#0C4A6E] border border-[#BAE6FD] uppercase font-mono">
                    {study.badge}
                  </span>
                  <span className="text-xs text-[#2D425A] flex items-center space-x-1.5 font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>{study.client}</span>
                  </span>
                </div>

                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#092342] mb-3 group-hover:text-[#0284C7] transition-colors">
                      {study.title}
                    </h3>

                    <p className="text-[#2D425A] text-sm leading-relaxed mb-6 font-normal">
                      {study.summary}
                    </p>

                    {/* Impact Metrics Bar */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-white border border-[#BAE6FD] mb-6 text-center">
                      {study.metrics.map((m, i) => (
                        <div key={i}>
                          <span className="text-lg font-black text-[#0284C7] block font-mono">{m.val}</span>
                          <span className="text-[10px] text-[#2D425A] uppercase block mt-0.5 font-semibold">{m.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Key Deliverables */}
                    <ul className="space-y-2 mb-8">
                      {study.deliverables.map((d, i) => (
                        <li key={i} className="flex items-center space-x-2 text-xs text-[#2D425A] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleEnquire(study.title)}
                    className="w-full py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs text-[#092342] hover:text-white bg-white hover:bg-[#0284C7] border border-[#BAE6FD] hover:border-[#0284C7] transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <span>Request Architecture Blueprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* BOTTOM CALL TO ACTION (Luminous Sky Blue Canvas) */}
      <section className="py-20 bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#BAE6FD] shadow-sm space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              ADVISORY SESSION
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#092342]">
              Transform Your Enterprise Operations Today
            </h3>
            <p className="text-[#2D425A] text-base max-w-xl mx-auto leading-relaxed font-medium">
              Schedule a confidential technical audit or payroll consultation with Techora's enterprise specialists.
            </p>
            <div>
              <button
                onClick={() => handleEnquire('Enterprise Transformation Strategy')}
                className="px-8 py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all inline-flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>Schedule Transformation Advisory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
