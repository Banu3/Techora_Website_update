import React from 'react';
import { motion } from 'framer-motion';
import { WORKFLOW_STEPS } from '../data/companyData';
import { Search, BarChart, Sliders, RefreshCw, ArrowRight } from 'lucide-react';

const iconMap = {
  Search, BarChart, Sliders, RefreshCw
};

export const ProcessTimeline = () => {
  return (
    <div className="relative py-12">
      {/* Desktop Horizontal Timeline Line */}
      <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#2563EB]/20 -translate-y-6 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        {WORKFLOW_STEPS.map((step, idx) => {
          const IconComp = iconMap[step.iconName] || Search;
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#2563EB] hover:-translate-y-1 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] flex items-center justify-center font-mono font-bold text-lg group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-300 group-hover:text-[#2563EB]/40 transition-colors">
                    {step.step}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-1 rounded bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-mono mb-2">
                  Phase {step.step}
                </div>

                <h4 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">
                  {step.name}
                </h4>

                <p className="text-[#475569] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < WORKFLOW_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
