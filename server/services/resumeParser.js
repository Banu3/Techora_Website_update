import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
let PDFParse = null;
let mammoth = null;
let tesseract = null;

try {
  const pp = require('pdf-parse');
  PDFParse = pp.PDFParse || pp.default?.PDFParse || pp;
} catch (e) {
  console.warn('[PARSER] pdf-parse load warning:', e.message);
}

try {
  mammoth = require('mammoth');
} catch (e) {
  console.warn('[PARSER] mammoth load warning:', e.message);
}

try {
  tesseract = require('tesseract.js');
} catch (e) {
  // Graceful fallback if tesseract.js is unavailable
}

// Configurable corporate skills dictionary
const SKILLS_DICTIONARY = [
  'M&A Human Capital', 'Organizational Restructuring', 'Board Advisory', 'Leadership Transitions',
  'Tech Talent Search', 'GCC Advisory', 'Cloud Architecture Mandates', 'Headhunting', 'Executive Search',
  'Statutory Compliance', 'Labor Codes', 'Payroll Audit', 'Enterprise HRMS', 'Tax Governance',
  'BFSI Advisory', 'C-Suite Assessment', 'Partner Engagement', 'Compensation Benchmarking',
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'Python', 'Java',
  'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
  'Talent Acquisition', 'HRIS', 'Strategic Sourcing', 'Change Management', 'PF & ESI Compliance'
];

export const STANDARD_FUNCTIONS = [
  'Executive Leadership & Board Advisory',
  'Human Resources & Talent Acquisition',
  'Payroll & Statutory Compliance',
  'Technology & Cloud Architecture',
  'BFSI & Wealth Management',
  'Corporate Strategy & M&A',
  'Legal, Risk & Governance',
  'Operations & Supply Chain',
  'Sales & Business Development',
  'Finance & Accounting'
];

export const STANDARD_INDUSTRIES = [
  'Banking, Financial Services & Insurance (BFSI)',
  'Technology & SaaS',
  'Manufacturing & Industrial',
  'Healthcare & Life Sciences',
  'Professional Services & Consulting',
  'Retail & E-Commerce',
  'Energy, Infrastructure & Real Estate',
  'Telecommunications & Media'
];

const INDIAN_CITIES = [
  'Mumbai', 'Bengaluru', 'New Delhi', 'Hyderabad', 'Chennai', 'Pune',
  'Gurugram', 'Noida', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh',
  'Kochi', 'Coimbatore', 'Indore', 'Bhubaneswar'
];

/**
 * Validate magic bytes or file signatures
 */
export function validateMagicBytes(buffer, originalFilename = '') {
  if (!buffer || buffer.length < 4) return { valid: false, error: 'File is empty or truncated.' };

  const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  const isDocx = buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isJpg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

  if (isPdf) return { valid: true, type: 'pdf' };
  if (isDocx) return { valid: true, type: 'docx' };
  if (isPng || isJpg) return { valid: true, type: 'image' };

  return { valid: false, error: 'File contents do not match a valid PDF or DOCX format.' };
}

/**
 * Extract raw text from Buffer based on file format
 */
export async function extractRawText(buffer, filename) {
  const ext = path.extname(filename).toLowerCase();

  // 1. PDF
  if (ext === '.pdf') {
    const pdfParser = new PDFParse({ data: buffer });
    const parsed = await pdfParser.getText();
    if (parsed && parsed.text && parsed.text.trim().length > 5) {
      return parsed.text;
    }
    throw new Error('PDF contains no readable text or is corrupted.');
  }

  // 2. DOCX
  if (ext === '.docx' || ext === '.doc') {
    const mammothResult = await mammoth.extractRawText({ buffer });
    if (mammothResult && mammothResult.value && mammothResult.value.trim().length > 5) {
      return mammothResult.value;
    }
    throw new Error('Word document contains no extractable text.');
  }

  // 3. Image (JPG, JPEG, PNG) via Tesseract OCR
  if (['.jpg', '.jpeg', '.png'].includes(ext) && tesseract) {
    try {
      console.log('[PARSER] Processing image resume with Tesseract OCR...');
      const worker = await tesseract.createWorker('eng');
      const ret = await worker.recognize(buffer);
      await worker.terminate();
      if (ret && ret.data && ret.data.text && ret.data.text.trim().length > 10) {
        return ret.data.text;
      }
    } catch (e) {
      console.warn('[PARSER] Tesseract OCR error:', e.message);
    }
  }

  // Fallback: UTF-8 string attempt for clean text buffers
  try {
    const rawStr = buffer.toString('utf-8');
    // If it has readable ascii words
    if (/[a-zA-Z]{3,}\s+[a-zA-Z]{3,}/.test(rawStr) && rawStr.length < 50000) {
      return rawStr;
    }
  } catch (e) {}

  return '';
}

