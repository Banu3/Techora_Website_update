import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, Code2, Cloud, Server, ShieldCheck, Zap, Database, FileCheck,
  Calculator, BadgePercent, Building2, FileText, CalendarCheck, Receipt, BarChart3, Users,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Compass, Code2, Cloud, Server, ShieldCheck, Zap, Database, FileCheck,
  Calculator, BadgePercent, Building2, FileText, CalendarCheck, Receipt, BarChart3, Users
};

export const ServiceCard = ({ service, onSelect, index = 0 }) => {
  const IconComponent = iconMap[service.iconName] || ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="bg-white p-6 sm:p-7 rounded-xl border border-[#BAE6FD] shadow-xs hover:border-[#0284C7] hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
      onClick={() => onSelect(service)}
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="card-icon p-3 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] group-hover:bg-[#BAE6FD] transition-colors duration-200">
            <IconComponent className="w-5 h-5" />
          </div>
          {service.badge && (
            <span className="px-2.5 py-1 rounded text-[11px] font-bold tracking-wide bg-[#E0F2FE] text-[#0C4A6E] border border-[#BAE6FD]">
              {service.badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#092342] mb-2.5 group-hover:text-[#0284C7] transition-colors duration-200 leading-snug">
          {service.title}
        </h3>

        <p className="text-[#2D425A] text-xs sm:text-sm leading-relaxed mb-6 font-normal">
          {service.shortDesc}
        </p>
      </div>

      <div className="pt-4 border-t border-[#BAE6FD] flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(service);
          }}
          className="text-xs font-bold uppercase tracking-wider text-[#0284C7] hover:text-[#0369A1] flex items-center space-x-1.5 transition-colors focus:outline-none group/btn cursor-pointer"
        >
          <span>View Scope & Deliverables</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
