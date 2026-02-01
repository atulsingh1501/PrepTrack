import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String }, // optional, for Youtube/articles
  filePath: { type: String }, // optional, for uploaded PDFs
  type: { type: String, enum: ['PDF', 'Video', 'Article', 'Other'], default: 'Other' },
  topic: { type: String }, // e.g., 'DSA', 'System Design'
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
