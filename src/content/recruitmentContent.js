/**
 * ============================================================================
 * TECHORA CONSULTANT — RECRUITMENT CONTENT SPECIFICATION
 * ============================================================================
 * 
 * TODO LIST FOR CLIENT / STAKEHOLDER REVIEW:
 * 1. [ ] Confirm primary recruitment offering scope (e.g. permanent staffing, retained search, contract-to-hire).
 * 2. [ ] Confirm the 6-step recruitment workflow under `processSteps` (marked "[Confirm steps]").
 * 3. [ ] Confirm FAQ responses under `faqs` (verify confidentiality boundaries, sourcing practices, and client inputs required).
 * 4. [ ] Provide real corporate photographs to replace `/images/services/recruitment-hero.webp`,
 *        `recruitment-requirements.webp`, `recruitment-sourcing.webp`, and `recruitment-interview-band.webp`.
 * 5. [ ] Provide verified partner/client quotes or testimonials if desired (do NOT invent clients).
 * ============================================================================
 */

export const recruitmentContent = {
  seo: {
    title: 'Recruitment & Talent Sourcing Services | TECHORA Consultant',
    description: 'Corporate recruitment and talent acquisition support tailored to your business structure and staffing requirements. Confidential candidate sourcing and evaluation.',
    canonical: 'https://techora.consulting/services/recruitment',
    openGraph: {
      title: 'Recruitment & Talent Sourcing Services | TECHORA Consultant',
      description: 'Structured recruitment solutions matching verified expertise to specialized business needs.',
      image: 'https://techora.consulting/images/services/recruitment-hero.webp',
      type: 'website'
    }
  },

  hero: {
    eyebrow: 'Workforce Advisory & Talent Acquisition',
    h1: 'The Right Talent. The Right Opportunity.',
    supportingText: 'Recruitment support designed around your business and workforce requirements.',
    primaryCtaText: 'Discuss Your Hiring Needs',
    primaryCtaLink: '#contact-section',
    secondaryCtaText: 'See how we work',
    secondaryCtaLink: '#how-we-work',
    image: '/images/services/recruitment-hero.webp',
    imageAlt: 'Recruitment advisors and corporate stakeholders in strategic talent consultation'
  },

  overview: {
    sectionNumber: '01',
    label: 'Recruitment Overview',
    heading: 'Aligning specialized professional skills with corporate organizational objectives.',
    mainParagraph: 'TECHORA Consultant assists enterprises across key industries in identifying, evaluating, and securing professional talent. We approach recruitment as an organizational discipline—ensuring that every search is rooted in an objective understanding of role requirements, business environment, and team dynamics.',
    sideNote: {
      title: 'Engagement Protocol',
      content: 'Every recruitment engagement is conducted with institutional discretion. Role parameters, candidate profiles, and commercial discussions remain strictly confidential throughout the sourcing lifecycle.'
    }
  },

  roleRequirements: {
    sectionNumber: '02',
    label: 'Understanding Role Requirements',
    heading: 'Grounding every search in verified functional parameters and technical standards.',
    description: 'Before talent sourcing commences, TECHORA collaborates with hiring authorities to delineate core operational deliverables, required competency baselines, reporting lines, and cultural expectations.',
    bulletPoints: [
      'Comprehensive review of functional responsibilities and performance benchmarks',
      'Evaluation of prerequisite technical credentials, licenses, or specialized experience',
      'Definition of organizational team context and leadership interfaces'
    ],
    image: '/images/services/recruitment-requirements.webp',
    imageAlt: 'Senior consultant reviewing candidate specification matrices and organizational requirements'
  },

  talentSourcing: {
    sectionNumber: '03',
    label: 'Talent Sourcing',
    heading: 'Systematic industry identification across active and passive professional networks.',
    description: 'Our sourcing capability combines established professional industry networks, specialized talent mapping, and direct confidential outreach to identify qualified individuals who align with specific mandate criteria.',
    bulletPoints: [
      'Discreet direct outreach to established industry practitioners',
      'Targeted talent mapping across relevant industry sectors',
      'Multi-channel professional database query protocols'
    ],
    image: '/images/services/recruitment-sourcing.webp',
    imageAlt: 'Recruitment specialists conducting market mapping and candidate sourcing analysis'
  },

  screeningAndEvaluation: {
    sectionNumber: '04 & 05',
    label: 'Candidate Screening & Evaluation',
    screening: {
      number: '04',
      title: 'Resume Screening',
      statement: 'Rigorous initial verification ensuring candidate portfolios satisfy fundamental background, qualification, and tenure benchmarks prior to shortlisting.',
      details: 'We review career trajectories, verifiable responsibilities, and relevant project experience to eliminate discrepancies early in the process.'
    },
    evaluation: {
      number: '05',
      title: 'Candidate Evaluation',
      statement: 'Structured preliminary conversations assessing communication competence, practical capability, and alignment with corporate culture.',
      details: 'Assessments focus on demonstrated professional aptitude and verifiable domain familiarity rather than superficial resume buzzwords.'
    }
  },

  interviewCoordination: {
    sectionNumber: '06',
    label: 'Interview Coordination',
    heading: 'Seamless logistics bridging employer schedules and candidate availability.',
    description: 'TECHORA manages interview scheduling, briefing packages, stakeholder coordination, and post-session feedback loops to maintain momentum and ensure professional candidate experiences.',
    image: '/images/services/recruitment-interview-band.webp',
    imageAlt: 'Modern corporate boardroom prepared for executive interview consultation',
    highlights: [
      'Structured interview scheduling across multiple management interviewers',
      'Comprehensive candidate briefing on organizational expectations',
      'Prompt post-interview feedback synthesis and status management'
    ]
  },

  processSupport: {
    sectionNumber: '07',
    label: 'Recruitment Process Support',
    statusTag: '[Confirm steps]',
    heading: 'A transparent, staged progression from requirement definition to placement closure.',
    steps: [
      {
        stepNumber: '01',
        title: 'Requirement',
        description: 'Detailed analysis of functional prerequisites, tenure expectations, and operational scope.'
      },
      {
        stepNumber: '02',
        title: 'Sourcing',
        description: 'Multi-channel talent identification and confidential market mapping across active networks.'
      },
      {
        stepNumber: '03',
        title: 'Screening',
        description: 'Rigorous resume review and initial credentials verification against defined baselines.'
      },
      {
        stepNumber: '04',
        title: 'Evaluation',
        description: 'Structured preliminary interviews evaluating competency, communication, and cultural alignment.'
      },
      {
        stepNumber: '05',
        title: 'Interview',
        description: 'Coordination of client interviews, structured briefings, and feedback synchronization.'
      },
      {
        stepNumber: '06',
        title: 'Closure',
        description: 'Offer facilitation, candidate onboarding coordination, and transition assistance.'
      }
    ]
  },

  faqs: [
    {
      question: 'How does an organization initiate a recruitment mandate with TECHORA?',
      answer: 'Engagements commence with an initial scoping consultation to review your workforce requirements, timeline, and candidate specifications. Upon mutual alignment on search parameters, our consultants begin market mapping.'
    },
    {
      question: 'What information is required from the employer before sourcing begins?',
      answer: 'We request a job description or functional summary, key performance milestones, compensation range indicators, reporting hierarchy, and required technical or educational credentials.'
    },
    {
      question: 'How are candidates screened prior to presentation?',
      answer: 'Candidates undergo structured resume verification followed by an introductory competency dialogue. We evaluate verifiable employment history, core domain familiarity, and initial interest in the opportunity.'
    },
    {
      question: 'Who manages the coordination of candidate interviews?',
      answer: 'TECHORA consultants handle all scheduling logistics between your interview panel and the candidates, including calendar synchronization, meeting invitations, and pre-interview briefings.'
    },
    {
      question: 'Are recruitment engagements handled confidentially?',
      answer: 'Yes. All client details and search parameters are managed under strict institutional confidentiality protocols. Confidential searches can be executed without public company disclosure during preliminary phases upon request.'
    },
    {
      question: 'What industries does TECHORA support with talent acquisition?',
      answer: 'TECHORA supports organizations across corporate enterprise, banking & financial services, technology, retail, and managed workforce operations.'
    }
  ],

  contactCta: {
    eyebrow: 'Corporate Recruitment Mandate',
    heading: 'Discuss Your Hiring Needs',
    subheading: 'Connect with a TECHORA talent consultant to structure your next recruitment cycle with confidence and discretion.',
    buttonText: 'Submit Recruitment Enquiry',
    serviceKey: 'Recruitment & Talent Acquisition'
  }
};
