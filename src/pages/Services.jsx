import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  CheckCircle,
  Building,
  ChevronRight,
  ChevronDown,
  Users,
  Calculator,
  Clock,
  Lock,
  Award,
  FileText,
  CheckCircle2,
  HelpCircle,
  Briefcase,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import ServiceIcon from '../components/ServiceIcon';
import EnquiryModal from '../components/EnquiryModal';

const DEFAULT_RECRUITMENT = [
  {
    id: 'permanent-recruitment',
    line: 'RECRUITMENT',
    title: 'Permanent Recruitment',
    description: 'Full-cycle hiring of permanent talent across levels and functions.',
    icon: 'UserCheck',
    order_index: 1,
  },
  {
    id: 'temp-contract-staffing',
    line: 'RECRUITMENT',
    title: 'Temporary & Contract Staffing',
    description: 'Flexible workforce solutions for project-based and short-term needs.',
    icon: 'Clock',
    order_index: 2,
  },
  {
    id: 'bulk-hiring',
    line: 'RECRUITMENT',
    title: 'Bulk Hiring',
    description: 'Large-volume, time-bound hiring with structured screening and onboarding support.',
    icon: 'Users',
    order_index: 3,
  },
  {
    id: 'executive-search',
    line: 'RECRUITMENT',
    title: 'Executive Search',
    description: 'Confidential, retained search for senior leadership and C-suite roles.',
    icon: 'Briefcase',
    order_index: 4,
  },
  {
    id: 'campus-recruitment',
    line: 'RECRUITMENT',
    title: 'Campus Recruitment',
    description: 'Fresher hiring through campus drives, assessments and talent pipelines.',
    icon: 'GraduationCap',
    order_index: 5,
  },
  {
    id: 'sourcing-screening',
    line: 'RECRUITMENT',
    title: 'Candidate Sourcing & Screening',
    description: 'Targeted sourcing, profile evaluation and shortlisting of qualified candidates.',
    icon: 'Search',
    order_index: 6,
  },
  {
    id: 'interview-coordination',
    line: 'RECRUITMENT',
    title: 'Interview Scheduling & Coordination',
    description: 'Seamless coordination between candidates and hiring teams.',
    icon: 'Calendar',
    order_index: 7,
  },
];

const DEFAULT_PAYROLL = [
  {
    id: 'payroll-processing',
    line: 'PAYROLL',
    title: 'Payroll Processing',
    description: 'Accurate, on-time monthly payroll execution.',
    icon: 'Calculator',
    order_index: 1,
  },
  {
    id: 'salary-disbursement',
    line: 'PAYROLL',
    title: 'Salary Calculation & Disbursement Support',
    description: 'Error-free computation and smooth salary release.',
    icon: 'Coins',
    order_index: 2,
  },
  {
    id: 'payslip-generation',
    line: 'PAYROLL',
    title: 'Payslip Generation',
    description: 'Clear, branded and compliant payslips for every employee.',
    icon: 'FileText',
    order_index: 3,
  },
  {
    id: 'attendance-leave',
    line: 'PAYROLL',
    title: 'Attendance & Leave Management',
    description: 'Integrated tracking of attendance, leave balances and adjustments.',
    icon: 'CalendarCheck',
    order_index: 4,
  },
  {
    id: 'pf-esi-support',
    line: 'PAYROLL',
    title: 'PF & ESI Support',
    description: 'Statutory registration, calculation, filing and challan support.',
    icon: 'ShieldCheck',
    order_index: 5,
  },
  {
    id: 'payroll-reports',
    line: 'PAYROLL',
    title: 'Payroll Reports & Documentation',
    description: 'Audit-ready reports, registers and records.',
    icon: 'FileSpreadsheet',
    order_index: 6,
  },
  {
    id: 'full-final-settlement',
    line: 'PAYROLL',
    title: 'Full & Final Settlement',
    description: 'Timely, compliant processing of exit dues and clearances.',
    icon: 'CheckCircle2',
    order_index: 7,
  },
];

