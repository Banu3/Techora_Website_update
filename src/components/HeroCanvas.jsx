import React from 'react';

export const HeroCanvas = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-[#EBF5FE] overflow-hidden">
      <img
        src="/images/hero-bg.png?v=3"
        alt="TECHORA Enterprise Headquarters"
        className="w-full h-full object-cover opacity-[0.12] mix-blend-multiply"
      />
      {/* Luminous Sky Blue ambient gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E0F2FE]/95 via-[#EBF5FE]/85 to-[#DDF1FF]/95"></div>
      
      {/* Soft atmospheric Sky Blue radial light */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#BAE6FD]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-[#BAE6FD]/30 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};
