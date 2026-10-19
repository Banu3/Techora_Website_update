const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\kisho\\.gemini\\antigravity-ide\\brain\\df2c9c49-309b-4021-8005-526007f0289e';
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');

const imageMappings = [
  {
    src: path.join(brainDir, 'corporate_handshake_meeting_1792164461241.jpg'),
    destinations: ['home-hero-2.webp', 'home-hero-2.jpg']
  },
  {
    src: path.join(brainDir, 'business_handshake_meeting_1792164553005.jpg'),
    destinations: ['intro-handshake.webp', 'intro-handshake.jpg']
  },
  {
    src: path.join(brainDir, 'topdown_business_handshake_1792164580404.jpg'),
    destinations: ['handshake-topdown.webp', 'handshake-topdown.jpg', 'handshake-executive.webp']
  },
  {
    src: path.join(brainDir, 'corporate_recruiter_interview_1792164525266.jpg'),
    destinations: ['home-hero-4.webp', 'home-hero-4.jpg', 'recruitment-interview.webp', 'recruitment-interview.jpg']
  },
  {
    src: path.join(brainDir, 'payroll_finance_professional_1792164623712.jpg'),
    destinations: ['payroll-hr.webp', 'payroll-hr.jpg']
  }
];

imageMappings.forEach(mapping => {
  if (fs.existsSync(mapping.src)) {
    const data = fs.readFileSync(mapping.src);
    mapping.destinations.forEach(destName => {
      const destPath = path.join(publicImagesDir, destName);
      fs.writeFileSync(destPath, data);
      console.log(`Copied ${path.basename(mapping.src)} -> ${destName} (${data.length} bytes)`);
    });
  } else {
    console.error(`Source not found: ${mapping.src}`);
  }
});
