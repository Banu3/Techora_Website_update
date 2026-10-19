/**
 * ============================================================================
 * TECHORA CONSULTANT — LEADERSHIP CONTENT REPOSITORY
 * ============================================================================
 * 
 * TODO CHECKLIST FOR EDITORIAL / BUSINESS TEAM:
 * [ ] Provide verified names, exact corporate titles, and photos for leadership members
 * [ ] Replace placeholder bios with verified career summaries and qualifications
 * [ ] Add verified LinkedIn profile URLs (leave empty string to automatically hide button)
 * [ ] Review and adjust practice areas of responsibility
 * [ ] Add additional partners/principals to the leaders array as needed
 * ============================================================================
 */

export const leadershipContent = {
  seo: {
    title: 'Leadership With Purpose | TECHORA Consultant Executive Leadership Team',
    description: 'Meet the executive leadership team and practice principals directing TECHORA Consultant in corporate advisory, executive search, and payroll solutions.',
    canonical: 'https://techora.consulting/profile/leadership',
  },

  hero: {
    eyebrow: 'Executive Governance',
    heading: 'Leadership With Purpose.',
    introLine: 'Guided by seasoned corporate advisory principals dedicated to institutional excellence, discreet executive search, and statutory workforce integrity.',
  },

  // 3 Clearly marked placeholder entries with neutral corporate portrait placeholders
  leaders: [
    {
      id: 'leader-1',
      isFeatured: true,
      name: '[Leader Name — Managing Principal & Practice Head]',
      designation: '[Designation — Managing Director & Executive Search Lead]',
      area: 'Executive Governance, Board Search & Corporate Strategy',
      bio: '[Short verified biography — Replace with confirmed biographical summary detailing leadership background, institutional consulting appointments, executive search track record, and corporate advisory mandates. Provides strategic oversight across tier-1 financial and technology client engagements.]',
      extendedBio: '[Extended biography — Additional verified qualifications, academic credentials, corporate advisory history, and industry leadership committee memberships to be provided by the business team.]',
      image: '/images/profile/leader-featured.webp',
      imageAlt: 'Portrait of TECHORA Managing Principal and Practice Head',
      linkedinUrl: '', // Provide verified URL: 'https://www.linkedin.com/in/verified-profile'
    },
    {
      id: 'leader-2',
      isFeatured: false,
      name: '[Leader Name — Head of Payroll & Statutory Governance]',
      designation: '[Designation — Practice Director, Statutory Audit & Compliance]',
      area: 'Enterprise Payroll Solutions & Multi-Jurisdiction Labor Compliance',
      bio: '[Short verified biography — Replace with confirmed biographical summary for the practice head overseeing statutory payroll audits, cross-border compensation frameworks, automated withholding architectures, and regulatory labor compliance.]',
      extendedBio: '[Extended biography — Extensive advisory background in corporate tax withholdings, statutory benefits parity, and multi-state workforce governance standards across domestic and global client entities.]',
      image: '/images/profile/leader-2.webp',
      imageAlt: 'Portrait of TECHORA Head of Payroll and Statutory Governance',
      linkedinUrl: '', // Provide verified URL or leave empty
    },
    {
      id: 'leader-3',
      isFeatured: false,
      name: '[Leader Name — Director of Industry Practices]',
      designation: '[Designation — Principal Consultant, Technology & Financial Advisory]',
      area: 'Sector Specialization: Banking, Enterprise Cloud & Modern Retail',
      bio: '[Short verified biography — Replace with confirmed biographical summary for the sector practice director managing specialized talent acquisition mandates, technology directorships, and quantitative leadership placement.]',
      extendedBio: '[Extended biography — Specialized background supporting corporate enterprise digital transformation, engineering leadership lift-outs, and banking sector fiduciary talent mapping.]',
      image: '/images/profile/leader-3.webp',
      imageAlt: 'Portrait of TECHORA Director of Industry Practices',
      linkedinUrl: '', // Provide verified URL or leave empty
    },
  ],

  cta: {
    eyebrow: 'Direct Advisory Engagement',
    heading: 'Work With Our Team',
    subheading: 'Connect directly with a TECHORA practice director to discuss your executive search requirements or statutory payroll compliance mandate.',
    buttonText: 'Work With Our Team',
    buttonLink: '/partner-with-us',
  },
};
