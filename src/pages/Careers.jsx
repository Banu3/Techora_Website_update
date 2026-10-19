import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ChevronRight,
  Calendar,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { formatDateIN } from '../utils/indiaFormat';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';
import { useSiteContent } from '../context/SiteContentContext';

const DESIGNATIONS = [
  'All Designations',
  'Practice Director',
  'Principal Consultant',
  'Senior Consultant',
  'Associate Partner',
  'Senior Lead',
  'Consultant',
  'Analyst'
];

const EXPERIENCES = [
  'All Experience Levels',
  '1–3 years',
  '2–5 years',
  '5–8 years',
  '8–12 years',
  '12+ years'
];

const LOCATIONS = [
  'All Locations',
  'Mumbai',
  'Bengaluru',
  'New Delhi',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Gurugram',
  'Noida'
];

export default function Careers({ onOpenConsultModal }) {
  const { t } = useSiteContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live filter state synced with URL search params
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedDesignation, setSelectedDesignation] = useState(searchParams.get('designation') || 'All Designations');
  const [selectedExperience, setSelectedExperience] = useState(searchParams.get('experience') || 'All Experience Levels');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All Locations');

  // Expanded row details
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [expandedTagsMap, setExpandedTagsMap] = useState({});

  const toggleTagExpand = (jobId) => {
    setExpandedTagsMap((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // Set SEO meta
  useEffect(() => {
    document.title = 'Careers & Open Positions | TECHORA Consultant';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Explore active corporate consulting, executive recruitment, and payroll governance opportunities at TECHORA Consultant.';
  }, []);

  // Sync state to URL and fetch live
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedDesignation && selectedDesignation !== 'All Designations') params.set('designation', selectedDesignation);
    if (selectedExperience && selectedExperience !== 'All Experience Levels') params.set('experience', selectedExperience);
    if (selectedLocation && selectedLocation !== 'All Locations') params.set('location', selectedLocation);

    setSearchParams(params, { replace: true });

    setLoading(true);
    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to retrieve open positions.');
        return res.json();
      })
      .then((data) => {
        setJobs(data.jobs || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, selectedDesignation, selectedExperience, selectedLocation, setSearchParams]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedDesignation('All Designations');
    setSelectedExperience('All Experience Levels');
    setSelectedLocation('All Locations');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    selectedDesignation !== 'All Designations' ||
    selectedExperience !== 'All Experience Levels' ||
    selectedLocation !== 'All Locations';

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* 1. Full-Bleed Hero (careers-young-team) */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--navy-950)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <img
            src="/images/careers-team-clean.webp?v=1"
            alt="Young Indian professionals collaborating at TECHORA"
            width="2400"
            height="1350"
            fetchPriority="high"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
            }}
          />
        </div>

        {/* Directional Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(7, 20, 38, 0.92) 0%, rgba(7, 20, 38, 0.72) 48%, rgba(7, 20, 38, 0.25) 85%)',
            zIndex: 2,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 3, paddingTop: '64px', paddingBottom: '64px' }}>
          <div style={{ maxWidth: '680px' }}>
            <SectionHeading
              variant="on-dark"
              label={t('careers.hero.eyebrow', 'Careers at TECHORA')}
              title={t('careers.hero.title', 'Open Positions & Professional Appointments')}
              italicWord="Appointments"
              subtitle={t('careers.hero.subtitle', 'Join an established consulting team advising corporate enterprises on leadership recruitment, workforce planning, and statutory payroll governance.')}
            />
          </div>
        </div>
      </section>

      {/* 2. Sticky Live Filter Bar (No "Filter" Button) */}
      <div
        style={{
          position: 'sticky',
          top: 'var(--nav-height, 72px)',
          zIndex: 40,
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--line)',
          boxShadow: '0 4px 16px rgba(7, 20, 38, 0.04)',
          padding: '16px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(220px, 1.4fr) repeat(3, minmax(160px, 1fr)) auto',
              gap: '12px',
              alignItems: 'center',
            }}
            className="careers-filters-grid"
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                color="var(--ink)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by title, skill, department..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  paddingLeft: '38px',
                  paddingRight: '12px',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--navy-900)',
                  backgroundColor: 'var(--mist)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Designation */}
            <div>
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 12px',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--navy-900)',
                  backgroundColor: 'var(--mist)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {DESIGNATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 12px',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--navy-900)',
                  backgroundColor: 'var(--mist)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {EXPERIENCES.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 12px',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--navy-900)',
                  backgroundColor: 'var(--mist)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Button */}
            <div>
              <button
                type="button"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                style={{
                  height: '46px',
                  padding: '0 16px',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  color: hasActiveFilters ? 'var(--navy-900)' : 'var(--ink)',
                  backgroundColor: hasActiveFilters ? 'var(--mist)' : 'transparent',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  cursor: hasActiveFilters ? 'pointer' : 'default',
                  opacity: hasActiveFilters ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <RefreshCw size={14} /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Open Positions Editorial Ruled List */}
      <section style={{ paddingTop: '56px' }}>
        <div className="container">
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                color: 'var(--navy-900)',
                margin: 0,
              }}
            >
              Open Positions {jobs.length > 0 ? `(${jobs.length})` : ''}
            </h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>
              Active positions open for direct application
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '64px 0', textAlign: 'center' }}>
              <Loader message="Loading available positions..." />
            </div>
          ) : error ? (
            <div
              style={{
                padding: '24px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                borderRadius: '4px',
                color: '#991B1B',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : jobs.length === 0 ? (
            /* Empty State */
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '6px',
                padding: '72px 24px',
                textAlign: 'center',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              <Briefcase size={44} color="var(--sky-600)" style={{ margin: '0 auto 16px auto' }} />
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  color: 'var(--navy-900)',
                  marginBottom: '10px',
                }}
              >
                No Open Positions Currently Listed
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--ink)',
                  lineHeight: 1.65,
                  maxWidth: '52ch',
                  margin: '0 auto 28px auto',
                }}
              >
                There are currently no active public vacancies matching your criteria. If you are an experienced consulting leader or payroll specialist, you may submit your credentials via our partnership desk.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/partner-with-us" className="btn-navy" style={{ padding: '12px 24px' }}>
                  Submit Professional Dossier <ArrowRight size={16} />
                </Link>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="btn-navy-outline"
                    style={{ padding: '12px 24px' }}
                  >
                    Clear Filter Criteria
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Editorial Ruled List */
            <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
              {jobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                const isDeadlinePassed = job.deadline && new Date(job.deadline) < new Date();
                return (
                  <div
                    key={job.id}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      padding: '32px 0',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(280px, 1.8fr) minmax(200px, 1.2fr) auto',
                        gap: '24px',
                        alignItems: 'center',
                      }}
                      className="job-row-grid"
                    >
                      {/* Left: Title & Skills */}
                      <div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.35rem',
                            lineHeight: 1.25,
                            color: 'var(--navy-900)',
                            fontWeight: 700,
                            marginBottom: '10px',
                          }}
                        >
                          {job.title}
                        </h3>

                        {job.required_skills && job.required_skills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {(expandedTagsMap[job.id] ? job.required_skills : job.required_skills.slice(0, 4)).map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '3px 8px',
                                  backgroundColor: 'var(--mist)',
                                  borderRadius: '3px',
                                  color: 'var(--navy-900)',
                                  border: '1px solid var(--line)',
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                            {job.required_skills.length > 4 && (
                              <button
                                type="button"
                                onClick={() => toggleTagExpand(job.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '0.75rem',
                                  color: 'var(--sky-600)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  padding: '2px 4px',
                                  alignSelf: 'center',
                                  textDecoration: 'underline',
                                }}
                              >
                                {expandedTagsMap[job.id] ? 'Show less' : `+${job.required_skills.length - 4} more`}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Middle: Designation, Location, Experience, Deadline */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem', color: 'var(--ink)' }}>
                        <div>
                          <strong style={{ color: 'var(--navy-900)' }}>{job.designation}</strong> &bull; {job.employment_type || job.engagement_type}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="var(--sky-600)" />
                          <span>{job.location}</span>
                          <span style={{ margin: '0 4px', color: 'var(--line)' }}>|</span>
                          <Clock size={14} color="var(--sky-600)" />
                          <span>{job.experience_text}</span>
                        </div>
                        {job.deadline && (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>
                            Deadline: <strong>{formatDateIN(job.deadline)}</strong>
                          </div>
                        )}
                      </div>

                      {/* Right: Apply Now & View Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--sky-600)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {isExpanded ? 'Hide details' : 'View details'}
                        </button>

                        {isDeadlinePassed ? (
                          <span
                            style={{
                              padding: '10px 18px',
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              color: 'var(--ink)',
                              backgroundColor: 'var(--mist)',
                              borderRadius: '4px',
                              border: '1px solid var(--line)',
                            }}
                          >
                            Applications closed
                          </span>
                        ) : (
                          <Link
                            to={`/careers/apply/${job.id}`}
                            className="btn-navy"
                            style={{
                              padding: '11px 22px',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Apply Now <ArrowRight size={15} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Expandable Details Drawer */}
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: '24px',
                          padding: '24px',
                          backgroundColor: 'var(--mist)',
                          borderRadius: '4px',
                          border: '1px solid var(--line)',
                          animation: 'fadeIn 0.2s ease',
                        }}
                      >
                        <div style={{ marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '8px' }}>
                            Position Description
                          </h4>
                          <p style={{ fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                            {job.description}
                          </p>
                        </div>

                        {job.responsibilities && (
                          <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '8px' }}>
                              Core Responsibilities
                            </h4>
                            <p style={{ fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                              {job.responsibilities}
                            </p>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Link
                            to={`/careers/apply/${job.id}`}
                            className="btn-navy"
                            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                          >
                            Apply for this Position &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .careers-filters-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .job-row-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 600px) {
          .careers-filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
