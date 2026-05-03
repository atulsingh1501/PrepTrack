import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  username: { type: String, required: true },
  url: { type: String, required: true },
  stats: { type: Map, of: String }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
