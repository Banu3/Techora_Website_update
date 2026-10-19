/**
 * ============================================================================
 * TECHORA CONSULTANT — OUR LEGACY CONTENT REPOSITORY
 * ============================================================================
 * Route: /profile/our-legacy
 * Founded Year: 2026
 *
 * Professional Institutional Heritage, Operating Architecture & Roadmap.
 * ============================================================================
 */

export interface LegacyPrinciple {
  title: string;
  description: string;
}

export interface LegacyArchitectureItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
}

export interface LegacyRoadmapPhase {
  phase: string;
  timeframe: string;
  title: string;
  description: string;
  deliverables: string[];
  status: 'Completed' | 'Operational' | 'In Execution' | 'Strategic Horizon';
  isCurrent?: boolean;
}

export interface LegacyContent {
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  hero: {
    breadcrumbs: Array<{ label: string; to?: string }>;
    eyebrow: string;
    heading: string;
    subtext: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    imageAlt: string;
  };
  story: {
    eyebrow: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    highlight: string;
  };
  principles: {
    eyebrow: string;
    heading: string;
    items: LegacyPrinciple[];
  };
  // Replacing redundant Vision/Mission with Institutional Architecture
  architecture: {
    eyebrow: string;
    heading: string;
    subtext: string;
    items: LegacyArchitectureItem[];
  };
  // Replacing simple Upcoming timeline with Strategic Horizon Roadmap
  roadmap: {
    eyebrow: string;
    heading: string;
    subtext: string;
    phases: LegacyRoadmapPhase[];
  };
  commitment: {
    quote: string;
  };
  leadershipNote: {
    heading: string;
    role: string;
    text: string;
    signOff: string;
    name: string;
  };
  cta: {
    heading: string;
    subtext: string;
    primaryButton: string;
    primaryLink: string;
    secondaryButton: string;
    secondaryLink: string;
  };
}

