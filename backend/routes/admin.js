const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const Guide = require('../models/Guide');
const Hotel = require('../models/Hotel');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const [users, trips, guides, hotels] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Guide.countDocuments(),
      Hotel.countDocuments()
    ]);
    const roleStats = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
    res.json({ users, trips, guides, hotels, roleStats });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/toggle', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/guides/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const guides = await Guide.find({ isApproved: false }).populate('user', 'name email avatar');
    res.json(guides);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/guides/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(guide);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
