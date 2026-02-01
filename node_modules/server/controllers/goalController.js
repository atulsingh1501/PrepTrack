import Goal from '../models/Goal.js';

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ targetDate: 1 });
    res.json(goals);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user._id });
    res.status(201).json(goal);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(goal);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
