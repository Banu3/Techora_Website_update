export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  // Allow international formatting, spaces, dashes, numbers min 7 max 15 digits
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{7,15}$/.test(cleaned);
};

export const validateContactForm = (data) => {
  const errors = {};

  if (!data.full_name || data.full_name.trim().length < 2) {
    errors.full_name = 'Full Name is required (minimum 2 characters).';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'A valid business email address is required.';
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.phone = 'Valid phone number is required (7-15 digits).';
  }

  if (!data.company_name || data.company_name.trim().length < 2) {
    errors.company_name = 'Company Name is required.';
  }

  if (!data.service_required) {
    errors.service_required = 'Please select a required service category.';
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Please provide details about your requirements (minimum 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
