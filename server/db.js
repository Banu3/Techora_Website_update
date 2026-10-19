import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Secure private uploads folder outside public/static
const privateUploadsDir = path.join(__dirname, '../private_uploads');
if (!fs.existsSync(privateUploadsDir)) {
  fs.mkdirSync(privateUploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'techora.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Base tables
db.exec(`
  -- Legacy tables (preserved)
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service_interest TEXT,
    project_scope TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS job_openings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    work_type TEXT NOT NULL,
    experience TEXT NOT NULL,
    summary TEXT NOT NULL,
    requirements TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    linkedin_url TEXT,
    portfolio_url TEXT,
    cover_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Production Jobs Table
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    designation TEXT NOT NULL,
    experience_text TEXT NOT NULL,
    experience_min INTEGER DEFAULT 0,
    experience_max INTEGER,
    location TEXT NOT NULL,
    employment_type TEXT NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT, -- JSON array string
    deadline DATE,
    status TEXT DEFAULT 'active', -- active | closed | draft
    requires_relevant_experience INTEGER DEFAULT 0,
    requires_dob INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
  CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);

  -- Production Applications Table
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_no TEXT UNIQUE NOT NULL,
    job_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    total_experience TEXT,
    relevant_experience TEXT,
    location TEXT,
    gender TEXT,
    dob TEXT,
    resume_path TEXT NOT NULL,
    resume_original_name TEXT NOT NULL,
    resume_sha256 TEXT,
    parsed_data TEXT,
    consent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    consent_version TEXT DEFAULT 'v1.0',
    status TEXT DEFAULT 'New', -- New | Shortlisted | Interview | Rejected | Hired
    ip_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    retention_until DATETIME,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );

  -- Admin Authentication Table
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Enquiries Table
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_no TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_e164 TEXT NOT NULL,
    company_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    service TEXT NOT NULL,
    company_location TEXT NOT NULL,
    requirements TEXT,
    message TEXT NOT NULL,
    source_page TEXT,
    industry TEXT,
    consent_at DATETIME NOT NULL,
    consent_version TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    ip_hash TEXT,
    user_agent_hash TEXT,
    dedupe_key TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    retention_until DATETIME
  );

  -- Site Content CMS Table
  CREATE TABLE IF NOT EXISTS site_content (
    page_key TEXT PRIMARY KEY,
    content_json TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Additive Schema Migrations for Jobs Table
const jobColumnMigrations = [
  `ALTER TABLE jobs ADD COLUMN department TEXT DEFAULT 'Consulting Practice';`,
  `ALTER TABLE jobs ADD COLUMN responsibilities TEXT;`,
  `ALTER TABLE jobs ADD COLUMN is_demo INTEGER DEFAULT 0;`,
  `ALTER TABLE jobs ADD COLUMN engagement_type TEXT;`,
  `ALTER TABLE jobs ADD COLUMN locations TEXT;`,
  `ALTER TABLE jobs ADD COLUMN exp_min INTEGER;`,
  `ALTER TABLE jobs ADD COLUMN exp_max INTEGER;`,
  `ALTER TABLE jobs ADD COLUMN tags TEXT;`,
];

for (const sql of jobColumnMigrations) {
  try {
    db.exec(sql);
  } catch (e) {
    // Column already exists, safe to ignore
  }
}

// Additive Schema Migrations for Applications Table
const appColumnMigrations = [
  `ALTER TABLE applications ADD COLUMN title TEXT;`,
  `ALTER TABLE applications ADD COLUMN first_name TEXT;`,
  `ALTER TABLE applications ADD COLUMN last_name TEXT;`,
  `ALTER TABLE applications ADD COLUMN city TEXT;`,
  `ALTER TABLE applications ADD COLUMN company TEXT;`,
  `ALTER TABLE applications ADD COLUMN designation TEXT;`,
  `ALTER TABLE applications ADD COLUMN experience_years REAL;`,
  `ALTER TABLE applications ADD COLUMN current_ctc TEXT;`,
  `ALTER TABLE applications ADD COLUMN degree TEXT;`,
  `ALTER TABLE applications ADD COLUMN institute TEXT;`,
  `ALTER TABLE applications ADD COLUMN function TEXT;`,
  `ALTER TABLE applications ADD COLUMN industry TEXT;`,
  `ALTER TABLE applications ADD COLUMN skills TEXT;`,
  `ALTER TABLE applications ADD COLUMN resume_url TEXT;`,
  `ALTER TABLE applications ADD COLUMN notes TEXT DEFAULT '';`,
  `ALTER TABLE applications ADD COLUMN mobile TEXT;`,
];

for (const sql of appColumnMigrations) {
  try {
    db.exec(sql);
  } catch (e) {
    // Column already exists, safe to ignore
  }
}

// Create Indexes
try {
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
    CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
    CREATE INDEX IF NOT EXISTS idx_applications_function ON applications(function);
    CREATE INDEX IF NOT EXISTS idx_applications_industry ON applications(industry);
    CREATE INDEX IF NOT EXISTS idx_applications_city ON applications(city);
    CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
  `);
} catch (e) {
  // Safe ignore
}

// Unique constraint on (job_id, email)
try {
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_unique_job_email ON applications(job_id, email);`);
} catch (e) {
  // If duplicates exist in legacy data, ignore index creation failure
}

// Services Table (Recruitment & Payroll)
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    line TEXT NOT NULL, -- 'RECRUITMENT' | 'PAYROLL'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_services_line ON services(line);
  CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
`);

// Additive Schema Migrations for Enquiries Table
const enquiryMigrations = [
  `ALTER TABLE enquiries ADD COLUMN service_id TEXT;`,
  `ALTER TABLE enquiries ADD COLUMN service_line TEXT;`,
];

for (const sql of enquiryMigrations) {
  try {
    db.exec(sql);
  } catch (e) {
    // Column already exists, safe to ignore
  }
}

// Seed All 14 Services if table is empty
try {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (countRow.count === 0) {
    const defaultServices = [
      // Recruitment Services
      {
        id: 'permanent-recruitment',
        line: 'RECRUITMENT',
        title: 'Permanent Recruitment',
        description: 'Full-cycle hiring of permanent talent across levels and functions.',
        icon: 'UserCheck',
        order_index: 1,
        active: 1,
      },
      {
        id: 'temp-contract-staffing',
        line: 'RECRUITMENT',
        title: 'Temporary & Contract Staffing',
        description: 'Flexible workforce solutions for project-based and short-term needs.',
        icon: 'Clock',
        order_index: 2,
        active: 1,
      },
      {
        id: 'bulk-hiring',
        line: 'RECRUITMENT',
        title: 'Bulk Hiring',
        description: 'Large-volume, time-bound hiring with structured screening and onboarding support.',
        icon: 'Users',
        order_index: 3,
        active: 1,
      },
      {
        id: 'executive-search',
        line: 'RECRUITMENT',
        title: 'Executive Search',
        description: 'Confidential, retained search for senior leadership and C-suite roles.',
        icon: 'Briefcase',
        order_index: 4,
        active: 1,
      },
      {
        id: 'campus-recruitment',
        line: 'RECRUITMENT',
        title: 'Campus Recruitment',
        description: 'Fresher hiring through campus drives, assessments and talent pipelines.',
        icon: 'GraduationCap',
        order_index: 5,
        active: 1,
      },
      {
        id: 'sourcing-screening',
        line: 'RECRUITMENT',
        title: 'Candidate Sourcing & Screening',
        description: 'Targeted sourcing, profile evaluation and shortlisting of qualified candidates.',
        icon: 'Search',
        order_index: 6,
        active: 1,
      },
      {
        id: 'interview-coordination',
        line: 'RECRUITMENT',
        title: 'Interview Scheduling & Coordination',
        description: 'Seamless coordination between candidates and hiring teams.',
        icon: 'Calendar',
        order_index: 7,
        active: 1,
      },

      // Payroll Services
      {
        id: 'payroll-processing',
        line: 'PAYROLL',
        title: 'Payroll Processing',
        description: 'Accurate, on-time monthly payroll execution.',
        icon: 'Calculator',
        order_index: 1,
        active: 1,
      },
      {
        id: 'salary-disbursement',
        line: 'PAYROLL',
        title: 'Salary Calculation & Disbursement Support',
        description: 'Error-free computation and smooth salary release.',
        icon: 'Coins',
        order_index: 2,
        active: 1,
      },
      {
        id: 'payslip-generation',
        line: 'PAYROLL',
        title: 'Payslip Generation',
        description: 'Clear, branded and compliant payslips for every employee.',
        icon: 'FileText',
        order_index: 3,
        active: 1,
      },
      {
        id: 'attendance-leave',
        line: 'PAYROLL',
        title: 'Attendance & Leave Management',
        description: 'Integrated tracking of attendance, leave balances and adjustments.',
        icon: 'CalendarCheck',
        order_index: 4,
        active: 1,
      },
      {
        id: 'pf-esi-support',
        line: 'PAYROLL',
        title: 'PF & ESI Support',
        description: 'Statutory registration, calculation, filing and challan support.',
        icon: 'ShieldCheck',
        order_index: 5,
        active: 1,
      },
      {
        id: 'payroll-reports',
        line: 'PAYROLL',
        title: 'Payroll Reports & Documentation',
        description: 'Audit-ready reports, registers and records.',
        icon: 'FileSpreadsheet',
        order_index: 6,
        active: 1,
      },
      {
        id: 'full-final-settlement',
        line: 'PAYROLL',
        title: 'Full & Final Settlement',
        description: 'Timely, compliant processing of exit dues and clearances.',
        icon: 'CheckCircle2',
        order_index: 7,
        active: 1,
      },
    ];

    const insertStmt = db.prepare(`
      INSERT INTO services (id, line, title, description, icon, order_index, active)
      VALUES (@id, @line, @title, @description, @icon, @order_index, @active)
    `);

    const insertMany = db.transaction((items) => {
      for (const item of items) insertStmt.run(item);
    });

    insertMany(defaultServices);
    console.log('[DB] Successfully seeded 14 institutional services (7 Recruitment, 7 Payroll).');
  }
} catch (err) {
  console.error('[DB] Error seeding services:', err.message);
}

// Seed Default Admin User: admin@techora.consulting / Admin@123
try {
  const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@techora.consulting');
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('Admin@123', salt);
    db.prepare(`
      INSERT INTO admins (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('TECHORA Managing Director', 'admin@techora.consulting', hash, 'superadmin');
    console.log('[DB] Seeded default administrator credentials: admin@techora.consulting');
  }
} catch (err) {
  console.error('[DB] Error seeding default admin:', err.message);
}

export default db;
