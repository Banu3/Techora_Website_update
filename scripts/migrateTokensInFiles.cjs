const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/App.jsx',
  'src/pages/Careers.jsx',
  'src/pages/PartnerWithUs.jsx',
  'src/pages/Privacy.jsx'
];

targetFiles.forEach((rel) => {
  const filePath = path.join(__dirname, '..', rel);
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  code = code.replace(/var\(--paper\)/g, 'var(--white)');
  code = code.replace(/var\(--surface\)/g, 'var(--white)');
  code = code.replace(/var\(--blueprint\)/g, 'var(--mist)');
  code = code.replace(/var\(--ink-900\)/g, 'var(--navy-900)');
  code = code.replace(/var\(--midnight\)/g, 'var(--navy-950)');

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Migrated tokens in:', rel);
});
