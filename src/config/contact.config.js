/**
 * TECHORA Consultant Contact Configuration
 * 
 * Rules:
 * - Only render a contact block/badge in the UI when its value is non-empty.
 * - Items needing explicit confirmation from the client are left empty ("") by default.
 */

export const contactConfig = {
  companyName: 'TECHORA Consultant',
  legalEntity: 'TECHORA Consulting Services',
  
  // Pending verification — kept blank so they are hidden until confirmed
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  
  phone: '', // e.g. '+91 XX XXXX XXXX' (pending confirmation)
  email: '', // e.g. 'contact@techora.consulting' (pending confirmation)
  partnershipsEmail: '', // unverified
  
  internationalHubs: [], // e.g. Singapore hub (unverified, hidden)
  
  operatingHours: '', // 'Mon – Fri, 9:30 AM – 6:30 PM IST' (only render if confirmed)
  
  social: {
    linkedin: '',
  },
};

export default contactConfig;
