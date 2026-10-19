const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function createFixtures() {
  const fixturesDir = path.resolve(__dirname, '../tests/fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  // 1. Text PDF fixture
  const textPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 380 >>
stream
BT
/F1 12 Tf
72 720 Td
(Vikram Malhotra) Tj
0 -20 Td
(Email: vikram.malhotra@consultingpartners.in) Tj
0 -20 Td
(Mobile: 98201 12345) Tj
0 -20 Td
(City: Mumbai) Tj
0 -20 Td
(Experience: Senior Consultant at Tata Consultancy Services Ltd.) Tj
0 -20 Td
(Jan 2018 - Mar 2021 Consultant at Wipro Technologies) Tj
0 -20 Td
(Apr 2021 - Present Principal Consultant) Tj
0 -20 Td
(Education: Master of Business Administration MBA) Tj
0 -20 Td
(Skills: Statutory Compliance, Payroll Administration, Labour Law, HRIS) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000233 00000 n 
0000000680 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
750
%%EOF`;

  fs.writeFileSync(path.join(fixturesDir, 'fixture-1-text.pdf'), textPdfContent);

  // 2. DOCX with email in header fixture
  const zip = new JSZip();
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
</Types>`);

  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdHeader" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
</Relationships>`);

  // Email placed inside Header XML!
  zip.file('word/header1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:r><w:t>Confidential Candidate Dossier | contact : ananya . deshmukh @ techadvisory . in | +91 97654 32109</w:t></w:r></w:p>
</w:hdr>`);

  zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Ananya Deshmukh</w:t></w:r></w:p>
    <w:p><w:r><w:t>Location: Pune</w:t></w:r></w:p>
    <w:p><w:r><w:t>Designation: Senior Lead at Infosys Technologies</w:t></w:r></w:p>
    <w:p><w:r><w:t>Work History: June 2017 to December 2020 Consultant at Cognizant Technology Solutions</w:t></w:r></w:p>
    <w:p><w:r><w:t>January 2021 to Present Senior Lead</w:t></w:r></w:p>
    <w:p><w:r><w:t>Education: Bachelor's Degree B.Tech in Computer Science</w:t></w:r></w:p>
    <w:p><w:r><w:t>Core Competencies: React, Node.js, TypeScript, Docker, Kubernetes, AWS</w:t></w:r></w:p>
  </w:body>
</w:document>`);

  const docxBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(path.join(fixturesDir, 'fixture-2-docx-header.docx'), docxBuffer);

  // 3. PDF with email in Mailto link annotation
  const mailtoPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Annots [6 0 R] /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 300 >>
stream
BT
/F1 12 Tf
72 720 Td
(Rohan Sengupta) Tj
0 -20 Td
(Click here to send email) Tj
0 -20 Td
(Phone: +91 91234 56789) Tj
0 -20 Td
(Location: Hyderabad) Tj
0 -20 Td
(Jan 2019 - Present Vice President at ICICI Securities Ltd.) Tj
0 -20 Td
(Education: Master of Business Administration MBA) Tj
0 -20 Td
(Skills: Financial Modeling, Risk Management, Corporate Advisory) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Type /Annot /Subtype /Link /Rect [72 690 200 710] /A << /S /URI /URI (mailto:rohan.sengupta@institutionaladvisory.in) >> >>
endobj
xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000247 00000 n 
0000000615 00000 n 
0000000685 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
820
%%EOF`;

  fs.writeFileSync(path.join(fixturesDir, 'fixture-3-pdf-mailto.pdf'), mailtoPdfContent);

  // 4. Scanned PDF (minimal / no extractable text)
  const scannedPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 12 >>
stream
q
Q
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000215 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
280
%%EOF`;

  fs.writeFileSync(path.join(fixturesDir, 'fixture-4-scanned.pdf'), scannedPdfContent);

  // 5. Corrupt file
  const corruptContent = Buffer.from('NOT_A_REAL_PDF_OR_DOCX_HEADER_TRUNCATED_BYTES');
  fs.writeFileSync(path.join(fixturesDir, 'fixture-5-corrupt.bin'), corruptContent);

  console.log('Created 5 test fixtures in tests/fixtures/');
}

createFixtures();
