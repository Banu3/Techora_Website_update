# TECHORA Consultant — Career Portal & Mandate Administration

Enterprise-grade Career & Executive Search Mandate Platform for **TECHORA Consultant**, matching the exact brand identity, typography, warm palette, and institutional aesthetics.

---

## 🏛️ Brand & Architectural Overview

- **Brand Wordmark:** `TECHORA ▪ CONSULTANT` (serif bold wordmark with small-caps subtitle and institutional blue accent square).
- **Aesthetic System:** Warm off-white/cream background (`#F9F9F8` / `var(--mist)`), dark navy text & action surfaces (`#0B1F3A` / `var(--navy-900)`), vibrant blue links & accents (`#0F7FC4` / `var(--sky-600)`), serif headings (Playfair/Fraunces), and clean Plus Jakarta Sans body typography.
- **Terminology:** Executive assignments and jobs are designated as **Mandates / Open Positions**.

---

## ⚡ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Recharts for data analytics.
- **Backend:** Node.js, Express, Multer (secure private uploads), Zod validation, JWT authentication with bcrypt.
- **Resume Parsing Engine:** Multi-tier extraction:
  - Multi-format text extraction: `pdf-parse`, `mammoth` (DOCX), `tesseract.js` (Image OCR).
  - Magic bytes binary header validation (rejecting disguised executables or malformed files).
  - LLM JSON schema extraction with intelligent heuristic/regex fallback for Indian formats (+91 phone numbers, Indian CTC notation, qualification degrees, institutes, and experience calculation).
- **Database:** PostgreSQL with Prisma (`prisma/schema.prisma`) and embedded SQLite with WAL mode (`data/techora.sqlite`) for plug-and-play local execution.

---

## 🚀 Quick Start Guide

### 1. Installation
Clone repository and install dependencies:
```bash
npm install
```

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
*(Default settings work immediately out-of-the-box for local testing).*

### 3. Database & Seeding
The database initializes and seeds automatically upon server start, or you can run:
```bash
node scripts/seedJobs.js
```
This populates:
1. **The 4 Mandates** specified in the requirements.
2. **30 Realistic Candidate Dossiers** across all 4 mandates.
3. **The Default Admin User**:
   - **Email:** `admin@techora.consulting`
   - **Password:** `Admin@123`

### 4. Running the Application
To run both backend and frontend concurrently:
```bash
npm run dev:full
```
Or run individually:
- **Backend API (Port 5000):** `npm run dev:server`
- **Frontend SPA (Port 3000):** `npm run dev`

