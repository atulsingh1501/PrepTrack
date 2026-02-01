const express   = require('express');
const router    = express.Router();
const Resource  = require('../models/Resource');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, type, tag, pages, content, url } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const resource = await Resource.create({ userId: req.user._id, title, type, tag, pages, content, url });
    res.status(201).json(resource);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    Object.assign(resource, req.body);
    await resource.save();
    res.json(resource);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
