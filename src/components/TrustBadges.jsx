import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, TrendingUp, CheckCircle2 } from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    { title: 'Secure Solutions', icon: ShieldCheck, desc: 'ISO 27001 & SOC 2 Standard' },
    { title: 'Business-Focused', icon: Target, desc: 'Strategy Aligned to Business ROI' },
    { title: 'Scalable Technology', icon: TrendingUp, desc: 'Cloud & Microservices Native' },
    { title: 'Compliance Ready', icon: CheckCircle2, desc: 'Automated PF / ESI / TDS Returns' }
  ];

  return (
    <div className="relative py-8 border-y border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((b, i) => {
            const IconComp = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#2563EB] hover:-translate-y-0.5 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-wide group-hover:text-[#2563EB] transition-colors">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] font-mono mt-0.5">{b.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
