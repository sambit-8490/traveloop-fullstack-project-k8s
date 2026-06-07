const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['traveler', 'guide', 'hotel_owner', 'admin'], default: 'traveler' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  savedDestinations: [{ type: String }],
  language: { type: String, default: 'en' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
