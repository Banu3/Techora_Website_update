import React from 'react';
import { motion } from 'framer-motion';
import { SecurityPillars } from '../components/SecurityPillars';
import { SEOMeta } from '../components/SEOMeta';
import { Shield, ShieldCheck, Lock, ArrowRight, KeyRound, Server } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const SecurityPage = ({ setActivePage }) => {
  const { content } = useContent();
  return (
    <>
      <SEOMeta
        title="Security Built Into Every Solution — Techora"
        description="From technology infrastructure to payroll data, Techora follows security-focused practices designed to protect sensitive business information."
      />

      {/* SECURITY HERO (Luminous Sky Blue Canvas) */}
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
                <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{content.securityHeroBadge || 'Security Architecture & Data Governance'}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="text-4xl sm:text-5xl font-extrabold text-[#092342] tracking-tight leading-tight"
              >
                {content.securityHeroTitle || 'Enterprise Security Built Into Every Layer'}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="text-[#2D425A] text-lg sm:text-xl leading-relaxed max-w-2xl font-medium"
              >
                {content.securityHeroSubtitle || 'From technology infrastructure to payroll data, Techora follows security-focused practices designed to protect sensitive business information.'}
              </motion.p>
            </div>

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="rounded-xl border border-[#BAE6FD] bg-white shadow-sm p-8 flex flex-col items-center text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7] mb-1 shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#092342]">Security Verification Posture</h3>
                <p className="text-xs text-[#2D425A] max-w-xs leading-relaxed font-medium">
                  Multi-factor authentication, encrypted communications, and role-based access control active across all client environments.
                </p>
                <div className="pt-3 border-t border-[#BAE6FD] w-full flex items-center justify-between text-xs font-bold text-[#092342]">
                  <span>Active Defense Status</span>
                  <span className="text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded border border-[#BAE6FD]">Enforced</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECURITY PILLARS SECTION (Clean White Background) */}
      <section className="py-24 bg-white border-b border-[#BAE6FD] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              CORE SECURITY CONTROLS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#092342] tracking-tight">
              Enterprise Defense Posture
            </h2>
            <p className="text-[#2D425A] text-base leading-relaxed font-medium">
              Structured security frameworks governing our software development, infrastructure management, and payroll operations.
            </p>
          </div>

          <SecurityPillars />

        </div>
      </section>

      {/* CALL TO ACTION (Luminous Sky Blue Canvas) */}
      <section className="py-20 bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#BAE6FD] shadow-sm space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              RISK MITIGATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#092342]">
              {content.securityCtaTitle || 'Discuss Your Enterprise Security Architecture'}
            </h3>
            <p className="text-[#2D425A] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
              {content.securityCtaSubtitle || 'Our technology practice advisors provide structured security reviews, vulnerability evaluations, and practical risk-mitigation roadmaps.'}
            </p>
            <div>
              <button
                onClick={() => {
                  setActivePage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all inline-flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>{content.securityCtaButton || 'Talk to a Security Specialist'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
