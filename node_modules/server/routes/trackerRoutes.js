import express from 'express';
import { updateTrackerUsernames, getTrackerData } from '../controllers/trackerController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/usernames', protect, updateTrackerUsernames);
router.get('/data', protect, getTrackerData);

export default router;
