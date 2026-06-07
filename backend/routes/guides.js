const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const guides = await Guide.find({ isApproved: true }).populate('user', 'name avatar email');
    res.json(guides);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/register', protect, authorize('guide'), async (req, res) => {
  try {
    const existing = await Guide.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Guide profile already exists' });
    const guide = await Guide.create({ ...req.body, user: req.user._id });
    res.status(201).json(guide);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/my-profile', protect, async (req, res) => {
  try {
    const guide = await Guide.findOne({ user: req.user._id }).populate('user', 'name avatar email');
    res.json(guide);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/my-profile', protect, async (req, res) => {
  try {
    const guide = await Guide.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
    res.json(guide);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
