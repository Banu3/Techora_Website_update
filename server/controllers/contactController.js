import db from '../config/db.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const { full_name, email, phone, company_name, service_required, message } = req.body;

    // Classify service category automatically
    const isIT = service_required.toLowerCase().includes('it') ||
      ['strategy', 'software', 'cloud', 'infrastructure', 'cybersecurity', 'digital', 'erp', 'assessment']
      .some(k => service_required.toLowerCase().includes(k));

    const category = isIT ? 'IT Consulting' : 'Payroll';

    // Parameterized SQL query preventing SQL injection
    const stmt = db.prepare(`
      INSERT INTO enquiries (full_name, email, phone, company_name, service_required, service_category, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'New')
    `);

    const result = stmt.run(full_name, email, phone, company_name, service_required, category, message);

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our enterprise consulting team will reach out to you within 24 hours.',
      enquiryId: result.lastInsertRowid
    });
  } catch (err) {
    next(err);
  }
};
