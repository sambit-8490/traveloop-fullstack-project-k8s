const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Guide gets their own bookings
router.get('/bookings', protect, authorize('guide'), async (req, res) => {
  try {
    // In production this would query a Booking model
    // Returning empty array so frontend uses mock data gracefully
    res.json([]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
