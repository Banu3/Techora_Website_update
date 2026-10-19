import React from 'react';
import { motion } from 'framer-motion';
import { CORE_VALUES } from '../data/companyData';
import { SEOMeta } from '../components/SEOMeta';
import { Shield, Sparkles, Lock, Clock, HeartHandshake, Target, Eye, Award, CheckCircle2, ArrowRight, Users, Globe, Building2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const valueIconMap = {
  Shield, Sparkles, Lock, Clock, HeartHandshake
};

export const AboutPage = ({ setActivePage }) => {
  const { content } = useContent();
  return (
    <>
      <SEOMeta
        title="About TECHORA — Technology Expertise. Business Understanding."
        description="Techora combines technology consulting expertise with operational business solutions to help organizations improve their technology infrastructure, digital processes, and payroll operations."
      />

      {/* ABOUT HERO (Luminous Sky Blue Canvas) */}
      <section className="pt-36 pb-20 relative overflow-hidden border-b border-[#BAE6FD] bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl space-y-6">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-white border border-[#BAE6FD] text-[#0C4A6E] text-xs font-bold uppercase tracking-wider shadow-xs"
          >
            <Award className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{content.aboutHeroBadge || 'Enterprise Technology & Operational Excellence'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-4xl sm:text-6xl font-extrabold text-[#092342] tracking-tight leading-tight"
          >
            {content.aboutHeroTitle || 'Technology Expertise. Business Understanding.'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-[#2D425A] text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-medium"
          >
            {content.aboutHeroSubtitle || 'Techora combines technology consulting expertise with operational business solutions to help organizations improve their technology infrastructure, digital processes, and payroll operations.'}
          </motion.p>

        </div>
      </section>

      {/* MISSION & VISION (Clean White Section) */}
      <section className="py-24 bg-white border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 sm:p-10 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-lg bg-white border border-[#BAE6FD] text-[#0284C7]">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#092342]">
                  {content.aboutMissionTitle || 'Our Mission'}
                </h3>
              </div>

              <blockquote className="text-lg font-bold text-[#0284C7] mb-4 leading-relaxed">
                {content.aboutMissionQuote || '"Help businesses use technology to operate smarter, safer, and more efficiently."'}
              </blockquote>

              <p className="text-[#2D425A] text-sm leading-relaxed">
                {content.aboutMissionDesc || 'We empower modern organizations by removing technical debt, safeguarding critical assets, and providing error-free operational frameworks that unlock long-term scalability.'}
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 sm:p-10 rounded-xl bg-[#EBF5FE] border border-[#BAE6FD] hover:border-[#0284C7] hover:bg-white shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-lg bg-white border border-[#BAE6FD] text-[#0284C7]">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#092342]">
                  {content.aboutVisionTitle || 'Our Vision'}
                </h3>
              </div>

              <blockquote className="text-lg font-bold text-[#0284C7] mb-4 leading-relaxed">
                {content.aboutVisionQuote || '"Become a trusted technology and business solutions partner for growing organizations."'}
              </blockquote>

              <p className="text-[#2D425A] text-sm leading-relaxed">
                {content.aboutVisionDesc || 'We strive to set the benchmark in enterprise technology advisory and automated statutory management, recognized for reliability, engineering discipline, and total client focus.'}
              </p>
            </motion.div>

          </div>

          {/* ADVISORY TEAM & GLOBAL OPERATIONS SHOWCASE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 rounded-xl border border-[#BAE6FD] bg-[#EBF5FE] shadow-xs p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#BAE6FD] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0284C7] border border-[#BAE6FD]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[#092342] font-bold text-sm">Advisory & Engineering Leadership</div>
                    <div className="text-[#0C4A6E] text-[10px] uppercase font-bold tracking-wider">Practice Network</div>
                  </div>
                </div>
                <div className="bg-[#E0F2FE] text-[#0C4A6E] text-[11px] font-bold px-3 py-1 rounded border border-[#BAE6FD]">Active Practice</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-[#BAE6FD]">
                  <div className="text-[#0284C7] text-3xl font-extrabold mb-1 font-mono">10+ Yrs</div>
                  <div className="text-[#2D425A] text-xs font-semibold">Avg Senior Experience</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-[#BAE6FD]">
                  <div className="text-[#092342] text-3xl font-extrabold mb-1 font-mono">100%</div>
                  <div className="text-[#2D425A] text-xs font-semibold">Compliance Track Record</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white border border-[#BAE6FD]">
                <span className="text-xs font-bold text-[#0284C7] block uppercase mb-1">Multidisciplinary Practice</span>
                <span className="text-sm font-bold text-[#092342] block">Senior Technical Architects & Statutory Compliance Specialists</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-6 rounded-xl border border-[#BAE6FD] bg-[#EBF5FE] shadow-xs p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#BAE6FD] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0284C7] border border-[#BAE6FD]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[#092342] font-bold text-sm">Enterprise Service Coverage</div>
                    <div className="text-[#0C4A6E] text-[10px] uppercase font-bold tracking-wider">Distributed Infrastructure</div>
                  </div>
                </div>
                <span className="flex items-center space-x-1.5 text-xs text-[#0284C7] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Available</span>
                </span>
              </div>

              <div className="p-4 rounded-lg bg-white border border-[#BAE6FD] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#092342]">
                  <span>Cloud Data Centers & Systems</span>
                  <span className="text-[#0284C7] font-bold">Tier-III Redundant</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#092342]">
                  <span>Statutory Compliance Jurisdictions</span>
                  <span className="text-[#0284C7] font-bold">All Major States</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#092342]">
                  <span>Customer Support Response</span>
                  <span className="text-[#0284C7] font-bold">&lt; 1 Hour SLA</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white border border-[#BAE6FD]">
                <span className="text-xs font-bold text-[#0284C7] block uppercase mb-1">Standardized Delivery</span>
                <span className="text-sm font-bold text-[#092342] block">Centralized Governance with Dedicated Account Management</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CORE VALUES (Sky Blue Section) */}
      <section className="py-24 bg-[#EBF5FE] border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#092342] tracking-tight">
              Our Core Values
            </h2>
            <p className="text-[#2D425A] text-base sm:text-lg font-medium">
              The fundamental principles that guide our technical engineering, client advisory, and business ethics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CORE_VALUES.map((val, idx) => {
              const IconComp = valueIconMap[val.iconName] || Shield;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-6 rounded-xl bg-white border border-[#BAE6FD] hover:border-[#0284C7] text-center group shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD] text-[#0284C7] mx-auto flex items-center justify-center mb-4 group-hover:bg-[#E0F2FE] transition-all">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h4 className="text-base font-bold text-[#092342] mb-2 group-hover:text-[#0284C7] transition-colors">
                      {val.title}
                    </h4>

                    <p className="text-[#2D425A] text-xs leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CALL TO ACTION (Luminous Sky Blue Canvas) */}
      <section className="py-20 bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#BAE6FD] shadow-sm space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              COLLABORATION
            </span>
            <h3 className="text-3xl font-extrabold text-[#092342]">
              {content.aboutCtaTitle || 'Partner With Techora Today'}
            </h3>
            <p className="text-[#2D425A] text-base max-w-xl mx-auto font-medium">
              {content.aboutCtaSubtitle || 'Experience enterprise-grade technology consulting and payroll compliance built for modern speed.'}
            </p>
            <div>
              <button
                onClick={() => {
                  setActivePage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all inline-flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>{content.aboutCtaButton || 'Talk to an Expert'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
