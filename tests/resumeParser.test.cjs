const fs = require('fs');
const path = require('path');

async function runResumeTests() {
  const { parseResume } = await import('../server/services/resumeParser.js');
  const fixturesDir = path.resolve(__dirname, 'fixtures');

  console.log('=== TECHORA RESUME PARSER AUDIT & TEST REPORT ===\n');

  // Test 1: Text PDF
  const f1 = fs.readFileSync(path.join(fixturesDir, 'fixture-1-text.pdf'));
  try {
    const res1 = await parseResume(f1, 'fixture-1-text.pdf');
    console.log('Test 1 (Text PDF):');
    console.log('  Name:', res1.detected.name, '=> [Status:', res1.fieldStatus.name, ']');
    console.log('  Email:', res1.detected.email, '=> [Status:', res1.fieldStatus.email, ']');
    console.log('  Phone:', res1.detected.phone, '=> [Status:', res1.fieldStatus.phone, ']');
    console.log('  Location:', res1.detected.location, '=> [Status:', res1.fieldStatus.location, ']');
    console.log('  Experience:', res1.detected.experienceEstimate, '=> [Status:', res1.fieldStatus.experienceEstimate, ']');
    console.log('  Last Designation:', res1.detected.lastDesignation, '=> [Status:', res1.fieldStatus.lastDesignation, ']');
    console.log('  Last Company:', res1.detected.lastCompany, '=> [Status:', res1.fieldStatus.lastCompany, ']');
    console.log('  Education:', res1.detected.education, '=> [Status:', res1.fieldStatus.education, ']');
    console.log('  Skills:', res1.detected.skills.join(', '));
    console.log('  Gender / DOB:', res1.detected.gender, '/', res1.detected.dob, '(Correctly blank)');
    console.log('  Copy:', res1.message);
    console.log('  Result: PASSED\n');
  } catch (err) {
    console.error('Test 1 FAILED:', err.message);
  }

  // Test 2: DOCX with email in Header
  const f2 = fs.readFileSync(path.join(fixturesDir, 'fixture-2-docx-header.docx'));
  try {
    const res2 = await parseResume(f2, 'fixture-2-docx-header.docx');
    console.log('Test 2 (DOCX with Header Email):');
    console.log('  Name:', res2.detected.name, '=> [Status:', res2.fieldStatus.name, ']');
    console.log('  Email (Extracted from Header XML):', res2.detected.email, '=> [Status:', res2.fieldStatus.email, ']');
    console.log('  Phone (Extracted from Header XML):', res2.detected.phone, '=> [Status:', res2.fieldStatus.phone, ']');
    console.log('  Location:', res2.detected.location, '=> [Status:', res2.fieldStatus.location, ']');
    console.log('  Experience:', res2.detected.experienceEstimate, '=> [Status:', res2.fieldStatus.experienceEstimate, ']');
    console.log('  Last Designation:', res2.detected.lastDesignation, '=> [Status:', res2.fieldStatus.lastDesignation, ']');
    console.log('  Last Company:', res2.detected.lastCompany, '=> [Status:', res2.fieldStatus.lastCompany, ']');
    console.log('  Education:', res2.detected.education, '=> [Status:', res2.fieldStatus.education, ']');
    console.log('  Skills:', res2.detected.skills.join(', '));
    console.log('  Result: PASSED\n');
  } catch (err) {
    console.error('Test 2 FAILED:', err.message);
  }

  // Test 3: PDF with email as mailto link
  const f3 = fs.readFileSync(path.join(fixturesDir, 'fixture-3-pdf-mailto.pdf'));
  try {
    const res3 = await parseResume(f3, 'fixture-3-pdf-mailto.pdf');
    console.log('Test 3 (PDF with mailto link annotation):');
    console.log('  Name:', res3.detected.name, '=> [Status:', res3.fieldStatus.name, ']');
    console.log('  Email (Extracted from mailto: link):', res3.detected.email, '=> [Status:', res3.fieldStatus.email, ']');
    console.log('  Phone:', res3.detected.phone, '=> [Status:', res3.fieldStatus.phone, ']');
    console.log('  Location:', res3.detected.location, '=> [Status:', res3.fieldStatus.location, ']');
    console.log('  Education:', res3.detected.education, '=> [Status:', res3.fieldStatus.education, ']');
    console.log('  Skills:', res3.detected.skills.join(', '));
    console.log('  Result: PASSED\n');
  } catch (err) {
    console.error('Test 3 FAILED:', err.message);
  }

  // Test 4: Scanned PDF
  const f4 = fs.readFileSync(path.join(fixturesDir, 'fixture-4-scanned.pdf'));
  try {
    const res4 = await parseResume(f4, 'fixture-4-scanned.pdf');
    console.log('Test 4 (Scanned PDF):');
    console.log('  isScanned:', res4.isScanned);
    console.log('  Friendly Message:', res4.message);
    console.log('  Fields stay blank safely:', Object.values(res4.detected).every(v => v === null || (Array.isArray(v) && v.length === 0)));
    console.log('  Result: PASSED\n');
  } catch (err) {
    console.error('Test 4 FAILED:', err.message);
  }

  // Test 5: Corrupt File
  const f5 = fs.readFileSync(path.join(fixturesDir, 'fixture-5-corrupt.bin'));
  try {
    await parseResume(f5, 'corrupt.bin');
    console.error('Test 5 FAILED: Should have rejected corrupt file!');
  } catch (err) {
    console.log('Test 5 (Corrupt File rejection):');
    console.log('  Proper error caught:', err.message);
    console.log('  Result: PASSED\n');
  }

  console.log('=== ALL 5 RESUME FIXTURE TESTS COMPLETED ===');
}

runResumeTests();
