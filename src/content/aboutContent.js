/**
 * ============================================================================
 * TECHORA CONSULTANT — ABOUT US CONTENT REPOSITORY
 * ============================================================================
 * 
 * TODO CHECKLIST FOR EDITORIAL / BUSINESS TEAM:
 * [ ] Replace placeholder founding date & verified company history facts
 * [ ] Confirm exact corporate registration entity details & headquarters address
 * [ ] Confirm organizational core values (currently drafted under '[Confirm values]')
 * [ ] Review and adjust mission and vision statements
 * [ ] Provide verified partner statistics or keep placeholders untouched
 * ============================================================================
 */

export const aboutContent = {
  seo: {
    title: 'About Us | TECHORA Consultant — Connecting Business Needs With Expertise',
    description: 'Learn about TECHORA Consultant: our mission, values, executive talent acquisition practice, statutory payroll governance, and corporate partnership ethos.',
    canonical: 'https://techora.consulting/profile/about-us',
  },

  hero: {
    eyebrow: 'Corporate Profile &bull; Practice Foundation',
    heading: 'Connecting Business Needs With the Right Expertise.',
    subheading: 'TECHORA Consultant operates at the intersection of executive recruitment, enterprise payroll compliance, and strategic workforce advisory for established organizations.',
    image: '/images/profile/about-hero.webp',
    imageAlt: 'TECHORA corporate headquarters and leadership advisory team in strategic session',
  },

  // 01 Company Introduction
  introduction: {
    sectionNum: '01',
    label: 'Company Overview',
    headline: 'Built to deliver strategic clarity, fiduciary discretion, and operational excellence.',
    mainParagraph: 'Founded to address the critical gap between executive talent acquisition and statutory workforce governance, TECHORA Consultant serves as a dedicated partner to national enterprises and multinational subsidiaries. In competitive and heavily regulated operating environments, sustainable growth demands leaders of exceptional caliber alongside compliant, error-free operational frameworks.',
    secondaryParagraph: 'Our practice directors collaborate directly with boards, chief human resources officers, and finance executives to design talent structures that reduce operational friction and enhance institutional resilience.',
    sidebarFacts: [
      { label: 'Founding Entity', value: 'TECHORA Consultant' },
      { label: 'Primary Hubs', value: '[Confirm Primary Locations, e.g. Mumbai / Bengaluru / Singapore]' },
      { label: 'Core Capabilities', value: 'Retained Executive Search &bull; Statutory Payroll Solutions' },
      { label: 'Advisory Standards', value: 'Strict Fiduciary Non-Disclosure' },
      { label: 'Client Model', value: 'Retained & Milestone-Governed Advisory' },
    ],
  },

  // 02 Who We Are
  whoWeAre: {
    sectionNum: '02',
    label: 'Who We Are',
    headline: 'A senior advisory team dedicated to enterprise talent and operational integrity.',
    description: 'We are experienced corporate search consultants, statutory compliance auditors, and workforce strategists. Rather than adopting commoditized volume staffing models, TECHORA maintains a boutique, partner-led engagement framework where every mandate is managed with absolute accountability.',
    keyPoints: [
      {
        title: 'Deep Sector Specialization',
        detail: 'Focused expertise across Banking & Financial Services, Enterprise Technology, Cloud Infrastructure, and Modern Retail Commerce.',
      },
      {
        title: 'Fiduciary Independence',
        detail: 'Objective assessment methodologies ensuring candidates align with long-term governance rather than short-term placement targets.',
      },
      {
        title: 'Integrated Risk Mitigation',
        detail: 'Holistic alignment between recruitment sourcing and statutory payroll compliance to eliminate cross-border legal exposure.',
      },
    ],
    image: '/images/profile/about-who-we-are.webp',
    imageAlt: 'Senior executive consultant reviewing corporate talent benchmarks',
  },

  // 03 Mission & Vision
  missionVision: {
    sectionNum: '03',
    label: 'Guiding Purpose',
    mission: {
      title: 'Our Mission',
      statement: 'To empower organizations to scale with confidence by placing transformational executive leaders and establishing airtight statutory payroll governance.',
      context: 'We exist to eliminate the talent shortages and regulatory liabilities that impede strategic corporate expansion.',
    },
    vision: {
      title: 'Our Vision',
      statement: 'To be the most trusted corporate workforce consultancy, renowned for discretion, institutional standards, and enduring client partnerships.',
      context: 'Setting the benchmark for how corporate recruitment and payroll governance operate as unified value drivers.',
    },
  },

  // 04 Values (Ruled numbered list marked with [Confirm values])
  values: {
    sectionNum: '04',
    label: 'Core Tenets',
    headline: 'The Standards That Direct Every Engagement.',
    items: [
      {
        num: '01',
        name: 'Fiduciary Discretion',
        description: 'Absolute confidentiality and non-disclosure governance applied to every executive mandate, board transition, and compensation review.',
      },
      {
        num: '02',
        name: 'Technical & Regulatory Rigor',
        description: 'Zero-defect compliance in labor codes, tax withholdings, and executive vetting to protect enterprise reputation.',
      },
      {
        num: '03',
        name: 'Partner-Led Accountability',
        description: 'Direct involvement of senior practice principals from initial engagement scoping through to completion and onboarding retention.',
      },
      {
        num: '04',
        name: 'Long-Term Value Creation',
        description: 'Prioritizing sustainable talent longevity and operational stability above transactional speed or short-term metrics.',
      },
    ],
  },

  // 05 Our Approach (Photographic band with navy overlay and horizontal steps)
  approach: {
    sectionNum: '05',
    label: 'Methodology',
    headline: 'Our Advisory Approach',
    subheading: 'A disciplined, 4-stage operational sequence that guarantees transparency and milestone delivery.',
    image: '/images/profile/about-approach-band.webp',
    steps: [
      {
        step: '01',
        title: 'Diagnostic Scoping',
        summary: 'Deep evaluation of organizational culture, statutory requirements, and precise leadership competencies.',
      },
      {
        step: '02',
        title: 'Targeted Mapping',
        summary: 'Discreet market outreach, comprehensive background vetting, and compensation alignment modeling.',
      },
      {
        step: '03',
        title: 'Governance Vetting',
        summary: 'Structured leadership assessment and statutory compliance auditing to ensure legal and operational fit.',
      },
      {
        step: '04',
        title: 'Seamless Integration',
        summary: 'Structured onboarding governance, milestone reviews, and 12-month retention advisory commitments.',
      },
    ],
  },

  // Practice Offerings overview
  offerings: {
    recruitment: {
      title: 'Retained Executive Recruitment',
      desc: 'Precision talent acquisition for C-Suite, Board, and Director appointments across complex corporate sectors.',
      link: '/services/recruitment',
      cta: 'Explore Executive Search',
    },
    payroll: {
      title: 'Payroll Solutions & Governance',
      desc: 'Independent statutory audits, automated tax withholdings, and multi-jurisdiction payroll risk management.',
      link: '/services/payroll',
      cta: 'Explore Payroll Governance',
    },
  },
};
