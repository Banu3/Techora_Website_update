import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import db from './db.js';
import { parseResume, validateMagicBytes } from './services/resumeParser.js';
import { sendEnquiryNotification } from './services/mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'techora_jwt_secret_key_2026_institutional_portal_production';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'techora_admin_secret_token_2026';

// Private Uploads Directory
const privateUploadsDir = path.join(__dirname, '../private_uploads');
if (!fs.existsSync(privateUploadsDir)) {
  fs.mkdirSync(privateUploadsDir, { recursive: true });
}
const tempDir = path.join(__dirname, '../private_uploads/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Multer Storage Configuration
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

const uploadDisk = multer({
  dest: tempDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Rate Limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 40;

function checkRateLimit(ip) {
  const now = Date.now();
  const history = rateLimitMap.get(ip) || [];
  const valid = history.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (valid.length >= MAX_REQUESTS) return false;
  valid.push(now);
  rateLimitMap.set(ip, valid);
  return true;
}

function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

function generateRefNo(prefix) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `TECHORA-${prefix}-${dateStr}-${randomHex}`;
}

// Zod Validation Schemas
const LoginSchema = z.object({
  email: z.string().email('Please enter a valid administrative email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const ApplicationValidationSchema = z.object({
  title: z.string().default('Mr'),
  firstName: z.string().min(1, 'First name is mandatory.'),
  lastName: z.string().min(1, 'Last name is mandatory.'),
  gender: z.string().default('Prefer not to say'),
  dob: z.string().default('1990-01-01'),
  email: z.string().email('A valid corporate or personal email is required.'),
  mobile: z.string().min(8, 'Please provide a valid Indian mobile number (+91).'),
  city: z.string().default('Mumbai'),
  company: z.string().default('Consulting Practice'),
  designation: z.string().default('Executive'),
  experienceYears: z.coerce.number().min(0, 'Experience must be a positive number.').default(0),
  currentCtc: z.string().default('25,00,000'),
  degree: z.string().default('Graduate'),
  institute: z.string().default('Institution'),
  function: z.string().default('Executive Leadership & Board Advisory'),
  industry: z.string().default('Professional Services & Consulting'),
  skills: z.union([z.array(z.string()), z.string()]).default([]),
  consent: z.union([z.boolean(), z.string(), z.number()]).refine((val) => {
    return val === true || val === 'true' || val === '1' || val === 1 || val === 'yes';
  }, 'Data privacy consent agreement is required.'),
});

// Admin JWT Guard Middleware
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required.' });
  }

  const token = authHeader.split(' ')[1];

  // 1. Check if token is the static ADMIN_TOKEN for backward compatibility
  if (token === ADMIN_TOKEN) {
    req.admin = { id: 1, email: 'admin@techora.consulting', role: 'superadmin' };
    return next();
  }

  // 2. Verify signed JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired administrative session token.' });
  }
}

// ============================================================================
// SYSTEM & HEALTH APIS
// ============================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    organization: 'TECHORA Consultant',
    timestamp: new Date().toISOString(),
    database: db.isTurso ? 'SQLite (WAL Active) / Turso LibSQL Cloud' : 'SQLite (WAL Active) / Prisma Prepared',
  });
});

// ============================================================================
// PART 1: PUBLIC CAREERS & MANDATES APIS (/careers)
// ============================================================================
app.get('/api/jobs', async (req, res) => {
  try {
    const { q, designation, location, experience } = req.query;

    let query = `
      SELECT id, slug, title, designation,
             COALESCE(engagement_type, employment_type) AS engagement_type,
             COALESCE(locations, location) AS location,
             COALESCE(exp_min, experience_min, 0) AS exp_min,
             COALESCE(exp_max, experience_max) AS exp_max,
             experience_text,
             COALESCE(tags, required_skills) AS tags,
             description, deadline, status, created_at,
             (SELECT COUNT(a.id) FROM applications a WHERE a.job_id = jobs.id) AS application_count
      FROM jobs
      WHERE status = 'active'
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
    `;
    const params = [];

    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      query += ` AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR required_skills LIKE ? OR designation LIKE ?)`;
      params.push(term, term, term, term, term);
    }
    if (designation && designation !== 'All Designations') {
      query += ` AND designation = ?`;
      params.push(designation.trim());
    }
    if (location && location !== 'All Locations') {
      query += ` AND (location LIKE ? OR locations LIKE ?)`;
      params.push(`%${location.trim()}%`, `%${location.trim()}%`);
    }
    if (experience && experience !== 'All Experience Levels') {
      query += ` AND experience_text LIKE ?`;
      params.push(`%${experience.trim()}%`);
    }

    query += ` ORDER BY id ASC`;

    const stmt = db.prepare(query);
    const jobs = await stmt.all(...params);

    const formattedJobs = jobs.map((j) => {
      let parsedTags = [];
      try {
        parsedTags = j.tags ? JSON.parse(j.tags) : [];
      } catch (e) {
        parsedTags = j.tags ? [j.tags] : [];
      }
      return {
        ...j,
        required_skills: parsedTags,
        tags: parsedTags,
        employment_type: j.engagement_type,
      };
    });

    return res.json({ success: true, count: formattedJobs.length, jobs: formattedJobs });
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    return res.status(500).json({ error: 'Internal system error retrieving job opportunities.' });
  }
});

// GET /api/jobs/:idOrSlug
app.get('/api/jobs/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isNumeric = /^\d+$/.test(idOrSlug);

    const stmt = isNumeric
      ? db.prepare(`
          SELECT id, slug, title, designation,
                 COALESCE(engagement_type, employment_type) AS engagement_type,
                 COALESCE(locations, location) AS location,
                 COALESCE(exp_min, experience_min, 0) AS exp_min,
                 COALESCE(exp_max, experience_max) AS exp_max,
                 experience_text,
                 COALESCE(tags, required_skills) AS tags,
                 description, deadline, status, created_at,
                 (SELECT COUNT(a.id) FROM applications a WHERE a.job_id = jobs.id) AS application_count
          FROM jobs WHERE id = ?
        `)
      : db.prepare(`
          SELECT id, slug, title, designation,
                 COALESCE(engagement_type, employment_type) AS engagement_type,
                 COALESCE(locations, location) AS location,
                 COALESCE(exp_min, experience_min, 0) AS exp_min,
                 COALESCE(exp_max, experience_max) AS exp_max,
                 experience_text,
                 COALESCE(tags, required_skills) AS tags,
                 description, deadline, status, created_at,
                 (SELECT COUNT(a.id) FROM applications a WHERE a.job_id = jobs.id) AS application_count
          FROM jobs WHERE slug = ?
        `);

    const job = await (isNumeric ? stmt.get(parseInt(idOrSlug, 10)) : stmt.get(idOrSlug));

    if (!job) {
      return res.status(404).json({ error: 'Job mandate not found.' });
    }

    const isClosed = job.status !== 'active' || (job.deadline && new Date(job.deadline) < new Date());

    let parsedTags = [];
    try {
      parsedTags = job.tags ? JSON.parse(job.tags) : [];
    } catch (e) {
      parsedTags = job.tags ? [job.tags] : [];
    }

    return res.json({
      success: true,
      isClosed,
      job: {
        ...job,
        required_skills: parsedTags,
        tags: parsedTags,
        employment_type: job.engagement_type,
      },
      message: isClosed ? 'Applications closed for this position.' : undefined,
    });
  } catch (err) {
    console.error('Error fetching job details:', err.message);
    return res.status(500).json({ error: 'Error retrieving job details.' });
  }
});

