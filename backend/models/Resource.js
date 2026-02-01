const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true, trim: true },
  type:    { type: String, enum: ['pdf', 'note', 'link'], default: 'pdf' },
  tag:     { type: String, default: 'General' },
  pages:   { type: Number, default: 0 },
  content: { type: String, default: '' }, // for notes
  url:     { type: String, default: '' }, // for links/pdfs
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
