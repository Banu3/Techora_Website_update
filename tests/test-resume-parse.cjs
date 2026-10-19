const fs = require('fs');
const path = require('path');

async function testResumeParse() {
  console.log('Testing Resume Parse Endpoint...');

  const fixturePath = path.join(__dirname, 'fixtures/valid_text.pdf');
  const buffer = fs.readFileSync(fixturePath);

  const formData = new FormData();
  formData.append('resume', new Blob([buffer], { type: 'application/pdf' }), 'valid_text.pdf');

  const res = await fetch('http://localhost:5000/api/resume/parse', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  console.log('Resume Parse Status:', res.status);
  console.log('Resume Parse Success:', data.success);
  console.log('Detected Fields:', Object.keys(data.detected || {}));
  console.log('Detected Email:', data.detected?.email);
  console.log('Detected Phone:', data.detected?.mobile);
  console.log('Field Status Map:', data.fieldStatus);

  if (!data.success) {
    throw new Error('Resume parse did not return success: ' + JSON.stringify(data));
  }
  console.log('RESUME PARSER ENDPOINT VERIFIED SUCCESSFULLY!');
}

testResumeParse().catch(err => {
  console.error('Error testing resume parse:', err);
  process.exit(1);
});
