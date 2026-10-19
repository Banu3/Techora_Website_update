const { parseResume } = require('../server/services/resumeParser.js');

async function testResumeParsing() {
  console.log('Testing Resume Parser with diverse inputs...\n');

  // Test 1: Standard resume text format (simulating extracted text or test)
  // Let's verify magic byte handling & error on invalid file:
  try {
    await parseResume(Buffer.from('not a pdf'), 'test.pdf');
    console.error('[FAIL] Invalid magic bytes should throw');
  } catch (err) {
    console.log('[PASS] Rejects non-PDF/DOCX magic bytes safely');
  }
}

testResumeParsing();
