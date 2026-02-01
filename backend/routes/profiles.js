const express = require('express');
const router  = express.Router();
const CodingProfile = require('../models/CodingProfile');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET all profiles for user
router.get('/', async (req, res) => {
  try {
    const profiles = await CodingProfile.find({ userId: req.user._id });
    res.json(profiles);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST add/update platform profile (upsert)
router.post('/', async (req, res) => {
  try {
    const { platform, username } = req.body;
    if (!platform || !username) return res.status(400).json({ message: 'Platform and username required' });
    const profile = await CodingProfile.findOneAndUpdate(
      { userId: req.user._id, platform },
      { username },
      { upsert: true, new: true }
    );
    res.status(201).json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE a platform profile
router.delete('/:id', async (req, res) => {
  try {
    await CodingProfile.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Profile removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
