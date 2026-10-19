import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SEOMeta } from '../components/SEOMeta';
import { 
  Calculator, Sliders, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, DollarSign, Building2, Zap, FileText, Compass
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const ROICalculatorPage = ({ setActivePage, setSelectedServiceTitle }) => {
  const { content } = useContent();
  const [headcount, setHeadcount] = useState(250);
  const [cloudNodes, setCloudNodes] = useState(15);
  
  // Selected Modules
  const [selectedIT, setSelectedIT] = useState(['it-strategy', 'cloud', 'cybersecurity']);
  const [selectedPayroll, setSelectedPayroll] = useState(['payroll-proc', 'pf-esi', 'tds-comp']);

  const toggleIT = (id) => {
    setSelectedIT(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const togglePayroll = (id) => {
    setSelectedPayroll(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Math Estimates
  const baseSavingsPerHead = 1800;
  const cloudOptimizationPerNode = 12000;
  
  const annualPayrollSavings = headcount * baseSavingsPerHead * (selectedPayroll.length > 0 ? 1 : 0);
  const annualCloudSavings = cloudNodes * cloudOptimizationPerNode * (selectedIT.includes('cloud') ? 1 : 0);
  const totalEstimatedSavings = annualPayrollSavings + annualCloudSavings;

  const handleRequestQuote = () => {
    if (setSelectedServiceTitle) {
      setSelectedServiceTitle(`Custom ROI Scope (${headcount} Staff / ${cloudNodes} Nodes)`);
    }
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOMeta
        title="Interactive ROI & Efficiency Calculator — Techora"
        description="Estimate operational cost savings and efficiency gains achieved through structured IT consulting and automated payroll workflows."
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
            <Calculator className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{content.roiHeroBadge || 'Operational ROI Simulator'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#092342] tracking-tight leading-tight"
          >
            {content.roiHeroTitle || 'Configure Your Scope. Project Operational Impact.'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-[#2D425A] text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-medium"
          >
            {content.roiHeroSubtitle || 'Select your workforce headcount, active cloud infrastructure scale, and required practice modules to project operational savings.'}
          </motion.p>

        </div>
      </section>

      {/* CALCULATOR INTERACTION SECTION (Clean White Background) */}
      <section className="py-24 bg-white border-b border-[#BAE6FD] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Scope Selectors */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Sliders Card */}
              <div className="p-6 sm:p-7 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] shadow-xs space-y-6">
                <h3 className="text-lg font-bold text-[#092342] flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#0284C7]" />
                  <span>1. Organizational Scale Parameters</span>
                </h3>

                {/* Headcount Slider */}
                <div>
                  <div className="flex justify-between text-xs text-[#2D425A] mb-2 font-medium">
                    <span>Workforce Headcount:</span>
                    <span className="text-[#0284C7] font-bold font-mono text-sm">{headcount} Staff</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    step="10"
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
                  />
                </div>

                {/* Cloud Nodes Slider */}
                <div>
                  <div className="flex justify-between text-xs text-[#2D425A] mb-2 font-medium">
                    <span>Active Cloud Nodes / Compute Clusters:</span>
                    <span className="text-[#0284C7] font-bold font-mono text-sm">{cloudNodes} Servers</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    step="1"
                    value={cloudNodes}
                    onChange={(e) => setCloudNodes(Number(e.target.value))}
                    className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
                  />
                </div>
              </div>

              {/* Module Toggles */}
              <div className="p-6 sm:p-7 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] shadow-xs space-y-6">
                <h3 className="text-lg font-bold text-[#092342] flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-[#0284C7]" />
                  <span>2. Practice Disciplines in Scope</span>
                </h3>

                {/* IT Consulting Modules */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#092342] block mb-3 font-mono">
                    IT Consulting Modules:
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'it-strategy', name: 'IT Strategy Roadmap' },
                      { id: 'cloud', name: 'Cloud Migration & Optimization' },
                      { id: 'cybersecurity', name: 'Security Architecture' },
                      { id: 'erp-crm', name: 'ERP & CRM Integration' }
                    ].map(mod => {
                      const active = selectedIT.includes(mod.id);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => toggleIT(mod.id)}
                          className={`p-3 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                            active 
                              ? 'bg-white border-[#0284C7] text-[#092342] font-bold shadow-xs' 
                              : 'bg-white/60 border-[#BAE6FD] text-[#2D425A] hover:text-[#092342]'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}{mod.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payroll Modules */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#092342] block mb-3 font-mono">
                    Payroll & Compliance Modules:
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'payroll-proc', name: 'Gross-to-Net Payroll' },
                      { id: 'pf-esi', name: 'PF & ESI Management' },
                      { id: 'tds-comp', name: 'TDS & Form 16 Filing' },
                      { id: 'payslips', name: 'Digital PDF Payslips' }
                    ].map(mod => {
                      const active = selectedPayroll.includes(mod.id);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => togglePayroll(mod.id)}
                          className={`p-3 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                            active 
                              ? 'bg-white border-[#0284C7] text-[#092342] font-bold shadow-xs' 
                              : 'bg-white/60 border-[#BAE6FD] text-[#2D425A] hover:text-[#092342]'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}{mod.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Dynamic Projected Impact Card */}
            <div className="lg:col-span-5 sticky top-28">
              <div className="bg-[#EBF5FE] p-7 sm:p-8 rounded-xl border border-[#BAE6FD] space-y-6 shadow-sm">
                
                {/* Visual Chart Header */}
                <div className="h-36 rounded-lg bg-white border border-[#BAE6FD] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#092342]">
                      Savings Projection Ledger
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0C4A6E] text-[10px] font-bold border border-[#BAE6FD]">
                      ESTIMATE
                    </span>
                  </div>
                  
                  {/* CSS Bars */}
                  <div className="flex items-end justify-between space-x-2 h-16 px-1">
                     {[20, 35, 50, 45, 70, 85, 100].map((height, i) => (
                       <div key={i} className="flex-1 bg-[#0284C7] rounded-t-xs" style={{ height: `${height}%` }} />
                     ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-[#2D425A] block mb-1 font-semibold">Estimated Annual Value / Efficiency:</span>
                    <span className="text-3xl font-black text-[#092342] font-mono">
                      ₹{totalEstimatedSavings.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#2D425A] block mt-1 font-medium">
                      *Reflects infrastructure optimization and reduced administrative overhead.
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-[#BAE6FD]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#2D425A]">Statutory Compliance Accuracy:</span>
                      <span className="text-[#092342] font-bold">100% Target</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#2D425A]">Payroll Processing Efficiency:</span>
                      <span className="text-[#0284C7] font-bold font-mono">+45% Speed</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#2D425A]">Audit Preparedness:</span>
                      <span className="text-[#092342] font-bold">Zero-Penalty Guarantee</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleRequestQuote}
                      className="w-full py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <span>Request Scope Proposal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};
