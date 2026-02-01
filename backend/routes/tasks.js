const express = require('express');
const router  = express.Router();
const Task    = require('../models/Task');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET all tasks for today (or all)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    const { text, category, time } = req.body;
    if (!text) return res.status(400).json({ message: 'Task text is required' });
    const task = await Task.create({ userId: req.user._id, text, category, time });
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH toggle done / update
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
