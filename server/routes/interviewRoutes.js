import express from 'express';
import { getInterviews, createInterview, updateInterview, deleteInterview } from '../controllers/interviewController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, getInterviews).post(protect, createInterview);
router.route('/:id').put(protect, updateInterview).delete(protect, deleteInterview);

export default router;
