const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  destinations: [{ type: String }],
  budget: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  isPublic: { type: Boolean, default: false },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }],
  totalExpense: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
