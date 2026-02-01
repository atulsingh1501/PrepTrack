const mongoose = require('mongoose');

const leetcodeSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  status:     { type: String, enum: ['Solved', 'Revisit', 'Pending'], default: 'Solved' },
  link:       { type: String, default: '' },
  notes:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('LeetcodeProblem', leetcodeSchema);
