const express = require('express');
const router  = express.Router();
const Goal    = require('../models/Goal');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, icon, current, target, color } = req.body;
    if (!name || !target) return res.status(400).json({ message: 'Name and target are required' });
    const goal = await Goal.create({ userId: req.user._id, name, icon, current, target, color });
    res.status(201).json(goal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    Object.assign(goal, req.body);
    await goal.save();
    res.json(goal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
