const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalBudget: { type: Number, default: 0 },
  expenses: [{
    category: { type: String, enum: ['hotels', 'transport', 'activities', 'food', 'miscellaneous'] },
    description: String,
    amount: Number,
    date: Date,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