// ============================================================================
// PART 1 & 2: RESUME PARSING (POST /api/resume/parse & alias)
// ============================================================================
const handleResumeParse = async (req, res) => {
  try {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Too many parse requests. Please wait a moment.' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Please upload a PDF, DOC, DOCX, or Image file (Max 5 MB).', canSubmitManually: true });
    }

    const result = await parseResume(req.file.buffer, req.file.originalname);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('Parse resume error:', err.message);
    return res.status(400).json({
      success: false,
      error: err.message || 'We could not extract details automatically. You can fill the form manually.',
      canSubmitManually: true,
      detected: {},
      fieldStatus: {},
    });
  }
};

app.post('/api/resume/parse', uploadMemory.single('resume'), handleResumeParse);
app.post('/api/applications/parse-resume', uploadMemory.single('resume'), handleResumeParse);

// ============================================================================
// PART 1: APPLICATION SUBMISSION (POST /api/applications)
// ============================================================================
app.post('/api/applications', uploadDisk.single('resume'), async (req, res) => {
  let uploadedTempPath = req.file ? req.file.path : null;

  try {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(clientIp)) {
      if (uploadedTempPath) fs.unlink(uploadedTempPath, () => {});
      return res.status(429).json({ error: 'Submission limit reached. Please wait a moment.' });
    }

    const {
      jobId,
      job_id,
      title,
      firstName,
      first_name,
      lastName,
      last_name,
      full_name,
      gender,
      dob,
      email,
      mobile,
      phone,
      city,
      company,
      designation,
      experienceYears,
      experience_years,
      currentCtc,
      current_ctc,
      degree,
      institute,
      function: appFunction,
      industry,
      skills,
      consent,
    } = req.body;

    const effectiveJobId = parseInt(jobId || job_id, 10);
    let effectiveFirstName = (firstName || first_name || '').trim();
    let effectiveLastName = (lastName || last_name || '').trim();
    if (!effectiveFirstName && full_name) {
      const parts = full_name.trim().split(/\s+/);
      effectiveFirstName = parts[0];
      effectiveLastName = parts.slice(1).join(' ') || parts[0];
    }

    const effectivePhone = (mobile || phone || '').trim();
    const effectiveExp = parseFloat(experienceYears || experience_years || 0);
    const effectiveCtc = (currentCtc || current_ctc || '25,00,000').trim();
    const effectiveTitle = title || 'Mr';
    const effectiveGender = gender || 'Prefer not to say';
    const effectiveDob = dob || '1990-01-01';
    const effectiveCity = city || 'Mumbai';
    const effectiveCompany = company || 'Professional Practice';
    const effectiveDesignation = designation || 'Consultant';
    const effectiveDegree = degree || 'Executive Degree';
    const effectiveInstitute = institute || 'Institution';
    const effectiveFunction = appFunction || 'Executive Leadership & Board Advisory';
    const effectiveIndustry = industry || 'Professional Services & Consulting';

    // Validate with Zod
    const validationResult = ApplicationValidationSchema.safeParse({
      title: effectiveTitle,
      firstName: effectiveFirstName,
      lastName: effectiveLastName,
      gender: effectiveGender,
      dob: effectiveDob,
      email,
      mobile: effectivePhone,
      city: effectiveCity,
      company: effectiveCompany,
      designation: effectiveDesignation,
      experienceYears: effectiveExp,
      currentCtc: effectiveCtc,
      degree: effectiveDegree,
      institute: effectiveInstitute,
      function: effectiveFunction,
      industry: effectiveIndustry,
      skills: skills || [],
      consent,
    });

    if (!validationResult.success) {
      if (uploadedTempPath) fs.unlink(uploadedTempPath, () => {});
      const firstError = validationResult.error.issues?.[0]?.message || validationResult.error.errors?.[0]?.message || 'Invalid form input.';
      return res.status(400).json({ error: firstError, details: validationResult.error.flatten() });
    }

    if (!effectiveJobId || isNaN(effectiveJobId)) {
      if (uploadedTempPath) fs.unlink(uploadedTempPath, () => {});
      return res.status(400).json({ error: 'Valid Job Mandate ID is required.' });
    }

    // Verify Job exists and is active
    const targetJob = await db.prepare('SELECT id, title, deadline, status FROM jobs WHERE id = ?').get(effectiveJobId);
    if (!targetJob) {
      if (uploadedTempPath) fs.unlink(uploadedTempPath, () => {});
      return res.status(404).json({ error: 'The selected mandate could not be found.' });
    }

    // Block Duplicates (Same Email + Same Job)
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await db.prepare('SELECT id, reference_no FROM applications WHERE job_id = ? AND email = ?').get(effectiveJobId, normalizedEmail);
    if (existing) {
      if (uploadedTempPath) fs.unlink(uploadedTempPath, () => {});
      return res.status(200).json({
        success: true,
        alreadyApplied: true,
        referenceNo: existing.reference_no,
        applicationId: existing.reference_no,
        error: 'You have already applied for this position',
        message: 'You have already applied for this position',
      });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: 'Resume upload is required.' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const magic = validateMagicBytes(fileBuffer, req.file.originalname);
    if (!magic.valid) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: magic.error });
    }

    // Save file with random UUID in private uploads
    const ext = path.extname(req.file.originalname).toLowerCase() || (magic.type === 'pdf' ? '.pdf' : '.docx');
    const safeFilename = `${crypto.randomUUID()}${ext}`;
    const destinationPath = path.join(privateUploadsDir, safeFilename);

    fs.copyFileSync(req.file.path, destinationPath);
    fs.unlink(req.file.path, () => {});

    // Parse skills array
    let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === 'string') {
      try {
        skillsArray = JSON.parse(skills);
      } catch (e) {
        skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const referenceNo = generateRefNo('APP');
    const fullName = `${effectiveFirstName} ${effectiveLastName}`.trim();
    const resumeUrl = `/api/admin/resumes/${safeFilename}`;

    const insertStmt = db.prepare(`
      INSERT INTO applications (
        reference_no, job_id, title, first_name, last_name, full_name,
        gender, dob, email, mobile, phone, city, location, company,
        designation, experience_years, total_experience, current_ctc,
        degree, institute, function, industry, skills, resume_path,
        resume_original_name, resume_url, status, notes, consent_at, consent_version,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, 'New', '', CURRENT_TIMESTAMP, 'v1.0',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    await insertStmt.run(
      referenceNo,
      effectiveJobId,
      effectiveTitle,
      sanitizeText(effectiveFirstName),
      sanitizeText(effectiveLastName),
      sanitizeText(fullName),
      sanitizeText(effectiveGender),
      effectiveDob,
      normalizedEmail,
      sanitizeText(effectivePhone),
      sanitizeText(effectivePhone),
      sanitizeText(effectiveCity),
      sanitizeText(effectiveCity),
      sanitizeText(effectiveCompany),
      sanitizeText(effectiveDesignation),
      effectiveExp,
      `${effectiveExp} Years`,
      sanitizeText(effectiveCtc),
      sanitizeText(effectiveDegree),
      sanitizeText(effectiveInstitute),
      sanitizeText(effectiveFunction),
      sanitizeText(effectiveIndustry),
      JSON.stringify(skillsArray),
      safeFilename,
      sanitizeText(req.file.originalname),
      resumeUrl
    );

    return res.status(201).json({
      success: true,
      applicationId: referenceNo,
      referenceNo,
      jobTitle: targetJob.title,
      message: 'Application successfully received with strict confidentiality. A confirmation email has been logged to your address.',
    });
  } catch (err) {
    if (uploadedTempPath) fs.unlink(uploadedTempPath, () => {});
    console.error('Error submitting application:', err.message);
    return res.status(500).json({ error: 'System error processing your application. Please try again.' });
  }
});

// ============================================================================
// PART 2: ADMIN AUTHENTICATION (POST /api/admin/login & verify)
// ============================================================================
app.post('/api/admin/login', async (req, res) => {
  try {
    const validation = LoginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors[0].message });
    }

    const { email, password } = validation.data;
    const admin = await db.prepare('SELECT id, name, email, password_hash, role FROM admins WHERE email = ?').get(email.toLowerCase().trim());

    if (!admin) {
      return res.status(401).json({ error: 'Invalid administrative email or password.' });
    }

    const isValidPassword = bcrypt.compareSync(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid administrative email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err.message);
    return res.status(500).json({ error: 'Internal error during authentication.' });
  }
});

app.get('/api/admin/auth/verify', requireAdminAuth, (req, res) => {
  return res.json({
    success: true,
    authorized: true,
    admin: req.admin,
    message: 'Administrative session active and verified.',
  });
});

// ============================================================================
// PART 2: ADMIN DASHBOARD ANALYTICS & STATS (GET /api/admin/stats)
// ============================================================================
app.get('/api/admin/stats', requireAdminAuth, async (req, res) => {
  try {
    const { range, fromDate, toDate } = req.query;

    let dateCondition = '';
    const dateParams = [];

    if (fromDate && toDate) {
      dateCondition = ' AND date(created_at) >= date(?) AND date(created_at) <= date(?)';
      dateParams.push(fromDate, toDate);
    } else if (range === 'today') {
      dateCondition = " AND date(created_at) = date('now')";
    } else if (range === 'week') {
      dateCondition = " AND date(created_at) >= date('now', '-7 days')";
    } else if (range === 'month') {
      dateCondition = " AND date(created_at) >= date('now', '-30 days')";
    }

    // 1. KPI Cards
    const totalApplications = (await db.prepare(`SELECT COUNT(id) AS count FROM applications WHERE 1=1 ${dateCondition}`).get(...dateParams))?.count || 0;
    const todayCount = (await db.prepare(`SELECT COUNT(id) AS count FROM applications WHERE date(created_at) = date('now')`).get())?.count || 0;
    const weekCount = (await db.prepare(`SELECT COUNT(id) AS count FROM applications WHERE date(created_at) >= date('now', '-7 days')`).get())?.count || 0;
    const monthCount = (await db.prepare(`SELECT COUNT(id) AS count FROM applications WHERE date(created_at) >= date('now', '-30 days')`).get())?.count || 0;
    const shortlistedCount = (await db.prepare(`SELECT COUNT(id) AS count FROM applications WHERE LOWER(status) = 'shortlisted' ${dateCondition}`).get(...dateParams))?.count || 0;
    const rejectedCount = (await db.prepare(`SELECT COUNT(id) AS count FROM applications WHERE LOWER(status) = 'rejected' ${dateCondition}`).get(...dateParams))?.count || 0;
    const activeMandates = (await db.prepare(`SELECT COUNT(id) AS count FROM jobs WHERE status = 'active'`).get())?.count || 0;

    // 2. Applicants per Job (Table and Bar Chart)
    const jobsList = await db.prepare(`
      SELECT j.id, j.title, j.designation, j.status, j.deadline,
             COUNT(a.id) AS count
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id ${dateCondition.replace(/created_at/g, 'a.created_at')}
      GROUP BY j.id
      ORDER BY count DESC, j.id ASC
    `).all(...dateParams);

    // 3. By Function (Donut)
    const byFunction = await db.prepare(`
      SELECT function AS name, COUNT(id) AS count
      FROM applications
      WHERE function IS NOT NULL AND function != '' ${dateCondition}
      GROUP BY function
      ORDER BY count DESC
    `).all(...dateParams);

    // 4. By Industry (Donut)
    const byIndustry = await db.prepare(`
      SELECT industry AS name, COUNT(id) AS count
      FROM applications
      WHERE industry IS NOT NULL AND industry != '' ${dateCondition}
      GROUP BY industry
      ORDER BY count DESC
    `).all(...dateParams);

    // 5. By City (Top 10)
    const byCity = await db.prepare(`
      SELECT city AS name, COUNT(id) AS count
      FROM applications
      WHERE city IS NOT NULL AND city != '' ${dateCondition}
      GROUP BY city
      ORDER BY count DESC
      LIMIT 10
    `).all(...dateParams);

    // 6. By Experience Band (0–2, 2–5, 5–10, 10+)
    const expBands = [
      { band: '0–2 yrs', min: 0, max: 2 },
      { band: '2–5 yrs', min: 2.01, max: 5 },
      { band: '5–10 yrs', min: 5.01, max: 10 },
      { band: '10+ yrs', min: 10.01, max: 99 },
    ];
    const byExperience = await Promise.all(expBands.map(async (b) => {
      const res = await db.prepare(`
        SELECT COUNT(id) AS count FROM applications
        WHERE experience_years >= ? AND experience_years <= ? ${dateCondition}
      `).get(b.min, b.max, ...dateParams);
      return { name: b.band, count: res ? res.count : 0 };
    }));

    // 7. By Gender (Pie)
    const byGender = await db.prepare(`
      SELECT gender AS name, COUNT(id) AS count
      FROM applications
      WHERE gender IS NOT NULL AND gender != '' ${dateCondition}
      GROUP BY gender
      ORDER BY count DESC
    `).all(...dateParams);

    // 8. Applications Over Time (Daily / Weekly / Monthly)
    const overTime = await db.prepare(`
      SELECT date(created_at) AS date, COUNT(id) AS count
      FROM applications
      WHERE created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `).all();

    const totalEnquiries = (await db.prepare('SELECT COUNT(id) AS count FROM enquiries').get())?.count || 0;
    const newEnquiries = (await db.prepare("SELECT COUNT(id) AS count FROM enquiries WHERE LOWER(status) = 'new'").get())?.count || 0;

    const rawEnquiriesByService = await db.prepare(`
      SELECT 
        COALESCE(NULLIF(service, ''), 'General Advisory') AS name,
        COUNT(id) AS count
      FROM enquiries
      GROUP BY name
      ORDER BY count DESC
    `).all();

    return res.json({
      success: true,
      kpis: {
        totalApplications,
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount,
        shortlisted: shortlistedCount,
        rejected: rejectedCount,
        activeMandates,
        totalEnquiries,
        newEnquiries,
      },
      applicantsPerJob: jobsList,
      charts: {
        byJob: jobsList.map((j) => ({ name: j.title.length > 25 ? `${j.title.slice(0, 25)}...` : j.title, fullName: j.title, count: j.count })),
        byFunction,
        byIndustry,
        byCity,
        byExperience,
        byGender,
        overTime,
        enquiriesByService: rawEnquiriesByService,
      },
    });
  } catch (err) {
    console.error('Error in /api/admin/stats:', err.message);
    return res.status(500).json({ error: 'Failed to aggregate administrative metrics.' });
  }
});

// Backward compatible stats route
app.get('/api/admin/jobs/stats', requireAdminAuth, (req, res) => {
  return res.redirect('/api/admin/stats');
});

// ============================================================================
// PART 2: ADMIN APPLICATIONS MANAGEMENT
// ============================================================================
app.get('/api/admin/applications', requireAdminAuth, async (req, res) => {
  try {
    const {
      job_id,
      function: appFunction,
      industry,
      city,
      experience_min,
      experience_max,
      status,
      from_date,
      to_date,
      q,
      sort = 'date_desc',
      page = 1,
      limit = 50,
    } = req.query;

    let query = `
      SELECT a.id, a.reference_no, a.job_id, j.title AS job_title, j.designation AS job_designation,
             a.title, a.first_name, a.last_name, a.full_name,
             a.email, COALESCE(a.mobile, a.phone) AS mobile, a.phone,
             a.city, COALESCE(a.city, a.location) AS location,
             a.company, a.designation,
             a.experience_years, a.total_experience, a.current_ctc,
             a.degree, a.institute, a.function, a.industry, a.skills,
             a.resume_path, a.resume_original_name, a.resume_url,
             a.gender, a.dob, a.status, a.notes, a.created_at
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params = [];

    if (job_id && job_id !== 'all') {
      query += ` AND a.job_id = ?`;
      params.push(parseInt(job_id, 10));
    }
    if (appFunction && appFunction !== 'all') {
      query += ` AND a.function = ?`;
      params.push(appFunction.trim());
    }
    if (industry && industry !== 'all') {
      query += ` AND a.industry = ?`;
      params.push(industry.trim());
    }
    if (city && city !== 'all') {
      query += ` AND (a.city LIKE ? OR a.location LIKE ?)`;
      params.push(`%${city.trim()}%`, `%${city.trim()}%`);
    }
    if (status && status !== 'all') {
      query += ` AND LOWER(a.status) = LOWER(?)`;
      params.push(status.trim());
    }
    if (experience_min !== undefined && experience_min !== '') {
      query += ` AND a.experience_years >= ?`;
      params.push(parseFloat(experience_min));
    }
    if (experience_max !== undefined && experience_max !== '') {
      query += ` AND a.experience_years <= ?`;
      params.push(parseFloat(experience_max));
    }
    if (from_date) {
      query += ` AND date(a.created_at) >= date(?)`;
      params.push(from_date);
    }
    if (to_date) {
      query += ` AND date(a.created_at) <= date(?)`;
      params.push(to_date);
    }
    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      query += ` AND (a.full_name LIKE ? OR a.email LIKE ? OR a.company LIKE ? OR a.designation LIKE ? OR a.reference_no LIKE ? OR a.skills LIKE ?)`;
      params.push(term, term, term, term, term, term);
    }

    // Sorting
    if (sort === 'date_asc') {
      query += ` ORDER BY a.id ASC`;
    } else if (sort === 'exp_desc') {
      query += ` ORDER BY a.experience_years DESC`;
    } else if (sort === 'name_asc') {
      query += ` ORDER BY a.full_name ASC`;
    } else {
      query += ` ORDER BY a.id DESC`;
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const offset = (pageNum - 1) * limitNum;

    const countQuery = `SELECT COUNT(*) AS total FROM (${query})`;
    const totalCount = (await db.prepare(countQuery).get(...params))?.total || 0;

    query += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const rows = await db.prepare(query).all(...params);

    const formatted = rows.map((r) => {
      let skillsArray = [];
      try {
        skillsArray = r.skills ? JSON.parse(r.skills) : [];
      } catch (e) {
        skillsArray = r.skills ? [r.skills] : [];
      }
      return {
        ...r,
        skills: skillsArray,
      };
    });

    return res.json({
      success: true,
      count: formatted.length,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      applications: formatted,
    });
  } catch (err) {
    console.error('Error querying admin applications:', err.message);
    return res.status(500).json({ error: 'Error querying application records.' });
  }
});

