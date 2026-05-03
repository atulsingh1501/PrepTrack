import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  repoUrl: { type: String },
  tags: [{ type: String }],
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
