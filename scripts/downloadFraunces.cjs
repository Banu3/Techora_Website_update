const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '../public/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

function fetch(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location, headers).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ statusCode: res.statusCode, data: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
  });
}

async function run() {
  try {
    const cssRes = await fetch(
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600..700;1,9..144,600..700&display=swap',
      {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    );
    const css = cssRes.data.toString();
    console.log('CSS fetched, length:', css.length);

    // Find latin subset woff2 urls
    const regex = /\/\* latin \*\/\s*@font-face\s*\{[^}]*font-style:\s*normal;[^}]*src:\s*url\((https:\/\/[^)]+)\)/;
    const italicRegex = /\/\* latin \*\/\s*@font-face\s*\{[^}]*font-style:\s*italic;[^}]*src:\s*url\((https:\/\/[^)]+)\)/;

    const normalMatch = css.match(regex);
    const italicMatch = css.match(italicRegex);

    if (normalMatch) {
      console.log('Downloading Fraunces Normal WOFF2:', normalMatch[1]);
      const normalData = await fetch(normalMatch[1]);
      fs.writeFileSync(path.join(fontsDir, 'fraunces-normal.woff2'), normalData.data);
      console.log('Saved fraunces-normal.woff2, bytes:', normalData.data.length);
    }

    if (italicMatch) {
      console.log('Downloading Fraunces Italic WOFF2:', italicMatch[1]);
      const italicData = await fetch(italicMatch[1]);
      fs.writeFileSync(path.join(fontsDir, 'fraunces-italic.woff2'), italicData.data);
      console.log('Saved fraunces-italic.woff2, bytes:', italicData.data.length);
    }
  } catch (err) {
    console.error('Download error:', err.message);
  }
}

run();
