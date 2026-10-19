const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '../public/fonts');
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

async function downloadFont(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch ' + url + ': ' + res.status);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buf));
  console.log('Saved:', path.basename(dest), '(' + (buf.byteLength / 1024).toFixed(1) + ' KB)');
}

async function run() {
  const gfCssUrl = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700&display=swap';
  const res = await fetch(gfCssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const css = await res.text();
  console.log('Fetched Google Fonts CSS definition.');

  const blocks = css.split('@font-face');
  const downloaded = new Set();

  for (const block of blocks) {
    // Only latin subset
    if (!block.includes('unicode-range') || !block.includes('U+0000-00FF')) continue;
    const familyMatch = block.match(/font-family:\s*['"]([^'"]+)['"]/);
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (familyMatch && weightMatch && urlMatch) {
      const fam = familyMatch[1].replace(/\s+/g, '-').toLowerCase();
      const wt = weightMatch[1];
      const filename = `${fam}-${wt}.woff2`;
      if (downloaded.has(filename)) continue;
      downloaded.add(filename);
      const dest = path.join(fontsDir, filename);
      await downloadFont(urlMatch[1], dest);
    }
  }

  console.log(`Successfully downloaded ${downloaded.size} self-hosted Latin WOFF2 font files.`);
}

run().catch(console.error);
