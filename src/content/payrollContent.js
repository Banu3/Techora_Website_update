/**
 * ============================================================================
 * TECHORA CONSULTANT — PAYROLL CONTENT SPECIFICATION
 * ============================================================================
 * 
 * TODO LIST FOR CLIENT / STAKEHOLDER REVIEW:
 * 1. [ ] Confirm whether "Attendance and Leave Coordination" is offered (currently `show: false` under `attendanceCoordination`).
 * 2. [ ] Confirm whether "Payslips and Reporting" generation is offered (currently `show: false` under `payslipsAndReporting`).
 * 3. [ ] Confirm whether "Statutory Payroll Support" (tax filing/PF/ESI/statutory returns) is offered 
 *        (currently `show: false` under `statutorySupport` — MUST REMAIN FALSE until formally verified).
 * 4. [ ] Review the Scope Disclaimer ("What this service is — and is not") to ensure exact compliance with company legal boundaries.
 * 5. [ ] Confirm conservative FAQ responses under `faqs` (no legal or tax guarantees).
 * 6. [ ] Provide real corporate payroll/HR operations photos to replace `/images/services/payroll-hero.webp`,
 *        `payroll-records.webp`, and `payroll-governance.webp`.
 * ============================================================================
 */

export const payrollContent = {
  seo: {
    title: 'Payroll Administration & Workforce Records | TECHORA Consultant',
    description: 'Explore administrative payroll support designed to assist enterprises in managing compensation workflows and accurate workforce records with operational consistency.',
    canonical: 'https://techora.consulting/services/payroll',
    openGraph: {
      title: 'Payroll Administration & Workforce Records | TECHORA Consultant',
      description: 'Structured administrative payroll support and compensation record management.',
      image: 'https://techora.consulting/images/services/payroll-hero.webp',
      type: 'website'
    }
  },

  hero: {
    eyebrow: 'Workforce Administration Practice',
    h1: 'Simplify Payroll. Support Your Workforce.',
    supportingText: 'Explore payroll support designed to help businesses manage compensation workflows and workforce records.',
    primaryCtaText: 'Discuss Payroll Requirements',
    primaryCtaLink: '#contact-section',
    image: '/images/services/payroll-hero.webp',
    imageAlt: 'Payroll operations specialists reviewing compensation spreadsheets and corporate workforce records'
  },

  inPageNav: [
    { id: 'overview', label: 'Overview' },
    { id: 'processing', label: 'Processing' },
    { id: 'records', label: 'Records' },
    { id: 'scope', label: 'Service Scope' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'contact-section', label: 'Enquiry' }
  ],

  overview: {
    sectionNumber: '01',
    id: 'overview',
    label: 'Payroll Overview',
    heading: 'Structured administrative oversight for recurring workforce compensation.',
    description: 'Timely and accurate salary calculation is fundamental to workforce stability and employee confidence. TECHORA provides reliable administrative support to streamline periodic payroll calculations, maintain salary master data, and ensure operational consistency across business cycles.',
    keyAttributes: [
      {
        title: 'Structured Operational Cadence',
        detail: 'Pre-scheduled calendar milestones for timesheet inputs, variable pay review, and batch processing.'
      },
      {
        title: 'Confidential Compensation Handling',
        detail: 'Rigorous data access controls protecting sensitive employee remuneration records.'
      },
      {
        title: 'Administrative Reliability',
        detail: 'Standardized reconciliation checks preventing computation discrepancies.'
      }
    ]
  },

  processingSupport: {
    sectionNumber: '02',
    id: 'processing',
    label: 'Payroll Processing Support',
    heading: 'Methodical execution of recurring compensation computations.',
    description: 'Our team assists organizations in processing periodic payroll runs using client-approved inputs. From basic pay structures to approved bonuses, overtime, and standard deductions, calculations are verified through cross-referenced check registers.',
    workflowPoints: [
      'Collation and normalization of client-provided monthly compensation inputs',
      'Systematic calculation of gross-to-net salary distributions',
      'Preparation of draft payroll summaries and payout registers for client executive sign-off',
      'Bank disbursement file structuring formatted to authorized banking partner templates'
    ]
  },

  employeeSalaryRecords: {
    sectionNumber: '03',
    id: 'records',
    label: 'Employee Salary Records',
    heading: 'Centralized and auditable remuneration documentation.',
    description: 'Maintaining clear, historic records of salary revisions, allowances, incentive dispersals, and standard deductions ensures transparency and simplifies internal reviews.',
    recordItems: [
      {
        item: 'Remuneration History',
        desc: 'Chronological tracking of compensation adjustments, promotions, and restructured salary components.'
      },
      {
        item: 'Reconciliation Registers',
        desc: 'Audit-ready monthly variance reports comparing prior and current disbursement cycles.'
      },
      {
        item: 'Separation & Final Settlement Summaries',
        desc: 'Administrative calculations for final salary settlements, notice periods, and leave encashment registers upon client approval.'
      }
    ],
    image: '/images/services/payroll-records.webp',
    imageAlt: 'Auditable payroll ledgers and salary computation records on screen'
  },

  // Capability flags: Can be toggled to true once verified by stakeholder
  attendanceCoordination: {
    show: false, // [Confirm: offered?] Toggle to true only when confirmed
    sectionNumber: '04',
    label: 'Attendance and Leave Coordination [Confirm: offered?]',
    heading: 'Integration of verified time records into monthly payroll calculations.',
    description: 'Reconciling shift logs, approved leaves, and holiday calendars into payroll inputs.'
  },

  payslipsAndReporting: {
    show: false, // [Confirm: offered?] Toggle to true only when confirmed
    sectionNumber: '05',
    label: 'Payslips and Reporting [Confirm: offered?]',
    heading: 'Generation of confidential employee salary slips and operational reports.',
    description: 'Digital delivery of encrypted payslips and monthly workforce payroll cost summaries.'
  },

  statutorySupport: {
    show: false, // Render ONLY if verified; otherwise hidden by flag
    sectionNumber: '06',
    label: 'Statutory Payroll Support [Unverified — Hidden by Default]',
    heading: 'Statutory deductions and regulatory payroll administration.',
    description: 'Assistance with statutory withholding computations under applicable jurisdiction guidelines.'
  },

  scopeDisclaimer: {
    id: 'scope',
    label: 'Service Scope & Operational Boundaries',
    heading: 'What This Service Is — And What It Is Not',
    subheading: 'Clear boundaries ensure transparency, legal compliance, and aligned expectations.',
    reviewNotice: '[Please review this scope disclaimer carefully before public publication]',
    whatItIs: {
      title: 'What TECHORA Payroll Support Is',
      points: [
        'Administrative calculation and processing of client-provided payroll data',
        'Maintenance of structured salary registers and compensation documentation',
        'Preparation of payout reconciliation registers for employer executive approval',
        'Standardized operational coordination bridging HR and finance workflows'
      ]
    },
    whatItIsNot: {
      title: 'What TECHORA Payroll Support Is NOT',
      points: [
        'Not a provider of legal counsel or labor law advisory',
        'Not a certified statutory tax consultancy or chartered financial auditor',
        'Not a substitute for official corporate tax filings or direct government tax remittances',
        'Not authorized to represent clients before tax authorities or regulatory bodies'
      ]
    },
    officialDisclaimerText: 'TECHORA provides administrative payroll support. It does not provide legal, tax or statutory advice; consult a qualified professional for those matters.'
  },

  faqs: [
    {
      question: 'What is the primary scope of TECHORA’s payroll service?',
      answer: 'TECHORA provides administrative payroll support, focusing on recurring calculation processing, salary register maintenance, and payout reconciliation based on employer-provided records.'
    },
    {
      question: 'Does TECHORA offer legal or tax advice as part of payroll services?',
      answer: 'No. TECHORA provides administrative payroll operational support only. We do not provide legal, tax, or statutory advice. Clients should consult certified legal or tax professionals for statutory advisory matters.'
    },
    {
      question: 'How do employers provide monthly payroll inputs?',
      answer: 'Employers submit standardized monthly input templates containing approved attendance, variable adjustments, new joiner details, and exits prior to agreed processing cut-off dates.'
    },
    {
      question: 'How is employee compensation confidentiality protected?',
      answer: 'Salary data is processed under strict access restrictions. Only designated administrative personnel handle client registers, and transmission utilizes encrypted channels.'
    },
    {
      question: 'Can TECHORA customize payroll registers to client reporting formats?',
      answer: 'Yes. Output disbursement registers and monthly variance summaries are tailored to interface smoothly with your internal accounting spreadsheets and banking formats.'
    },
    {
      question: 'How are discrepancies or payroll adjustments resolved?',
      answer: 'Any variance identified during reconciliation is flagged for employer review and adjustment prior to final disbursement approval.'
    }
  ],

  contactCta: {
    id: 'contact-section',
    eyebrow: 'Workforce Payroll Administration',
    heading: 'Discuss Payroll Requirements',
    subheading: 'Connect with our operations team to evaluate administrative payroll support for your organization.',
    serviceKey: 'Payroll Administration & Records'
  }
};
