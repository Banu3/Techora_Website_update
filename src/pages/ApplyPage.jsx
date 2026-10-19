import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Check,
  Info
} from 'lucide-react';
import { formatDateIN } from '../utils/indiaFormat';
import Loader from '../components/Loader';

const FUNCTIONS_LIST = [
  'Executive Leadership & Board Advisory',
  'Human Resources & Talent Acquisition',
  'Payroll & Statutory Compliance',
  'Technology & Cloud Architecture',
  'BFSI & Wealth Management',
  'Corporate Strategy & M&A',
  'Legal, Risk & Governance',
  'Operations & Supply Chain',
  'Sales & Business Development',
  'Finance & Accounting'
];

const INDUSTRIES_LIST = [
  'Banking, Financial Services & Insurance (BFSI)',
  'Technology & SaaS',
  'Manufacturing & Industrial',
  'Healthcare & Life Sciences',
  'Professional Services & Consulting',
  'Retail & E-Commerce',
  'Energy, Infrastructure & Real Estate',
  'Telecommunications & Media'
];

export default function ApplyPage() {
  const { jobId, slug } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState(null);

  // Resume upload & parsing states
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsing, setParsing] = useState(false);
  const [parseNotice, setParseNotice] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Map of which fields were auto-filled vs manually entered
  const [autoFilledFields, setAutoFilledFields] = useState({});

  // Form Fields State (All mandatory)
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    mobile: '+91 ',
    city: '',
    company: '',
    designation: '',
    experienceYears: '',
    currentCtc: '',
    degree: '',
    institute: '',
    function: '',
    industry: '',
    skills: [],
    consent: false,
  });

  const [skillInput, setSkillInput] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  // Load Job Details
  useEffect(() => {
    const identifier = jobId || slug;
    if (!identifier) {
      setJobError('No mandate selected. Please navigate from the careers portal.');
      setJobLoading(false);
      return;
    }

    setJobLoading(true);
    fetch(`/api/jobs/${identifier}`)
      .then((res) => {
        if (!res.ok) throw new Error('Mandate not found or closed.');
        return res.json();
      })
      .then((data) => {
        if (data.isClosed) {
          setJobError('Applications for this position are currently closed.');
        } else {
          setJob(data.job || null);
          setJobError(null);
          document.title = data.job ? `Apply: ${data.job.title} | TECHORA Consultant` : 'Apply | TECHORA';
        }
      })
      .catch((err) => {
        setJobError(err.message || 'Error retrieving mandate details.');
      })
      .finally(() => {
        setJobLoading(false);
      });
  }, [jobId, slug]);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Supported extensions: pdf, doc, docx, jpg, jpeg, png
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      setParseNotice({
        type: 'error',
        message: 'Unsupported document format. Please upload a PDF, DOC, DOCX, JPG, or PNG file (Max 5 MB).',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setParseNotice({
        type: 'error',
        message: 'File size exceeds 5 MB limit. Please compress or select a smaller resume file.',
      });
      return;
    }

    setResumeFile(file);
    processResumeUpload(file);
  };

  // Upload and parse resume
  const processResumeUpload = (file) => {
    setParsing(true);
    setUploadProgress(20);
    setParseNotice(null);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 200);

    const uploadPayload = new FormData();
    uploadPayload.append('resume', file);

    fetch('/api/resume/parse', {
      method: 'POST',
      body: uploadPayload,
    })
      .then((res) => res.json())
      .then((data) => {
        clearInterval(progressTimer);
        setUploadProgress(100);

        if (!data.success && !data.canSubmitManually) {
          setParseNotice({
            type: 'warning',
            message: data.error || "Unable to parse resume automatically. You can enter your details manually below.",
          });
          return;
        }

        const det = data.detected || {};
        const fieldStatus = data.fieldStatus || {};

        // Update form state with detected data
        const newAutofilled = {};

        setFormData((prev) => {
          const updated = { ...prev };

          if (det.title) {
            updated.title = det.title;
            newAutofilled.title = true;
          }
          if (det.firstName) {
            updated.firstName = det.firstName;
            newAutofilled.firstName = true;
          }
          if (det.lastName) {
            updated.lastName = det.lastName;
            newAutofilled.lastName = true;
          }
          if (det.gender) {
            updated.gender = det.gender;
            newAutofilled.gender = true;
          }
          if (det.dob) {
            updated.dob = det.dob;
            newAutofilled.dob = true;
          }
          if (det.email) {
            updated.email = det.email;
            newAutofilled.email = true;
          }
          if (det.mobile) {
            updated.mobile = det.mobile;
            newAutofilled.mobile = true;
          }
          if (det.city) {
            updated.city = det.city;
            newAutofilled.city = true;
          }
          if (det.company) {
            updated.company = det.company;
            newAutofilled.company = true;
          }
          if (det.designation) {
            updated.designation = det.designation;
            newAutofilled.designation = true;
          }
          if (det.totalExperienceYears !== undefined && det.totalExperienceYears !== '') {
            updated.experienceYears = String(det.totalExperienceYears);
            newAutofilled.experienceYears = true;
          }
          if (det.currentCtc) {
            updated.currentCtc = det.currentCtc;
            newAutofilled.currentCtc = true;
          }
          if (det.degree) {
            updated.degree = det.degree;
            newAutofilled.degree = true;
          }
          if (det.institute) {
            updated.institute = det.institute;
            newAutofilled.institute = true;
          }
          if (det.function) {
            updated.function = det.function;
            newAutofilled.function = true;
          }
          if (det.industry) {
            updated.industry = det.industry;
            newAutofilled.industry = true;
          }
          if (Array.isArray(det.skills) && det.skills.length > 0) {
            updated.skills = Array.from(new Set([...prev.skills, ...det.skills]));
            newAutofilled.skills = true;
          }

          return updated;
        });

        setAutoFilledFields(newAutofilled);

        const countAuto = Object.keys(newAutofilled).length;
        setParseNotice({
          type: 'success',
          message: countAuto > 0
            ? `Resume parsed successfully. ${countAuto} field(s) were auto-filled. You can review or edit any field.`
            : 'Resume uploaded. Please complete the remaining fields below.',
        });
      })
      .catch((err) => {
        clearInterval(progressTimer);
        setUploadProgress(100);
        setParseNotice({
          type: 'warning',
          message: 'Document uploaded. Automated parsing had a minor delay; you can fill in your details manually.',
        });
      })
      .finally(() => {
        setParsing(false);
      });
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for field
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !formData.skills.includes(trimmed)) {
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Indian CTC auto-formatting helper
  const handleCtcBlur = () => {
    let raw = formData.currentCtc.replace(/[^0-9]/g, '');
    if (!raw) return;
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      const formatted = new Intl.NumberFormat('en-IN').format(num);
      setFormData((prev) => ({ ...prev, currentCtc: formatted }));
    }
  };

  // Form Validation & Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.gender) errors.gender = 'Gender is required';

    if (!formData.dob) {
      errors.dob = 'Date of birth is required';
    } else {
      const bDate = new Date(formData.dob);
      const diff = Date.now() - bDate.getTime();
      const age = Math.abs(new Date(diff).getUTCFullYear() - 1970);
      if (age < 18) errors.dob = 'Applicant must be at least 18 years of age';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Valid corporate or personal email is required';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      errors.mobile = 'Valid 10-digit Indian mobile number is required';
    }

    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.company.trim()) errors.company = 'Current/last company is required';
    if (!formData.designation.trim()) errors.designation = 'Current/last designation is required';
    if (!formData.experienceYears || isNaN(parseFloat(formData.experienceYears))) {
      errors.experienceYears = 'Experience in years is required';
    }
    if (!formData.currentCtc.trim()) errors.currentCtc = 'Current CTC is required';
    if (!formData.degree.trim()) errors.degree = 'Highest educational degree is required';
    if (!formData.institute.trim()) errors.institute = 'Institute name is required';

    if (!formData.skills || formData.skills.length === 0) {
      errors.skills = 'Please add at least one core skill';
    }

    if (!resumeFile) {
      errors.resume = 'Please upload your resume document';
    }

    if (!formData.consent) {
      errors.consent = 'You must agree to the data privacy and confidential retention policy';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('jobId', job.id);
      payload.append('title', formData.title);
      payload.append('firstName', formData.firstName);
      payload.append('lastName', formData.lastName);
      payload.append('gender', formData.gender);
      payload.append('dob', formData.dob);
      payload.append('email', formData.email.trim().toLowerCase());
      payload.append('mobile', formData.mobile);
      payload.append('city', formData.city);
      payload.append('company', formData.company);
      payload.append('designation', formData.designation);
      payload.append('experienceYears', formData.experienceYears);
      payload.append('currentCtc', formData.currentCtc);
      payload.append('degree', formData.degree);
      payload.append('institute', formData.institute);
      payload.append('function', formData.function || 'Executive Leadership & Board Advisory');
      payload.append('industry', formData.industry || 'Professional Services & Consulting');
      payload.append('skills', JSON.stringify(formData.skills));
      payload.append('consent', formData.consent ? 'true' : 'false');
      payload.append('resume', resumeFile);

      const res = await fetch('/api/applications', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (res.status === 409 || (data.error && data.error.includes('already applied'))) {
        setSubmitError('You have already applied for this position. Our advisory committee has your credentials on file.');
        return;
      }

      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Failed to submit application. Please verify your details.');
        return;
      }

      setSuccessResult({
        applicationId: data.applicationId || data.referenceNo,
        email: formData.email,
        jobTitle: job.title,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError('Network or system error communicating with mandate desk. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for rendering field border and status badge
  const getFieldStatusUI = (fieldName) => {
    const hasError = !!formErrors[fieldName];
    return {
      borderColor: hasError ? '#EF4444' : 'var(--line)',
      borderWidth: '1px',
      backgroundColor: hasError ? '#FEF2F2' : 'var(--white)',
      badge: null,
    };
  };

  if (jobLoading) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center', backgroundColor: 'var(--white)', minHeight: '80vh' }}>
        <Loader message="Loading Mandate Details..." />
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div style={{ backgroundColor: 'var(--white)', minHeight: '80vh', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-900)', fontSize: '1.75rem', marginBottom: '12px' }}>
            Position Unavailable
          </h2>
          <p style={{ color: 'var(--ink)', lineHeight: 1.6, marginBottom: '24px' }}>
            {jobError || 'The requested appointment could not be retrieved or is no longer open.'}
          </p>
          <Link to="/careers" className="btn-navy" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Return to Open Mandates
          </Link>
        </div>
      </div>
    );
  }

  // Success Screen
  if (successResult) {
    return (
      <div style={{ backgroundColor: 'var(--white)', minHeight: '85vh', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '48px 40px',
              boxShadow: '0 8px 30px rgba(7, 20, 38, 0.05)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#D1FAE5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--navy-900)',
                marginBottom: '8px',
                lineHeight: 1.2,
              }}
            >
              Application Dossier Received
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--ink)', marginBottom: '24px' }}>
              Your credentials for <strong style={{ color: 'var(--navy-900)' }}>{successResult.jobTitle}</strong> have been securely registered with TECHORA Consultant.
            </p>

            <div
              style={{
                backgroundColor: 'var(--mist)',
                border: '1px solid var(--line)',
                borderRadius: '6px',
                padding: '20px',
                marginBottom: '32px',
                display: 'inline-block',
                width: '100%',
                maxWidth: '480px',
              }}
            >
              <div style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: '4px' }}>
                Fiduciary Reference Number
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--navy-900)',
                  letterSpacing: '0.05em',
                }}
              >
                {successResult.applicationId}
              </div>
            </div>

            <div
              style={{
                textAlign: 'left',
                backgroundColor: '#F8FAFC',
                borderLeft: '4px solid var(--sky-600)',
                padding: '16px 20px',
                borderRadius: '0 4px 4px 0',
                marginBottom: '36px',
                fontSize: '0.875rem',
                color: 'var(--ink)',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: 'var(--navy-900)', display: 'block', marginBottom: '4px' }}>
                Next Steps &amp; Confirmation Receipt
              </strong>
              A confirmation email has been logged to <strong>{successResult.email}</strong>. Our senior practice leadership will review your executive dossier against the mandate criteria under strict confidentiality.
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/careers" className="btn-navy" style={{ padding: '12px 28px', fontSize: '0.9375rem' }}>
                View Other Mandates <ArrowRight size={16} />
              </Link>
              <Link to="/" className="btn-navy-outline" style={{ padding: '12px 28px', fontSize: '0.9375rem' }}>
                Institutional Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* 1. TOP MANDATE BANNER */}
      <section
        style={{
          backgroundColor: 'var(--navy-950)',
          color: 'var(--white)',
          paddingTop: '48px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container">
          <Link
            to="/careers"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--sky-500)',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '16px',
            }}
          >
            <ArrowLeft size={16} /> Back to Open Positions
          </Link>

          <div style={{ maxWidth: '900px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--sky-500)',
                fontWeight: 700,
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Executive Mandate Intake
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                lineHeight: 1.2,
                color: 'var(--white)',
                marginBottom: '16px',
              }}
            >
              {job.title}
            </h1>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                fontSize: '0.9375rem',
                color: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={16} color="var(--sky-500)" />
                <span><strong>{job.designation}</strong> &bull; {job.employment_type || job.engagement_type}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--sky-500)" />
                <span>{job.location}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--sky-500)" />
                <span>{job.experience_text}</span>
              </div>

              {job.deadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="var(--sky-500)" />
                  <span>Deadline: <strong>{formatDateIN(job.deadline)}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN APPLICATION CONTENT */}
      <div className="container" style={{ paddingTop: '40px' }}>
        <form onSubmit={handleSubmit} noValidate>
          {/* STEP 1 (TOP): RESUME UPLOAD BOX */}
          <div
            style={{
              backgroundColor: 'var(--mist)',
              border: `2px dashed ${dragActive ? 'var(--sky-600)' : 'var(--line)'}`,
              borderRadius: '8px',
              padding: '36px 24px',
              textAlign: 'center',
              marginBottom: '36px',
              transition: 'all 0.2s ease',
              backgroundColor: dragActive ? 'rgba(15, 127, 196, 0.04)' : 'var(--mist)',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id="field-resume"
            />

            <UploadCloud size={44} color="var(--sky-600)" style={{ margin: '0 auto 12px auto' }} />

            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                color: 'var(--navy-900)',
                marginBottom: '6px',
              }}
            >
              Step 1: Upload Your Executive Resume / CV
            </h3>

            <p style={{ fontSize: '0.875rem', color: 'var(--ink)', maxWidth: '58ch', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
              Drag and drop your file here, or click to browse. We support PDF, DOC, DOCX, JPG, JPEG, or PNG (Max 5 MB).
              Our system will intelligently auto-fill the application fields below.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="btn-navy"
              style={{
                padding: '10px 24px',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <UploadCloud size={16} /> Choose Resume File
            </button>

            {resumeFile && (
              <div
                style={{
                  marginTop: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'var(--white)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  fontSize: '0.875rem',
                  color: 'var(--navy-900)',
                }}
              >
                <FileText size={18} color="var(--sky-600)" />
                <strong>{resumeFile.name}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--ink)' }}>
                  ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    setParseNotice(null);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', marginLeft: '6px' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Parsing Progress Bar & Shimmer Loader */}
            {parsing && (
              <div style={{ maxWidth: '420px', margin: '20px auto 0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', color: 'var(--sky-600)', fontSize: '0.875rem', fontWeight: 600 }}>
                  <Sparkles size={16} className="animate-spin" />
                  <span>Reading your resume… extracting profile details</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${uploadProgress}%`,
                      backgroundColor: 'var(--sky-600)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Parse Notice */}
            {parseNotice && (
              <div
                style={{
                  maxWidth: '680px',
                  margin: '20px auto 0 auto',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  backgroundColor: parseNotice.type === 'success' ? '#F0FDF4' : parseNotice.type === 'error' ? '#FEF2F2' : '#FFFBEB',
                  border: `1px solid ${parseNotice.type === 'success' ? '#86EFAC' : parseNotice.type === 'error' ? '#FCA5A5' : '#FCD34D'}`,
                  color: parseNotice.type === 'success' ? '#166534' : parseNotice.type === 'error' ? '#991B1B' : '#92400E',
                }}
              >
                {parseNotice.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{parseNotice.message}</span>
              </div>
            )}

            {formErrors.resume && (
              <div style={{ color: '#DC2626', fontSize: '0.8125rem', marginTop: '10px', fontWeight: 600 }}>
                {formErrors.resume}
              </div>
            )}
          </div>

          {/* STEP 2 HEADER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '12px 18px',
              backgroundColor: 'var(--mist)',
              borderRadius: '6px',
              marginBottom: '28px',
              border: '1px solid var(--line)',
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--navy-900)', fontWeight: 600 }}>
              <Info size={16} color="var(--sky-600)" />
              <span>Step 2: Candidate Profile Details (All fields mandatory)</span>
            </div>
          </div>

          {/* 3-COLUMN RESPONSIVE GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px',
              alignItems: 'start',
            }}
            className="apply-form-3col"
          >
            {/* ========================================================
                COLUMN 1: PERSONAL DETAILS
                ======================================================== */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(7, 20, 38, 0.02)',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  color: 'var(--navy-900)',
                  marginBottom: '18px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                1. Personal Identity
              </h4>

              {/* Title */}
              <div style={{ marginBottom: '16px' }} id="field-title">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Title <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('title').badge}
                </div>
                <select
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('title').borderWidth} solid ${getFieldStatusUI('title').borderColor}`,
                    backgroundColor: getFieldStatusUI('title').backgroundColor,
                  }}
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                </select>
                {formErrors.title && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.title}</span>}
              </div>

              {/* First Name */}
              <div style={{ marginBottom: '16px' }} id="field-firstName">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    First Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('firstName').badge}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya"
                  value={formData.firstName}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('firstName').borderWidth} solid ${getFieldStatusUI('firstName').borderColor}`,
                    backgroundColor: getFieldStatusUI('firstName').backgroundColor,
                  }}
                />
                {formErrors.firstName && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.firstName}</span>}
              </div>

              {/* Last Name */}
              <div style={{ marginBottom: '16px' }} id="field-lastName">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Last Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('lastName').badge}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Singhania"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('lastName').borderWidth} solid ${getFieldStatusUI('lastName').borderColor}`,
                    backgroundColor: getFieldStatusUI('lastName').backgroundColor,
                  }}
                />
                {formErrors.lastName && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.lastName}</span>}
              </div>

              {/* Gender */}
              <div style={{ marginBottom: '16px' }} id="field-gender">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Gender <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('gender').badge}
                </div>
                <select
                  value={formData.gender}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('gender').borderWidth} solid ${getFieldStatusUI('gender').borderColor}`,
                    backgroundColor: getFieldStatusUI('gender').backgroundColor,
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {formErrors.gender && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.gender}</span>}
              </div>

              {/* DOB (18+) */}
              <div style={{ marginBottom: '16px' }} id="field-dob">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Date of Birth (18+) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('dob').badge}
                </div>
                <input
                  type="date"
                  value={formData.dob}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('dob').borderWidth} solid ${getFieldStatusUI('dob').borderColor}`,
                    backgroundColor: getFieldStatusUI('dob').backgroundColor,
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--ink)', display: 'block', marginTop: '4px' }}>
                  Statutory requirement for verification
                </span>
                {formErrors.dob && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.dob}</span>}
              </div>
            </div>

            {/* ========================================================
                COLUMN 2: CONTACT & ACADEMICS
                ======================================================== */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(7, 20, 38, 0.02)',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  color: 'var(--navy-900)',
                  marginBottom: '18px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                2. Contact &amp; Education
              </h4>

              {/* Email */}
              <div style={{ marginBottom: '16px' }} id="field-email">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Email Address <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('email').badge}
                </div>
                <input
                  type="email"
                  placeholder="v.singhania@domain.com"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('email').borderWidth} solid ${getFieldStatusUI('email').borderColor}`,
                    backgroundColor: getFieldStatusUI('email').backgroundColor,
                  }}
                />
                {formErrors.email && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.email}</span>}
              </div>

              {/* Mobile (+91) */}
              <div style={{ marginBottom: '16px' }} id="field-mobile">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Mobile Number (+91) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('mobile').badge}
                </div>
                <input
                  type="tel"
                  placeholder="+91 98201 44521"
                  value={formData.mobile}
                  onChange={(e) => handleFieldChange('mobile', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('mobile').borderWidth} solid ${getFieldStatusUI('mobile').borderColor}`,
                    backgroundColor: getFieldStatusUI('mobile').backgroundColor,
                  }}
                />
                {formErrors.mobile && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.mobile}</span>}
              </div>

              {/* City */}
              <div style={{ marginBottom: '16px' }} id="field-city">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Current Location / City <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('city').badge}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bengaluru, New Delhi"
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('city').borderWidth} solid ${getFieldStatusUI('city').borderColor}`,
                    backgroundColor: getFieldStatusUI('city').backgroundColor,
                  }}
                />
                {formErrors.city && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.city}</span>}
              </div>

              {/* Degree */}
              <div style={{ marginBottom: '16px' }} id="field-degree">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Highest Degree <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('degree').badge}
                </div>
                <input
                  type="text"
                  placeholder="e.g. MBA Strategy & Finance, B.Tech, CA"
                  value={formData.degree}
                  onChange={(e) => handleFieldChange('degree', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('degree').borderWidth} solid ${getFieldStatusUI('degree').borderColor}`,
                    backgroundColor: getFieldStatusUI('degree').backgroundColor,
                  }}
                />
                {formErrors.degree && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.degree}</span>}
              </div>

              {/* Institute */}
              <div style={{ marginBottom: '16px' }} id="field-institute">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Institute / University <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('institute').badge}
                </div>
                <input
                  type="text"
                  placeholder="e.g. IIM Ahmedabad, IIT Madras, XLRI"
                  value={formData.institute}
                  onChange={(e) => handleFieldChange('institute', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('institute').borderWidth} solid ${getFieldStatusUI('institute').borderColor}`,
                    backgroundColor: getFieldStatusUI('institute').backgroundColor,
                  }}
                />
                {formErrors.institute && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.institute}</span>}
              </div>
            </div>

            {/* ========================================================
                COLUMN 3: PROFESSIONAL EXPERIENCE & PRACTICE
                ======================================================== */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(7, 20, 38, 0.02)',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  color: 'var(--navy-900)',
                  marginBottom: '18px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                3. Career &amp; Experience
              </h4>

              {/* Company */}
              <div style={{ marginBottom: '16px' }} id="field-company">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Company (Current/Last) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('company').badge}
                </div>
                <input
                  type="text"
                  placeholder="e.g. McKinsey, Deloitte, TCS"
                  value={formData.company}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('company').borderWidth} solid ${getFieldStatusUI('company').borderColor}`,
                    backgroundColor: getFieldStatusUI('company').backgroundColor,
                  }}
                />
                {formErrors.company && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.company}</span>}
              </div>

              {/* Designation */}
              <div style={{ marginBottom: '16px' }} id="field-designation">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Designation <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('designation').badge}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Senior Engagement Director"
                  value={formData.designation}
                  onChange={(e) => handleFieldChange('designation', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('designation').borderWidth} solid ${getFieldStatusUI('designation').borderColor}`,
                    backgroundColor: getFieldStatusUI('designation').backgroundColor,
                  }}
                />
                {formErrors.designation && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.designation}</span>}
              </div>

              {/* Experience (Years Decimal) */}
              <div style={{ marginBottom: '16px' }} id="field-experienceYears">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Total Experience (Years) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('experienceYears').badge}
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 15.5"
                  value={formData.experienceYears}
                  onChange={(e) => handleFieldChange('experienceYears', e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('experienceYears').borderWidth} solid ${getFieldStatusUI('experienceYears').borderColor}`,
                    backgroundColor: getFieldStatusUI('experienceYears').backgroundColor,
                  }}
                />
                {formErrors.experienceYears && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.experienceYears}</span>}
              </div>

              {/* Current CTC (INR) */}
              <div style={{ marginBottom: '16px' }} id="field-currentCtc">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Current CTC (INR) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('currentCtc').badge}
                </div>
                <input
                  type="text"
                  placeholder=""
                  value={formData.currentCtc}
                  onChange={(e) => handleFieldChange('currentCtc', e.target.value)}
                  onBlur={handleCtcBlur}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    outline: 'none',
                    border: `${getFieldStatusUI('currentCtc').borderWidth} solid ${getFieldStatusUI('currentCtc').borderColor}`,
                    backgroundColor: getFieldStatusUI('currentCtc').backgroundColor,
                  }}
                />
                {formErrors.currentCtc && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.currentCtc}</span>}
              </div>



              {/* Skills (Chips) */}
              <div style={{ marginBottom: '8px' }} id="field-skills">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                    Key Competencies / Skills <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {getFieldStatusUI('skills').badge}
                </div>

                <div
                  style={{
                    border: `${getFieldStatusUI('skills').borderWidth} solid ${getFieldStatusUI('skills').borderColor}`,
                    backgroundColor: getFieldStatusUI('skills').backgroundColor,
                    borderRadius: '4px',
                    padding: '8px',
                    minHeight: '44px',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: formData.skills.length > 0 ? '6px' : '0' }}>
                    {formData.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'var(--navy-900)',
                          color: 'var(--white)',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Type skill & press Enter or comma..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.8125rem',
                      backgroundColor: 'transparent',
                      padding: '4px',
                    }}
                  />
                </div>
                {formErrors.skills && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.skills}</span>}
              </div>
            </div>
          </div>

          {/* 3. CONSENT & SUBMISSION FOOTER */}
          <div
            style={{
              marginTop: '40px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '28px',
              boxShadow: '0 4px 16px rgba(7, 20, 38, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }} id="field-consent">
              <input
                type="checkbox"
                id="consent-check"
                checked={formData.consent}
                onChange={(e) => handleFieldChange('consent', e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  marginTop: '2px',
                  accentColor: 'var(--navy-900)',
                  cursor: 'pointer',
                }}
              />
              <label
                htmlFor="consent-check"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--navy-900)',
                  lineHeight: 1.5,
                  cursor: 'pointer',
                }}
              >
                I hereby declare that the details provided are accurate and authorize TECHORA Consultant to securely process and retain my candidate dossier for institutional executive search, statutory payroll, and advisory appointments in strict accordance with the{' '}
                <Link to="/privacy" target="_blank" style={{ color: 'var(--sky-600)', textDecoration: 'underline' }}>
                  TECHORA Privacy Notice &amp; Retention Charter
                </Link>.
              </label>
            </div>
            {formErrors.consent && (
              <div style={{ color: '#EF4444', fontSize: '0.8125rem', marginBottom: '16px' }}>
                {formErrors.consent}
              </div>
            )}

            {submitError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  color: '#991B1B',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--ink)' }}>
                <ShieldCheck size={18} color="var(--sky-600)" />
                <span>Confidential Executive Dossier Submission. Zero data is saved until final Submit.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-navy"
                style={{
                  padding: '14px 36px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Submitting Dossier…
                  </>
                ) : (
                  <>
                    Submit Application <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
