const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const legacyTokens = ['--paper', '--surface', '--blueprint', '--midnight', '--ink-900'];

function searchDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchDir(fullPath);
    } else if (/\.(jsx?|tsx?|css)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        for (const token of legacyTokens) {
          if (line.includes(token)) {
            console.log(`${path.relative(srcDir, fullPath)}:${idx + 1}: ${line.trim()}`);
          }
        }
      });
    }
  }
}

searchDir(srcDir);
