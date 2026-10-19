const fs = require('fs');
const path = require('path');

const fixturesDir = path.join(__dirname, '../tests/fixtures');
if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
}

// 1. Text PDF (Minimal standard valid PDF with extractable text)
// Text: "Richard Vance\nEmail: r.vance@techora.consulting\nPhone: +91 98200 12345\nExperience: 14 Years in Executive Search, BFSI Advisory, Labour Law"
const minimalPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 212 >>
stream
BT
/F1 12 Tf
72 712 Td
(Richard Vance) Tj
0 -20 Td
(Email: r.vance@techora.consulting) Tj
0 -20 Td
(Phone: +91 98200 12345) Tj
0 -20 Td
(Experience: 14 Years in Executive Search, BFSI Advisory, Labour Law) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000227 00000 n 
0000000490 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
560
%%EOF`;

fs.writeFileSync(path.join(fixturesDir, 'valid_text.pdf'), minimalPdf);

// 2. Scanned Image PDF (Valid PDF header, but zero text stream, only image dummy)
const scannedPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >> endobj
xref
0 4
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
trailer << /Size 4 /Root 1 0 R >>
startxref
190
%%EOF`;
fs.writeFileSync(path.join(fixturesDir, 'scanned_image.pdf'), scannedPdf);

// 3. Corrupt File (Garbage bytes that fail PDF parsing)
const corruptBytes = Buffer.from('%PDF-1.4\nBROKEN_GARBAGE_PAYLOAD_UNREADABLE_HEX_CORRUPTED');
fs.writeFileSync(path.join(fixturesDir, 'corrupt_file.pdf'), corruptBytes);

// 4. Renamed Wrong Type (Plain text file with .pdf extension, magic bytes will fail)
const renamedText = 'This is plain text with no PDF magic bytes header.';
fs.writeFileSync(path.join(fixturesDir, 'renamed_wrong_type.pdf'), renamedText);

// 5. Oversized File (> 5 MB)
const oversized = Buffer.alloc(5.5 * 1024 * 1024, 'A');
// Prepend valid PDF header so it is rejected for size, not magic bytes
Buffer.from('%PDF-1.4\n').copy(oversized, 0);
fs.writeFileSync(path.join(fixturesDir, 'oversized_file.pdf'), oversized);

// 6. Encrypted/Protected PDF simulation
const encryptedPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >> endobj
4 0 obj << /Filter /Standard /V 2 /R 3 /O (encrypted_password_hash) /U (user_key) /P -4 >> endobj
trailer << /Size 5 /Root 1 0 R /Encrypt 4 0 R >>
startxref
250
%%EOF`;
fs.writeFileSync(path.join(fixturesDir, 'encrypted.pdf'), encryptedPdf);

console.log('All test fixtures generated successfully in tests/fixtures/');
