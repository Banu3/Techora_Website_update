import 'dotenv/config';
import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('❌ Error: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env');
  process.exit(1);
}

const turso = createClient({ url, authToken });

async function migrate() {
  console.log(`🚀 Connecting to Turso database at ${url}...`);

  // Verify connection
  const ping = await turso.execute('SELECT 1 as connected');
  if (!ping.rows.length) {
    throw new Error('Could not ping Turso database.');
  }
  console.log('✅ Connected to Turso successfully!\n');

  console.log('📦 Applying table schemas and indexes...');

  const schemaStatements = [
    // Legacy tables
    `CREATE TABLE IF NOT EXISTS inquiries (
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
    );`,
    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS job_openings (
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
    );`,
    `CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      linkedin_url TEXT,
      portfolio_url TEXT,
      cover_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    // Production Jobs Table
    `CREATE TABLE IF NOT EXISTS jobs (
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
      department TEXT DEFAULT 'Consulting Practice',
      responsibilities TEXT,
      is_demo INTEGER DEFAULT 0,
      engagement_type TEXT,
      locations TEXT,
      exp_min INTEGER,
      exp_max INTEGER,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);`,
    `CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);`,

    // Production Applications Table
    `CREATE TABLE IF NOT EXISTS applications (
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
      title TEXT,
      first_name TEXT,
      last_name TEXT,
      city TEXT,
      company TEXT,
      designation TEXT,
      experience_years REAL,
      current_ctc TEXT,
      degree TEXT,
      institute TEXT,
      function TEXT,
      industry TEXT,
      skills TEXT,
      resume_url TEXT,
      notes TEXT DEFAULT '',
      mobile TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      retention_until DATETIME,
      FOREIGN KEY (job_id) REFERENCES jobs(id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_function ON applications(function);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_industry ON applications(industry);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_city ON applications(city);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_unique_job_email ON applications(job_id, email);`,

    // Admins Table
    `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    // Enquiries Table
    `CREATE TABLE IF NOT EXISTS enquiries (
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
      service_id TEXT,
      service_line TEXT,
      consent_at DATETIME NOT NULL,
      consent_version TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      ip_hash TEXT,
      user_agent_hash TEXT,
      dedupe_key TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      retention_until DATETIME
    );`,

    // Site Content CMS Table
    `CREATE TABLE IF NOT EXISTS site_content (
      page_key TEXT PRIMARY KEY,
      content_json TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    // Services Table
    `CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      line TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS idx_services_line ON services(line);`,
    `CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);`
  ];

  for (const stmt of schemaStatements) {
    try {
      await turso.execute(stmt);
    } catch (e) {
      console.warn(`[Warning during DDL] ${e.message}`);
    }
  }

  console.log('✅ Schemas created successfully!\n');

  // Check if local SQLite database exists to copy data
  const localDbPath = path.join(__dirname, '../data/techora.sqlite');
  if (fs.existsSync(localDbPath)) {
    console.log(`🔄 Found local database at ${localDbPath}. Migrating data...`);
    const localDb = new Database(localDbPath, { readonly: true });

    const tablesToMigrate = ['admins', 'services', 'jobs', 'site_content', 'enquiries', 'applications'];

    for (const table of tablesToMigrate) {
      try {
        const rows = localDb.prepare(`SELECT * FROM ${table}`).all();
        if (rows.length === 0) {
          console.log(`ℹ️  Table ${table}: 0 rows (skipped)`);
          continue;
        }

        // Check if Turso table already has rows
        const tursoCountRes = await turso.execute(`SELECT COUNT(*) as c FROM ${table}`);
        const tursoCount = Number(tursoCountRes.rows[0].c);

        if (tursoCount > 0) {
          console.log(`ℹ️  Table ${table}: Turso already has ${tursoCount} rows. Skipping insert.`);
          continue;
        }

        console.log(`🚚 Migrating ${rows.length} rows to ${table}...`);
        for (const row of rows) {
          const keys = Object.keys(row);
          const placeholders = keys.map(() => '?').join(', ');
          const values = Object.values(row);
          const sql = `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
          await turso.execute({ sql, args: values });
        }
        console.log(`✅ Table ${table}: Migrated ${rows.length} rows.`);
      } catch (err) {
        console.error(`⚠️  Error migrating table ${table}:`, err.message);
      }
    }
    localDb.close();
  }

  // Final summary of Turso tables
  const tablesResult = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  console.log('\n📊 Turso Database Tables Status:');
  for (const row of tablesResult.rows) {
    const countRes = await turso.execute(`SELECT COUNT(*) as c FROM ${row.name}`);
    console.log(`   - ${row.name}: ${countRes.rows[0].c} records`);
  }

  console.log('\n🎉 Turso database initialization & migration complete!');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
