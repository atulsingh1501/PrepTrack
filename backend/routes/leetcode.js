const express = require('express');
const router  = express.Router();
const Problem = require('../models/LeetcodeProblem');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, difficulty, status, link, notes } = req.body;
    if (!name) return res.status(400).json({ message: 'Problem name is required' });
    const problem = await Problem.create({ userId: req.user._id, name, difficulty, status, link, notes });
    res.status(201).json(problem);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    Object.assign(problem, req.body);
    await problem.save();
    res.json(problem);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ message: 'Problem deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