/**
 * Normalize Indian mobile / phone
 */
export function normalizePhone(rawPhone) {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, '');

  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1))) {
    const core = digits.slice(1);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) {
    const core = digits.slice(2);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }
  if (digits.length >= 10 && digits.length <= 15) {
    return `+91 ${digits.slice(-10, -5)} ${digits.slice(-5)}`;
  }
  return null;
}

/**
 * Intelligent Heuristic Fallback & Schema Extractor
 */
export function extractFieldsWithHeuristics(text) {
  const result = {
    title: '',
    firstName: '',
    lastName: '',
    name: '',
    gender: null,
    dob: null,
    email: '',
    mobile: '',
    phone: '',
    city: '',
    company: '',
    designation: '',
    totalExperienceYears: '',
    currentCtc: '',
    degree: '',
    institute: '',
    skills: [],
    function: '',
    industry: '',
  };

  if (!text) return result;

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Email extraction (Regex)
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.email = emailMatch[0].toLowerCase().trim();
  }

  // 2. Mobile extraction (Regex with Indian phone heuristics)
  const phoneMatch = text.match(/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/) ||
                     text.match(/(?:\+?91[\s-]?)?[6-9]\d{9}/);
  if (phoneMatch) {
    const norm = normalizePhone(phoneMatch[0]);
    if (norm) {
      result.mobile = norm;
      result.phone = norm;
    }
  }

  // 3. Title & Name Detection
  // Check if title is present (Dr., Mr., Ms., Mrs.)
  const titleMatch = text.match(/\b(Mr\.|Ms\.|Mrs\.|Dr\.|Mr|Ms|Mrs|Dr)\b/i);
  if (titleMatch) {
    const rawT = titleMatch[1].replace('.', '').toLowerCase();
    if (rawT === 'dr') result.title = 'Dr';
    else if (rawT === 'ms') result.title = 'Ms';
    else if (rawT === 'mrs') result.title = 'Mrs';
    else if (rawT === 'mr') result.title = 'Mr';
  } else {
    result.title = 'Mr'; // default sensible title
  }

  // Extract name from top 5 lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Skip if line looks like header, phone, or email
    if (line.includes('@') || /(resume|curriculum|vitae|profile|page)/i.test(line) || /\d/.test(line)) {
      continue;
    }
    const cleanLine = line.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, '').trim();
    const words = cleanLine.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && /^[A-Za-z\s.'-]+$/.test(cleanLine)) {
      result.firstName = words[0];
      result.lastName = words.slice(1).join(' ');
      result.name = `${result.firstName} ${result.lastName}`.trim();
      break;
    }
  }

  result.phone = result.mobile;

  // 4. Gender (if explicitly mentioned)
  const genderMatch = text.match(/\b(Gender|Sex)\s*[:=-]?\s*(Male|Female|Other)\b/i);
  if (genderMatch) {
    result.gender = genderMatch[2].charAt(0).toUpperCase() + genderMatch[2].slice(1).toLowerCase();
  }

  // 5. DOB (if mentioned)
  const dobMatch = text.match(/\b(?:DOB|Date of Birth|Birth Date)\s*[:=-]?\s*([0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{2,4}|[0-9]{4}[-/.][0-9]{1,2}[-/.][0-9]{1,2})\b/i);
  if (dobMatch) {
    try {
      const parts = dobMatch[1].split(/[-/.]/);
      if (parts.length === 3) {
        let y, m, d;
        if (parts[0].length === 4) {
          y = parts[0]; m = parts[1].padStart(2, '0'); d = parts[2].padStart(2, '0');
        } else {
          d = parts[0].padStart(2, '0'); m = parts[1].padStart(2, '0'); y = parts[2];
          if (y.length === 2) y = parseInt(y, 10) > 30 ? `19${y}` : `20${y}`;
        }
        result.dob = `${y}-${m}-${d}`;
      }
    } catch (e) {}
  }

  // 6. City Detection
  for (const city of INDIAN_CITIES) {
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(text)) {
      result.city = city;
      break;
    }
  }

  // 7. Total Experience Calculation
  // Look for explicit "X years of experience" or calculate from year ranges
  const expMatch = text.match(/([0-9]{1,2}(?:\.[0-9]{1,2})?)\+?\s*(?:years?|yrs?)(?:\s*of\s*experience)?/i);
  if (expMatch) {
    result.totalExperienceYears = parseFloat(expMatch[1]);
  } else {
    // Calculate from work-history year ranges (e.g., "2015 - 2024", "2016 to Present")
    const yearMatches = [...text.matchAll(/\b(19\d{2}|20\d{2})\s*(?:-|–|to)\s*(19\d{2}|20\d{2}|Present|Current)\b/gi)];
    if (yearMatches.length > 0) {
      let earliestYear = 9999;
      let latestYear = 0;
      const currentYear = new Date().getFullYear();

      for (const m of yearMatches) {
        const start = parseInt(m[1], 10);
        const end = /present|current/i.test(m[2]) ? currentYear : parseInt(m[2], 10);
        if (start < earliestYear) earliestYear = start;
        if (end > latestYear) latestYear = end;
      }
      if (earliestYear < 9999 && latestYear >= earliestYear && earliestYear > 1970) {
        result.totalExperienceYears = latestYear - earliestYear;
      }
    }
  }

  // 8. Designation & Company Detection
  const designationPatterns = [
    /current(?:ly)?\s*(?:working\s*as|designation|role)?\s*[:=-]?\s*([A-Za-z\s&-]{3,35})/i,
    /(Partner|Director|Practice Lead|Principal Consultant|Senior Consultant|Vice President|Head of [A-Za-z\s]+|General Manager|Manager - [A-Za-z\s]+|Consultant|Architect)/i
  ];
  for (const dp of designationPatterns) {
    const match = text.match(dp);
    if (match) {
      result.designation = match[1].trim();
      break;
    }
  }

  const companyPatterns = [
    /(?:Current Company|Organization|Employer|At)\s*[:=-]?\s*([A-Za-z0-9\s&.,-]{3,40})/i,
    /\b(McKinsey|Deloitte|PwC|EY|KPMG|Bain|Accenture|TCS|Infosys|Wipro|Google|Microsoft|Amazon|Korn Ferry|Spencer Stuart|Heidrick|Boyden|Michael Page|ADP|Randstad)\b/i
  ];
  for (const cp of companyPatterns) {
    const match = text.match(cp);
    if (match) {
      result.company = match[1].trim();
      break;
    }
  }

  // 9. Current CTC detection
  const ctcMatch = text.match(/(?:CTC|Salary|Compensation|Package)\s*[:=-]?\s*(?:INR|Rs\.?|₹)?\s*([0-9,.]+)\s*(Lakhs?|Lacs?|Cr)?/i);
  if (ctcMatch) {
    let num = ctcMatch[1].replace(/,/g, '');
    let unit = (ctcMatch[2] || '').toLowerCase();
    if (unit.startsWith('lac') || unit.startsWith('lakh')) {
      const lacs = parseFloat(num);
      result.currentCtc = `${lacs},00,000`;
    } else if (unit.startsWith('cr')) {
      const cr = parseFloat(num);
      result.currentCtc = `${cr * 100},00,000`;
    } else {
      result.currentCtc = ctcMatch[1];
    }
  }

  // 10. Degree & Institute Detection
  const degreeMatch = text.match(/\b(MBA|PGDM|Ph\.D\.|Ph\.D|M\.Tech|B\.Tech|B\.E\.|B\.E|B\.Com|Chartered Accountant|LL\.B\.|LLB|LLM|Master in [A-Za-z\s]+|Bachelor of [A-Za-z\s]+)\b/i);
  if (degreeMatch) {
    result.degree = degreeMatch[0].trim();
  }

  const instituteMatch = text.match(/\b(IIM [A-Za-z]+|IIM|IIT [A-Za-z]+|IIT|XLRI|ISB|BITS Pilani|FMS Delhi|JBIMS|SPJIMR|Symbiosis|Anna University|Bangalore University|NMIMS)\b/i);
  if (instituteMatch) {
    result.institute = instituteMatch[0].trim();
  }

  // 11. Skills extraction
  const detectedSkills = [];
  for (const skill of SKILLS_DICTIONARY) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      detectedSkills.push(skill);
    }
  }
  result.skills = detectedSkills.slice(0, 8);

  // 12. Function & Industry mapping
  if (/payroll|statutory|labor code|pf|esi|compliance/i.test(text)) {
    result.function = 'Payroll & Statutory Compliance';
    result.industry = 'Professional Services & Consulting';
  } else if (/cloud|software|tech|developer|architect|saas|ai/i.test(text)) {
    result.function = 'Technology & Cloud Architecture';
    result.industry = 'Technology & SaaS';
  } else if (/bfsi|banking|wealth|equity|finance|fund|investment/i.test(text)) {
    result.function = 'BFSI & Wealth Management';
    result.industry = 'Banking, Financial Services & Insurance (BFSI)';
  } else if (/m&a|restructuring|reorganization|board|c-suite/i.test(text)) {
    result.function = 'Corporate Strategy & M&A';
    result.industry = 'Professional Services & Consulting';
  } else if (/recruitment|talent acquisition|hiring|headhunting|search/i.test(text)) {
    result.function = 'Human Resources & Talent Acquisition';
    result.industry = 'Professional Services & Consulting';
  } else {
    result.function = STANDARD_FUNCTIONS[0];
    result.industry = STANDARD_INDUSTRIES[4];
  }

  return result;
}

