import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String }, // optional, for links
  filePath: { type: String }, // optional, for uploaded PDFs
  content: { type: String }, // optional, for rich notes
  type: { type: String, enum: ['PDF', 'Link', 'Note'], required: true },
  category: { type: String }, // e.g., 'DSA', 'System Design'
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