// Update single application status & notes
app.patch('/api/admin/applications/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const existing = await db.prepare('SELECT id FROM applications WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Application dossier not found.' });
    }

    let updates = [];
    let params = [];

    if (status !== undefined) {
      const validStatuses = ['New', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];
      const matchedStatus = validStatuses.find((s) => s.toLowerCase() === status.toLowerCase());
      if (!matchedStatus) {
        return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
      }
      updates.push('status = ?');
      params.push(matchedStatus);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(sanitizeText(notes));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update.' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await db.prepare(`UPDATE applications SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    return res.json({ success: true, message: 'Applicant dossier updated successfully.' });
  } catch (err) {
    console.error('Error updating application:', err.message);
    return res.status(500).json({ error: 'Internal error updating application.' });
  }
});

app.patch('/api/admin/applications/:id/status', requireAdminAuth, (req, res) => {
  return app.handle({ ...req, method: 'PATCH', url: `/api/admin/applications/${req.params.id}` }, res);
});

// Bulk status change
app.post('/api/admin/applications/bulk-status', requireAdminAuth, async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return res.status(400).json({ error: 'Array of application IDs and target status are required.' });
    }

    const validStatuses = ['New', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];
    const matched = validStatuses.find((s) => s.toLowerCase() === status.toLowerCase());
    if (!matched) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const placeholders = ids.map(() => '?').join(',');
    await db.prepare(`UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`).run(matched, ...ids);

    return res.json({ success: true, message: `Successfully updated ${ids.length} applications to ${matched}.` });
  } catch (err) {
    console.error('Bulk update error:', err.message);
    return res.status(500).json({ error: 'Failed to execute bulk status update.' });
  }
});

