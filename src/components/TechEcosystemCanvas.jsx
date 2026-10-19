import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TECH_ECOSYSTEM } from '../data/companyData';
import { Code, Server, Network, Cloud, Database, Shield, Cpu, Layers, BarChart } from 'lucide-react';

const iconMap = {
  'React.js': Code,
  'Node.js': Server,
  'REST APIs': Network,
  'Cloud Infrastructure': Cloud,
  'Databases': Database,
  'Cybersecurity': Shield,
  'ERP Systems': Cpu,
  'CRM Platforms': Layers,
  'Business Analytics': BarChart,
};

export const TechEcosystemCanvas = () => {
  const [activeTech, setActiveTech] = useState(TECH_ECOSYSTEM[0]);

  return (
    <div className="relative rounded-2xl glass-panel p-8 md:p-12 overflow-hidden border border-slate-800">
      <div className="absolute inset-0 bg-hero-gradient opacity-30 pointer-events-none" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Tech Grid */}
        <div className="lg:col-span-7 grid grid-cols-3 gap-3 md:gap-4">
          {TECH_ECOSYSTEM.map((tech) => {
            const IconComp = iconMap[tech.name] || Code;
            const isSelected = activeTech.name === tech.name;

            return (
              <motion.button
                key={tech.name}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTech(tech)}
                className={`p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div
                  className="p-3 rounded-lg mb-2 transition-colors"
                  style={{
                    backgroundColor: isSelected ? `${tech.color}22` : 'rgba(255,255,255,0.03)',
                    color: isSelected ? tech.color : '#94A3B8',
                  }}
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <span className={`text-xs md:text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                  {tech.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Column: Detailed Inspector Card */}
        <div className="lg:col-span-5">
          <motion.div
            key={activeTech.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8 rounded-xl bg-slate-900/90 border border-slate-700/80 relative"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{activeTech.category}</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{activeTech.name}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {activeTech.desc}. Engineered for enterprise compliance, high availability, and zero data leakage.
            </p>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Architecture Standard:</span>
                <span className="text-slate-200">ISO/IEC 27001</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Integration Protocol:</span>
                <span className="text-cyan-400">RESTful / gRPC</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Availability Target:</span>
                <span className="text-emerald-400">99.99% Uptime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