export default function Services({ onOpenConsultModal }) {
  const location = useLocation();

  // Active practice: 'recruitment' | 'payroll'
  const [activePractice, setActivePractice] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#payroll' || search.includes('line=payroll')) return 'payroll';
    }
    return 'recruitment';
  });

  const [services, setServices] = useState({
    recruitment: DEFAULT_RECRUITMENT,
    payroll: DEFAULT_PAYROLL,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Permanent Recruitment');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Set document title and meta description
  useEffect(() => {
    document.title = `${activePractice === 'recruitment' ? 'Recruitment Services' : 'Payroll Services'} | TECHORA Consultant`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'End-to-end recruitment and payroll solutions built on compliance, discretion and accountability.';
  }, [activePractice]);

  // Sync tab with URL hash or search params
  useEffect(() => {
    const hash = location.hash;
    const search = location.search;
    if (hash === '#payroll' || search.includes('line=payroll')) {
      setActivePractice('payroll');
    } else if (hash === '#recruitment' || search.includes('line=recruitment')) {
      setActivePractice('recruitment');
    }
  }, [location.hash, location.search, location.pathname]);

  // Fetch live services from backend
  useEffect(() => {
    fetch('/api/services')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch services');
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          const rec = data.services.filter((s) => s.line === 'RECRUITMENT');
          const pay = data.services.filter((s) => s.line === 'PAYROLL');
          setServices({
            recruitment: rec.length > 0 ? rec : DEFAULT_RECRUITMENT,
            payroll: pay.length > 0 ? pay : DEFAULT_PAYROLL,
          });
        }
      })
      .catch((err) => {
        console.warn('Using default services list:', err.message);
      });
  }, []);

  const handleSelectPractice = (practiceKey) => {
    setActivePractice(practiceKey);
    setOpenFaqIndex(0);
    const newHash = `#${practiceKey}`;
    if (window.history.pushState) {
      window.history.pushState(null, '', newHash);
    } else {
      window.location.hash = newHash;
    }
    const sectionEl = document.getElementById(practiceKey);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenEnquiry = (serviceTitle) => {
    setSelectedService(serviceTitle || (activePractice === 'recruitment' ? 'Permanent Recruitment' : 'Payroll Processing'));
    setModalOpen(true);
  };

  const allServicesList = [
    ...services.recruitment.map((s) => ({ ...s, line: 'RECRUITMENT' })),
    ...services.payroll.map((s) => ({ ...s, line: 'PAYROLL' })),
  ];

  return (
    <div style={{ backgroundColor: 'var(--white)', color: 'var(--navy-900)' }}>
      {/* =====================================================================
          PAGE HEADER (With dynamic practice-specific background image)
          ===================================================================== */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#FAF8F5',
          backgroundImage: `linear-gradient(90deg, rgba(250, 248, 245, 0.98) 0%, rgba(250, 248, 245, 0.92) 50%, rgba(250, 248, 245, 0.62) 80%, rgba(250, 248, 245, 0.38) 100%), url(${
            activePractice === 'payroll' ? '/images/services/payroll-hero.webp' : '/images/services/recruitment-hero.webp'
          })`,
          backgroundPosition: 'right center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          borderBottom: '1px solid var(--line)',
          padding: '80px 0 64px 0',
          transition: 'background-image 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  color: activePractice === 'payroll' ? '#059669' : 'var(--sky-600)',
                  display: 'inline-block',
                }}
              >
                WHAT WE DO • {activePractice === 'payroll' ? 'PAYROLL PRACTICE' : 'RECRUITMENT PRACTICE'}
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: activePractice === 'payroll' ? '#059669' : 'var(--sky-600)' }} />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: activePractice === 'payroll' ? '#F0FDF4' : '#EFF6FF',
                  color: activePractice === 'payroll' ? '#166534' : '#1E40AF',
                  border: `1px solid ${activePractice === 'payroll' ? '#BBF7D0' : '#BFDBFE'}`,
                }}
              >
                7 Specialized Offerings
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.4rem, 4.8vw, 3.4rem)',
                fontWeight: 700,
                color: 'var(--navy-900)',
                lineHeight: 1.15,
                margin: '0 0 14px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Our Services
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.1875rem)',
                color: 'var(--ink)',
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 400,
                maxWidth: '680px',
              }}
            >
              {activePractice === 'payroll'
                ? 'Accurate monthly payroll execution, statutory PF & ESI compliance, payslip generation, and audit-ready governance.'
                : 'Full-cycle permanent hiring, executive search, campus recruitment, and flexible workforce staffing.'}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          VIEW 1: RECRUITMENT SERVICES ONLY
          ===================================================================== */}
      {activePractice === 'recruitment' && (
        <section
          id="recruitment"
          style={{
            padding: '72px 0 96px 0',
            borderBottom: '1px solid var(--line)',
            scrollMarginTop: '80px',
          }}
        >
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            {/* Practice Header & Introduction */}
            <div style={{ maxWidth: '880px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    color: 'var(--sky-600)',
                  }}
                >
                  PRACTICE AREA 01 • TALENT ACQUISITION
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--sky-600)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--ink)', fontWeight: 600 }}>
                  Showing 7 Recruitment Services
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 3.4vw, 2.75rem)',
                  color: 'var(--navy-900)',
                  fontWeight: 700,
                  margin: '0 0 14px 0',
                  letterSpacing: '-0.01em',
                }}
              >
                Recruitment Services
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                Full-cycle hiring of permanent talent across levels and functions. Flexible workforce solutions for project-based and short-term needs, time-bound bulk hiring, and confidential retained executive search for senior leadership and C-suite roles.
              </p>
            </div>

            {/* Value-Add Enhancement: Recruitment Practice KPI Performance Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '16px',
                marginBottom: '48px',
              }}
            >
              {[
                { number: '98.4%', label: 'Mandate Fulfillment Rate', note: 'Retained executive placement accuracy' },
                { number: '14 Days', label: 'Average Shortlist TAT', note: 'Calibrated first-round profiles' },
                { number: '500+', label: 'Senior Appointments', note: 'Board advisory & C-suite placements' },
                { number: '100% Retained', label: 'Confidentiality Assurance', note: 'Strict blind-search protocols' },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FAF8F5',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '20px 22px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: 'var(--navy-900)',
                      lineHeight: 1.1,
                      marginBottom: '6px',
                    }}
                  >
                    {kpi.number}
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sky-600)', marginBottom: '3px' }}>
                    {kpi.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink)' }}>
                    {kpi.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Responsive Card Grid: Exactly the 7 Recruitment Services */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
                marginBottom: '64px',
              }}
            >
              {services.recruitment.map((srv) => (
                <div
                  key={srv.id}
                  className="service-card-interactive"
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(7, 20, 38, 0.03)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(15, 127, 196, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      <ServiceIcon name={srv.icon} size={24} color="var(--sky-600)" />
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        color: 'var(--navy-900)',
                        fontWeight: 700,
                        margin: '0 0 10px 0',
                        lineHeight: 1.3,
                      }}
                    >
                      {srv.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--ink)',
                        lineHeight: 1.6,
                        margin: '0 0 24px 0',
                      }}
                    >
                      {srv.description}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(srv.title)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--sky-600)',
                        textDecoration: 'none',
                        transition: 'gap 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.gap = '10px')}
                      onMouseLeave={(e) => (e.currentTarget.style.gap = '6px')}
                    >
                      <span>Enquire</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* "How We Work" 4-Step Strip for Recruitment */}
            <div
              style={{
                backgroundColor: '#FAF8F5',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '36px 32px',
                marginBottom: '64px',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: 'var(--sky-600)',
                  }}
                >
                  OPERATIONAL METHODOLOGY
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    color: 'var(--navy-900)',
                    fontWeight: 700,
                    margin: '4px 0 0 0',
                  }}
                >
                  How We Deliver Recruitment Mandates
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '24px',
                  position: 'relative',
                }}
              >
                {[
                  { step: '01', title: 'Understand', desc: 'Calibrate candidate persona, technical competencies, and corporate governance requirements.' },
                  { step: '02', title: 'Source', desc: 'Deploy direct executive search, proprietary databases, and targeted active networks.' },
                  { step: '03', title: 'Screen', desc: 'Perform multi-stage credential validation, pedigree audits, and behavioural interviews.' },
                  { step: '04', title: 'Place', desc: 'Guide offer structuring, candidate transition, and 90-day retention verification.' },
                ].map((st) => (
                  <div key={st.step} style={{ position: 'relative' }}>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        color: 'var(--sky-600)',
                        fontFamily: 'monospace',
                        marginBottom: '6px',
                      }}
                    >
                      STEP {st.step}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--navy-900)', fontWeight: 700, margin: '0 0 6px 0' }}>
                      {st.title}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Value-Add Enhancement: Recruitment Practice Institutional FAQs */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '36px 32px',
                marginBottom: '48px',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: 'var(--sky-600)',
                  }}
                >
                  PRACTICE ADVISORY FAQ
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    color: 'var(--navy-900)',
                    fontWeight: 700,
                    margin: '4px 0 0 0',
                  }}
                >
                  Key Parameters of Our Recruitment Engagements
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  {
                    q: 'How does TECHORA conduct confidential senior executive search?',
                    a: 'Retained executive mandates are handled under strict non-disclosure protocols. We engage directly with senior leadership candidates via blind corporate briefings, ensuring complete corporate discretion before mutual NDA execution.',
                  },
                  {
                    q: 'What replacement guarantee applies to permanent appointments?',
                    a: 'All full-time permanent placements include our standard 90-day institutional replacement guarantee. If a placed candidate departs within 90 days, our practice provides a verified replacement dossier at zero additional advisory fee.',
                  },
                  {
                    q: 'Can TECHORA coordinate campus recruitment and nationwide bulk hiring?',
                    a: 'Yes. Our volume recruitment infrastructure deploys dedicated assessment teams, automated candidate screening, and structured pan-India recruitment drives for high-growth tech, financial services, and industrial enterprises.',
                  },
                  {
                    q: 'How do you coordinate interview scheduling between candidates and hiring committees?',
                    a: 'Our coordinators handle complete multi-tier scheduling, pre-interview technical setup, briefing packets for executive interviewers, and real-time candidate availability tracking.',
                  },
                ].map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      style={{
                        border: '1px solid var(--line)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '16px 20px',
                          backgroundColor: isOpen ? '#FAF8F5' : 'var(--white)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                          color: 'var(--navy-900)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                        }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={18}
                          color="var(--sky-600)"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease',
                            flexShrink: 0,
                          }}
                        />
                      </button>
                      {isOpen && (
                        <div
                          style={{
                            padding: '14px 20px 18px 20px',
                            backgroundColor: '#FAF8F5',
                            borderTop: '1px solid var(--line)',
                            fontSize: '0.875rem',
                            color: 'var(--ink)',
                            lineHeight: 1.6,
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seamless Switcher Banner to Payroll Services */}
            <div
              style={{
                backgroundColor: '#F4EFEA',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '24px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '1rem', marginBottom: '2px' }}>
                  Looking for Statutory Payroll &amp; Compliance Solutions?
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>
                  Explore error-free salary calculation, PF &amp; ESI filing, payslip generation, and Full &amp; Final settlements.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPractice('payroll')}
                className="btn-navy"
                style={{ padding: '10px 20px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Switch to Payroll Services</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          VIEW 2: PAYROLL SERVICES ONLY
          ===================================================================== */}
      {activePractice === 'payroll' && (
        <section
          id="payroll"
          style={{
            backgroundColor: '#FAF8F5',
            padding: '72px 0 96px 0',
            borderBottom: '1px solid var(--line)',
            scrollMarginTop: '80px',
          }}
        >
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            {/* Practice Header & Introduction */}
            <div style={{ maxWidth: '880px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    color: '#059669',
                  }}
                >
                  PRACTICE AREA 02 • STATUTORY &amp; WORKFORCE GOVERNANCE
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#059669' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--ink)', fontWeight: 600 }}>
                  Showing 7 Payroll Services
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 3.4vw, 2.75rem)',
                  color: 'var(--navy-900)',
                  fontWeight: 700,
                  margin: '0 0 14px 0',
                  letterSpacing: '-0.01em',
                }}
              >
                Payroll Services
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                Accurate, on-time monthly payroll execution with error-free salary computation and smooth disbursement support. We generate clear, branded payslips, manage attendance and leave, deliver statutory PF &amp; ESI filing, audit-ready documentation, and timely exit clearances.
              </p>
            </div>

            {/* Value-Add Enhancement: Payroll Practice Compliance Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '16px',
                marginBottom: '48px',
              }}
            >
              {[
                { number: '100%', label: 'Statutory Compliance', note: 'PF, ESI, PT, and TDS returns' },
                { number: 'Zero-Defect', label: 'Salary Computation', note: 'Dual-reconciled monthly registers' },
                { number: '48 Hours', label: 'F&F Settlement Turnaround', note: 'Audit-ready clearance dossiers' },
                { number: 'Bank-Grade', label: 'Data & Payslip Security', note: 'Encrypted monthly employee delivery' },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '20px 22px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: 'var(--navy-900)',
                      lineHeight: 1.1,
                      marginBottom: '6px',
                    }}
                  >
                    {kpi.number}
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', marginBottom: '3px' }}>
                    {kpi.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink)' }}>
                    {kpi.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Responsive Card Grid: Exactly the 7 Payroll Services */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
                marginBottom: '64px',
              }}
            >
              {services.payroll.map((srv) => (
                <div
                  key={srv.id}
                  className="service-card-interactive"
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(7, 20, 38, 0.03)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      <ServiceIcon name={srv.icon} size={24} color="#059669" />
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        color: 'var(--navy-900)',
                        fontWeight: 700,
                        margin: '0 0 10px 0',
                        lineHeight: 1.3,
                      }}
                    >
                      {srv.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--ink)',
                        lineHeight: 1.6,
                        margin: '0 0 24px 0',
                      }}
                    >
                      {srv.description}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(srv.title)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--sky-600)',
                        textDecoration: 'none',
                        transition: 'gap 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.gap = '10px')}
                      onMouseLeave={(e) => (e.currentTarget.style.gap = '6px')}
                    >
                      <span>Enquire</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* "How We Work" 4-Step Strip for Payroll */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '36px 32px',
                marginBottom: '64px',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: '#059669',
                  }}
                >
                  COMPLIANCE PIPELINE
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    color: 'var(--navy-900)',
                    fontWeight: 700,
                    margin: '4px 0 0 0',
                  }}
                >
                  How We Execute Monthly Payroll
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '24px',
                }}
              >
                {[
                  { step: '01', title: 'Collect Data', desc: 'Consolidate attendance logs, leave balances, variable incentives, and tax declarations.' },
                  { step: '02', title: 'Process', desc: 'Compute gross-to-net earnings, statutory deductions, TDS withholding, and PT liability.' },
                  { step: '03', title: 'Validate', desc: 'Perform multi-tier dual audit reconciliation and variance checks against previous cycles.' },
                  { step: '04', title: 'Disburse and Report', desc: 'Generate bank disbursement files, encrypted payslips, and monthly statutory challans.' },
                ].map((st) => (
                  <div key={st.step}>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        color: '#059669',
                        fontFamily: 'monospace',
                        marginBottom: '6px',
                      }}
                    >
                      STEP {st.step}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--navy-900)', fontWeight: 700, margin: '0 0 6px 0' }}>
                      {st.title}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Value-Add Enhancement: Payroll Practice Statutory FAQs */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '36px 32px',
                marginBottom: '48px',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: '#059669',
                  }}
                >
                  STATUTORY &amp; TAX FAQ
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    color: 'var(--navy-900)',
                    fontWeight: 700,
                    margin: '4px 0 0 0',
                  }}
                >
                  Payroll Governance &amp; Regulatory Standards
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  {
                    q: 'How does TECHORA guarantee pan-India multi-state statutory compliance?',
                    a: 'Our in-house payroll compliance directors actively monitor state-level changes in Professional Tax (PT), Labour Welfare Fund (LWF), and Shops & Establishments registrations across every Indian territory.',
                  },
                  {
                    q: 'How are employee payslips delivered and secured?',
                    a: 'Payslips are generated in PDF format with personal PIN/password encryption and dispatched automatically to corporate or personal emails immediately post disbursement validation.',
                  },
                  {
                    q: 'What is the processing turnaround time for Full & Final (F&F) settlements?',
                    a: 'We process full exit dues—including gratuity, leave encashment calculations, and statutory deductions—within 48 to 72 business hours upon clearance sign-off.',
                  },
                  {
                    q: 'Do you provide audit-ready PF and ESI challans for corporate annual audits?',
                    a: 'Yes. Every monthly cycle concludes with audit-ready electronic inspection challans (ECRs), return acknowledgements, and monthly payroll registers stored in structured digital archives.',
                  },
                ].map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      style={{
                        border: '1px solid var(--line)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '16px 20px',
                          backgroundColor: isOpen ? '#FAF8F5' : 'var(--white)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                          color: 'var(--navy-900)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                        }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={18}
                          color="#059669"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease',
                            flexShrink: 0,
                          }}
                        />
                      </button>
                      {isOpen && (
                        <div
                          style={{
                            padding: '14px 20px 18px 20px',
                            backgroundColor: '#FAF8F5',
                            borderTop: '1px solid var(--line)',
                            fontSize: '0.875rem',
                            color: 'var(--ink)',
                            lineHeight: 1.6,
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seamless Switcher Banner to Recruitment Services */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '24px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '1rem', marginBottom: '2px' }}>
                  Looking for Talent Acquisition &amp; Executive Search?
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>
                  Explore permanent recruitment, temporary staffing, high-volume bulk hiring, and executive leadership mandates.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPractice('recruitment')}
                className="btn-navy"
                style={{ padding: '10px 20px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Switch to Recruitment Services</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          CLOSING CTA BAND IN DARK NAVY
          ===================================================================== */}
      <section
        style={{
          backgroundColor: 'var(--navy-900)',
          color: 'var(--white)',
          padding: '88px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 700,
              color: 'var(--sky-500)',
              display: 'inline-block',
              marginBottom: '12px',
            }}
          >
            ENTERPRISE ADVISORY &amp; SOLUTIONS
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              color: 'var(--white)',
              fontWeight: 700,
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            Need a tailored solution?
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255, 255, 255, 0.75)',
              maxWidth: '640px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6,
            }}
          >
            Discuss your organization's workforce planning or payroll compliance requirements with a senior practice director.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => handleOpenEnquiry(activePractice === 'recruitment' ? 'Permanent Recruitment' : 'Payroll Processing')}
              style={{
                backgroundColor: 'var(--sky-600)',
                color: 'var(--white)',
                padding: '14px 28px',
                borderRadius: '4px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--sky-500)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--sky-600)')}
            >
              <span>Enquire Now</span>
              <ArrowRight size={16} />
            </button>

            <Link
              to="/partner-with-us"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--white)',
                padding: '14px 28px',
                borderRadius: '4px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.25)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
            >
              <span>Partner With Us</span>
              <Building size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
        servicesList={allServicesList}
      />

      {/* Hover style injection */}
      <style>{`
        .service-card-interactive:hover {
          transform: translateY(-4px);
          border-color: var(--sky-500) !important;
          box-shadow: 0 12px 24px -8px rgba(7, 20, 38, 0.08) !important;
        }
      `}</style>
    </div>
  );
}
