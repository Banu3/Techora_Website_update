import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactDir = 'C:\\Users\\kisho\\.gemini\\antigravity-ide\\brain\\e5456ade-0163-4bc3-9172-11cd463a3253';
const publicImgDir = path.join(__dirname, 'public/images');

if (!fs.existsSync(publicImgDir)) {
  fs.mkdirSync(publicImgDir, { recursive: true });
}

const imageMap = {
  'it_consulting_cover_1790274061958.png': 'it-consulting.png',
  'payroll_services_cover_1790274091786.png': 'payroll-services.png',
  'about_techora_team_1790274125002.png': 'about-team.png',
  'security_datacenter_1790274153276.png': 'security-datacenter.png',
  'hero_enterprise_tech_1790274309634.png': 'hero-tech.png',
  'cloud_devops_infra_1790274331989.png': 'cloud-devops.png',
  'fintech_banking_study_1790274355710.png': 'fintech-banking.png',
  'payroll_analytics_dashboard_1790274382363.png': 'payroll-analytics.png',
  'global_headquarters_office_1790274406618.png': 'headquarters.png',
  'roi_growth_strategy_1790274431352.png': 'roi-strategy.png'
};

for (const [srcName, targetName] of Object.entries(imageMap)) {
  const src = path.join(artifactDir, srcName);
  const target = path.join(publicImgDir, targetName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, target);
    console.log(`[Synced] ${srcName} -> ${targetName}`);
  } else {
    console.log(`[Missing] ${srcName}`);
  }
}
