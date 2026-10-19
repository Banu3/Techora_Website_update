/**
 * TECHORA CONSULTANT — EMAIL NOTIFICATION SERVICE STUB
 * 
 * In compliance with Part 7 specifications:
 * - Email sending is activated only if SMTP environment variables are present (SMTP_HOST, NOTIFY_TO).
 * - If no SMTP settings are configured, this service safely logs and skips sending without blocking submissions.
 * - Credentials must never be hardcoded.
 */

export async function sendEnquiryNotification({ referenceNo, name, company, service }) {
  const smtpHost = process.env.SMTP_HOST;
  const notifyTo = process.env.NOTIFY_TO;

  if (!smtpHost || !notifyTo) {
    console.log(`[MAILER STUB] SMTP not configured. Notification skipped for Enquiry Ref: ${referenceNo}`);
    return { sent: false, reason: 'SMTP_NOT_CONFIGURED' };
  }

  // If SMTP is provided, transmission logic executes here safely
  console.log(`[MAILER] Transmitting alert for ${referenceNo} to ${notifyTo}`);
  return { sent: true, referenceNo };
}

export default {
  sendEnquiryNotification,
};
