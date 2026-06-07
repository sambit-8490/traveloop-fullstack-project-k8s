const express = require('express');
const router = express.Router();
const Checklist = require('../models/Checklist');
const { protect } = require('../middleware/auth');

router.get('/trip/:tripId', protect, async (req, res) => {
  try {
    let checklist = await Checklist.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!checklist) checklist = await Checklist.create({ trip: req.params.tripId, user: req.user._id, items: [] });
    res.json(checklist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/trip/:tripId/item', protect, async (req, res) => {
  try {
    let checklist = await Checklist.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!checklist) checklist = await Checklist.create({ trip: req.params.tripId, user: req.user._id, items: [] });
    checklist.items.push(req.body);
    await checklist.save();
    res.json(checklist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/trip/:tripId/item/:itemId', protect, async (req, res) => {
  try {
    const checklist = await Checklist.findOne({ trip: req.params.tripId, user: req.user._id });
    const item = checklist.items.id(req.params.itemId);
    if (item) Object.assign(item, req.body);
    await checklist.save();
    res.json(checklist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/trip/:tripId/item/:itemId', protect, async (req, res) => {
  try {
    const checklist = await Checklist.findOne({ trip: req.params.tripId, user: req.user._id });
    checklist.items = checklist.items.filter(i => i._id.toString() !== req.params.itemId);
    await checklist.save();
    res.json(checklist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
