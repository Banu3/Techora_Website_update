import fs from 'fs';
import path from 'path';

// Current conversation ID for the newly generated image
const srcDir = 'C:\\Users\\kisho\\.gemini\\antigravity-ide\\brain\\b63f025c-8bbd-4e7f-a40a-8b3507caf863';
const destDir = 'd:\\Feelance Project\\Tekora\\public\\images';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Previous conversation ID (if old files still need copying)
const oldSrcDir = 'C:\\Users\\kisho\\.gemini\\antigravity-ide\\brain\\e5456ade-0163-4bc3-9172-11cd463a3253';

const mappings = {
  // newly generated image (corporate building)
  'corporate_building_bg_1791650272886.jpg': { name: 'hero-bg.jpg', dir: srcDir },
  // old images
  'it_consulting_cover_1790274061958.png': { name: 'it-consulting.png', dir: oldSrcDir },
  'payroll_services_cover_1790274091786.png': { name: 'payroll-services.png', dir: oldSrcDir },
  'about_techora_team_1790274125002.png': { name: 'about-team.png', dir: oldSrcDir },
  'security_datacenter_1790274153276.png': { name: 'security-datacenter.png', dir: oldSrcDir }
};

for (const [srcFile, info] of Object.entries(mappings)) {
  const srcPath = path.join(info.dir, srcFile);
  const destPath = path.join(destDir, info.name);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`[Copied] ${srcFile} -> ${info.name}`);
  } else {
    console.error(`[Missing] ${srcPath}`);
  }
}

