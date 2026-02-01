import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  proficiency: { type: Number, min: 1, max: 5, default: 1 },
  category: { type: String }, // Frontend, Backend, Database, Language
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
