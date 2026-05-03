import express from 'express';
import Skill from '../models/Skill.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id });
    res.json(skills);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const skill = await Skill.create({ ...req.body, user: req.user._id });
    res.json(skill);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    res.json(skill);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