// Delete single application
app.delete('/api/admin/applications/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.prepare('SELECT id, reference_no, resume_path FROM applications WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Candidate application not found.' });
    }
    if (existing.resume_path && fs.existsSync(existing.resume_path)) {
      try { fs.unlinkSync(existing.resume_path); } catch (e) {}
    }
    await db.prepare('DELETE FROM applications WHERE id = ?').run(id);
    return res.json({ success: true, message: `Application dossier [${existing.reference_no}] deleted successfully.` });
  } catch (err) {
    console.error('Error deleting application:', err.message);
    return res.status(500).json({ error: 'Failed to delete candidate application.' });
  }
});

// Bulk delete applications
app.post('/api/admin/applications/bulk-delete', requireAdminAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of application IDs required.' });
    }
    const placeholders = ids.map(() => '?').join(',');
    const apps = await db.prepare(`SELECT resume_path FROM applications WHERE id IN (${placeholders})`).all(...ids);
    for (const a of apps) {
      if (a.resume_path && fs.existsSync(a.resume_path)) {
        try { fs.unlinkSync(a.resume_path); } catch (e) {}
      }
    }
    const result = await db.prepare(`DELETE FROM applications WHERE id IN (${placeholders})`).run(...ids);
    return res.json({ success: true, message: `Successfully deleted ${result.changes} candidate application(s).` });
  } catch (err) {
    console.error('Error bulk deleting applications:', err.message);
    return res.status(500).json({ error: 'Failed to delete selected applications.' });
  }
});

