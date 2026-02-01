const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:     { type: String, required: true, trim: true },
  category: { type: String, default: 'General' },
  time:     { type: String, default: '' },
  done:     { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
