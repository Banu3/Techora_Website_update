import db from './config/db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('[Seed] Seeding initial database data...');

  const adminEmail = 'admin@techora.com';
  const plainPassword = 'Admin#2026';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(plainPassword, salt);

  const checkStmt = db.prepare('SELECT id FROM admin_users WHERE email = ?');
  const existing = checkStmt.get(adminEmail);

  if (!existing) {
    const insertStmt = db.prepare('INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)');
    insertStmt.run(adminEmail, passwordHash, 'admin');
    console.log(`[Seed Success] Created default admin account: ${adminEmail} / ${plainPassword}`);
  } else {
    console.log(`[Seed Info] Admin account ${adminEmail} already exists.`);
  }

  // Seed initial sample enquiries if database is empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM enquiries');
  const { count } = countStmt.get();

  if (count === 0) {
    const insertEnquiry = db.prepare(`
      INSERT INTO enquiries (full_name, email, phone, company_name, service_required, service_category, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEnquiry.run(
      'Alexander Wright',
      'alex.wright@nexusglobal.com',
      '+1 (555) 234-8901',
      'Nexus Global Tech',
      'IT Strategy & Consulting',
      'IT Consulting',
      'Looking for a comprehensive 3-year IT strategy roadmap and cloud migration audit for our multi-regional enterprise infrastructure.',
      'In Progress'
    );

    insertEnquiry.run(
      'Elena Rostova',
      'e.rostova@horizonlogistics.io',
      '+1 (555) 987-6543',
      'Horizon Logistics',
      'Payroll Processing',
      'Payroll',
      'Need automated multi-state salary processing and PF/ESI compliance management for our 450+ workforce.',
      'New'
    );

    insertEnquiry.run(
      'Marcus Vance',
      'mvance@apexfintech.org',
      '+1 (555) 456-7890',
      'Apex Fintech Solutions',
      'Cybersecurity Consulting',
      'IT Consulting',
      'Requiring Zero-Trust security architecture setup and SOC 2 audit readiness evaluation for our payment gateway.',
      'Contacted'
    );

    console.log('[Seed Success] Created sample enterprise enquiries.');
  }

  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