// Export applications to CSV
app.get('/api/admin/export', requireAdminAuth, async (req, res) => {
  try {
    const { job_id, status, function: appFunc, city } = req.query;

    let query = `
      SELECT a.reference_no, j.title AS job_title, a.full_name, a.email, a.mobile,
             a.city, a.company, a.designation, a.experience_years, a.current_ctc,
             a.degree, a.institute, a.function, a.industry, a.status, a.created_at
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params = [];

    if (job_id && job_id !== 'all') {
      query += ` AND a.job_id = ?`;
      params.push(parseInt(job_id, 10));
    }
    if (status && status !== 'all') {
      query += ` AND LOWER(a.status) = LOWER(?)`;
      params.push(status.trim());
    }
    if (appFunc && appFunc !== 'all') {
      query += ` AND a.function = ?`;
      params.push(appFunc.trim());
    }
    if (city && city !== 'all') {
      query += ` AND a.city LIKE ?`;
      params.push(`%${city.trim()}%`);
    }

    query += ` ORDER BY a.id DESC`;

    const rows = await db.prepare(query).all(...params);

    // Build CSV
    const headers = [
      'Reference No', 'Mandate', 'Full Name', 'Email', 'Mobile',
      'City', 'Company', 'Designation', 'Experience (Years)', 'Current CTC',
      'Degree', 'Institute', 'Function', 'Industry', 'Status', 'Applied Date'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csv = headers.join(',') + '\n';
    for (const r of rows) {
      const line = [
        r.reference_no, r.job_title, r.full_name, r.email, r.mobile,
        r.city, r.company, r.designation, r.experience_years, r.current_ctc,
        r.degree, r.institute, r.function, r.industry, r.status, r.created_at
      ].map(escapeCsv).join(',');
      csv += line + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="TECHORA_Applications_${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    console.error('Error generating export:', err.message);
    return res.status(500).json({ error: 'Failed to generate export file.' });
  }
});

// ============================================================================
// PART 2: ADMIN MANDATES CRUD (/api/admin/jobs)
// ============================================================================
app.get('/api/admin/jobs', requireAdminAuth, async (req, res) => {
  try {
    const rows = await db.prepare(`
      SELECT j.id, j.slug, j.title, j.designation,
             COALESCE(j.engagement_type, j.employment_type) AS engagement_type,
             COALESCE(j.locations, j.location) AS locations,
             COALESCE(j.exp_min, j.experience_min, 0) AS exp_min,
             COALESCE(j.exp_max, j.experience_max) AS exp_max,
             j.experience_text,
             COALESCE(j.tags, j.required_skills) AS tags,
             j.description, j.deadline, j.status, j.created_at,
             COUNT(a.id) AS applicant_count
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY j.id
      ORDER BY j.id ASC
    `).all();

    const formatted = rows.map((j) => {
      let tags = [];
      try {
        tags = j.tags ? JSON.parse(j.tags) : [];
      } catch (e) {
        tags = j.tags ? [j.tags] : [];
      }
      return {
        ...j,
        tags,
        required_skills: tags,
        employment_type: j.engagement_type,
        location: j.locations,
        application_count: j.applicant_count,
      };
    });

    return res.json({ success: true, count: formatted.length, jobs: formatted });
  } catch (err) {
    console.error('Error retrieving admin jobs:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve mandates.' });
  }
});

app.post('/api/admin/jobs', requireAdminAuth, async (req, res) => {
  try {
    const {
      title,
      designation,
      engagementType,
      engagement_type,
      employment_type,
      locations,
      location,
      expMin,
      exp_min,
      expMax,
      exp_max,
      tags,
      required_skills,
      description,
      deadline,
      status = 'active',
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Mandate title is required.' });
    }
    if (!designation || !designation.trim()) {
      return res.status(400).json({ error: 'Executive designation is required.' });
    }
    if (!description || description.trim().length < 15) {
      return res.status(400).json({ error: 'Description must be at least 15 characters.' });
    }

    const effEngagement = (engagementType || engagement_type || employment_type || 'Full-time Mandate').trim();
    const effLocation = (locations || location || 'Mumbai / Hybrid').trim();
    const effExpMin = parseInt(expMin ?? exp_min ?? 0, 10);
    const effExpMax = expMax !== undefined && expMax !== '' ? parseInt(expMax ?? exp_max, 10) : null;
    const expText = effExpMax ? `${effExpMin}–${effExpMax} Years` : `${effExpMin}+ Years`;

    let tagsArray = [];
    const rawTags = tags || required_skills;
    if (Array.isArray(rawTags)) {
      tagsArray = rawTags;
    } else if (typeof rawTags === 'string') {
      tagsArray = rawTags.split(',').map((s) => s.trim()).filter(Boolean);
    }

    // Slug generation
    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await db.prepare('SELECT id FROM jobs WHERE slug = ?').get(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const stmt = db.prepare(`
      INSERT INTO jobs (
        slug, title, designation, employment_type, engagement_type, location, locations,
        experience_text, experience_min, experience_max, exp_min, exp_max,
        tags, required_skills, description, deadline, status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    const result = await stmt.run(
      slug,
      sanitizeText(title),
      sanitizeText(designation),
      effEngagement,
      effEngagement,
      effLocation,
      effLocation,
      expText,
      effExpMin,
      effExpMax,
      effExpMin,
      effExpMax,
      JSON.stringify(tagsArray),
      JSON.stringify(tagsArray),
      sanitizeText(description),
      deadline ? deadline.trim() : null,
      ['active', 'draft', 'closed'].includes(status) ? status : 'active'
    );

    const created = await db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, message: 'Mandate successfully created and published.', job: created });
  } catch (err) {
    console.error('Error creating job:', err.message);
    return res.status(500).json({ error: 'Server error creating mandate.' });
  }
});

