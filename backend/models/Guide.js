const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: [{ type: String }],
  languages: [{ type: String }],
  location: { type: String, required: true },
  experience: { type: Number, default: 0 },
  pricePerDay: { type: Number, default: 0 },
  idDocument: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  services: [{ type: String }],
  availability: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
