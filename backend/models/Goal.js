const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true, trim: true },
  icon:    { type: String, default: '🎯' },
  current: { type: Number, default: 0 },
  target:  { type: Number, required: true },
  color:   { type: String, enum: ['green', 'amber', 'red', 'purple'], default: 'green' },
}, { timestamps: true });

// Virtual: percentage
goalSchema.virtual('percent').get(function () {
  return Math.round((this.current / this.target) * 100);
});

goalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Goal', goalSchema);