app.put('/api/admin/jobs/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Job mandate not found.' });
    }

    const {
      title = existing.title,
      designation = existing.designation,
      engagementType,
      engagement_type,
      locations,
      location,
      expMin,
      exp_min,
      expMax,
      exp_max,
      tags,
      description = existing.description,
      deadline = existing.deadline,
      status = existing.status,
    } = req.body;

    const effEngagement = engagementType || engagement_type || existing.engagement_type || existing.employment_type;
    const effLocation = locations || location || existing.locations || existing.location;
    const effExpMin = parseInt(expMin ?? exp_min ?? existing.exp_min ?? existing.experience_min ?? 0, 10);
    const effExpMax = expMax !== undefined && expMax !== '' ? parseInt(expMax ?? exp_max, 10) : existing.exp_max;
    const expText = effExpMax ? `${effExpMin}–${effExpMax} Years` : `${effExpMin}+ Years`;

    let tagsArray = [];
    if (tags !== undefined) {
      tagsArray = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((s) => s.trim()).filter(Boolean) : [];
    } else {
      try {
        tagsArray = JSON.parse(existing.tags || existing.required_skills || '[]');
      } catch (e) {
        tagsArray = [];
      }
    }

    await db.prepare(`
      UPDATE jobs SET
        title = ?, designation = ?, employment_type = ?, engagement_type = ?,
        location = ?, locations = ?, experience_text = ?,
        experience_min = ?, experience_max = ?, exp_min = ?, exp_max = ?,
        tags = ?, required_skills = ?, description = ?, deadline = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      sanitizeText(title),
      sanitizeText(designation),
      effEngagement,
      effEngagement,
      effLocation,
      effLocation,
      expText,
      effExpMin,
      effExpMax,
      effExpMin,
      effExpMax,
      JSON.stringify(tagsArray),
      JSON.stringify(tagsArray),
      sanitizeText(description),
      deadline ? deadline.trim() : null,
      status,
      id
    );

    const updated = await db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    return res.json({ success: true, message: 'Mandate updated successfully.', job: updated });
  } catch (err) {
    console.error('Error updating job:', err.message);
    return res.status(500).json({ error: 'Server error updating mandate.' });
  }
});

app.delete('/api/admin/jobs/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.prepare('SELECT id FROM jobs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Job mandate not found.' });
    }

    const appCount = await db.prepare('SELECT COUNT(id) AS count FROM applications WHERE job_id = ?').get(id);
    if (appCount && appCount.count > 0) {
      await db.prepare(`UPDATE jobs SET status = 'closed', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(id);
      return res.json({
        success: true,
        archived: true,
        message: `Mandate marked as closed. Preserved ${appCount.count} applicant records.`,
      });
    }

    await db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Mandate permanently removed.' });
  } catch (err) {
    console.error('Error deleting job:', err.message);
    return res.status(500).json({ error: 'Server error deleting mandate.' });
  }
});

// Secure Resume Download Endpoint
app.get('/api/admin/resumes/:filename', requireAdminAuth, (req, res) => {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(privateUploadsDir, safeFilename);

    if (!fs.existsSync(filePath)) {
      // Check sample resumes or fallback
      return res.status(404).json({ error: 'Resume dossier file not found.' });
    }

    return res.sendFile(filePath);
  } catch (err) {
    return res.status(500).json({ error: 'Error downloading resume dossier.' });
  }
});

// ============================================================================
// PART 2: SERVICES & ENQUIRIES MANAGEMENT
// ============================================================================

// Rate Limiter for Enquiry Submissions (in-memory)
const enquiryRateMap = new Map();
function checkEnquiryRateLimit(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 15;
  const record = enquiryRateMap.get(ip);
  if (!record || now > record.resetAt) {
    enquiryRateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count += 1;
  return true;
}

// 1. Public Services API (/api/services)
app.get('/api/services', async (req, res) => {
  try {
    const { line } = req.query;
    let query = 'SELECT * FROM services WHERE active = 1';
    const params = [];
    if (line) {
      query += ' AND UPPER(line) = UPPER(?)';
      params.push(line.trim());
    }
    query += ' ORDER BY order_index ASC, id ASC';
    const services = await db.prepare(query).all(...params);
    return res.json({ success: true, services });
  } catch (err) {
    console.error('Error fetching public services:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve services.' });
  }
});

// 2. Admin Services CRUD
app.get('/api/admin/services', requireAdminAuth, async (req, res) => {
  try {
    const services = await db.prepare('SELECT * FROM services ORDER BY line ASC, order_index ASC').all();
    return res.json({ success: true, services });
  } catch (err) {
    console.error('Error fetching admin services:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve services.' });
  }
});

app.post('/api/admin/services', requireAdminAuth, async (req, res) => {
  try {
    const { id, line, title, description, icon, order_index, active } = req.body;
    if (!title || !description || !line) {
      return res.status(400).json({ error: 'Title, description, and service line are required.' });
    }
    const serviceId = (id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
    const existing = await db.prepare('SELECT id FROM services WHERE id = ?').get(serviceId);
    if (existing) {
      return res.status(409).json({ error: 'A service with this ID or slug already exists.' });
    }

    await db.prepare(`
      INSERT INTO services (id, line, title, description, icon, order_index, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      serviceId,
      line.toUpperCase(),
      title.trim(),
      description.trim(),
      icon || 'Briefcase',
      parseInt(order_index || 0, 10),
      active === undefined || active === 1 || active === true ? 1 : 0
    );

    const created = await db.prepare('SELECT * FROM services WHERE id = ?').get(serviceId);
    return res.status(201).json({ success: true, service: created });
  } catch (err) {
    console.error('Error creating service:', err.message);
    return res.status(500).json({ error: 'Failed to create service: ' + err.message });
  }
});

app.put('/api/admin/services/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { line, title, description, icon, order_index, active } = req.body;
    const existing = await db.prepare('SELECT id FROM services WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    await db.prepare(`
      UPDATE services
      SET line = COALESCE(?, line),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          icon = COALESCE(?, icon),
          order_index = COALESCE(?, order_index),
          active = COALESCE(?, active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      line ? line.toUpperCase() : null,
      title !== undefined ? title.trim() : null,
      description !== undefined ? description.trim() : null,
      icon !== undefined ? icon : null,
      order_index !== undefined ? parseInt(order_index, 10) : null,
      active !== undefined ? (active ? 1 : 0) : null,
      id
    );

    const updated = await db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    return res.json({ success: true, service: updated, message: 'Service updated successfully.' });
  } catch (err) {
    console.error('Error updating service:', err.message);
    return res.status(500).json({ error: 'Failed to update service.' });
  }
});

app.delete('/api/admin/services/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.prepare('SELECT id FROM services WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    await db.prepare('DELETE FROM services WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Service removed successfully.' });
  } catch (err) {
    console.error('Error deleting service:', err.message);
    return res.status(500).json({ error: 'Failed to delete service.' });
  }
});

