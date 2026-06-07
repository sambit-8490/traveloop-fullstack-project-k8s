const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect } = require('../middleware/auth');

router.post('/:tripId/invite', protect, async (req, res) => {
  try {
    const { email } = req.body;
    const User = require('../models/User');
    const invitee = await User.findOne({ email });
    if (!invitee) return res.status(404).json({ message: 'User not found' });
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, user: req.user._id },
      { $addToSet: { collaborators: invitee._id } },
      { new: true }
    ).populate('collaborators', 'name avatar email');
    res.json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:tripId/remove/:userId', protect, async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, user: req.user._id },
      { $pull: { collaborators: req.params.userId } },
      { new: true }
    ).populate('collaborators', 'name avatar email');
    res.json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
