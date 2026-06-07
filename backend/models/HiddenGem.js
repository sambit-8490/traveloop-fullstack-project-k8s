const mongoose = require('mongoose');

const hiddenGemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: String, enum: ['viewpoint', 'food', 'cultural', 'nature', 'adventure', 'other'], default: 'other' },
  images: [{ type: String }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isApproved: { type: Boolean, default: true },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('HiddenGem', hiddenGemSchema);