// Admin Home Service Card Image Upload
// Auto-resizes to 1200x750, converts to WebP under 150 KB
app.post('/api/admin/services/card-image', requireAdminAuth, uploadMemory.single('image'), async (req, res) => {
  try {
    const { cardId } = req.body;
    const fileMap = {
      'recruitment': 'executive-talent.webp',
      'executive-talent': 'executive-talent.webp',
      'payroll': 'payroll-governance.webp',
      'payroll-governance': 'payroll-governance.webp',
      'advisory': 'workforce-advisory.webp',
      'workforce-advisory': 'workforce-advisory.webp',
    };

    const targetFile = fileMap[cardId];
    if (!targetFile) {
      return res.status(400).json({ error: 'Invalid service card identifier.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image exceeds maximum size limit of 2 MB.' });
    }

    const mime = req.file.mimetype;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) {
      return res.status(400).json({ error: 'Only JPG, PNG, and WebP images are permitted.' });
    }

    const sharpModule = await import('sharp');
    const sharp = sharpModule.default;

    const overlaySvg = Buffer.from(
      `<svg width="1200" height="750" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="750" fill="#071426" fill-opacity="0.08" />
      </svg>`
    );

    let quality = 82;
    let webpBuf = await sharp(req.file.buffer)
      .resize(1200, 750, { fit: 'cover', position: 'center' })
      .composite([{ input: overlaySvg, blend: 'over' }])
      .webp({ quality, effort: 6 })
      .toBuffer();

    while (webpBuf.length > 150 * 1024 && quality > 50) {
      quality -= 5;
      webpBuf = await sharp(req.file.buffer)
        .resize(1200, 750, { fit: 'cover', position: 'center' })
        .composite([{ input: overlaySvg, blend: 'over' }])
        .webp({ quality, effort: 6 })
        .toBuffer();
    }

    const publicDir = path.join(__dirname, '../public/images/services');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const outPath = path.join(publicDir, targetFile);
    fs.writeFileSync(outPath, webpBuf);

    return res.json({
      success: true,
      message: `Image updated successfully for ${cardId}`,
      url: `/images/services/${targetFile}?v=${Date.now()}`,
      sizeKB: (webpBuf.length / 1024).toFixed(1),
    });
  } catch (err) {
    console.error('Error uploading card image:', err.message);
    return res.status(500).json({ error: 'Failed to process card image: ' + err.message });
  }
});

// 3. Admin Enquiries CSV Export (Supports Bearer token or ?token= param)
app.get('/api/admin/enquiries/export', (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.query.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token is required.' });
  }
  if (token === ADMIN_TOKEN) {
    req.admin = { id: 1, email: 'admin@techora.consulting', role: 'superadmin' };
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token.' });
  }
}, (req, res) => {
  try {
    const enquiries = db.prepare(`
      SELECT reference_no, full_name, company_name, email, phone_e164, service, service_line, status, created_at, message
      FROM enquiries
      ORDER BY id DESC
    `).all();

    const headers = ['Reference No', 'Full Name', 'Company', 'Email', 'Mobile', 'Service', 'Service Line', 'Status', 'Date', 'Message'];
    const rows = enquiries.map((e) => [
      e.reference_no,
      e.full_name,
      e.company_name,
      e.email,
      e.phone_e164,
      e.service,
      e.service_line || '',
      e.status,
      e.created_at,
      (e.message || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((val) => `"${String(val || '').replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="techora_enquiries_${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    console.error('Error exporting enquiries:', err.message);
    return res.status(500).json({ error: 'Failed to export enquiries CSV.' });
  }
});

// 4. Admin Enquiries List
app.get('/api/admin/enquiries', requireAdminAuth, async (req, res) => {
  try {
    const { status, service, line, q, page = 1, limit = 50 } = req.query;

    let query = `
      SELECT id, reference_no, full_name, email, phone_e164, company_name, designation,
             service, service_id, service_line, company_location, requirements, industry, source_page, message, status, created_at, updated_at
      FROM enquiries
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND LOWER(status) = LOWER(?)`;
      params.push(status.trim());
    }
    if (line && line !== 'all') {
      query += ` AND (UPPER(service_line) = UPPER(?) OR UPPER(service) LIKE ?)`;
      params.push(line.trim(), `%${line.trim().toUpperCase()}%`);
    } else if (service && service !== 'all') {
      query += ` AND LOWER(service) = LOWER(?)`;
      params.push(service.trim());
    }
    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      query += ` AND (full_name LIKE ? OR email LIKE ? OR phone_e164 LIKE ? OR company_name LIKE ? OR reference_no LIKE ? OR service LIKE ? OR message LIKE ?)`;
      params.push(term, term, term, term, term, term, term);
    }

    const countSql = query.replace(/SELECT[\s\S]+?FROM enquiries/, 'SELECT COUNT(*) as total FROM enquiries');
    const totalRow = await db.prepare(countSql).get(...params);
    const total = totalRow ? totalRow.total : 0;

    query += ` ORDER BY id DESC`;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    query += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const enquiries = await db.prepare(query).all(...params);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      enquiries,
    });
  } catch (err) {
    console.error('Error fetching admin enquiries:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve partner enquiries.' });
  }
});

// 5. Admin Enquiry Status Update
app.patch('/api/admin/enquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await db.prepare('SELECT id FROM enquiries WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }

    if (status) {
      await db.prepare(`UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(status, id);
    }

    return res.json({ success: true, message: 'Enquiry status updated successfully.' });
  } catch (err) {
    console.error('Error updating enquiry status:', err.message);
    return res.status(500).json({ error: 'Failed to update partner enquiry.' });
  }
});

// Delete single enquiry
app.delete('/api/admin/enquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.prepare('SELECT id, reference_no FROM enquiries WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Enquiry record not found.' });
    }
    await db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);
    return res.json({ success: true, message: `Enquiry [${existing.reference_no}] deleted successfully.` });
  } catch (err) {
    console.error('Error deleting enquiry:', err.message);
    return res.status(500).json({ error: 'Failed to delete enquiry record.' });
  }
});

// Bulk delete enquiries
app.post('/api/admin/enquiries/bulk-delete', requireAdminAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of enquiry IDs required.' });
    }
    const placeholders = ids.map(() => '?').join(',');
    const result = await db.prepare(`DELETE FROM enquiries WHERE id IN (${placeholders})`).run(...ids);
    return res.json({ success: true, message: `Successfully deleted ${result.changes} enquiry record(s).` });
  } catch (err) {
    console.error('Error bulk deleting enquiries:', err.message);
    return res.status(500).json({ error: 'Failed to delete selected enquiries.' });
  }
});

// 6. Public Enquiry Submission (Dual support for Service Enquiry Modal & Partner Intake)
const enquiryValidationSchema = z.object({
  name: z.string().min(2, 'Name must contain at least 2 characters').optional(),
  full_name: z.string().min(2, 'Full name must contain at least 2 characters').optional(),
  email: z.string().email('Please provide a valid corporate email address'),
  mobile: z.string().min(6, 'Please provide a valid mobile number').optional(),
  phone: z.string().min(6).optional(),
  phone_e164: z.string().min(6).optional(),
  company: z.string().optional(),
  company_name: z.string().optional(),
  designation: z.string().optional(),
  service: z.string().optional(),
  serviceId: z.string().optional(),
  service_id: z.string().optional(),
  company_location: z.string().optional(),
  industry: z.string().optional(),
  requirements: z.any().optional(),
  message: z.string().min(3, 'Please provide a brief description of your mandate or query (at least 3 characters)'),
  source_page: z.string().optional(),
  consent: z.any().optional(),
  website_hp: z.string().optional(),
  submission_time_ms: z.any().optional(),
}).refine((data) => data.name || data.full_name, {
  message: 'Full Name is required',
  path: ['name'],
});

