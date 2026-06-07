const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { city, maxPrice } = req.query;
    let query = { isAvailable: true };
    if (city) query.city = new RegExp(city, 'i');
    if (maxPrice) query.pricePerNight = { $lte: parseInt(maxPrice) };
    const hotels = await Hotel.find(query).populate('owner', 'name email');
    res.json(hotels);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, authorize('hotel_owner', 'admin'), async (req, res) => {
  try {
    const hotel = await Hotel.create({ ...req.body, owner: req.user._id });
    res.status(201).json(hotel);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/my-hotels', protect, async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id });
    res.json(hotels);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
    res.json(hotel);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Hotel.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.json({ message: 'Hotel deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
