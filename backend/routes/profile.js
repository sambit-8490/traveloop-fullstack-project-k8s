const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/', protect, async (req, res) => {
  try {
    const { password, role, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'traveloop/avatars');
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.json({ message: 'Account deactivated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
