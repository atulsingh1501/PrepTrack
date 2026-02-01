import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createNote = async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json(note);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
