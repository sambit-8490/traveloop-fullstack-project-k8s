const express = require('express');
const router = express.Router();
const HiddenGem = require('../models/HiddenGem');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { city, category } = req.query;
    let query = { isApproved: true };
    if (city) query.city = new RegExp(city, 'i');
    if (category) query.category = category;
    const gems = await HiddenGem.find(query).populate('user', 'name avatar').sort('-likes');
    res.json(gems);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const gem = await HiddenGem.create({ ...req.body, user: req.user._id });
    res.status(201).json(gem);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/like', protect, async (req, res) => {
  try {
    const gem = await HiddenGem.findById(req.params.id);
    const liked = gem.likedBy.includes(req.user._id);
    if (liked) {
      gem.likedBy.pull(req.user._id);
      gem.likes = Math.max(0, gem.likes - 1);
    } else {
      gem.likedBy.push(req.user._id);
      gem.likes += 1;
    }
    await gem.save();
    res.json(gem);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
