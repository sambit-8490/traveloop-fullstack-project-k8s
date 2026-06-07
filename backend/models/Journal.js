const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entries: [{
    day: Number,
    date: Date,
    title: String,
    content: String,
    mood: { type: String, enum: ['happy', 'excited', 'tired', 'neutral', 'amazing'] },
    photos: [{ type: String }],
    location: String
  }],
  reminders: [{
    title: String,
    date: Date,
    time: String,
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
