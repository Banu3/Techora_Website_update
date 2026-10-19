import db from '../server/db.js';

console.log('[PURGE] Running expired partnership enquiries retention purge...');

try {
  const expiredStmt = db.prepare(`
    SELECT id, reference_no FROM enquiries
    WHERE datetime(retention_until) <= datetime('now')
       OR datetime(created_at) <= datetime('now', '-365 days')
  `);
  const expired = expiredStmt.all();

  console.log(`[PURGE] Found ${expired.length} expired partnership enquiry records.`);

  const deleteStmt = db.prepare(`
    DELETE FROM enquiries
    WHERE datetime(retention_until) <= datetime('now')
       OR datetime(created_at) <= datetime('now', '-365 days')
  `);
  const info = deleteStmt.run();

  console.log(`[PURGE] Successfully purged ${info.changes} expired enquiries.`);
} catch (err) {
  console.error('[PURGE] Error during enquiries purge:', err.message);
  process.exit(1);
}
