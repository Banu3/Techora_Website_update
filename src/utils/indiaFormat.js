/**
 * India Localisation Utilities (en-IN)
 * - Dates: DD MMM YYYY
 * - Time: IST (Indian Standard Time)
 * - Currency: ₹ with Indian lakh/crore numbering
 * - Phone & PIN code validation
 */

// Format Date as DD MMM YYYY (e.g. 24 Oct 2026)
export function formatDateIN(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return dateInput;

  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

// Format Currency in INR with lakh/crore system (e.g. ₹12,50,000)
export function formatCurrencyINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '';
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

// Validate 10-digit Indian Mobile (starts with 6, 7, 8, 9)
export function isValidIndianMobile(phoneStr) {
  if (!phoneStr) return false;
  const digits = String(phoneStr).replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) return true;
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) return true;
  return false;
}

// Optional 6-digit Indian PIN code validation
export function isValidIndianPIN(pinStr) {
  if (!pinStr) return true; // Optional
  const trimmed = String(pinStr).trim();
  return /^[1-9][0-9]{5}$/.test(trimmed);
}

// Curated list of Indian corporate cities
export const INDIAN_CITIES = [
  'Mumbai',
  'Bengaluru',
  'New Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Gurugram',
  'Noida',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Kochi',
  'Chandigarh',
  'Indore',
  'Coimbatore',
  'Nagpur',
  'Vadodara',
  'Bhubaneswar',
  'Thiruvananthapuram',
  'Visakhapatnam',
];

export const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Delhi NCR',
  'Telangana',
  'Tamil Nadu',
  'Haryana',
  'Uttar Pradesh',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Kerala',
  'Punjab',
  'Madhya Pradesh',
  'Odisha',
  'Andhra Pradesh',
];
