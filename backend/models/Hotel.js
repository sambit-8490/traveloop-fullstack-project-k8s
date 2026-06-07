const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  city: { type: String, required: true },
  images: [{ type: String }],
  pricePerNight: { type: Number, required: true },
  amenities: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  packages: [{
    name: String,
    description: String,
    price: Number,
    duration: Number,
    includes: [String]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
