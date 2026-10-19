/**
 * ============================================================================
 * TECHORA CONSULTANT — INDUSTRIES CONTENT SPECIFICATION
 * ============================================================================
 * 
 * TODO LIST FOR CLIENT / STAKEHOLDER REVIEW:
 * 1. [ ] Confirm which specific industries TECHORA actively serves.
 *        To activate an industry, toggle its `enabled` property from `false` to `true`.
 * 2. [ ] Review the 6 candidate sector entries below:
 *        - Information Technology [Confirm: do we serve this industry?]
 *        - Manufacturing [Confirm: do we serve this industry?]
 *        - Healthcare [Confirm: do we serve this industry?]
 *        - Retail and E-commerce [Confirm: do we serve this industry?]
 *        - Logistics and Supply Chain [Confirm: do we serve this industry?]
 *        - Professional Services [Confirm: do we serve this industry?]
 * 3. [ ] Confirm workforce challenge statements for each enabled sector (must remain generic and non-promissory).
 * 4. [ ] Verify service mappings (Recruitment / Payroll) and concise explanations.
 * 5. [ ] Supply real client case photography if desired (do NOT invent logos or testimonials).
 * 
 * NOTE ON ACTIVATION:
 * By default, all candidate industries below have `enabled: false`.
 * If no industry is enabled, the landing page renders a graceful notice:
 * "Industry details are being finalized" along with a direct consultation CTA.
 * In development mode, append `?previewIndustries=1` to preview all 6 candidate layouts.
 * ============================================================================
 */

