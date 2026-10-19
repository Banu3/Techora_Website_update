import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const DetailModal = ({ service, onClose, onEnquire }) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#092342]/50 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          className="relative w-full max-w-2xl bg-white border border-[#BAE6FD] rounded-xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0284C7]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#092342] hover:text-[#0284C7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#E0F2FE] border border-[#BAE6FD] text-[#0C4A6E] text-xs font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{service.badge || 'Enterprise Capability'}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#092342] mb-3">{service.title}</h3>

          <p className="text-[#2D425A] text-sm sm:text-base leading-relaxed mb-6 font-normal">
            {service.fullDesc || service.shortDesc}
          </p>

          {/* Key Deliverables */}
          {service.deliverables && service.deliverables.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#092342] mb-3">
                Key Strategic Deliverables & Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-lg bg-[#EBF5FE] border border-[#BAE6FD]">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] mt-0.5 shrink-0" />
                    <span className="text-xs sm:text-sm text-[#092342] font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#BAE6FD] flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#2D425A] hover:text-[#092342] bg-[#E0F2FE] border border-[#BAE6FD] transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEnquire(service.title);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-sky-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>Enquire About {service.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
