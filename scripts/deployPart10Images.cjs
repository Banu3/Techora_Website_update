const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\kisho\\.gemini\\antigravity-ide\\brain\\df2c9c49-309b-4021-8005-526007f0289e';
const targetDir = path.join(__dirname, '../public/images');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const fileMap = {
  'hero-1-handshake.webp': 'hero_1_handshake_1792173714456.jpg',
  'hero-2-conversation.webp': 'hero_2_conversation_1792173735521.jpg',
  'hero-3-team-discussion.webp': 'hero_3_team_discussion_1792173758028.jpg',
  'hero-4-recruiter-candidate.webp': 'hero_4_recruiter_candidate_1792173782538.jpg',
  'about-leadership-meeting.webp': 'about_leadership_meeting_1792173827105.jpg',
  'careers-young-team.webp': 'careers_young_team_1792173805100.jpg',
  'clients-meeting-room.webp': 'clients_meeting_room_1792173847326.jpg',
  'payroll-hr-desk.webp': 'payroll_finance_professional_1792164623712.jpg',
  'recruitment-interview-closeup.webp': 'recruiter_candidate_interview_1792164492988.jpg',
  'partner-handshake-topdown.webp': 'topdown_business_handshake_1792164580404.jpg',
};

for (const [dest, src] of Object.entries(fileMap)) {
  const srcPath = path.join(brainDir, src);
  const destPath = path.join(targetDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> ${dest} (${fs.statSync(destPath).size} bytes)`);
  } else {
    console.error(`Missing source: ${srcPath}`);
  }
}

// Also ensure legacy-boardroom and industries-open-office
const existingBoardroom = path.join(targetDir, 'legacy-boardroom.webp');
if (!fs.existsSync(existingBoardroom)) {
  const fallbackSrc = path.join(brainDir, 'about_leadership_meeting_1792173827105.jpg');
  fs.copyFileSync(fallbackSrc, existingBoardroom);
  console.log(`Created legacy-boardroom.webp`);
}

const existingIndustries = path.join(targetDir, 'industries-open-office.webp');
if (!fs.existsSync(existingIndustries)) {
  // Use existing industries-office.webp or copy from brain
  const prevInd = path.join(targetDir, 'industries-office.webp');
  if (fs.existsSync(prevInd)) {
    fs.copyFileSync(prevInd, existingIndustries);
    console.log(`Copied industries-office.webp -> industries-open-office.webp`);
  }
}

// Backward compatibility links for home hero
fs.copyFileSync(path.join(targetDir, 'hero-1-handshake.webp'), path.join(targetDir, 'home-hero-1.webp'));
fs.copyFileSync(path.join(targetDir, 'hero-2-conversation.webp'), path.join(targetDir, 'home-hero-2.webp'));
fs.copyFileSync(path.join(targetDir, 'hero-3-team-discussion.webp'), path.join(targetDir, 'home-hero-3.webp'));
fs.copyFileSync(path.join(targetDir, 'hero-4-recruiter-candidate.webp'), path.join(targetDir, 'home-hero-4.webp'));

console.log('All Part 10 photography deployed successfully.');
