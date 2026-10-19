const fs = require('fs');
const path = require('path');

const careersDir = path.join(__dirname, '../public/images/careers');
const partnerDir = path.join(__dirname, '../public/images/partner');

if (!fs.existsSync(careersDir)) fs.mkdirSync(careersDir, { recursive: true });
if (!fs.existsSync(partnerDir)) fs.mkdirSync(partnerDir, { recursive: true });

fs.copyFileSync(
  path.join(__dirname, '../public/images/home/hero-talent-search.webp'),
  path.join(careersDir, 'careers-hero.webp')
);

fs.copyFileSync(
  path.join(__dirname, '../public/images/home/hero-strategy-conference.webp'),
  path.join(partnerDir, 'partner-hero.webp')
);

console.log('Local images copied successfully.');
