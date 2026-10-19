import 'dotenv/config';
import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Secure private uploads folder outside public/static
const privateUploadsDir = path.join(__dirname, '../private_uploads');
if (!fs.existsSync(privateUploadsDir)) {
  fs.mkdirSync(privateUploadsDir, { recursive: true });
}

const useTurso = Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

function flattenArgs(args) {
  if (args.length === 1 && Array.isArray(args[0])) {
    return args[0];
  }
  return args;
}

let dbInstance;

if (useTurso) {
  const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log(`[DB] Connected to Turso Cloud Database: ${process.env.TURSO_DATABASE_URL}`);

  dbInstance = {
    isTurso: true,
    client: tursoClient,
    pragma() {},
    prepare(sql) {
      return {
        all: async (...args) => {
          const res = await tursoClient.execute({ sql, args: flattenArgs(args) });
          return res.rows;
        },
        get: async (...args) => {
          const res = await tursoClient.execute({ sql, args: flattenArgs(args) });
          return res.rows[0] || null;
        },
        run: async (...args) => {
          const res = await tursoClient.execute({ sql, args: flattenArgs(args) });
          return {
            lastInsertRowid: res.lastInsertRowid !== undefined ? Number(res.lastInsertRowid) : 0,
            changes: res.rowsAffected,
          };
        },
      };
    },
    exec: async (sql) => {
      return await tursoClient.executeMultiple(sql);
    },
    transaction: (fn) => {
      return async (...args) => {
        return await fn(...args);
      };
    },
  };
} else {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'techora.sqlite');
  const sqliteDb = new Database(dbPath);

  // Enable WAL mode for high concurrency
  sqliteDb.pragma('journal_mode = WAL');

  // Base tables
  sqliteDb.exec(`
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
      required_skills TEXT,
      deadline DATE,
      status TEXT DEFAULT 'active',
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
      status TEXT DEFAULT 'New',
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

    -- Services Table
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      line TEXT NOT NULL,
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

  // Additive Schema Migrations
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
    try { sqliteDb.exec(sql); } catch (e) {}
  }

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
    try { sqliteDb.exec(sql); } catch (e) {}
  }

  const enquiryMigrations = [
    `ALTER TABLE enquiries ADD COLUMN service_id TEXT;`,
    `ALTER TABLE enquiries ADD COLUMN service_line TEXT;`,
  ];
  for (const sql of enquiryMigrations) {
    try { sqliteDb.exec(sql); } catch (e) {}
  }

  try {
    sqliteDb.exec(`
      CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
      CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
      CREATE INDEX IF NOT EXISTS idx_applications_function ON applications(function);
      CREATE INDEX IF NOT EXISTS idx_applications_industry ON applications(industry);
      CREATE INDEX IF NOT EXISTS idx_applications_city ON applications(city);
      CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_unique_job_email ON applications(job_id, email);
    `);
  } catch (e) {}

  dbInstance = {
    isTurso: false,
    sqliteDb,
    pragma: (...args) => sqliteDb.pragma(...args),
    prepare(sql) {
      const stmt = sqliteDb.prepare(sql);
      return {
        all: async (...args) => stmt.all(...flattenArgs(args)),
        get: async (...args) => stmt.get(...flattenArgs(args)),
        run: async (...args) => stmt.run(...flattenArgs(args)),
      };
    },
    exec: async (sql) => sqliteDb.exec(sql),
    transaction: (fn) => sqliteDb.transaction(fn),
  };
}

export default dbInstance;
