import React, { useEffect } from 'react';
import HomeHero from '../components/home/HomeHero';
import WelcomeIntro from '../components/home/WelcomeIntro';
import ThreeColumnCards from '../components/home/ThreeColumnCards';
import HomeSplitSection from '../components/home/HomeSplitSection';
import FullWidthBanner from '../components/home/FullWidthBanner';

export default function Home({ onOpenConsultModal }) {
  useEffect(() => {
    document.title = 'TECHORA Consultant — People. Expertise. Business Growth.';

    // Inject Organization JSON-LD with verified corporate data
    const jsonLdId = 'techora-org-schema';
    let script = document.getElementById(jsonLdId);
    if (!script) {
      script = document.createElement('script');
      script.id = jsonLdId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'TECHORA Consultant',
        description: 'Corporate consulting, executive recruitment, talent acquisition, and statutory payroll solutions.',
        url: 'https://techora.consulting/',
        foundingDate: '2026',
        serviceType: [
          'Executive Talent Acquisition',
          'Payroll Solutions and Statutory Governance',
          'Strategic Workforce Advisory',
          'Corporate Consulting',
        ],
        areaServed: 'Global',
      });
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--white)', width: '100%' }}>
      {/* 2. Hero Slider (full width, landscape) */}
      <HomeHero />

      {/* 3. Welcome Section (centered) */}
      <WelcomeIntro />

      {/* 4. Three-Column Service Cards */}
      <ThreeColumnCards />

      {/* 5. Split Section (text left, image right) */}
      <HomeSplitSection />

      {/* 6. Full-Width Image Banner */}
      <FullWidthBanner onOpenConsultModal={onOpenConsultModal} />
    </div>
  );
}
