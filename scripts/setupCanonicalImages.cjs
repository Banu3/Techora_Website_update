const fs = require('fs');
const path = require('path');

const publicImages = path.join(__dirname, '../public/images');

const mapping = {
  'home-hero-1.webp': 'home/hero-collaboration.webp',
  'home-hero-2.webp': 'home/hero-leadership-interaction.webp',
  'home-hero-3.webp': 'home/hero-exec-boardroom.webp',
  'home-hero-4.webp': 'home/hero-talent-search.webp',
  'handshake-topdown.webp': 'clients/client-network-hero.webp',
  'about-team.webp': 'profile/about-who-we-are.webp',
  'recruitment-interview.webp': 'services/recruitment-interview-band.webp',
  'payroll-hr.webp': 'services/payroll-hero.webp',
  'industries-office.webp': 'industries/industries-hero.webp',
  'careers-collab.webp': 'home/hero-recruitment-team.webp',
  'legacy-boardroom.webp': 'profile/legacy-hero.webp',
};

console.log('Mapping images to canonical photography system names...');

for (const [targetName, sourceRel] of Object.entries(mapping)) {
  const sourcePath = path.join(publicImages, sourceRel);
  const targetPath = path.join(publicImages, targetName);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✓ Copied ${sourceRel} -> ${targetName}`);
  } else {
    console.warn(`! Source file missing: ${sourcePath}`);
  }
}

console.log('Photography canonical setup complete.');
