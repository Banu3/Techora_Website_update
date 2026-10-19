# UNVERIFIED CLAIMS AUDIT & CLIENT CONFIRMATION LEDGER

This document itemizes every factual statement, response-time commitment, physical address, legal covenant, and demographic figure identified across the TECHORA Consultant codebase.

Per **Part 10 Requirements**, all unconfirmed items have been removed or conditionally hidden behind `src/config/contact.config.js` until confirmed by you.

---

## 1. Physical Addresses & Regional Hubs
| Item | Source Location | Initial Project Value | Part 10 Status | Action Required from Client |
| :--- | :--- | :--- | :--- | :--- |
| **Corporate Headquarters** | `src/config/contactConfig.js:14-22`, `src/content/aboutContent.js:39` | Mumbai, Maharashtra | **HIDDEN** | Supply registered office address, landmark, and 6-digit PIN code. |
| **Singapore Hub / ASEAN Desk** | `src/config/contactConfig.js:23`, `src/pages/PartnerWithUs.jsx:414` | Singapore ASEAN Liaison Desk | **HIDDEN** | Confirm if international representative desk in Singapore is active. |
| **Regional Practice Hubs** | `src/content/aboutContent.js:39` | Bengaluru / Mumbai / Singapore | **HIDDEN** | Specify exact operational branches across India. |

---

## 2. Telephony & Electronic Contact Information
| Item | Source Location | Initial Project Value | Part 10 Status | Action Required from Client |
| :--- | :--- | :--- | :--- | :--- |
| **Central Switchboard Phone** | `src/config/contactConfig.js:8` | `+91 22 6984 5200` | **HIDDEN** | Supply official corporate phone number (mobile or landline with STD). |
| **Executive Search Hotline** | `src/config/contactConfig.js:9` | `+91 98201 54321` | **HIDDEN** | Confirm direct partner outreach phone number. |
| **Partnerships Email** | `src/config/contactConfig.js:10` | `partnerships@techora.consulting` | **HIDDEN** | Confirm official intake email address. |
| **Governance Email** | `src/config/contactConfig.js:11` | `governance@techora.consulting` | **HIDDEN** | Confirm statutory audit email address. |
| **Recruitment Email** | `src/config/contactConfig.js:12` | `recruitment@techora.consulting` | **HIDDEN** | Confirm talent acquisition email address. |

---

## 3. Response-Time & Service Level Commitments
| Item | Source Location | Claimed Value | Part 10 Status | Action Required from Client |
| :--- | :--- | :--- | :--- | :--- |
| **Turnaround Time Guarantee** | `src/config/contactConfig.js:26` | "24 business hours under strict non-disclosure covenant" | **REMOVED** from public pages | Confirm turnaround policy or keep neutral "promptly". |
| **Partner Review Guarantee** | `src/content/partnerContent.js:34` | "Mandates are reviewed and acknowledged by a Senior Practice Partner within 24 business hours" | **REMOVED** from public pages | Confirm if 24-hour SLA is contractual. |
| **Payroll Inquiry Response** | `src/components/services/PayrollContactCTA.jsx:54` | "will contact you within 24 business hours" | **REPLACED** with "will review your details promptly" | Keep neutral until SLA is confirmed. |
| **Industry Inquiry Response** | `src/components/industries/IndustryEnquiryForm.jsx:71` | "respond within 24 business hours" | **REPLACED** with "will review your details promptly" | Keep neutral until SLA is confirmed. |

---

## 4. Legal, NDA & Data Retention Covenants
| Item | Source Location | Claimed Value | Part 10 Status | Action Required from Client |
| :--- | :--- | :--- | :--- | :--- |
| **365-Day Retention Guarantee** | `src/config/contactConfig.js:27`, `src/pages/Careers.jsx`, `src/pages/PartnerWithUs.jsx` | "365-day statutory retention standards" | **REMOVED** from public consent checkboxes | Confirm your statutory document retention period under Indian DPDP Act. |
| **"Zero Publicity" Covenant** | `src/content/partnerContent.js:38` | "Zero publicity or public announcements without explicit corporate client sanction" | **REMOVED** | Confirm if strict zero-publicity policy applies to all engagements. |
| **Fiduciary NDA Guarantee** | `src/components/home/PartnerCTA.jsx:121` | "Every mandate is governed by non-disclosure protocols" | **REPLACED** with corporate partnership copy | Supply standardized client NDA agreement if required. |

---

## 5. Marketing Claims & Badges
| Item | Source Location | Claimed Value | Part 10 Status | Action Required from Client |
| :--- | :--- | :--- | :--- | :--- |
| **Home Hero Badge** | `src/components/home/HomeHero.jsx:229` | "Corporate Advisory • Executive Search • Payroll Solutions" | **REMOVED** | Verification completed per Part 10 spec. |
| **Mandate Verification Claim** | `src/pages/Careers.jsx:533` | "All positions represent verified, active corporate retained mandates." | **REMOVED** | Replaced with plain "Open Positions". |
| **Public Applicant Counts** | `src/pages/Careers.jsx` | "0 Applicants" | **REMOVED** | Candidate count hidden from public viewing. |

---

## 6. Seed / Sample Job Listings in Database
| Job Title | Designation | Experience Text | Status | Current Handling |
| :--- | :--- | :--- | :--- | :--- |
| Practice Director – BFSI Executive Search | Practice Director | 12–18 Years | `is_demo = 1` | Hidden from public Careers listing; reserved for admin demo only. |
| Principal Consultant – Payroll & Statutory Governance | Principal Consultant | 8–14 Years | `is_demo = 1` | Hidden from public Careers listing; reserved for admin demo only. |
| Senior Practice Lead – Technology & Cloud Leadership | Senior Lead | 7–12 Years | `is_demo = 1` | Hidden from public Careers listing; reserved for admin demo only. |
| Associate Partner – Corporate Reorganization Advisory | Associate Partner | 10–16 Years | `is_demo = 1` | Hidden from public Careers listing; reserved for admin demo only. |

*Note: Genuine active job mandates published via `/admin` will have `is_demo = 0` and will appear publicly in the ruled editorial listing.*
