const fs = require('fs');
const path = require('path');

const VALID_STATIC_ROUTES = new Set([
  '/',
  '/profile/about-us',
  '/profile/our-legacy',
  '/profile/leadership',
  '/about-us',
  '/profile',
  '/profile/about',
  '/profile/legacy',
  '/services',
  '/services/recruitment',
  '/services/payroll',
  '/clients',
  '/expertise',
  '/expertise/industries',
  '/expertise/industries/bfsi',
  '/expertise/industries/technology',
  '/expertise/industries/healthcare-pharma',
  '/expertise/industries/manufacturing-engineering',
  '/expertise/industries/retail-ecommerce',
  '/expertise/industries/infrastructure-energy',
  '/careers',
  '/partner-with-us',
  '/privacy',
]);

const srcDir = path.join(__dirname, '../src');

function getAllJsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsxFiles(fullPath));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllJsxFiles(srcDir);
const deadLinks = [];
const hashtagLinks = [];
const verifiedLinks = [];

const toRegex = /to=["']([^"']+)["']/g;
const hrefRegex = /href=["']([^"']+)["']/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(srcDir, file);

  let match;
  while ((match = toRegex.exec(content)) !== null) {
    const target = match[1].split('?')[0]; // Strip query params
    if (target === '#' || target === '') {
      hashtagLinks.push({ file: relPath, target: match[1] });
    } else if (target.startsWith('/') && !VALID_STATIC_ROUTES.has(target) && !target.startsWith('/careers/')) {
      deadLinks.push({ file: relPath, target: match[1] });
    } else {
      verifiedLinks.push({ file: relPath, target: match[1] });
    }
  }

  while ((match = hrefRegex.exec(content)) !== null) {
    const target = match[1];
    if (target === '#') {
      hashtagLinks.push({ file: relPath, target });
    } else if (target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('http')) {
      verifiedLinks.push({ file: relPath, target });
    } else if (target.startsWith('/') && !VALID_STATIC_ROUTES.has(target.split('?')[0])) {
      deadLinks.push({ file: relPath, target });
    } else {
      verifiedLinks.push({ file: relPath, target });
    }
  }
}

console.log('=== LINK CRAWL AUDIT REPORT ===');
console.log(`Total verified links found: ${verifiedLinks.length}`);
console.log(`Dead or missing routes found: ${deadLinks.length}`);
if (deadLinks.length > 0) {
  console.log('Dead links:', deadLinks);
}
console.log(`Hashtag ('#') links found: ${hashtagLinks.length}`);
if (hashtagLinks.length > 0) {
  console.log('Hashtag links:', hashtagLinks);
}
