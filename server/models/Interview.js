import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Mock', 'Actual'], default: 'Mock' },
  round: { type: String }, // e.g., 'HR', 'Technical 1', 'System Design'
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  rating: { type: Number, min: 1, max: 5 }, // self-rating or interviewer rating
  feedback: { type: String },
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