Visit:
- **Public Careers Page:** [http://localhost:3000/careers](http://localhost:3000/careers)
- **Mandate Administration (Admin):** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📋 Features & Implementation Breakdown

### 1. Careers Portal (`/careers`)
- **Live Filter Bar:** Real-time search by keyword (title, department, skill), Designation, Experience Level, Location, and "Clear" filter reset.
- **Live Counter:** Dynamic `Open Positions (N)` counter showing the active count from the database with subtitle *"Active positions open for direct application"*.
- **Mandate Rows:**
  - Mandate Title, Designation • Engagement Type, Location, Experience Range, and Deadline.
  - Skill tags show first 4 items with interactive `+N more` toggle that expands inline.
  - "View details" modal link and dark-navy `"Apply Now →"` button.
  - Auto-hides expired mandates from active listings and shows `"Applications closed"` badge if accessed directly.

### 2. Resume-Powered Apply Flow (`/careers/apply/:jobId`)
- Preserves the full brand navbar and 4-column footer.
- **Top Banner:** Displays selected mandate title, engagement type, location, and experience requirement.
- **3-Column Responsive Grid:** Step 1 upload card + 2-column detailed profile form (single-column on mobile).
- **Step 1: Resume Upload:**
  - Drag-and-drop or file picker accepting PDF, DOC, DOCX, JPG, JPEG, PNG (max 5MB).
  - Animated upload progress bar.
  - **"Reading your resume…"** skeleton loading state during text parsing and entity extraction.
- **Auto-Fill Visual Feedback:**
  - Auto-populated fields feature a soft green border and an **"Auto-filled"** badge.
  - Unmatched fields display a soft yellow **"Please fill"** helper hint.
  - All fields remain fully editable by the candidate.
  - Automatic work experience calculation from tenure dates if not explicitly stated.
  - Nearest-match mapping for candidate Function and Industry.
- **Indian CTC Formatting Hint:** Includes helpful hint `"For Eg. 90 Lacs should be written as 90,00,000"` with real-time Indian number grouping.
- **Skills Chip Manager:** Add comma-separated skills with removable interactive tags.
- **Duplicate Prevention:** Prevents duplicate applications with the same email on the same mandate with friendly notification.
- **Success Screen:** Displays institutional confirmation with unique tracking Application Reference ID (e.g., `TECHORA-APP-20261018-XXXXXX`).

### 3. Secured Mandate Administration (`/admin`)
- Accessible via the **"Mandate Administration"** link in the footer or direct URL.
- **Authentication:** Protected with JWT token and bcrypt password hashing. Default login: `admin@techora.consulting` / `Admin@123`.
- **Institutional Dark-Navy Sidebar:** Navigation for Dashboard, Mandates, Applications, Reports, Settings, and Sign Out.
- **Executive KPI Cards:** Total Applications, Today, This Week, This Month, Shortlisted, Rejected, Active Mandates.
- **Interactive Recharts Analytics:**
  - Applications by Mandate (Bar Chart)
  - Applications by Function (Donut Chart)
  - Applications by Industry (Donut Chart)
  - Applications by Experience Band (0–2, 2–5, 5–10, 10+)
  - Top 10 Candidate Cities (Ranked Bar Chart)
  - Gender Distribution (Pie Chart)
  - Application Influx Velocity over Time (Daily / Weekly / Monthly toggle)
  - Global Date-Range filter that dynamically filters all dashboard analytics.
- **Mandate Management:**
  - Create, edit, toggle status (active/closed), and delete mandates.
  - Any mandate created or updated in admin is immediately reflected live on the public `/careers` page.
  - Each mandate card shows its real-time applicant count and direct "View Applicants" filter trigger.
- **Applications Management:**
  - Full-featured data table: Candidate Name, Mandate, Email, Mobile, City, Company, Designation, Experience, CTC, Function, Industry, Date, Status.
  - Multi-filtering: Filter by Job, Status, Function, Industry, City, and Experience band.
  - Search across all candidate fields.
  - Side Drawer Candidate Dossier: Click any applicant to view full profile, download/preview CV, update status (`New`, `Shortlisted`, `Interview`, `Rejected`, `Hired`), and save private administrative notes.
  - Bulk status change operations.
  - One-click CSV export respecting all active filters.

---

## 🔒 Security & Quality Standards

- **Server-Side Zod Validation:** All endpoints validate schemas strictly.
- **Magic Bytes Validation:** File headers are checked for true MIME types before processing.
- **Rate Limiting:** Protects `/api/applications` and `/api/resume/parse` against spam or abuse.
- **Private CV Storage:** Resumes are stored in a non-public `/private_uploads` folder and served exclusively through authenticated admin streams (`/api/admin/resumes/:filename`).
- **Bot Defense:** Minimum time-to-submit timing checks and honeypot field filters.

---

## 🧪 Testing

To run the full end-to-end integration test suite:
```bash
node tests/integration.test.cjs
```
The test suite validates:
- SQLite WAL mode & Prisma database compatibility
- Public API job deadline auto-hiding
- Magic bytes and multi-format resume parsing
- Candidate submission & duplicate suppression
- Isolated private upload storage security
- Administrative JWT authorization and RBAC
- Frontend SPA route availability
