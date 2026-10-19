const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
  const b = fs.readFileSync('tests/fixtures/valid_text.pdf');
  const uint8 = new Uint8Array(b);
  const p = new PDFParse(uint8);
  await p.load();
  const text = await p.getText();
  console.log('SUCCESS! Parsed text:');
  console.log(text);
}

test().catch(console.error);
