const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const targets = [
  'src/content/aboutContent.js',
  'src/content/legacyContent.js',
  'src/content/leadershipContent.js',
  'src/content/recruitmentContent.js',
  'src/content/payrollContent.js',
  'src/content/industriesContent.js',
  'src/content/careersContent.js',
  'src/content/partnerContent.js',
  'src/config/contactConfig.js',
  'src/pages/Home.jsx',
  'src/pages/AboutUs.jsx',
  'src/pages/OurLegacy.jsx',
  'src/pages/Leadership.jsx',
  'src/pages/Recruitment.jsx',
  'src/pages/Payroll.jsx',
  'src/pages/Industries.jsx',
  'src/pages/IndustryDetail.jsx',
  'src/pages/Careers.jsx',
  'src/pages/PartnerWithUs.jsx',
  'src/pages/Clients.jsx',
  'src/pages/Privacy.jsx'
];

const claimPatterns = [
  { re: /\b(zero[- ]defect|error[- ]free)\b/i, category: 'Zero-Defect / Quality Guarantee' },
  { re: /\b(retention|retained|onboarding retention|candidate retention)\b/i, category: 'Retention Commitment / Model' },
  { re: /\b(C[- ]suite|board transition|executive search|managing director|vice president)\b/i, category: 'C-Suite & Board Placement Specialty' },
  { re: /\b(regulated|statutory compliance|labor code|tax withholding|EPF|ESI|TDS|provident fund)\b/i, category: 'Regulated Sector / Statutory Compliance' },
  { re: /\b(\d+[- ]day|\d+ hours?|turnaround|timeline|response time)\b/i, category: 'Performance Timeline / SLA Guarantee' },
  { re: /\b(100%|guarantee|warranty|indemnity|commitment)\b/i, category: 'Factual Commitment' },
  { re: /\b(fiduciary non-disclosure|mutual non-disclosure|strict confidentiality)\b/i, category: 'Confidentiality & Governance Standard' }
];

const results = [];

targets.forEach((rel) => {
  const fullPath = path.join(rootDir, rel);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // skip comments that are pure dev notes or imports
    const trimmed = line.trim();
    if (trimmed.startsWith('import ') || trimmed.startsWith('//') && !trimmed.includes('claim')) {
      // allow checking
    }

    claimPatterns.forEach((cp) => {
      if (cp.re.test(trimmed)) {
        // extract sentence-like string
        const clean = trimmed.replace(/^["'`\s*,-]+|["'`\s*,;]+$/g, '');
        if (clean.length > 20 && !results.some(r => r.file === rel && r.line === idx + 1 && r.category === cp.category)) {
          results.push({
            file: rel,
            line: idx + 1,
            category: cp.category,
            quote: clean
          });
        }
      }
    });
  });
});

let md = '# TECHORA Consultant — Unverified Claims Registry (UNVERIFIED_CLAIMS.md)\n\n';
md += '> **Purpose:** Per Part 9 instructions, this document registers every factual, performance, quality, capability, and commitment claim across website content and code. **None of these sentences were edited in code.** Review each entry below and confirm, revise, or flag for removal.\n\n';
md += `**Total Claims Flagged:** ${results.length}\n\n`;
md += '| # | Source File & Line | Claim Category | Exact Sentence / Statement | Verification Prompt for Stakeholder |\n';
md += '|---|---|---|---|---|\n';

results.forEach((item, i) => {
  const fileLink = `[${path.basename(item.file)}:${item.line}](${item.file}#L${item.line})`;
  // sanitize quote for markdown table
  const safeQuote = item.quote.replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
  let prompt = '';
  if (item.category.includes('Zero-Defect')) prompt = 'Confirm whether zero-defect SLA or indemnity is legally agreed.';
  else if (item.category.includes('Retention')) prompt = 'Confirm if replacement guarantee period (e.g. 90/180 days) is offered.';
  else if (item.category.includes('C-Suite')) prompt = 'Confirm historical track record of CXO/board placements.';
  else if (item.category.includes('Performance Timeline')) prompt = 'Confirm turnaround SLA (e.g. 24h response or 30-day mandate).';
  else if (item.category.includes('Regulated')) prompt = 'Confirm jurisdiction certifications and compliance audit scope.';
  else prompt = 'Confirm accuracy of organizational claim.';

  md += `| ${i + 1} | ${fileLink} | ${item.category} | "${safeQuote}" | ${prompt} |\n`;
});

md += '\n## Category Summary\n\n';
const cats = {};
results.forEach(r => cats[r.category] = (cats[r.category] || 0) + 1);
for (const [cat, count] of Object.entries(cats)) {
  md += `- **${cat}:** ${count} statements\n`;
}

fs.writeFileSync(path.join(rootDir, 'UNVERIFIED_CLAIMS.md'), md, 'utf8');
console.log(`Generated UNVERIFIED_CLAIMS.md with ${results.length} claims.`);
