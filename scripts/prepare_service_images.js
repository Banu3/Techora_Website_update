import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Download, resize to 1200x750 (16:10), color grade with cool navy/neutral tone,
 * and save as compressed WebP under 150 KB.
 *
 * IMAGE SOURCES & CREDITS:
 * 1. Executive Talent Acquisition:
 *    Source: Unsplash (Royalty-free, Commercial use)
 *    URL: https://images.unsplash.com/photo-1521791136064-7986c2920216
 *    Photographer: Cytonn Photography (@cytonn_photography)
 *    Description: Authentic senior-level business agreement handshake over meeting desk in corporate office.
 *
 * 2. Payroll Solutions and Statutory Governance:
 *    Source: Unsplash (Royalty-free, Commercial use)
 *    URL: https://images.unsplash.com/photo-1454165804606-c3d57bc86b40
 *    Photographer: Scott Graham (@homajob)
 *    Description: Focused close-up of hands reviewing payroll spreadsheets, financial documentation, calculator, pen on clean office desk.
 *
 * 3. Strategic Workforce Advisory:
 *    Source: Unsplash (Royalty-free, Commercial use)
 *    URL: https://images.unsplash.com/photo-1542744173-8e7e53415bb0
 *    Photographer: Campaign Creators (@campaign_creators)
 *    Description: Corporate strategy session in modern boardroom with executives analyzing charts, performance data, and organizational roadmap.
 */

const IMAGES = [
  {
    name: 'executive-talent.webp',
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=85',
    credit: 'Cytonn Photography / Unsplash',
    sourceUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
  },
  {
    name: 'payroll-governance.webp',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85',
    credit: 'Scott Graham / Unsplash',
    sourceUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
  },
  {
    name: 'workforce-advisory.webp',
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=85',
    credit: 'Campaign Creators / Unsplash',
    sourceUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
  },
];

async function run() {
  const targetDir = path.resolve('public/images/services');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Subtle cool navy overlay color: rgba(7, 20, 38, 0.08)
  const overlaySvg = Buffer.from(
    `<svg width="1200" height="750" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="750" fill="#071426" fill-opacity="0.08" />
    </svg>`
  );

  for (const img of IMAGES) {
    console.log(`Downloading ${img.name}...`);
    const res = await fetch(img.url);
    if (!res.ok) {
      throw new Error(`Failed to download ${img.url}: ${res.statusText}`);
    }
    const inputBuf = Buffer.from(await res.arrayBuffer());

    let quality = 82;
    let webpBuf = await sharp(inputBuf)
      .resize(1200, 750, { fit: 'cover', position: 'center' })
      .composite([{ input: overlaySvg, blend: 'over' }])
      .webp({ quality, effort: 6 })
      .toBuffer();

    // Ensure under 150 KB
    while (webpBuf.length > 150 * 1024 && quality > 50) {
      quality -= 5;
      webpBuf = await sharp(inputBuf)
        .resize(1200, 750, { fit: 'cover', position: 'center' })
        .composite([{ input: overlaySvg, blend: 'over' }])
        .webp({ quality, effort: 6 })
        .toBuffer();
    }

    const destPath = path.join(targetDir, img.name);
    fs.writeFileSync(destPath, webpBuf);
    console.log(`Saved ${img.name} -> ${(webpBuf.length / 1024).toFixed(1)} KB (Quality: ${quality})`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
