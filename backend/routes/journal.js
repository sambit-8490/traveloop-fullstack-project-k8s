const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const { protect } = require('../middleware/auth');

router.get('/trip/:tripId', protect, async (req, res) => {
  try {
    let journal = await Journal.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!journal) journal = await Journal.create({ trip: req.params.tripId, user: req.user._id, entries: [], reminders: [] });
    res.json(journal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/trip/:tripId/entry', protect, async (req, res) => {
  try {
    let journal = await Journal.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!journal) journal = await Journal.create({ trip: req.params.tripId, user: req.user._id, entries: [], reminders: [] });
    journal.entries.push(req.body);
    await journal.save();
    res.json(journal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/trip/:tripId/entry/:entryId', protect, async (req, res) => {
  try {
    const journal = await Journal.findOne({ trip: req.params.tripId, user: req.user._id });
    const entry = journal.entries.id(req.params.entryId);
    if (entry) Object.assign(entry, req.body);
    await journal.save();
    res.json(journal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/trip/:tripId/reminder', protect, async (req, res) => {
  try {
    let journal = await Journal.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!journal) journal = await Journal.create({ trip: req.params.tripId, user: req.user._id, entries: [], reminders: [] });
    journal.reminders.push(req.body);
    await journal.save();
    res.json(journal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
