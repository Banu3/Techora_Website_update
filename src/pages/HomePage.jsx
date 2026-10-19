import React from 'react';
import { motion } from 'framer-motion';
import { HeroCanvas } from '../components/HeroCanvas';
import { SEOMeta } from '../components/SEOMeta';
import { 
  ArrowRight, ShieldCheck, Compass, Calculator, TrendingUp, Layers, CheckCircle2,
  Server, Cpu, Lock, Users, Check, Globe, Database,
  FileText, Shield, Code, BarChart3, HardDrive, Activity, CheckSquare, Building2
} from 'lucide-react';

import { useContent } from '../context/ContentContext';

export const HomePage = ({ setActivePage, setSelectedServiceTitle }) => {
  const { content } = useContent();

  const scrollToSolutions = () => {
    const target = document.getElementById('solutions-overview');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateTo = (pageId, serviceTitle = null) => {
    if (serviceTitle && setSelectedServiceTitle) {
      setSelectedServiceTitle(serviceTitle);
    }
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOMeta 
        title="TECHORA — Enterprise Technology & Reliable Payroll Solutions"
        description="Techora provides strategic IT consulting, secure infrastructure management, and dependable payroll solutions designed to help growing enterprises streamline operations and scale with confidence."
      />

      {/* ==================================================
          1. HERO SECTION (Luminous Sky Blue Canvas & Deep Navy Contrast)
          ================================================== */}
      <section className="relative min-h-[92vh] flex items-center pt-32 pb-24 overflow-hidden bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF] border-b border-[#BAE6FD]">
        <HeroCanvas />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Hero Copy & CTA */}
            <div className="lg:col-span-6 space-y-7">
              
              {/* Eyebrow Label */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-md bg-white/95 backdrop-blur-xs border border-[#BAE6FD] text-[#0C4A6E] text-xs font-bold tracking-wider uppercase shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                <span>{content.homeHeroBadge || 'STRATEGIC IT ADVISORY • STATUTORY PAYROLL OPERATIONS'}</span>
              </motion.div>

              {/* Main Headline (Deep Navy #092342 for Crystal-Clear Legibility) */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#092342] leading-[1.12] font-sans"
              >
                {content.heroTitle || 'Strategic IT Advisory. Reliable Enterprise Payroll.'}
              </motion.h1>

              {/* Supporting Copy (Slate Navy #2D425A for High Contrast) */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="text-base sm:text-lg text-[#2D425A] font-medium leading-relaxed max-w-xl"
              >
                {content.heroSubtitle || 'Techora partners with ambitious organizations to engineer resilient technology infrastructure, secure enterprise cloud platforms, and zero-error statutory payroll operations — giving leadership total operational clarity.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-1"
              >
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-7 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>{content.heroBtnPrimary || 'Schedule Consultation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToSolutions}
                  className="px-7 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#092342] bg-white hover:bg-[#E0F2FE] border border-[#BAE6FD] hover:border-[#0284C7] shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>{content.heroBtnSecondary || 'Explore Capabilities'}</span>
                </button>
              </motion.div>

              {/* Three Credibility Proof Points */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.32 }}
                className="pt-6 border-t border-[#BAE6FD] flex flex-wrap items-center gap-6 text-xs text-[#2D425A] font-semibold"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>{content.homeTrustPoint1 || '15+ Years Combined Advisory Leadership'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>{content.homeTrustPoint2 || '100% Statutory Compliance Accuracy'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>{content.homeTrustPoint3 || 'Enterprise Security Architecture'}</span>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Pure Architectural Headquarters Visual (No Artificial Dashboard Mockups) */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="relative rounded-2xl lg:rounded-3xl overflow-hidden border border-[#BAE6FD] shadow-[0_25px_60px_-15px_rgba(2,132,199,0.20)] bg-white group"
              >
                {/* Full-Height Daylight Headquarters Architecture Photography */}
                <img 
                  src="/images/techora-headquarters-daylight.png" 
                  alt="Techora Global Corporate Headquarters & Advisory Campus" 
                  className="w-full h-[480px] sm:h-[540px] lg:h-[600px] object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out" 
                />

                {/* Subtle daylight depth gradient at base */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#092342]/70 via-[#092342]/10 to-transparent pointer-events-none" />

                {/* Understated Authentic Corporate Identification Plaque */}
                <div className="absolute bottom-5 left-5 right-5 p-4 sm:p-5 rounded-xl bg-white/95 backdrop-blur-md border border-white/90 shadow-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#092342] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      <Building2 className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] block">
                        Corporate Headquarters
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#092342] leading-tight">
                        Techora Technology & Advisory Campus
                      </h3>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end pl-4 border-l border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Operations Hub
                    </span>
                    <span className="text-xs font-bold text-[#092342]">
                      Global Delivery Centre
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          2. EXECUTIVE OVERVIEW & 4 OPERATIONAL PILLARS (Clean White Contrast)
          ================================================== */}
      <section className="py-16 bg-white border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
                ENGINEERED FOR STABILITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#092342] tracking-tight leading-snug">
                Technology and operational solutions built for established businesses.
              </h2>
              <p className="text-sm text-[#2D425A] leading-relaxed">
                We remove technical friction, secure sensitive business records, and run precise statutory payroll operations with a dedicated team of specialists.
              </p>
            </div>

            {/* Right: Architectural 2x2 Ledger */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white transition-all shadow-xs space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white text-[#0284C7] border border-[#BAE6FD]">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#092342]">IT Strategy & Advisory</h3>
                    <span className="text-[10px] text-[#0C4A6E] font-mono font-semibold">01 / ARCHITECTURE</span>
                  </div>
                </div>
                <p className="text-xs text-[#2D425A] leading-relaxed pt-1">
                  Technology roadmaps, stack assessments, and governance aligned with business objectives.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white transition-all shadow-xs space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white text-[#0284C7] border border-[#BAE6FD]">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#092342]">Cloud & Systems</h3>
                    <span className="text-[10px] text-[#0C4A6E] font-mono font-semibold">02 / INFRASTRUCTURE</span>
                  </div>
                </div>
                <p className="text-xs text-[#2D425A] leading-relaxed pt-1">
                  Resilient cloud migration, hybrid networks, uptime monitoring, and disaster recovery.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white transition-all shadow-xs space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white text-[#0284C7] border border-[#BAE6FD]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#092342]">Cybersecurity</h3>
                    <span className="text-[10px] text-[#0C4A6E] font-mono font-semibold">03 / GOVERNANCE</span>
                  </div>
                </div>
                <p className="text-xs text-[#2D425A] leading-relaxed pt-1">
                  Access controls, data validation, vulnerability mitigation, and continuous compliance.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white transition-all shadow-xs space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white text-[#0284C7] border border-[#BAE6FD]">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#092342]">Payroll Operations</h3>
                    <span className="text-[10px] text-[#0C4A6E] font-mono font-semibold">04 / COMPLIANCE</span>
                  </div>
                </div>
                <p className="text-xs text-[#2D425A] leading-relaxed pt-1">
                  End-to-end salary processing, PF, ESI, TDS calculations, and timely statutory filing.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          3. TWO CORE DISCIPLINES — ASYMMETRICAL EDITORIAL SHOWCASE (Sky Blue Canvas)
          ================================================== */}
      <section id="solutions-overview" className="py-24 bg-[#EBF5FE] border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Section Introduction */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              WHAT WE DO
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092342] tracking-tight">
              Two Specialized Disciplines.<br />One Business-Focused Approach.
            </h2>
            <p className="text-[#2D425A] text-base sm:text-lg leading-relaxed font-medium">
              From enterprise technology architecture and security safeguards to statutory payroll processing, Techora manages the systems behind modern business execution.
            </p>
          </div>

          {/* DISCIPLINE 01: IT CONSULTING */}
          <div className="rounded-2xl border border-[#BAE6FD] bg-white p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Narrative & Scope */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#0C4A6E] bg-[#E0F2FE] px-3.5 py-1.5 rounded-md border border-[#BAE6FD]">
                    DISCIPLINE 01
                  </span>
                  <span className="text-xs font-mono text-[#2D425A] uppercase font-semibold">STRATEGY & ARCHITECTURE</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#092342] tracking-tight">
                  {content.homeItTitle || 'Build Technology That Works for Your Business'}
                </h3>

                <p className="text-[#2D425A] text-base leading-relaxed">
                  {content.homeItDesc || 'Transform technology from an operational headache into a strategic advantage with practical consulting across cloud, security, and enterprise software.'}
                </p>

                {/* Service Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'IT Strategy & Advisory',
                    'Cloud Solutions',
                    'Cybersecurity Consulting',
                    'Digital Transformation',
                    'ERP & CRM Solutions',
                    'Technology Assessment'
                  ].map((tag, idx) => (
                    <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#F0F8FF] text-[#092342] border border-[#BAE6FD]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Three Core Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-[#2D425A]">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Vendor Independence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Cost Governance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Documented Architecture</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('it-consulting')}
                    className="px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#0284C7] hover:bg-[#0369A1] transition-all inline-flex items-center space-x-2 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Explore IT Consulting Practice</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Architectural Blueprint Diagram */}
              <div className="lg:col-span-5">
                <div className="rounded-xl bg-[#EBF5FE] p-6 border border-[#BAE6FD] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#BAE6FD]">
                    <div className="flex items-center space-x-2.5">
                      <Compass className="w-4 h-4 text-[#0284C7]" />
                      <span className="text-xs font-bold text-[#092342]">Consulting Blueprint Architecture</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#0C4A6E] font-bold">PHASE-BASED</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-lg bg-white border border-[#BAE6FD]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#092342]">01. Assessment & Roadmap</span>
                        <span className="text-[10px] font-mono text-[#0284C7] font-bold">Discovery</span>
                      </div>
                      <p className="text-[11px] text-[#2D425A]">Infrastructure audit, security baseline, and bottleneck diagnostics.</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-[#BAE6FD]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#092342]">02. Architecture & Design</span>
                        <span className="text-[10px] font-mono text-[#0284C7] font-bold">Engineering</span>
                      </div>
                      <p className="text-[11px] text-[#2D425A]">Cloud topology, API integration contracts, and security posture.</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-[#BAE6FD]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#092342]">03. Execution & Migration</span>
                        <span className="text-[10px] font-mono text-[#0284C7] font-bold">Deployment</span>
                      </div>
                      <p className="text-[11px] text-[#2D425A]">Zero-downtime cutover, team enablement, and operational handoff.</p>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[11px] text-[#2D425A] font-medium">
                    <span>Outcome: Predictable, scalable infrastructure without vendor lock-in.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DISCIPLINE 02: PAYROLL SERVICES */}
          <div className="rounded-2xl border border-[#BAE6FD] bg-white p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Operational Statutory Workflow Ledger */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="rounded-xl bg-[#EBF5FE] p-6 border border-[#BAE6FD] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#BAE6FD]">
                    <div className="flex items-center space-x-2.5">
                      <Calculator className="w-4 h-4 text-[#0284C7]" />
                      <span className="text-xs font-bold text-[#092342]">Statutory Processing Pipeline</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#0284C7]">MONTHLY CYCLE</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-lg bg-white border border-[#BAE6FD] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#092342] block">1. Attendance & Data Ingestion</span>
                        <span className="text-[10px] text-[#2D425A]">Biometric logs & leave approval reconciliation</span>
                      </div>
                      <Check className="w-4 h-4 text-[#0284C7]" />
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-[#BAE6FD] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#092342] block">2. Gross-to-Net Calculations</span>
                        <span className="text-[10px] text-[#2D425A]">Allowances, overtime, reimbursements, deductions</span>
                      </div>
                      <Check className="w-4 h-4 text-[#0284C7]" />
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-[#BAE6FD] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#092342] block">3. Statutory Filing & Compliance</span>
                        <span className="text-[10px] text-[#2D425A]">PF, ESI challans, Professional Tax, TDS returns</span>
                      </div>
                      <Check className="w-4 h-4 text-[#0284C7]" />
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-[#BAE6FD] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#092342] block">4. Secure Payslip Distribution</span>
                        <span className="text-[10px] text-[#2D425A]">Encrypted digital payslips & bank disbursement ledger</span>
                      </div>
                      <Check className="w-4 h-4 text-[#0284C7]" />
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[11px] text-[#2D425A] font-medium">
                    <span>100% On-Time Processing • Zero Penalty Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Scope */}
              <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#0C4A6E] bg-[#E0F2FE] px-3.5 py-1.5 rounded-md border border-[#BAE6FD]">
                    DISCIPLINE 02
                  </span>
                  <span className="text-xs font-mono text-[#2D425A] uppercase font-semibold">OPERATIONAL EXECUTION</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#092342] tracking-tight">
                  {content.homePayrollTitle || 'Payroll That Runs Smoothly Behind the Scenes'}
                </h3>

                <p className="text-[#2D425A] text-base leading-relaxed">
                  {content.homePayrollDesc || 'Simplify payroll operations with structured salary processing, employee record management, and dependable statutory compliance.'}
                </p>

                {/* Service Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Payroll Processing',
                    'Salary Calculation',
                    'PF & ESI Management',
                    'TDS Compliance',
                    'Attendance & Leave Sync',
                    'Payroll Reports & Audits'
                  ].map((tag, idx) => (
                    <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#F0F8FF] text-[#092342] border border-[#BAE6FD]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Key operational benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-[#2D425A]">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Accurate Calculations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Statutory Deadlines Met</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Audit-Ready Registers</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('payroll-services')}
                    className="px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#092342] bg-[#EBF5FE] hover:bg-[#E0F2FE] border border-[#BAE6FD] hover:border-[#0284C7] transition-all inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Explore Payroll Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          4. WHY TECHORA — ARCHITECTURAL VALUES (Clean White Background)
          ================================================== */}
      <section className="py-24 bg-white border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              WHY TECHORA
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092342] tracking-tight">
              Technology Expertise With a Business-First Mindset
            </h2>
            <p className="text-[#2D425A] text-base sm:text-lg leading-relaxed font-medium">
              We focus on practical, cost-effective solutions that improve operational efficiency, strengthen data security, and support sustainable business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="p-7 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black font-mono text-[#0284C7] mb-4 block">01</span>
                <h3 className="text-lg font-bold text-[#092342] mb-2 group-hover:text-[#0284C7] transition-colors">
                  Strategic Thinking
                </h3>
                <p className="text-xs sm:text-sm text-[#2D425A] leading-relaxed">
                  Technology recommendations aligned with your long-term business objectives and operational goals.
                </p>
              </div>
              <div className="pt-6 border-t border-[#BAE6FD] mt-6 flex items-center justify-between text-[11px] text-[#2D425A] font-mono">
                <span>Domain</span>
                <span className="text-[#092342] font-bold">Enterprise Advisory</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="p-7 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black font-mono text-[#0284C7] mb-4 block">02</span>
                <h3 className="text-lg font-bold text-[#092342] mb-2 group-hover:text-[#0284C7] transition-colors">
                  Security by Design
                </h3>
                <p className="text-xs sm:text-sm text-[#2D425A] leading-relaxed">
                  Security best practices embedded directly into technical architecture and administrative workflows.
                </p>
              </div>
              <div className="pt-6 border-t border-[#BAE6FD] mt-6 flex items-center justify-between text-[11px] text-[#2D425A] font-mono">
                <span>Governance</span>
                <span className="text-[#092342] font-bold">Zero Trust Posture</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="p-7 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black font-mono text-[#0284C7] mb-4 block">03</span>
                <h3 className="text-lg font-bold text-[#092342] mb-2 group-hover:text-[#0284C7] transition-colors">
                  Scalable Systems
                </h3>
                <p className="text-xs sm:text-sm text-[#2D425A] leading-relaxed">
                  Architectures built to accommodate headcount growth, new business units, and evolving regulations.
                </p>
              </div>
              <div className="pt-6 border-t border-[#BAE6FD] mt-6 flex items-center justify-between text-[11px] text-[#2D425A] font-mono">
                <span>Scalability</span>
                <span className="text-[#092342] font-bold">Modular Stack</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.24 }}
              className="p-7 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black font-mono text-[#0284C7] mb-4 block">04</span>
                <h3 className="text-lg font-bold text-[#092342] mb-2 group-hover:text-[#0284C7] transition-colors">
                  Direct Execution
                </h3>
                <p className="text-xs sm:text-sm text-[#2D425A] leading-relaxed">
                  Accountable consultants, direct communication channels, and dependable execution throughout.
                </p>
              </div>
              <div className="pt-6 border-t border-[#BAE6FD] mt-6 flex items-center justify-between text-[11px] text-[#2D425A] font-mono">
                <span>Reliability</span>
                <span className="text-[#092342] font-bold">Accountable Team</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ==================================================
          5. IT CONSULTING CAPABILITY MATRIX (Sky Blue Canvas)
          ================================================== */}
      <section className="py-24 bg-[#EBF5FE] border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              PRACTICE AREAS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092342] tracking-tight">
              Enterprise IT Consulting Capabilities
            </h2>
            <p className="text-[#2D425A] text-base sm:text-lg font-medium">
              Practical guidance and implementation support across critical technology disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            
            {[
              { num: '01', title: 'IT Strategy & Advisory', desc: 'Align technology roadmap, vendor selection, and capital investments with core business goals.', col: 'lg:col-span-8', icon: Compass },
              { num: '02', title: 'Software Architecture Consulting', desc: 'Design scalable, maintainable enterprise systems and resilient API contracts.', col: 'lg:col-span-4', icon: Code },
              { num: '03', title: 'Cloud Solutions & Migration', desc: 'Architect, migrate, and optimize resilient cloud infrastructure on AWS and Azure.', col: 'lg:col-span-4', icon: Server },
              { num: '04', title: 'IT Infrastructure & Operations', desc: 'Ensure reliable network topology, server stability, and proactive uptime monitoring.', col: 'lg:col-span-4', icon: HardDrive },
              { num: '05', title: 'Cybersecurity Consulting', desc: 'Identify security gaps, enforce access controls, and safeguard sensitive data assets.', col: 'lg:col-span-4', icon: ShieldCheck },
              { num: '06', title: 'Digital Transformation', desc: 'Modernize legacy workflows and deploy automated operational pipelines.', col: 'lg:col-span-6', icon: Cpu },
              { num: '07', title: 'ERP & CRM Solutions', desc: 'Integrate enterprise software platforms for unified cross-department reporting.', col: 'lg:col-span-6', icon: Database },
              { num: '08', title: 'Comprehensive Technology Assessment', desc: 'Conduct in-depth audits of your existing technology stack to eliminate bottlenecks, reduce recurring costs, and harden security.', col: 'lg:col-span-12', icon: BarChart3 }
            ].map((service, idx) => {
              const IconComp = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  onClick={() => navigateTo('it-consulting', service.title)}
                  className={`${service.col} p-7 rounded-xl bg-white border border-[#BAE6FD] hover:border-[#0284C7] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-[#0C4A6E] bg-[#E0F2FE] px-2.5 py-1 rounded border border-[#BAE6FD]">
                        {service.num}
                      </span>
                      <div className="p-2.5 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD] text-[#0284C7] group-hover:bg-[#E0F2FE] transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#092342] mb-2 group-hover:text-[#0284C7] transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#2D425A] font-normal leading-relaxed mb-4">
                      {service.desc}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0284C7] group-hover:translate-x-1 transition-transform">
                    <span>View Capability Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ==================================================
          6. STATUTORY PAYROLL OPERATIONS GRID (Clean White Background)
          ================================================== */}
      <section className="py-24 bg-white border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              OPERATIONAL COMPLIANCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092342] tracking-tight">
              Payroll Operations Without the Complexity
            </h2>
            <p className="text-[#2D425A] text-base sm:text-lg font-medium">
              Structured salary processing, employee records, and dependable statutory compliance workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {[
              { title: 'End-to-End Payroll Processing', desc: 'Accurate gross-to-net salary calculations for all organizational tiers and contractor categories.', icon: Calculator },
              { title: 'Salary & Compensation Calculation', desc: 'Precision computation for base pay, allowances, overtime rules, deductions, and bonuses.', icon: TrendingUp },
              { title: 'PF & ESI Management', desc: 'Timely preparation and electronic filing of monthly Provident Fund and ESI returns.', icon: ShieldCheck },
              { title: 'TDS & Statutory Compliance', desc: 'Tax deduction computations at source, Form 16 support, and statutory compliance registries.', icon: FileText },
              { title: 'Attendance & Leave Sync', desc: 'Direct integration with biometric clock-in hardware and leave management systems.', icon: CheckCircle2 },
              { title: 'Encrypted Payslip Generation', desc: 'Automated distribution of password-protected digital payslips directly to staff.', icon: Lock },
              { title: 'Payroll Audit Registers', desc: 'Comprehensive monthly variance summaries, general ledger exports, and audit trails.', icon: BarChart3 },
              { title: 'Employee Record Governance', desc: 'Centralized onboarding documentation, CTC structural revisions, and exit clearances.', icon: Users }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  onClick={() => navigateTo('payroll-services', item.title)}
                  className="p-6 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#BAE6FD] text-[#0284C7] w-fit mb-4 group-hover:bg-[#E0F2FE] transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-bold text-[#092342] mb-2 group-hover:text-[#0284C7] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#2D425A] leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-bold text-[#0284C7] group-hover:translate-x-1 transition-transform">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ==================================================
          7. SECURITY & DATA GOVERNANCE (Sky Blue Canvas)
          ================================================== */}
      <section className="py-24 bg-[#EBF5FE] border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              SECURITY & DATA GOVERNANCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092342] tracking-tight">
              Security Built Into Every Solution
            </h2>
            <p className="text-[#2D425A] text-base sm:text-lg leading-relaxed font-medium">
              Business data requires deliberate protection at every layer. Techora embeds enterprise security controls into both technical systems and payroll processing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-xl bg-white border border-[#BAE6FD] hover:border-[#0284C7] shadow-xs transition-all space-y-3">
              <div className="p-2.5 rounded-lg bg-[#E0F2FE] text-[#0284C7] w-fit">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#092342]">Secure Authentication</h3>
              <p className="text-xs text-[#2D425A] leading-relaxed">
                Multi-factor authentication (MFA) and granular role-based access control across all corporate systems.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#BAE6FD] hover:border-[#0284C7] shadow-xs transition-all space-y-3">
              <div className="p-2.5 rounded-lg bg-[#E0F2FE] text-[#0284C7] w-fit">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#092342]">Protected Endpoints & APIs</h3>
              <p className="text-xs text-[#2D425A] leading-relaxed">
                TLS 1.3 encrypted API communication with strict rate limiting, authorization tokens, and perimeter defenses.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#BAE6FD] hover:border-[#0284C7] shadow-xs transition-all space-y-3">
              <div className="p-2.5 rounded-lg bg-[#E0F2FE] text-[#0284C7] w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#092342]">Structured Data Validation</h3>
              <p className="text-xs text-[#2D425A] leading-relaxed">
                End-to-end data sanitization, schema verification, and encrypted storage at rest using AES-256 standards.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#BAE6FD] hover:border-[#0284C7] shadow-xs transition-all space-y-3">
              <div className="p-2.5 rounded-lg bg-[#E0F2FE] text-[#0284C7] w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#092342]">Least-Privilege Access</h3>
              <p className="text-xs text-[#2D425A] leading-relaxed">
                Zero-trust privilege boundaries ensuring staff access only the specific records required for their job function.
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigateTo('security')}
              className="text-xs font-bold uppercase tracking-wider text-[#0284C7] hover:underline inline-flex items-center space-x-1 cursor-pointer"
            >
              <span>Review our full Security Architecture & Compliance Framework</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ==================================================
          8. 5-STAGE METHODOLOGY (Clean White Background)
          ================================================== */}
      <section className="py-24 bg-white border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              ENGAGEMENT METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092342] tracking-tight">
              A Structured Approach to Delivery
            </h2>
            <p className="text-[#2D425A] text-base sm:text-lg font-medium">
              Our 5-stage engagement model ensures predictability, transparency, and operational continuity throughout every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Understand', desc: 'Identify organizational requirements, technical constraints, and business targets.' },
              { step: '02', title: 'Assess', desc: 'Audit existing technology stack, infrastructure reliability, and compliance status.' },
              { step: '03', title: 'Architect', desc: 'Engineer practical technical solutions or statutory payroll workflows tailored to your scale.' },
              { step: '04', title: 'Implement', desc: 'Execute phased rollout, data migration, and system integrations with zero interruption.' },
              { step: '05', title: 'Support', desc: 'Provide continuous monitoring, statutory updates, and proactive infrastructure maintenance.' }
            ].map((st, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-6 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-2xl font-black font-mono text-[#0284C7] mb-3 block">
                    {st.step}
                  </span>
                  <h3 className="text-base font-bold text-[#092342] group-hover:text-[#0284C7] transition-colors mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#2D425A] font-normal leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          9. CORE CAPABILITIES (Sky Blue Canvas)
          ================================================== */}
      <section className="py-20 bg-[#EBF5FE] border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] mb-2 block font-mono">
              CORE EXPERTISE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#092342] tracking-tight">
              Engineered for Enterprise Operational Resilience
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {[
              'IT Strategy & Advisory',
              'Cloud Architecture (AWS / Azure)',
              'Cybersecurity Safeguards',
              'Enterprise Software Consulting',
              'ERP & CRM Integration',
              'Statutory Payroll Processing',
              'PF & ESI Compliance',
              'TDS Return Support',
              'Biometric Attendance Sync',
              'Operational Auditing'
            ].map((cap, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 rounded-lg bg-white border border-[#BAE6FD] text-[#092342] text-xs sm:text-sm font-semibold hover:border-[#0284C7] hover:bg-[#E0F2FE] transition-all shadow-xs"
              >
                {cap}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          10. FINAL CALL TO ACTION (Luminous Sky Blue Canvas)
          ================================================== */}
      <section className="py-24 bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 sm:p-14 border border-[#BAE6FD] text-center shadow-md shadow-sky-900/5 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
                START A CONVERSATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092342] tracking-tight">
                {content.homeCtaTitle || 'Ready to Improve Your IT & Payroll Operations?'}
              </h2>
              <p className="text-[#2D425A] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                {content.homeCtaSubtitle || "Speak with our enterprise consulting team to evaluate your technology infrastructure or streamline your statutory payroll compliance."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all inline-flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>{content.homeCtaButton || 'Schedule a Consultation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToSolutions}
                  className="px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-xs text-[#092342] bg-[#EBF5FE] hover:bg-[#E0F2FE] border border-[#BAE6FD] hover:border-[#0284C7] transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>View Our Practice Areas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};
