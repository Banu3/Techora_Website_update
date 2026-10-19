import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_FILE || path.join(__dirname, '../database.sqlite');

// Automatically sync generated images to public/images
try {
  const artifactDir = 'C:\\Users\\kisho\\.gemini\\antigravity-ide\\brain\\e5456ade-0163-4bc3-9172-11cd463a3253';
  const publicImgDir = path.join(__dirname, '../../public/images');

  if (!fs.existsSync(publicImgDir)) {
    fs.mkdirSync(publicImgDir, { recursive: true });
  }

  const imageMap = {
    'it_consulting_cover_1790274061958.png': 'it-consulting.png',
    'payroll_services_cover_1790274091786.png': 'payroll-services.png',
    'about_techora_team_1790274125002.png': 'about-team.png',
    'security_datacenter_1790274153276.png': 'security-datacenter.png',
    'hero_enterprise_tech_1790274309634.png': 'hero-tech.png',
    'cloud_devops_infra_1790274331989.png': 'cloud-devops.png',
    'fintech_banking_study_1790274355710.png': 'fintech-banking.png',
    'payroll_analytics_dashboard_1790274382363.png': 'payroll-analytics.png',
    'global_headquarters_office_1790274406618.png': 'headquarters.png',
    'roi_growth_strategy_1790274431352.png': 'roi-strategy.png'
  };

  for (const [srcName, targetName] of Object.entries(imageMap)) {
    const src = path.join(artifactDir, srcName);
    const target = path.join(publicImgDir, targetName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, target);
      console.log(`[Asset Auto-Sync] Synced ${targetName}`);
    }
  }
} catch (e) {
  // Silent fallback
}

let db;

try {
  db = new Database(dbPath, { verbose: null });
  db.pragma('journal_mode = WAL');

  // Initialize schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        company_name TEXT NOT NULL,
        service_required TEXT NOT NULL,
        service_category TEXT DEFAULT 'IT Consulting',
        message TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        content TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log(`[Database] SQLite Database initialized at ${dbPath}`);
} catch (err) {
  console.error('[Database Error] Failed to initialize SQLite database:', err);
}

export default db;
