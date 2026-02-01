import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Rich text / markdown
  subject: { type: String, required: true }, // DSA, OS, DBMS, CN, HR
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
