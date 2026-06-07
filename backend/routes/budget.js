const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');

router.get('/trip/:tripId', protect, async (req, res) => {
  try {
    const budget = await Budget.findOne({ trip: req.params.tripId, user: req.user._id });
    res.json(budget);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/trip/:tripId', protect, async (req, res) => {
  try {
    let budget = await Budget.findOne({ trip: req.params.tripId, user: req.user._id });
    if (budget) {
      budget = await Budget.findByIdAndUpdate(budget._id, req.body, { new: true });
    } else {
      budget = await Budget.create({ ...req.body, trip: req.params.tripId, user: req.user._id });
    }
    res.json(budget);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/trip/:tripId/expense', protect, async (req, res) => {
  try {
    let budget = await Budget.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!budget) budget = await Budget.create({ trip: req.params.tripId, user: req.user._id, totalBudget: 0 });
    budget.expenses.push({ ...req.body, paidBy: req.user._id });
    await budget.save();
    res.json(budget);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/trip/:tripId/expense/:expenseId', protect, async (req, res) => {
  try {
    const budget = await Budget.findOne({ trip: req.params.tripId, user: req.user._id });
    budget.expenses = budget.expenses.filter(e => e._id.toString() !== req.params.expenseId);
    await budget.save();
    res.json(budget);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