export const industriesContent = {
  seo: {
    title: 'Industry Expertise & Workforce Solutions | TECHORA Consultant',
    description: 'Explore TECHORA’s specialized recruitment and administrative payroll solutions aligned with unique workforce challenges across corporate industries.',
    canonical: 'https://techora.consulting/expertise/industries',
    openGraph: {
      title: 'Industry Expertise & Workforce Solutions | TECHORA Consultant',
      description: 'Sector-focused recruitment and administrative payroll capabilities tailored to corporate organizational demands.',
      image: 'https://techora.consulting/images/industries/industries-hero.webp',
      type: 'website',
    },
  },

  hero: {
    eyebrow: 'Sector-Specific Advisory',
    h1: 'Industry Knowledge. Business-Focused Solutions.',
    supportingText: 'Workforce challenges vary by sector. TECHORA provides recruitment and administrative payroll support aligned with the functional and operational realities of your industry.',
    primaryCtaText: 'Discuss Your Industry Needs',
    primaryCtaLink: '#industry-enquiry',
    image: '/images/industries/industries-hero.webp',
    imageAlt: 'Modern architectural skyline representing diverse corporate industry sectors',
  },

  intro: {
    sectionNumber: '01',
    label: 'Sector Engagement Model',
    statement: 'Understanding operational dynamics before sourcing talent or structuring payroll.',
    body: 'Corporate workforce requirements cannot be addressed through one-size-fits-all assumptions. Operating parameters, hiring lead times, shift models, and compliance baselines differ fundamentally between technology firms, industrial plants, and retail enterprises. TECHORA structures talent acquisition and payroll administration around verified sector parameters.',
    sideNote: {
      title: 'Practice Boundary',
      content: 'We engage strictly within our validated functional capabilities—retained recruitment and administrative payroll operations. We do not make unverified claims of historical placements or past client rosters.',
    },
  },

  // Candidate Industries List (all enabled: false by default per client instruction)
  industries: [
    {
      slug: 'information-technology',
      name: 'Information Technology',
      // [Confirm: do we serve this industry?] Set enabled to true once verified by stakeholder
      enabled: false,
      tagline: 'Enterprise Software, Infrastructure & Cloud Services',
      composition: 'image-left', // layout variant (a)
      overview: 'Technology firms face competitive pressure to identify specialized engineering talent, cloud architecture leaders, and technical management while managing distributed workforce payroll consistency.',
      workforceChallenges: [
        'High competition and rapid compensation benchmarks for specialized technical roles',
        'Multi-region remote team structures requiring accurate compensation recording',
        'Verification of functional technical credentials and practical domain aptitude',
        'Balancing long-term engineering leadership retention with project-based surges',
      ],
      services: [
        {
          type: 'recruitment',
          title: 'Specialized Technical Recruitment',
          description: 'Targeted sourcing and competency evaluation for software engineering leads, cloud architects, and technology managers.',
          link: '/services/recruitment',
        },
        {
          type: 'payroll',
          title: 'Remote Workforce Payroll Administration',
          description: 'Standardized monthly compensation calculations and payout registers for distributed technical teams.',
          link: '/services/payroll',
        },
      ],
      image: '/images/industries/industry-it.webp',
      imageAlt: 'Software engineering team collaborating on distributed systems architecture',
      ctaLabel: 'Enquire About Information Technology',
    },
    {
      slug: 'manufacturing',
      name: 'Manufacturing',
      // [Confirm: do we serve this industry?] Set enabled to true once verified by stakeholder
      enabled: false,
      tagline: 'Industrial Production, Engineering & Plant Operations',
      composition: 'photo-band', // layout variant (b)
      overview: 'Industrial organizations balance stringent operational safety requirements, shift schedules, and plant engineering leadership searches with high-volume hourly workforce administration.',
      workforceChallenges: [
        'Sourcing certified mechanical, chemical, and plant operations leadership',
        'Managing rotating shift attendance records, overtime computations, and allowances',
        'Ensuring compliance with client-provided internal plant compensation schedules',
        'Maintaining continuity across multi-tier supervisory production hierarchies',
      ],
      services: [
        {
          type: 'recruitment',
          title: 'Plant & Operational Recruitment',
          description: 'Confidential sourcing for production directors, quality assurance managers, and manufacturing engineers.',
          link: '/services/recruitment',
        },
        {
          type: 'payroll',
          title: 'Shift & Overtime Payroll Administration',
          description: 'Systematic calculation of shift premiums, overtime hours, and verified plant attendance registers.',
          link: '/services/payroll',
        },
      ],
      image: '/images/industries/industry-manufacturing.webp',
      imageAlt: 'Advanced industrial production facility and quality control monitoring',
      ctaLabel: 'Enquire About Manufacturing',
    },
    {
      slug: 'healthcare',
      name: 'Healthcare',
      // [Confirm: do we serve this industry?] Set enabled to true once verified by stakeholder
      enabled: false,
      tagline: 'Healthcare Administration, Facilities & Clinical Support Services',
      composition: 'split-minimal', // layout variant (c)
      overview: 'Healthcare institutions require rigorous credential verification for administrative leaders and robust payroll accuracy across 24/7 on-call hospital operations.',
      workforceChallenges: [
        'Mandatory verification of medical credentials, licensing, and background checks',
        'Round-the-clock shift rotations and variable duty incentive calculations',
        'High documentation standards for employee compensation and attendance history',
        'Retention challenges in specialized healthcare management positions',
      ],
      services: [
        {
          type: 'recruitment',
          title: 'Healthcare Administrative Recruitment',
          description: 'Rigorous vetting and placement of healthcare facility directors, administrative managers, and compliance heads.',
          link: '/services/recruitment',
        },
        {
          type: 'payroll',
          title: 'Shift Differential Payroll Processing',
          description: 'Accurate reconciliation of on-call duty allowances, night shifts, and verified facility timesheets.',
          link: '/services/payroll',
        },
      ],
      image: '/images/industries/industry-healthcare.webp',
      imageAlt: 'Modern healthcare facility administration and patient care coordination center',
      ctaLabel: 'Enquire About Healthcare',
    },
    {
      slug: 'retail-and-ecommerce',
      name: 'Retail and E-commerce',
      // [Confirm: do we serve this industry?] Set enabled to true once verified by stakeholder
      enabled: false,
      tagline: 'Omnichannel Retail, Merchandising & Digital Commerce Platforms',
      composition: 'image-left', // layout variant (a)
      overview: 'Retailers face seasonal hiring spikes, high frontline turnover, and complex inventory management leadership mandates across physical and digital storefronts.',
      workforceChallenges: [
        'Rapid onboarding and volume sourcing during peak retail and holiday cycles',
        'Frequent compensation adjustments for store incentives, commissions, and bonuses',
        'Recruiting commercial leaders skilled in both store operations and e-commerce platforms',
        'Consolidating multi-store payroll inputs into auditable central disbursements',
      ],
      services: [
        {
          type: 'recruitment',
          title: 'Retail & E-commerce Executive Search',
          description: 'Sourcing regional store directors, e-commerce growth leads, and procurement managers.',
          link: '/services/recruitment',
        },
        {
          type: 'payroll',
          title: 'Incentive & Multi-Location Payroll',
          description: 'Administrative processing of sales commissions, incentive payouts, and multi-branch salary registers.',
          link: '/services/payroll',
        },
      ],
      image: '/images/industries/industry-retail.webp',
      imageAlt: 'Omnichannel fulfillment logistics and retail storefront operations',
      ctaLabel: 'Enquire About Retail & E-commerce',
    },
    {
      slug: 'logistics-and-supply-chain',
      name: 'Logistics and Supply Chain',
      // [Confirm: do we serve this industry?] Set enabled to true once verified by stakeholder
      enabled: false,
      tagline: 'Freight, Warehousing, Distribution & Fleet Management',
      composition: 'photo-band', // layout variant (b)
      overview: 'Supply chain networks depend on experienced distribution directors and timely compensation management for distributed warehouse and fleet personnel.',
      workforceChallenges: [
        'Sourcing experienced distribution, customs, and freight forwarding directorships',
        'Managing distributed hub attendance records and mileage/trip allowances',
        'High operational sensitivity to scheduling delays and workforce attrition',
        'Standardizing multi-depot documentation into centralized payroll registers',
      ],
      services: [
        {
          type: 'recruitment',
          title: 'Supply Chain Leadership Sourcing',
          description: 'Confidential recruitment for warehouse heads, freight logistics managers, and supply chain directors.',
          link: '/services/recruitment',
        },
        {
          type: 'payroll',
          title: 'Depot & Fleet Payroll Processing',
          description: 'Collation of hub timesheets, variable trip allowances, and centralized compensation payout structuring.',
          link: '/services/payroll',
        },
      ],
      image: '/images/industries/industry-logistics.webp',
      imageAlt: 'Global distribution hub and freight supply chain fleet coordination',
      ctaLabel: 'Enquire About Logistics & Supply Chain',
    },
    {
      slug: 'professional-services',
      name: 'Professional Services',
      // [Confirm: do we serve this industry?] Set enabled to true once verified by stakeholder
      enabled: false,
      tagline: 'Consulting, Legal, Accounting & Institutional Advisory Practices',
      composition: 'split-minimal', // layout variant (c)
      overview: 'Professional advisory firms demand rigorous evaluation of technical credentials, billing efficiency, and partner-level discretion.',
      workforceChallenges: [
        'Attracting senior advisory professionals with proven practice development experience',
        'Managing partner draw calculations, discretionary bonus allocations, and profit share models',
        'Maintaining absolute confidentiality during lateral partner recruitment cycles',
        'Strict audit and transparency expectations across all internal compensation records',
      ],
      services: [
        {
          type: 'recruitment',
          title: 'Advisory & Partner Recruitment',
          description: 'Discreet search and evaluation for senior consultants, practice leaders, and managing directors.',
          link: '/services/recruitment',
        },
        {
          type: 'payroll',
          title: 'Executive Remuneration Administration',
          description: 'Confidential handling of partner compensations, variable performance allocations, and executive registers.',
          link: '/services/payroll',
        },
      ],
      image: '/images/industries/industry-services.webp',
      imageAlt: 'Senior corporate consultants conducting institutional advisory review',
      ctaLabel: 'Enquire About Professional Services',
    },
  ],

  enquirySection: {
    id: 'industry-enquiry',
    eyebrow: 'Sector-Specific Mandate',
    heading: 'Discuss Your Industry Workforce Requirements',
    subheading: 'Connect with a TECHORA practice specialist to evaluate recruitment or payroll operational support tailored to your sector.',
  },
};
