const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');
const { protect } = require('../middleware/auth');

router.get('/trip/:tripId', protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ trip: req.params.tripId, user: req.user._id });
    res.json(itinerary);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/trip/:tripId', protect, async (req, res) => {
  try {
    let itinerary = await Itinerary.findOne({ trip: req.params.tripId, user: req.user._id });
    if (itinerary) {
      itinerary = await Itinerary.findByIdAndUpdate(itinerary._id, req.body, { new: true });
    } else {
      itinerary = await Itinerary.create({ ...req.body, trip: req.params.tripId, user: req.user._id });
    }
    res.json(itinerary);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/trip/:tripId/day/:dayIndex', protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    itinerary.days[req.params.dayIndex] = { ...itinerary.days[req.params.dayIndex].toObject(), ...req.body };
    await itinerary.save();
    res.json(itinerary);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