/**
 * Optional LLM parser call when API key is provided
 */
async function callLlmParser(rawText) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    if (process.env.GEMINI_API_KEY) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const prompt = `You are a high precision resume parsing engine for TECHORA Consultant.
Extract candidate details from the resume text into the following strict JSON object schema:
{
  "title": "Mr" | "Ms" | "Mrs" | "Dr",
  "firstName": "string",
  "lastName": "string",
  "gender": "Male" | "Female" | "Other" | "Prefer not to say",
  "dob": "YYYY-MM-DD",
  "email": "string",
  "mobile": "+91 XXXXX XXXXX",
  "city": "string",
  "company": "string",
  "designation": "string",
  "totalExperienceYears": number,
  "currentCtc": "string in INR format e.g. 90,00,000",
  "degree": "string",
  "institute": "string",
  "skills": ["string"],
  "function": "Executive Leadership & Board Advisory" | "Human Resources & Talent Acquisition" | "Payroll & Statutory Compliance" | "Technology & Cloud Architecture" | "BFSI & Wealth Management" | "Corporate Strategy & M&A" | "Legal, Risk & Governance" | "Operations & Supply Chain" | "Sales & Business Development" | "Finance & Accounting",
  "industry": "Banking, Financial Services & Insurance (BFSI)" | "Technology & SaaS" | "Manufacturing & Industrial" | "Healthcare & Life Sciences" | "Professional Services & Consulting" | "Retail & E-Commerce" | "Energy, Infrastructure & Real Estate" | "Telecommunications & Media"
}
Only output the JSON object without code fences or extra text.

Resume Text:
${rawText.slice(0, 10000)}
`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (response.ok) {
        const json = await response.json();
        const candidateJsonStr = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateJsonStr) {
          return JSON.parse(candidateJsonStr);
        }
      }
    }
  } catch (err) {
    console.warn('[LLM PARSE] LLM parsing failed, falling back to heuristics:', err.message);
  }
  return null;
}

