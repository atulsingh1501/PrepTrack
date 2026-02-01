const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true, trim: true },
  level:    { type: String, enum: ['strong', 'learning', 'weak'], default: 'learning' },
  category: { type: String, enum: ['Languages', 'Frameworks & Tools', 'Core CS'], default: 'Languages' },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
