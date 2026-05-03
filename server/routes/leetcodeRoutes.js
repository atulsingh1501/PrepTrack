import express from 'express';
import LeetCode from '../models/LeetCode.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const problems = await LeetCode.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, difficulty, status, topic, link, notes } = req.body;
    if (!title) return res.status(400).json({ message: 'Problem title is required' });
    const problem = await LeetCode.create({ userId: req.user._id, title, difficulty, status, topic, link, notes });
    res.status(201).json(problem);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const problem = await LeetCode.findOne({ _id: req.params.id, userId: req.user._id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    Object.assign(problem, req.body);
    await problem.save();
    res.json(problem);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const problem = await LeetCode.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ message: 'Problem deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
