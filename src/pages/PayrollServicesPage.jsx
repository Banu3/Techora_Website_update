import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PAYROLL_SERVICES } from '../data/servicesData';
import { ServiceCard } from '../components/ServiceCard';
import { DetailModal } from '../components/DetailModal';
import { SEOMeta } from '../components/SEOMeta';
import { Calculator, ShieldCheck, CheckCircle2, ArrowRight, DollarSign, FileText } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const PayrollServicesPage = ({ setActivePage, setSelectedServiceTitle }) => {
  const { content } = useContent();
  const [selectedService, setSelectedService] = useState(null);

  // Interactive Salary Estimator Widget State
  const [grossSalary, setGrossSalary] = useState(1200000); // Annual CTC in INR
  const [regime, setRegime] = useState('new');

  const basicPay = Math.round(grossSalary * 0.5);
  const hra = Math.round(grossSalary * 0.2);
  const pfEmployee = Math.min(Math.round(basicPay * 0.12), 21600);
  const estimatedTds = regime === 'new' ? Math.round(grossSalary * 0.08) : Math.round(grossSalary * 0.11);
  const netAnnualTakeHome = grossSalary - pfEmployee - estimatedTds;
  const monthlyTakeHome = Math.round(netAnnualTakeHome / 12);

  const handleEnquire = (serviceTitle) => {
    if (setSelectedServiceTitle) {
      setSelectedServiceTitle(serviceTitle);
    }
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOMeta
        title="Payroll Services & Statutory Compliance — Techora"
        description="Techora helps businesses manage payroll operations efficiently — from salary calculations and employee data to statutory compliance and payroll reporting."
      />

      {/* PAYROLL HERO (Luminous Sky Blue Canvas) */}
      <section className="pt-36 pb-20 relative overflow-hidden border-b border-[#BAE6FD] bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-white border border-[#BAE6FD] text-[#0C4A6E] text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{content.payrollHeroBadge || 'Automated Salary Processing & Statutory Compliance'}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="text-4xl sm:text-5xl font-extrabold text-[#092342] tracking-tight leading-tight"
              >
                {content.payrollHeroTitle || 'Payroll Services: Accurate, Timely & 100% Compliant'}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="text-[#2D425A] text-lg sm:text-xl leading-relaxed max-w-2xl font-medium"
              >
                {content.payrollHeroSubtitle || 'Techora manages complete payroll operations — from gross-to-net salary calculations and employee records to provident fund filings, tax deductions, and reporting.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="flex flex-wrap gap-3 text-xs font-semibold text-[#092342]"
              >
                <div className="px-3.5 py-2 rounded-lg bg-white border border-[#BAE6FD] flex items-center space-x-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Zero-Defect Salary Disbursal</span>
                </div>
                <div className="px-3.5 py-2 rounded-lg bg-white border border-[#BAE6FD] flex items-center space-x-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>PF, ESI & TDS Monthly Filings</span>
                </div>
                <div className="px-3.5 py-2 rounded-lg bg-white border border-[#BAE6FD] flex items-center space-x-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Encrypted PDF Payslips</span>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="rounded-xl border border-[#BAE6FD] bg-white shadow-sm p-6 sm:p-7 flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#BAE6FD] pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#092342]">Disbursal Processing Ledger</span>
                  <span className="text-xs font-bold text-[#0C4A6E] bg-[#E0F2FE] px-2.5 py-0.5 rounded border border-[#BAE6FD]">Verified Cycle</span>
                </div>
                
                <div className="bg-[#EBF5FE] rounded-lg border border-[#BAE6FD] p-4 shadow-xs">
                  <div className="flex justify-between items-end border-b border-[#BAE6FD] pb-3 mb-3">
                    <div>
                      <div className="text-[11px] text-[#2D425A] uppercase tracking-wider mb-1 font-mono font-bold">Disbursal Batch Total</div>
                      <div className="text-2xl font-black text-[#092342] font-mono">₹45,80,000</div>
                    </div>
                    <div className="text-[#0284C7] text-xs font-bold bg-white px-2 py-0.5 rounded border border-[#BAE6FD]">Reconciled</div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#2D425A]">Statutory TDS Deducted</span>
                      <span className="text-[#092342] font-bold font-mono">₹6,85,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#2D425A]">Provident Fund (PF & ESI)</span>
                      <span className="text-[#092342] font-bold font-mono">₹3,45,000</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD] text-center shadow-xs">
                  <span className="text-xs font-bold text-[#092342] block">100% Guaranteed On-Time Disbursal & Statutory Returns</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 8 PAYROLL SERVICES GRID (Clean White Background) */}
      <section className="py-24 bg-white relative border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
                COMPREHENSIVE SPECTRUM
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#092342] tracking-tight">
                Our Payroll Management Services
              </h2>
            </div>
            <p className="text-[#2D425A] text-sm max-w-md mt-2 md:mt-0 leading-relaxed font-medium">
              Select any capability to review detailed workflows, statutory compliance rules, and sample reporting outputs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAYROLL_SERVICES.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onSelect={(svc) => setSelectedService(svc)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* INTERACTIVE SALARY ENGINE PREVIEW WIDGET (Sky Blue Section) */}
      <section className="py-20 bg-[#EBF5FE] border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
                CALCULATION SIMULATOR
              </span>
              <h3 className="text-3xl font-extrabold text-[#092342] tracking-tight">
                Structured Compensation & Tax Deductions
              </h3>
              <p className="text-[#2D425A] text-sm leading-relaxed font-medium">
                Techora's payroll framework calculates gross-to-net salary components, statutory contributions (PF, ESI), and income tax (TDS) under both tax regimes accurately.
              </p>
              
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center space-x-3 text-xs text-[#2D425A] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>Pro-rata joining & exit calculations</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-[#2D425A] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>Biometric attendance & leave integration</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-[#2D425A] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>Digital password-protected payslip batches</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#BAE6FD] shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#BAE6FD] mb-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#0284C7]" />
                    <span className="text-sm font-bold text-[#092342]">Salary Breakdown Calculator</span>
                  </div>
                  <div className="flex bg-[#EBF5FE] p-1 rounded-md border border-[#BAE6FD] text-xs font-semibold">
                    <button
                      onClick={() => setRegime('new')}
                      className={`px-3 py-1 rounded transition-colors cursor-pointer ${regime === 'new' ? 'bg-[#0284C7] text-white font-bold' : 'text-[#2D425A]'}`}
                    >
                      New Tax Regime
                    </button>
                    <button
                      onClick={() => setRegime('old')}
                      className={`px-3 py-1 rounded transition-colors cursor-pointer ${regime === 'old' ? 'bg-[#0284C7] text-white font-bold' : 'text-[#2D425A]'}`}
                    >
                      Old Tax Regime
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs text-[#2D425A] mb-2 font-medium">
                      <span>Annual Gross Package (CTC):</span>
                      <span className="text-[#0284C7] font-bold font-mono">₹{grossSalary.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="300000"
                      max="5000000"
                      step="50000"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(Number(e.target.value))}
                      className="w-full h-2 bg-[#EBF5FE] rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD]">
                      <span className="text-[10px] text-[#2D425A] block mb-1">Basic Salary</span>
                      <span className="text-xs font-bold text-[#092342] font-mono">₹{basicPay.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD]">
                      <span className="text-[10px] text-[#2D425A] block mb-1">HRA Component</span>
                      <span className="text-xs font-bold text-[#092342] font-mono">₹{hra.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD]">
                      <span className="text-[10px] text-[#2D425A] block mb-1">Annual PF</span>
                      <span className="text-xs font-bold text-[#2D425A] font-mono">₹{pfEmployee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD]">
                      <span className="text-[10px] text-[#2D425A] block mb-1">Est. TDS</span>
                      <span className="text-xs font-bold text-[#092342] font-mono">₹{estimatedTds.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-[#0C4A6E] block font-semibold">Estimated Monthly Take-Home:</span>
                      <span className="text-2xl font-black text-[#092342] font-mono">₹{monthlyTakeHome.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      onClick={() => handleEnquire('Payroll Processing')}
                      className="px-5 py-2.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-sky-600/20 active:scale-95"
                    >
                      Automate Your Payroll
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BOTTOM CTA (Luminous Sky Blue Canvas) */}
      <section className="py-20 bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#BAE6FD] shadow-sm space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              COMPLIANCE ASSURANCE
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#092342]">
              {content.payrollCtaTitle || 'Simplify Your Enterprise Payroll Compliance'}
            </h3>
            <p className="text-[#2D425A] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
              {content.payrollCtaSubtitle || "Eliminate statutory penalties, processing errors, and manual spreadsheet calculations with Techora's payroll services."}
            </p>
            <div>
              <button
                onClick={() => handleEnquire('Payroll Processing')}
                className="px-8 py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all inline-flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>{content.payrollCtaButton || 'Request Payroll Consultation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}
      <DetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onEnquire={handleEnquire}
      />
    </>
  );
};
