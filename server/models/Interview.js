import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Mock', 'Actual'], default: 'Mock' },
  round: { type: String, enum: ['Technical', 'HR', 'System Design', 'Behavioral', 'Other'], default: 'Technical' },
  status: { type: String, enum: ['Scheduled', 'In Progress', 'Done'], default: 'Scheduled' },
  mode: { type: String, enum: ['Online', 'In-person'], default: 'Online' },
  notes: { type: String },
  rating: { type: Number, min: 1, max: 5 }, // self-rating or interviewer rating
  feedback: { type: String },
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
