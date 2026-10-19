import { body, validationResult } from 'express-validator';

export const validateContactInput = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Full Name must be between 2 and 150 characters')
    .escape(),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid business email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .matches(/^[\d\s\-\+\(\)]{7,20}$/)
    .withMessage('Please provide a valid phone number'),

  body('company_name')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Company Name is required')
    .escape(),

  body('service_required')
    .trim()
    .notEmpty()
    .withMessage('Service selection is required')
    .escape(),

  body('message')
    .trim()
    .isLength({ min: 10, max: 3000 })
    .withMessage('Message details must be between 10 and 3000 characters')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failure: ' + errors.array().map(e => e.msg).join(', '),
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateAdminLogin = [
  body('email').trim().isEmail().withMessage('Valid administrator email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }
    next();
  }
];
