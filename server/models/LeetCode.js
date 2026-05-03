import mongoose from 'mongoose';

const leetcodeSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:      { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  status:     { type: String, enum: ['Solved', 'Revisit', 'Skip'], default: 'Solved' },
  topic:      { type: String, default: '' },
  link:       { type: String, default: '' },
  notes:      { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('LeetCode', leetcodeSchema);
