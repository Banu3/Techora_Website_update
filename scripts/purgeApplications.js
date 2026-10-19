import db from '../server/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const privateUploadsDir = path.join(__dirname, '../private_uploads');

console.log('[PURGE] Running expired applications retention purge...');

try {
  // Find applications past retention date or past 365 days
  const expiredStmt = db.prepare(`
    SELECT id, reference_no, resume_path FROM applications
    WHERE datetime(retention_until) <= datetime('now')
       OR datetime(created_at) <= datetime('now', '-365 days')
  `);
  const expired = expiredStmt.all();

  console.log(`[PURGE] Found ${expired.length} expired candidate application records.`);

  let deletedFiles = 0;
  for (const app of expired) {
    if (app.resume_path) {
      const filePath = path.join(privateUploadsDir, path.basename(app.resume_path));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          deletedFiles++;
        } catch (e) {
          console.error(`[PURGE] Error deleting resume file: ${filePath}`, e.message);
        }
      }
    }
  }

  const deleteStmt = db.prepare(`
    DELETE FROM applications
    WHERE datetime(retention_until) <= datetime('now')
       OR datetime(created_at) <= datetime('now', '-365 days')
  `);
  const info = deleteStmt.run();

  console.log(`[PURGE] Successfully purged ${info.changes} applications and removed ${deletedFiles} stored resume files.`);
} catch (err) {
  console.error('[PURGE] Error during applications purge:', err.message);
  process.exit(1);
}
