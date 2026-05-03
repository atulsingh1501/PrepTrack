import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['Applications', 'Problems', 'Skills', 'Rounds', 'Other'], default: 'Problems' },
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  unit: { type: String, default: 'units' },
  dueDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