export const legacyContent: LegacyContent = {
  seo: {
    title: 'Our Legacy | Institutional Heritage & Roadmap | TECHORA Consultant',
    description: 'Explore the legacy, operating architecture, and strategic evolution roadmap of TECHORA Consultant — delivering retained executive search and statutory governance.',
    canonical: 'https://techora.consulting/profile/our-legacy',
  },

  // 1. HERO
  hero: {
    breadcrumbs: [
      { label: 'Profile', to: '/profile/about-us' },
      { label: 'Our Legacy' },
    ],
    eyebrow: 'OUR LEGACY • FOUNDED IN 2026',
    heading: 'A Legacy Built on Trust, From Day One.',
    subtext: 'TECHORA Consultant was founded in 2026 with a clear purpose: to bring executive talent acquisition and statutory payroll governance together under one discreet, partner-led practice.',
    buttonText: 'Partner With Us',
    buttonLink: '/partner-with-us',
    image: '/images/profile/legacy-hero.webp',
    imageAlt: 'High-rise architectural glass facade representing corporate institutional legacy',
  },

  // 2. OUR STORY (Founded 2026)
  story: {
    eyebrow: '01 • OUR STORY',
    heading: 'Why TECHORA Was Founded',
    paragraph1: 'In 2026, TECHORA Consultant was established to close a fundamental divide in the corporate ecosystem: organizations hire senior leaders in one silo and manage payroll compliance in another, with little connection between strategic intent and statutory reality.',
    paragraph2: 'We built TECHORA as an integrated fiduciary partner for both. We assist boards and executive leadership in securing transformational leaders while ensuring workforce operations, statutory withholdings, and labor audits operate with disciplined, confidential precision.',
    highlight: "Founded in 2026. Built with modern talent intelligence and audit-proof statutory rigor.",
  },

  // 3. OUR FOUNDING PRINCIPLES (4 cards)
  principles: {
    eyebrow: '02 • FOUNDATIONAL STANDARDS',
    heading: 'Our Founding Principles',
    items: [
      {
        title: 'Fiduciary Integrity',
        description: 'We treat every client mandate and every candidate record with the care of a trustee.',
      },
      {
        title: 'Unwavering Discretion',
        description: 'Searches, salaries and strategies stay confidential. Strict non-disclosure is our standard, not an add-on.',
      },
      {
        title: 'Statutory Accountability',
        description: 'Every payroll and compliance process we run is accurate, documented and audit-ready.',
      },
      {
        title: 'Partner-Led Precision',
        description: 'Senior partners stay involved in every engagement, from first conversation to final outcome.',
      },
    ],
  },

  // 4. INSTITUTIONAL ARCHITECTURE (Replaces duplicate Vision/Mission)
  architecture: {
    eyebrow: '03 • OPERATING ARCHITECTURE',
    heading: 'How We Define Institutional Advisory',
    subtext: 'Rather than transactional services, our institutional framework synchronizes senior executive leadership with compliance risk mitigation across four core pillars.',
    items: [
      {
        number: '01',
        title: 'Retained Search Discretion',
        subtitle: 'Air-Gapped Candidate Intelligence',
        description: 'Executive searches are conducted under strict non-disclosure protocols with blind dossiers, ensuring zero organizational disruption or competitive market exposure.',
        metrics: '100% C-Suite Mandate Exclusivity',
      },
      {
        number: '02',
        title: 'Statutory Governance Engine',
        subtitle: 'Multi-Jurisdictional Payroll Rigor',
        description: 'End-to-end statutory oversight covering labor codes, tax withholdings, social security contributions, and pre-audit reconciliations for regulated enterprises.',
        metrics: 'Zero-Defect Audit Standard',
      },
      {
        number: '03',
        title: 'Partner-Led Compact',
        subtitle: 'Direct Executive Ownership',
        description: 'Every engagement is owned and executed directly by practice partners, capping active mandates to guarantee undivided strategic focus and responsiveness.',
        metrics: 'Partner-to-Mandate Ratio: 1 : 4',
      },
      {
        number: '04',
        title: 'Workforce Talent Mapping',
        subtitle: 'Data-Backed Succession Architecture',
        description: 'Comprehensive compensation benchmarks, competitor talent mapping, and leadership pipeline modeling tailored to Boardroom strategic horizons.',
        metrics: 'Proprietary Market Intelligence',
      },
    ],
  },

  // 5. STRATEGIC HORIZON & ROADMAP (Replaces simplistic Upcoming timeline)
  roadmap: {
    eyebrow: '04 • STRATEGIC HORIZON',
    heading: 'Our Institutional Roadmap',
    subtext: 'A deliberate, phase-governed trajectory advancing TECHORA from a specialized boutique advisory to a pan-regional workforce governance powerhouse.',
    phases: [
      {
        phase: 'Phase 01',
        timeframe: '2026',
        title: 'Institutional Inception & Core Practices',
        description: 'Formal establishment of TECHORA Consultant. Rollout of the Retained Executive Search desk across BFSI, Industrial, and Consumer verticals, alongside the Statutory Governance and Payroll Audit practice.',
        deliverables: [
          'Founding charter and partner-led governance architecture',
          'Launch of Retained Executive Search practice across core verticals',
          'Enterprise Payroll & Statutory Compliance infrastructure',
          'Bespoke client non-disclosure & data-security protocols',
        ],
        status: 'Operational',
        isCurrent: true,
      },
      {
        phase: 'Phase 02',
        timeframe: '2027',
        title: 'Multi-Jurisdictional Expansion & Capability Scaling',
        description: 'Expanding statutory advisory into multi-state and cross-border frameworks, establishing dedicated industry leadership hubs, and launching proprietary workforce compensation benchmarking.',
        deliverables: [
          'Pan-regional labor law & multi-state statutory filing automation',
          'Sector-specific talent intelligence desks for Healthcare & Tech',
          'Automated client audit reconciliation dashboards',
          'Institutional client partnership programs with service-level compacts',
        ],
        status: 'In Execution',
      },
      {
        phase: 'Phase 03',
        timeframe: '2028 – 2030',
        title: 'Boardroom Advisory & Human Capital Stewardship',
        description: 'Maturing into an institutional advisory of choice for board evaluations, C-suite succession architecture, and regulatory risk stewardship across South and Southeast Asian markets.',
        deliverables: [
          'Board-level succession planning & executive compensation advisory',
          'Institutional human capital risk audit certifications',
          'Cross-border leadership mobility & international talent corridors',
          'Annual National Talent & Compliance Governance Whitepaper',
        ],
        status: 'Strategic Horizon',
      },
    ],
  },

  // 6. OUR COMMITMENT (short quote-style block)
  commitment: {
    quote: 'We treat our newness as a distinct fiduciary advantage: modern systems, zero legacy baggage, uncompromised confidentiality, and complete personal accountability on every mandate.',
  },

  // 7. LEADERSHIP NOTE (Authentic, executive-level address)
  leadershipNote: {
    heading: 'A Note From Our Leadership',
    role: 'Founding Statement',
    text: 'When we established TECHORA in 2026, we recognized that corporate boards and leaders no longer tolerate the artificial separation between senior talent acquisition and regulatory compliance. High-stakes leadership transitions require discretion and sector insight; payroll and workforce governance demand audit-grade precision. TECHORA was created to be the single, dependable fiduciary partner where corporate leaders find both under one roof.',
    signOff: 'With commitment to enterprise advancement,',
    name: 'The Founding Partners, TECHORA Consultant',
  },

  // 8. CTA BAND
  cta: {
    heading: 'Build Your Next Chapter With TECHORA',
    subtext: 'Connect with our practice partners for executive search mandates, statutory payroll governance, or strategic workforce advisory.',
    primaryButton: 'Partner With Us',
    primaryLink: '/partner-with-us',
    secondaryButton: 'Explore Services',
    secondaryLink: '/services/recruitment',
  },
};

export default legacyContent;
