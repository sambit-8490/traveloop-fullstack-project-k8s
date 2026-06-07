const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: { type: String, required: true },
    category: { type: String, enum: ['clothing', 'electronics', 'documents', 'medicines', 'other'], default: 'other' },
    packed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Checklist', checklistSchema);