app.post('/api/enquiries', async (req, res) => {
  try {
    // A. Rate Limiting Check
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (!checkEnquiryRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait a few minutes before submitting another enquiry.' });
    }

    // B. Honeypot & Bot Checks
    const { website_hp, submission_time_ms } = req.body;
    if (website_hp) {
      return res.status(400).json({ error: 'Automated submission detected.' });
    }
    if (submission_time_ms && parseInt(submission_time_ms, 10) < 1200) {
      return res.status(400).json({ error: 'Submission received too quickly. Please review your details.' });
    }

    // C. Zod Validation
    const parsed = enquiryValidationSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Validation error.';
      return res.status(400).json({ error: firstError, details: parsed.error.issues });
    }

    const data = parsed.data;
    const fullName = (data.name || data.full_name || '').trim();
    const email = data.email.trim();
    const companyName = (data.company || data.company_name || 'Individual / Confidential').trim();
    const phone = (data.mobile || data.phone || data.phone_e164 || '').trim();
    const designation = (data.designation || 'Corporate Decision Maker').trim();
    const location = (data.company_location || '').trim();
    const message = data.message.trim();
    const sourcePage = data.source_page || '/services';
    const requirements = data.requirements;
    const industry = data.industry || '';

    // D. Service & Line Resolution
    let serviceTitle = data.service || 'General Practice Enquiry';
    let serviceId = data.serviceId || data.service_id || '';
    let serviceLine = 'RECRUITMENT';

    // Lookup service in database if serviceId or serviceTitle is provided
    if (serviceId) {
      const match = await db.prepare('SELECT title, line FROM services WHERE id = ?').get(serviceId);
      if (match) {
        serviceTitle = match.title;
        serviceLine = match.line;
      }
    } else {
      const match = await db.prepare('SELECT id, title, line FROM services WHERE LOWER(title) = LOWER(?)').get(serviceTitle);
      if (match) {
        serviceId = match.id;
        serviceTitle = match.title;
        serviceLine = match.line;
      } else if (/payroll|salary|payslip|esi|pf|settlement|attendance/i.test(serviceTitle)) {
        serviceLine = 'PAYROLL';
      }
    }

    const reqStr = typeof requirements === 'object' && requirements !== null
      ? JSON.stringify(requirements)
      : (requirements || '');

    const refNo = generateRefNo('ENQ');

    await db.prepare(`
      INSERT INTO enquiries (
        reference_no, full_name, email, phone_e164, company_name, designation,
        service, service_id, service_line, company_location, requirements, industry,
        source_page, message, consent_at, consent_version, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'v1.0', 'new')
    `).run(
      refNo,
      fullName,
      email,
      phone,
      companyName,
      designation,
      serviceTitle,
      serviceId,
      serviceLine,
      location,
      reqStr,
      industry,
      sourcePage,
      message
    );

    sendEnquiryNotification({ referenceNo: refNo, name: fullName, company: companyName, service: serviceTitle }).catch(() => {});

    return res.status(201).json({
      success: true,
      referenceNo: refNo,
      message: 'Your enquiry has been successfully submitted. Our senior practice leadership will connect with you within 24 hours.',
    });
  } catch (err) {
    console.error('Error processing enquiry:', err.message);
    return res.status(500).json({ error: 'System error processing your partnership mandate.' });
  }
});

// ============================================================================
// WEBSITE CONTENT MANAGEMENT SYSTEM (CMS) APIS
// ============================================================================

// Public GET: Fetch all active site content overrides
app.get('/api/content', async (req, res) => {
  try {
    const rows = await db.prepare('SELECT page_key, content_json, updated_at FROM site_content').all();
    const content = {};
    for (const r of rows) {
      try {
        content[r.page_key] = JSON.parse(r.content_json);
      } catch (e) {
        content[r.page_key] = {};
      }
    }
    return res.json({ success: true, content });
  } catch (err) {
    console.error('Error fetching site content:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve website content.' });
  }
});

// Public GET: Fetch single page content
app.get('/api/content/:pageKey', async (req, res) => {
  try {
    const row = await db.prepare('SELECT page_key, content_json, updated_at FROM site_content WHERE page_key = ?').get(req.params.pageKey);
    if (!row) {
      return res.json({ success: true, pageKey: req.params.pageKey, content: null });
    }
    return res.json({
      success: true,
      pageKey: row.page_key,
      content: JSON.parse(row.content_json),
      updatedAt: row.updated_at,
    });
  } catch (err) {
    console.error(`Error fetching page content for ${req.params.pageKey}:`, err.message);
    return res.status(500).json({ error: 'Failed to retrieve page content.' });
  }
});

// Admin PUT: Update single page content
app.put('/api/content/:pageKey', requireAdminAuth, async (req, res) => {
  try {
    const pageKey = req.params.pageKey;
    const incoming = req.body.content !== undefined ? req.body.content : req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'Invalid content payload: expected JSON object.' });
    }

    const contentJson = JSON.stringify(incoming);

    await db.prepare(`
      INSERT INTO site_content (page_key, content_json, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(page_key) DO UPDATE SET
        content_json = excluded.content_json,
        updated_at = CURRENT_TIMESTAMP
    `).run(pageKey, contentJson);

    return res.json({
      success: true,
      pageKey,
      message: `Content for '${pageKey}' has been updated and published.`,
    });
  } catch (err) {
    console.error(`Error saving page content for ${req.params.pageKey}:`, err.message);
    return res.status(500).json({ error: 'Failed to save page content.' });
  }
});

// Admin POST: Batch save multiple pages
app.post('/api/content/batch', requireAdminAuth, async (req, res) => {
  try {
    const pages = req.body.pages;
    if (!pages || typeof pages !== 'object') {
      return res.status(400).json({ error: 'Invalid batch payload: expected object { pages: { [key]: content } }.' });
    }

    const upsertStmt = db.prepare(`
      INSERT INTO site_content (page_key, content_json, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(page_key) DO UPDATE SET
        content_json = excluded.content_json,
        updated_at = CURRENT_TIMESTAMP
    `);

    for (const [key, val] of Object.entries(pages)) {
      await upsertStmt.run(key, JSON.stringify(val));
    }

    return res.json({
      success: true,
      message: `Successfully saved ${Object.keys(pages).length} pages of website content.`,
    });
  } catch (err) {
    console.error('Error batch saving site content:', err.message);
    return res.status(500).json({ error: 'Failed to save batch content.' });
  }
});

// Admin POST: Reset page content to default
app.post('/api/content/reset/:pageKey', requireAdminAuth, async (req, res) => {
  try {
    const pageKey = req.params.pageKey;
    await db.prepare('DELETE FROM site_content WHERE page_key = ?').run(pageKey);
    return res.json({
      success: true,
      pageKey,
      message: `Page '${pageKey}' content reset to factory defaults.`,
    });
  } catch (err) {
    console.error(`Error resetting content for ${req.params.pageKey}:`, err.message);
    return res.status(500).json({ error: 'Failed to reset page content.' });
  }
});

app.post('/api/inquiries', (req, res) => res.redirect(307, '/api/enquiries'));

// Serve Static Files in Production
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && req.method === 'GET') {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[TECHORA BACKEND] Operational on port ${PORT}`);
  });
}

export default app;