/**
 * Main parser entrypoint
 */
export async function parseResume(buffer, originalFilename) {
  const magic = validateMagicBytes(buffer, originalFilename);
  if (!magic.valid) {
    throw new Error(magic.error || 'Invalid file format.');
  }

  const rawText = await extractRawText(buffer, originalFilename);

  // 1. Try LLM if configured
  let detected = null;
  if (rawText && rawText.length > 50) {
    detected = await callLlmParser(rawText);
  }

  // 2. Heuristic fallback
  const fallback = extractFieldsWithHeuristics(rawText || '');
  if (!detected) {
    detected = fallback;
  } else {
    // Fill any missing keys with fallback
    for (const key of Object.keys(fallback)) {
      if (!detected[key] || (Array.isArray(detected[key]) && detected[key].length === 0)) {
        detected[key] = fallback[key];
      }
    }
  }

  // Build fieldStatus badge map: 'autofilled' vs 'empty'
  const fieldStatus = {};
  for (const [key, val] of Object.entries(detected)) {
    const hasValue = Array.isArray(val) ? val.length > 0 : (val !== null && val !== undefined && String(val).trim() !== '');
    fieldStatus[key] = hasValue ? 'autofilled' : 'empty';
  }

  return {
    rawText: (rawText || '').slice(0, 1000),
    detected,
    fieldStatus,
  };
}
