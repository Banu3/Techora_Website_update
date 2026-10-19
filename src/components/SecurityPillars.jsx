import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SECURITY_PILLARS } from '../data/companyData';
import { 
  Lock, UserCheck, KeyRound, ShieldAlert, FileCheck2, Cpu, FolderLock, History, CheckCircle, Shield
} from 'lucide-react';

const iconMap = {
  Lock, UserCheck, KeyRound, ShieldAlert, FileCheck2, Cpu, FolderLock, History
};

export const SecurityPillars = () => {
  const [selectedPillar, setSelectedPillar] = useState(SECURITY_PILLARS[0]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SECURITY_PILLARS.map((pillar, idx) => {
          const IconComp = iconMap[pillar.iconName] || Shield;
          const isSelected = selectedPillar.id === pillar.id;

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              onClick={() => setSelectedPillar(pillar)}
              className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#0284C7] shadow-md shadow-sky-600/10'
                  : 'bg-white border-[#BAE6FD] hover:border-[#0284C7] hover:bg-[#EBF5FE]/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg border ${isSelected ? 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]' : 'bg-[#EBF5FE] text-[#0284C7] border-[#BAE6FD]'}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0C4A6E]">0{idx + 1}</span>
                </div>

                <h4 className="text-base font-bold text-[#092342] mb-2">
                  {pillar.title}
                </h4>

                <p className="text-[#2D425A] text-xs leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#BAE6FD] flex items-center justify-between text-[11px] font-mono text-[#2D425A]">
                <span>Architecture Control</span>
                <span className={isSelected ? 'text-[#0284C7] font-bold' : 'text-[#2D425A]'}>
                  {isSelected ? 'Active Focus' : 'Standard'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Realistic Security Transparency Note */}
      <div className="p-4 rounded-lg bg-white border border-[#BAE6FD] text-center text-xs text-[#2D425A] flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 shadow-xs">
        <Shield className="w-4 h-4 text-[#0284C7] shrink-0" />
        <span>
          <strong className="text-[#092342] font-semibold">Security Commitment:</strong> Techora adheres to defense-in-depth principles, proactive posture updates, continuous vulnerability assessments, and strict regulatory compliance.
        </span>
      </div>
    </div>
  );
};
