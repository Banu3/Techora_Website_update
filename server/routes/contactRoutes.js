import express from 'express';
import { createEnquiry } from '../controllers/contactController.js';
import { validateContactInput } from '../middleware/validate.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', contactLimiter, validateContactInput, createEnquiry);

export default router;
