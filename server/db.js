import 'dotenv/config';
import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = Boolean(process.env.VERCEL);

// Secure private uploads folder
const privateUploadsDir = isVercel
  ? path.join(os.tmpdir(), 'techora_private_uploads')
  : path.join(__dirname, '../private_uploads');

try {
  if (!fs.existsSync(privateUploadsDir)) {
    fs.mkdirSync(privateUploadsDir, { recursive: true });
  }
} catch (e) {
  // Silent fallback for read-only serverless filesystems
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
  // Dynamic import for local SQLite only when NOT running on Turso/Vercel
  let Database;
  try {
    const mod = await import('better-sqlite3');
    Database = mod.default;
  } catch (e) {
    console.warn('[DB] better-sqlite3 native module not available:', e.message);
  }

  if (Database) {
    const dataDir = path.join(__dirname, '../data');
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch (e) {}

    const dbPath = path.join(dataDir, 'techora.sqlite');
    const sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');

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
  } else {
    // Dummy fallback if neither is available
    dbInstance = {
      isTurso: false,
      pragma() {},
      prepare() {
        return {
          all: async () => [],
          get: async () => null,
          run: async () => ({ lastInsertRowid: 0, changes: 0 }),
        };
      },
      exec: async () => {},
      transaction: (fn) => async (...args) => fn(...args),
    };
  }
}

export default dbInstance;
