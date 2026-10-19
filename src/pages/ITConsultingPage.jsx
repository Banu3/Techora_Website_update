import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IT_SERVICES } from '../data/servicesData';
import { ServiceCard } from '../components/ServiceCard';
import { DetailModal } from '../components/DetailModal';
import { SEOMeta } from '../components/SEOMeta';
import { Compass, ShieldCheck, Cpu, ArrowRight, Server, Layers, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const ITConsultingPage = ({ setActivePage, setSelectedServiceTitle }) => {
  const { content } = useContent();
  const [selectedService, setSelectedService] = useState(null);

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
        title="IT Consulting Services — Techora"
        description="From technology strategy to cybersecurity and digital transformation, Techora helps businesses build secure, scalable, and future-ready technology environments."
      />

      {/* IT CONSULTING HERO (Luminous Sky Blue Canvas) */}
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
                <Compass className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{content.itHeroBadge || 'Enterprise IT Advisory & Architecture'}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="text-4xl sm:text-5xl font-extrabold text-[#092342] tracking-tight leading-tight"
              >
                {content.itHeroTitle || 'IT Consulting Services That Turn Technology Into Business Advantage'}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="text-[#2D425A] text-lg sm:text-xl leading-relaxed max-w-2xl font-medium"
              >
                {content.itHeroSubtitle || 'From technology strategy to cybersecurity and cloud modernization, Techora helps organizations build dependable, future-ready infrastructure.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="flex flex-wrap gap-3 text-xs font-semibold text-[#092342]"
              >
                <div className="px-3.5 py-2 rounded-lg bg-white border border-[#BAE6FD] flex items-center space-x-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Strategic Roadmap Planning</span>
                </div>
                <div className="px-3.5 py-2 rounded-lg bg-white border border-[#BAE6FD] flex items-center space-x-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Resilient Cloud Systems</span>
                </div>
                <div className="px-3.5 py-2 rounded-lg bg-white border border-[#BAE6FD] flex items-center space-x-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Defensive Cybersecurity</span>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[#092342]">Infrastructure SLA Status</span>
                  <span className="text-xs font-bold text-[#0C4A6E] bg-[#E0F2FE] px-2.5 py-0.5 rounded border border-[#BAE6FD]">Operational</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#EBF5FE] border border-[#BAE6FD] rounded-lg p-4 shadow-xs">
                    <div className="h-1.5 w-8 bg-[#0284C7] rounded-full mb-3" />
                    <div className="text-2xl font-black text-[#092342] mb-0.5 font-mono">99.98%</div>
                    <div className="text-[11px] text-[#2D425A] font-semibold">Target Uptime SLA</div>
                  </div>
                  <div className="bg-[#EBF5FE] border border-[#BAE6FD] rounded-lg p-4 shadow-xs">
                    <div className="h-1.5 w-8 bg-[#092342] rounded-full mb-3" />
                    <div className="text-2xl font-black text-[#092342] mb-0.5 font-mono">&lt; 15ms</div>
                    <div className="text-[11px] text-[#2D425A] font-semibold">Internal Routing Latency</div>
                  </div>
                </div>

                <div className="bg-[#EBF5FE] border border-[#BAE6FD] rounded-lg p-4 h-24 flex items-end space-x-2 shadow-xs">
                  {[45, 68, 52, 85, 70, 88, 96, 60].map((height, i) => (
                    <div key={i} className="flex-1 bg-[#0284C7] rounded-t-xs" style={{ height: `${height}%` }} />
                  ))}
                </div>

                <div className="pt-2 border-t border-[#BAE6FD] text-center">
                  <span className="text-xs font-bold text-[#092342]">Continuous Architecture & Infrastructure Monitoring</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* CLOUD INFRASTRUCTURE FEATURE BANNER (Clean White Background) */}
      <section className="py-20 bg-white border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-xl border border-[#BAE6FD] shadow-xs bg-[#EBF5FE] p-7 flex items-center justify-center">
                <div className="w-full max-w-md space-y-4">
                  <div className="p-4 rounded-lg bg-white border border-[#BAE6FD] flex justify-between items-center shadow-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] border border-[#BAE6FD]">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#092342]">Primary Infrastructure Cluster</div>
                        <div className="text-[11px] text-[#2D425A] font-semibold mt-0.5">Multi-Region Redundancy</div>
                      </div>
                    </div>
                    <div className="h-2.5 w-2.5 rounded-full bg-[#0284C7]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-white border border-[#BAE6FD] shadow-xs flex flex-col items-center text-center">
                       <ShieldCheck className="w-6 h-6 text-[#0284C7] mb-2" />
                       <div className="text-xs font-bold text-[#092342]">Security Gateway</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white border border-[#BAE6FD] shadow-xs flex flex-col items-center text-center">
                       <Cpu className="w-6 h-6 text-[#092342] mb-2" />
                       <div className="text-xs font-bold text-[#092342]">Compute Engine</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
                INFRASTRUCTURE EXCELLENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#092342] tracking-tight">
                Modern Cloud Infrastructure Engineered for Reliability
              </h2>
              <p className="text-[#2D425A] text-base leading-relaxed">
                Whether migrating workloads to hybrid cloud platforms or optimizing existing systems, our senior architects design clean architectures focused on high availability, security, and cost governance.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
                <div className="p-3.5 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD] shadow-xs">
                  <span className="text-[#0284C7] font-black block text-base mb-0.5 font-mono">99.98%</span>
                  <span className="text-[#2D425A] font-semibold">Target SLA Reliability</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD] shadow-xs">
                  <span className="text-[#092342] font-black block text-base mb-0.5 font-mono">Zero Single Point</span>
                  <span className="text-[#2D425A] font-semibold">Of System Failure</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8 IT CONSULTING SERVICES GRID (Sky Blue Canvas) */}
      <section className="py-24 bg-[#EBF5FE] relative border-b border-[#BAE6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
                PRACTICE AREAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#092342] tracking-tight">
                Our IT Consulting Services
              </h2>
            </div>
            <p className="text-[#2D425A] text-sm max-w-md mt-2 md:mt-0 leading-relaxed font-medium">
              Select any capability to explore specific deliverables, technical scopes, and implementation timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {IT_SERVICES.map((service, index) => (
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

      {/* BOTTOM CTA (Clean White Card Container) */}
      <section className="py-20 bg-gradient-to-b from-[#E0F2FE] via-[#EBF5FE] to-[#DDF1FF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#BAE6FD] shadow-sm space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block font-mono">
              GET IN TOUCH
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#092342]">
              {content.itCtaTitle || 'Need Technical Architecture Advisory?'}
            </h3>
            <p className="text-[#2D425A] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
              {content.itCtaSubtitle || 'Our technology practice leads work directly with your leadership team to assess existing systems and formulate an actionable roadmap.'}
            </p>
            <div>
              <button
                onClick={() => handleEnquire('IT Strategy & Consulting')}
                className="px-8 py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all inline-flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>{content.itCtaButton || 'Schedule IT Consultation'}</span>
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
