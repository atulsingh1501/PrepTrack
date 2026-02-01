const mongoose = require('mongoose');

const codingProfileSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: {
    type: String,
    enum: ['leetcode', 'gfg', 'codechef', 'codeforces', 'hackerrank', 'codestudio', 'atcoder', 'github'],
    required: true,
  },
  username: { type: String, required: true, trim: true },
}, { timestamps: true });

// Unique per user per platform
codingProfileSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('CodingProfile', codingProfileSchema);
