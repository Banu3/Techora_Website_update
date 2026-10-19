import express from 'express';
import { loginAdmin, getEnquiries, updateStatus, deleteEnquiry, getContent, updateContent } from '../controllers/adminController.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { validateAdminLogin } from '../middleware/validate.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public auth and content retrieval routes
router.post('/login', loginLimiter, validateAdminLogin, loginAdmin);
router.get('/content', getContent);

// Protected admin management routes
router.use(verifyAdminToken);
router.get('/enquiries', getEnquiries);
router.patch('/enquiries/:id', updateStatus);
router.delete('/enquiries/:id', deleteEnquiry);
router.put('/content', updateContent);

export default router;
