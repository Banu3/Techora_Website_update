const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Fallback Local Storage store key for standalone demo resilience
const LOCAL_STORAGE_KEY = 'techora_enquiries_db_v3';

const getLocalEnquiries = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('LocalStorage read error', e);
  }
  // Default mock seed data if local storage is empty
  const defaultData = [
    {
      id: 1,
      full_name: 'Rahul Sharma',
      email: 'rahul.s@nexusglobal.in',
      phone: '+91 98765 43210',
      company_name: 'Nexus Global Tech',
      service_required: 'IT Strategy & Consulting',
      service_category: 'IT Consulting',
      message: 'Looking for a comprehensive 3-year IT strategy roadmap and cloud migration audit for our multi-regional enterprise infrastructure.',
      status: 'In Progress',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      id: 2,
      full_name: 'Priya Patel',
      email: 'priya.patel@horizonlogistics.in',
      phone: '+91 87654 32109',
      company_name: 'Horizon Logistics',
      service_required: 'Payroll Processing',
      service_category: 'Payroll',
      message: 'Need automated multi-state salary processing and PF/ESI compliance management for our 450+ workforce.',
      status: 'New',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 3,
      full_name: 'Vikram Singh',
      email: 'vsingh@apexfintech.in',
      phone: '+91 76543 21098',
      company_name: 'Apex Fintech Solutions',
      service_required: 'Cybersecurity Consulting',
      service_category: 'IT Consulting',
      message: 'Requiring Zero-Trust security architecture setup and SOC 2 audit readiness evaluation for our payment gateway.',
      status: 'Contacted',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
};

const saveLocalEnquiries = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

export const submitContactForm = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Server responded with ${res.status}`);
  } catch (err) {
    console.warn('API Endpoint unreachable, using fallback client store:', err.message);
    // Standalone fallback: persist to LocalStorage
    const current = getLocalEnquiries();
    const isIT = formData.service_required.toLowerCase().includes('it') || 
                 ['strategy', 'software', 'cloud', 'infrastructure', 'cybersecurity', 'digital', 'erp', 'assessment']
                 .some(k => formData.service_required.toLowerCase().includes(k));

    const newEnquiry = {
      id: Date.now(),
      ...formData,
      service_category: isIT ? 'IT Consulting' : 'Payroll',
      status: 'New',
      created_at: new Date().toISOString()
    };
    current.unshift(newEnquiry);
    saveLocalEnquiries(current);

    return {
      success: true,
      message: 'Enquiry submitted successfully! Our enterprise consulting team will reach out to you within 24 hours.',
      enquiryId: newEnquiry.id
    };
  }
};

export const adminLogin = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Invalid administrator credentials');
  } catch (err) {
    console.warn('Backend login API unavailable, using standard auth verification:', err.message);
    // Standalone fallback default admin creds: admin@techora.com / Admin#2026
    if (email === 'admin@techora.com' && password === 'Admin#2026') {
      const mockToken = 'mock_jwt_techora_' + btoa(JSON.stringify({ email, role: 'admin', exp: Date.now() + 86400000 }));
      return {
        success: true,
        token: mockToken,
        user: { email: 'admin@techora.com', role: 'admin' }
      };
    }
    throw new Error(err.message || 'Invalid administrator credentials');
  }
};

export const fetchEnquiries = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error('Failed to fetch from backend');
  } catch (err) {
    console.warn('Using client store for enquiries:', err.message);
    const data = getLocalEnquiries();
    return { success: true, enquiries: data };
  }
};

export const updateEnquiryStatus = async (token, id, status) => {
  try {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Updating status via client store:', err.message);
  }
  // Local fallback
  const list = getLocalEnquiries();
  const index = list.findIndex(item => item.id == id);
  if (index !== -1) {
    list[index].status = status;
    saveLocalEnquiries(list);
  }
  return { success: true, message: 'Status updated successfully' };
};

export const deleteEnquiry = async (token, id) => {
  try {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Deleting enquiry via client store:', err.message);
  }
  // Local fallback
  const list = getLocalEnquiries().filter(item => item.id != id);
  saveLocalEnquiries(list);
  return { success: true, message: 'Enquiry deleted successfully' };
};

// ==========================================
// CMS (Content Management System) Comprehensive Store
// ==========================================
const CMS_STORAGE_KEY = 'techora_cms_content_v1';

export const DEFAULT_CONTENT = {
  // Brand & Global Contact
  companyName: 'TECHORA',
  navbarSubtitle: 'IT CONSULTING & PAYROLL SOLUTIONS',
  hqAddress: 'Techora Enterprise Tower, 500 Financial Way, Tech Hub Suite 1400, NY 10005',
  contactPhone: '+91 (8000) 555-832',
  contactPhone2: '+91 (8000) 555-833',
  contactEmail: 'contact@techora.com',
  businessHours: 'Monday – Friday: 9:00 AM – 6:00 PM EST',
  footerTagline: '"Technology That Moves Business Forward."',
  footerDesc: 'Techora delivers strategic IT consulting and reliable payroll solutions that help enterprise organizations simplify operations, strengthen security posture, and scale with confidence.',
  footerCopyright: '© 2026 Techora Enterprise Solutions. All Rights Reserved.',

  // Home Page - Hero
  homeHeroBadge: 'STRATEGIC IT ADVISORY • STATUTORY PAYROLL OPERATIONS',
  heroTitle: 'Strategic IT Advisory. Reliable Enterprise Payroll.',
  heroSubtitle: 'Techora partners with ambitious organizations to engineer resilient technology infrastructure, secure enterprise cloud platforms, and zero-error statutory payroll operations — giving leadership total operational clarity.',
  heroBtnPrimary: 'Schedule Consultation',
  heroBtnSecondary: 'Explore Capabilities',
  homeTrustPoint1: '15+ Years Combined Advisory Leadership',
  homeTrustPoint2: '100% Statutory Compliance Accuracy',
  homeTrustPoint3: 'Enterprise Security Architecture',

  // Home Page - Performance Metrics Bar
  homeMetric1Val: '99.98%',
  homeMetric1Label: 'Infrastructure Reliability SLA',
  homeMetric2Val: '10+ Yrs',
  homeMetric2Label: 'Advisory Leadership',
  homeMetric3Val: '100%',
  homeMetric3Label: 'Statutory Filing Accuracy',
  homeMetric4Val: '24/7',
  homeMetric4Label: 'Enterprise Support SLA',

  // Home Page - Core Practice Areas
  homeServicesBadge: 'Core Business Solutions',
  homeServicesTitle: 'Two Specialized Disciplines. One Business-Focused Approach.',
  homeServicesSubtitle: 'From technology strategy and cybersecurity to payroll processing and statutory compliance, Techora helps businesses improve the systems behind their day-to-day operations.',
  homeItTitle: 'Enterprise IT Consulting',
  homeItTagline: 'Strategic Advisory & Cloud Engineering',
  homeItDesc: 'Transform technology from an operational headache into a strategic advantage with practical consulting across cloud, security, and enterprise software.',
  homePayrollTitle: 'Statutory Payroll Solutions',
  homePayrollTagline: 'Flawless Compliance & Salary Automation',
  homePayrollDesc: 'Simplify payroll operations with structured salary processing, employee record management, and dependable statutory compliance.',

  // Home Page - Why Techora & Delivery Process
  homeWhyBadge: 'The Techora Approach',
  homeWhyTitle: 'Technology Expertise With a Business-First Mindset',
  homeWhySubtitle: 'We focus on practical, cost-effective solutions that improve operational efficiency, strengthen data security, and support sustainable business growth.',
  homeWorkflowBadge: 'Delivery Methodology',
  homeWorkflowTitle: 'Our 5-Stage Implementation Process',
  homeWorkflowSubtitle: 'A structured, transparent engagement model engineered for clarity, predictability, and dependable results.',

  // Home Page - Call to Action
  homeCtaTitle: 'Ready to Improve Your IT & Payroll Operations?',
  homeCtaSubtitle: 'Speak with our enterprise consulting team to evaluate your technology infrastructure or streamline your statutory payroll compliance.',
  homeCtaButton: 'Schedule a Consultation',

  // About Page
  aboutHeroBadge: 'Enterprise Technology & Operational Excellence',
  aboutHeroTitle: 'Technology Expertise. Business Understanding.',
  aboutHeroSubtitle: 'Techora combines technology consulting expertise with operational business solutions to help organizations improve their technology infrastructure, digital processes, and payroll operations.',
  aboutMissionTitle: 'Our Mission',
  aboutMissionQuote: '"Help businesses use technology to operate smarter, safer, and more efficiently."',
  aboutMissionDesc: 'We empower modern organizations by removing technical debt, safeguarding critical assets, and providing error-free operational frameworks that unlock long-term scalability.',
  aboutVisionTitle: 'Our Vision',
  aboutVisionQuote: '"Become a trusted technology and business solutions partner for growing organizations."',
  aboutVisionDesc: 'We strive to set the gold standard in enterprise technology advisory and automated statutory management, recognized worldwide for reliability, innovation, and total client focus.',
  aboutValuesBadge: 'Guiding Principles',
  aboutValuesTitle: 'Our Core Values',
  aboutValuesSubtitle: 'The fundamental beliefs that steer our software engineering, client relationships, and business ethics.',
  aboutCtaTitle: 'Partner With Techora Today',
  aboutCtaSubtitle: 'Experience enterprise-grade technology consulting and payroll compliance built for modern speed.',
  aboutCtaButton: 'Talk to an Expert',

  // IT Consulting Page
  itHeroBadge: 'Enterprise IT Advisory & Software Architecture',
  itHeroTitle: 'IT Consulting Services That Turn Technology Into Business Advantage',
  itHeroSubtitle: 'From technology strategy to cybersecurity and digital transformation, Techora helps businesses build secure, scalable, and future-ready technology environments.',
  itHeroButton: 'Schedule Technical Audit',
  itArchTitle: 'Modern Architecture. Proven Performance.',
  itArchDesc: 'We architect, optimize, and secure enterprise technology stacks tailored to your long-term business roadmap.',
  itCtaTitle: 'Accelerate Your Technology Roadmap',
  itCtaSubtitle: 'Schedule a discovery session with our senior enterprise architects to review your technical infrastructure.',
  itCtaButton: 'Get in Touch with our IT Specialists',

  // Payroll Services Page
  payrollHeroBadge: 'Statutory Payroll Management & Enterprise Compliance',
  payrollHeroTitle: 'Payroll & Compliance Done Right. Every Cycle. Without Fail.',
  payrollHeroSubtitle: 'We deliver end-to-end payroll processing, statutory deductions, and tax compliance with enterprise accuracy, full transparency, and guaranteed timelines.',
  payrollHeroButton: 'Request Payroll Consultation',
  payrollCompTitle: 'Zero-Defect Statutory Compliance',
  payrollCompDesc: 'Automating provident fund (PF), employee state insurance (ESI), tax deductions at source (TDS), and professional tax across all regional jurisdictions.',
  payrollCtaTitle: 'Streamline Your Payroll Operations',
  payrollCtaSubtitle: 'Eliminate compliance penalties and payroll processing delays with our automated statutory management platform.',
  payrollCtaButton: 'Speak to a Payroll Specialist',

  // Security Page
  securityHeroBadge: 'Zero-Trust Architecture & Compliance Frameworks',
  securityHeroTitle: 'Enterprise Security Built Into Every Layer',
  securityHeroSubtitle: 'At Techora, security is not an afterthought. We implement multi-layered defenses, cryptographic standards, and strict role-based controls across all operations.',
  securityArchTitle: 'Comprehensive Defense In Depth',
  securityArchDesc: 'Continuous security audits, vulnerability assessments, and automated statutory data protection safeguards.',
  securityCtaTitle: 'Strengthen Your Enterprise Defense Today',
  securityCtaSubtitle: 'Request a comprehensive zero-trust security architecture assessment from our certified specialists.',
  securityCtaButton: 'Request Security Assessment',

  // Case Studies & ROI
  caseStudiesHeroBadge: 'Proven Track Record',
  caseStudiesHeroTitle: 'Client Success Stories & Enterprise Impact',
  caseStudiesHeroSubtitle: 'Explore how Techora helped industry leaders optimize their technology stacks, safeguard data, and automate statutory payroll.',
  roiHeroBadge: 'Quantifiable Business Value',
  roiHeroTitle: 'Calculate Your Operational ROI',
  roiHeroSubtitle: 'Estimate the cost savings, time efficiency, and compliance risk reduction achieved by partnering with Techora.',

  // Contact Page
  contactHeroBadge: 'Enterprise Advisory Desk',
  contactHeroTitle: 'Connect With Our Enterprise Practice Specialists',
  contactHeroSubtitle: 'Reach out to our certified advisors for IT transformation consultations or comprehensive payroll statutory audits.'
};

export const CONTENT_PRESETS = [
  {
    id: 'modern-enterprise',
    name: 'Modern Enterprise & High-Growth',
    badge: 'Recommended',
    tagline: 'Bold, high-conversion tech & payroll copy built for modern scale',
    data: {
      homeHeroBadge: 'ENTERPRISE CLOUD ARCHITECTURE • 100% STATUTORY ACCURACY',
      heroTitle: 'Powering Resilient Infrastructure. Perfecting Enterprise Payroll.',
      heroSubtitle: 'Techora engineers mission-critical cloud platforms and automates zero-defect payroll processing — empowering high-growth organizations to scale fast without operational risk.',
      heroBtnPrimary: 'Schedule Strategic Consultation',
      heroBtnSecondary: 'Explore Practice Areas',
      homeTrustPoint1: '99.98% High-Availability SLA',
      homeTrustPoint2: 'Zero-Trust Cyber Defense',
      homeTrustPoint3: '100% Audit-Ready Compliance',
      homeServicesTitle: 'Two Specialized Engines. One Unified Standard.',
      homeServicesSubtitle: 'We eliminate technical chaos and administrative friction through enterprise-grade software architecture and error-free payroll automation.',
      homeCtaTitle: 'Ready to Accelerate Your Enterprise Operations?',
      homeCtaSubtitle: 'Speak with our senior enterprise consultants today to evaluate your infrastructure or streamline your statutory compliance.',
      aboutHeroTitle: 'Engineering Operational Excellence for Modern Enterprises',
      aboutHeroSubtitle: 'Techora unites high-performance cloud architecture with precision statutory payroll, freeing leadership to focus on hyper-growth and market leadership.',
      itHeroTitle: 'IT Consulting Services That Turn Technology Into Business Advantage',
      payrollHeroTitle: 'Payroll & Compliance Done Right. Every Cycle. Without Fail.'
    }
  },
  {
    id: 'executive-advisory',
    name: 'Executive Advisory & Global Authority',
    badge: 'Tier-1 Consultancy',
    tagline: 'High-level executive tone inspired by McKinsey & Big-4 consulting',
    data: {
      homeHeroBadge: 'STRATEGIC IT ADVISORY • MISSION-CRITICAL AUTOMATION',
      heroTitle: 'Where Technological Mastery Meets Flawless Payroll Execution.',
      heroSubtitle: 'From complex cloud modernization and proactive threat defense to automated statutory salary disbursements. We safeguard your critical assets and empower your workforce.',
      heroBtnPrimary: 'Schedule Confidential Consultation',
      heroBtnSecondary: 'Review Case Studies',
      homeTrustPoint1: 'Certified Enterprise Architects',
      homeTrustPoint2: 'ISO & SOC-2 Aligned Protocols',
      homeTrustPoint3: 'Zero-Penalty Compliance Guarantee',
      homeServicesTitle: 'Architectural Rigor. Operational Precision.',
      homeServicesSubtitle: 'Aligning next-generation enterprise technology with rigorous statutory governance across all business units.',
      homeCtaTitle: 'Transform Your Technology & Compliance Posture',
      homeCtaSubtitle: 'Partner with dedicated practice directors to benchmark your technical architecture and payroll systems.',
      aboutHeroTitle: 'Trusted Enterprise Advisors. Relentless Operational Precision.',
      aboutHeroSubtitle: 'We partner with enterprise leaders to eliminate legacy technical debt, strengthen data security, and automate complex regulatory workflows.',
      itHeroTitle: 'Strategic IT Advisory Converting Complexity Into Competitive Edge',
      payrollHeroTitle: 'Institutional-Grade Payroll Governance & Zero-Defect Processing'
    }
  },
  {
    id: 'results-driven',
    name: 'Direct, High-Speed & Results-Driven',
    badge: 'Fast & Punchy',
    tagline: 'Clear, problem-solving copy focused on speed, zero downtime, and ROI',
    data: {
      homeHeroBadge: 'NEXT-GEN IT SERVICES • AUTOMATED STATUTORY COMPLIANCE',
      heroTitle: 'Eliminate System Chaos. Automate Zero-Defect Payroll.',
      heroSubtitle: 'Stop losing valuable hours to infrastructure downtime and payroll errors. Techora delivers battle-tested software engineering and automated salary filings that run like clockwork.',
      heroBtnPrimary: 'Request Free Enterprise Audit',
      heroBtnSecondary: 'Calculate ROI Savings',
      homeTrustPoint1: 'Near-Zero Unplanned Downtime',
      homeTrustPoint2: '24/7 Proactive Threat Shield',
      homeTrustPoint3: 'Flawless Multi-State Tax Compliance',
      homeServicesTitle: 'Solving Enterprise Headaches with Modern Engineering',
      homeServicesSubtitle: 'Built to take technology bottlenecks and compliance complexities completely off your plate.',
      homeCtaTitle: 'Stop Wasting Time on IT Outages and Payroll Glitches',
      homeCtaSubtitle: 'Let Techora upgrade your systems and automate your compliance so you can focus 100% on revenue.',
      aboutHeroTitle: 'Built to Make Enterprise Operations Fast, Simple, and Secure',
      aboutHeroSubtitle: 'We remove operational friction with reliable modern technology infrastructure and automated statutory compliance that never misses a deadline.',
      itHeroTitle: 'Enterprise IT Infrastructure and Security That Just Works',
      payrollHeroTitle: 'Zero-Error Payroll and Tax Filings Without the Headaches'
    }
  },
  {
    id: 'future-tech',
    name: 'Futuristic Tech & Next-Gen Automation',
    badge: 'Innovative',
    tagline: 'Visionary, forward-looking copy for tech-first disruptors',
    data: {
      homeHeroBadge: 'ENGINEERING THE FUTURE OF BUSINESS OPERATIONS',
      heroTitle: 'Smarter Systems. Unbreakable Security. Frictionless Payroll.',
      heroSubtitle: 'Empowering modern enterprises with resilient cloud architectures, intelligent automation, and transparent statutory compliance designed for tomorrow’s scale.',
      heroBtnPrimary: 'Start Your Transformation',
      heroBtnSecondary: 'Discover Our Practice Areas',
      homeTrustPoint1: 'Autonomous Cloud Resilience',
      homeTrustPoint2: 'Next-Gen Threat Mitigation',
      homeTrustPoint3: 'End-to-End Automated Filings',
      homeServicesTitle: 'Intelligent Platforms Built for Non-Stop Scale',
      homeServicesSubtitle: 'Unifying resilient cloud infrastructure and frictionless payroll automation into one intelligent ecosystem.',
      homeCtaTitle: 'Build a Smarter, More Resilient Enterprise Today',
      homeCtaSubtitle: 'Connect with our engineering specialists to design future-ready IT infrastructure and automated payroll systems.',
      aboutHeroTitle: 'Building Tomorrow’s Enterprise Technology Today',
      aboutHeroSubtitle: 'We combine breakthrough technology engineering with autonomous compliance to help visionary organizations scale without limits.',
      itHeroTitle: 'Next-Generation IT Consulting for High-Performance Enterprises',
      payrollHeroTitle: 'Autonomous, Cloud-Native Payroll and Statutory Compliance'
    }
  }
];

export const getWebsiteContent = () => {
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONTENT, ...parsed };
    }
  } catch (e) {
    console.error('LocalStorage read error', e);
  }

  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
  } catch (e) {}

  return { ...DEFAULT_CONTENT };
};

export const updateWebsiteContent = async (newContent, token) => {
  try {
    const current = getWebsiteContent();
    const merged = { ...current, ...newContent };
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));

    // Dispatch custom event for real-time live updates without full reload
    window.dispatchEvent(new CustomEvent('cms_content_updated', { detail: merged }));

    // Non-blocking sync to backend server if available
    if (token) {
      fetch(`${API_BASE}/admin/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: merged })
      }).catch(() => {});
    }

    return { success: true, message: 'Website content published live across all pages!' };
  } catch (e) {
    console.error('LocalStorage write error', e);
    throw new Error('Failed to update website content');
  }
};

export const resetWebsiteContent = async (token) => {
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
    window.dispatchEvent(new CustomEvent('cms_content_updated', { detail: DEFAULT_CONTENT }));

    if (token) {
      fetch(`${API_BASE}/admin/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: DEFAULT_CONTENT })
      }).catch(() => {});
    }

    return { success: true, message: 'All website content reset to original defaults!' };
  } catch (e) {
    console.error('Reset error', e);
    throw new Error('Failed to reset website content');
  }
};


