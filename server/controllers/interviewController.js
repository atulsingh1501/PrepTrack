import Interview from '../models/Interview.js';

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({ date: 1 });
    res.json(interviews);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createInterview = async (req, res) => {
  try {
    const interview = await Interview.create({ ...req.body, user: req.user._id });
    res.status(201).json(interview);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(interview);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteInterview = async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
