const mongoose = require('mongoose');

const activityItemSchema = new mongoose.Schema({
  name: String,
  time: String,
  duration: String,
  cost: { type: Number, default: 0 },
  type: String,
  notes: String,
  completed: { type: Boolean, default: false }
});

const daySchema = new mongoose.Schema({
  day: Number,
  date: Date,
  city: String,
  activities: [activityItemSchema],
  notes: String,
  accommodation: String,
  transport: String,
  dailyCost: { type: Number, default: 0 }
});

const itinerarySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  days: [daySchema],
  totalCost: { type: Number, default: 0 },
  isAIGenerated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
