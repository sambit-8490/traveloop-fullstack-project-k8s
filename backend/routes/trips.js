const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ $or: [{ user: req.user._id }, { collaborators: req.user._id }] }).sort('-createdAt');
    res.json(trips);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, user: req.user._id });
    res.status(201).json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/public', async (req, res) => {
  try {
    const trips = await Trip.find({ isPublic: true }).populate('user', 'name avatar').sort('-createdAt').limit(20);
    res.json(trips);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('collaborators', 'name avatar email');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, { new: true }
    );
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Trip deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/duplicate', protect, async (req, res) => {
  try {
    const original = await Trip.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Trip not found' });
    const copy = await Trip.create({
      user: req.user._id, title: `Copy of ${original.title}`,
      description: original.description, startDate: original.startDate,
      endDate: original.endDate, destinations: original.destinations,
      budget: original.budget, tags: original.tags
    });
    res.status(201).json(copy);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
