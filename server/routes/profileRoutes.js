import express from 'express';
import Profile from '../models/Profile.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.user._id });
    res.json(profiles);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const profile = await Profile.create({ ...req.body, user: req.user._id });
    res.status(201).json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Profile.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
