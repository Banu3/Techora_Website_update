import rateLimit from 'express-rate-limit';

// Rate limiter for public contact form endpoint (10 requests per 15 mins per IP)
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many enquiry submissions from this IP address. Please try again after 15 minutes.'
  }
});

// Rate limiter for admin login endpoint (5 login attempts per 15 mins per IP)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many failed login attempts. Account access throttled for 15 minutes.'
  }
});
