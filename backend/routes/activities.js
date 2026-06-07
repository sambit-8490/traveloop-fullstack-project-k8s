const express = require('express');
const router = express.Router();

const activities = [
  { id: 1, name: 'River Rafting', city: 'Rishikesh', type: 'adventure', duration: '3 hours', cost: 800, rating: 4.8, description: 'Thrilling white water rafting experience' },
  { id: 2, name: 'Yoga Session', city: 'Rishikesh', type: 'wellness', duration: '2 hours', cost: 500, rating: 4.9, description: 'Morning yoga by the Ganges' },
  { id: 3, name: 'Street Food Tour', city: 'Delhi', type: 'food', duration: '3 hours', cost: 600, rating: 4.7, description: 'Explore Old Delhi street food' },
  { id: 4, name: 'Taj Mahal Sunrise', city: 'Agra', type: 'sightseeing', duration: '4 hours', cost: 1200, rating: 5.0, description: 'Witness the Taj at sunrise' },
  { id: 5, name: 'Scuba Diving', city: 'Goa', type: 'adventure', duration: '2 hours', cost: 2500, rating: 4.6, description: 'Explore underwater marine life' },
  { id: 6, name: 'Cooking Class', city: 'Jaipur', type: 'food', duration: '3 hours', cost: 1500, rating: 4.8, description: 'Learn authentic Rajasthani cooking' },
  { id: 7, name: 'Ganga Aarti', city: 'Varanasi', type: 'cultural', duration: '2 hours', cost: 0, rating: 4.9, description: 'Sacred evening prayer ceremony' },
  { id: 8, name: 'Paragliding', city: 'Manali', type: 'adventure', duration: '1 hour', cost: 2000, rating: 4.7, description: 'Soar over Himalayan valleys' },
  { id: 9, name: 'Photography Walk', city: 'Mumbai', type: 'photography', duration: '3 hours', cost: 800, rating: 4.5, description: 'Capture iconic Mumbai landmarks' },
  { id: 10, name: 'Boat Ride', city: 'Udaipur', type: 'sightseeing', duration: '1 hour', cost: 400, rating: 4.6, description: 'Scenic boat ride on Lake Pichola' },
  { id: 11, name: 'Trekking', city: 'Shimla', type: 'adventure', duration: '5 hours', cost: 1000, rating: 4.7, description: 'Trek through pine forests' },
  { id: 12, name: 'Heritage Walk', city: 'Kolkata', type: 'cultural', duration: '3 hours', cost: 500, rating: 4.5, description: 'Walk through colonial heritage' }
];

router.get('/', (req, res) => {
  let result = [...activities];
  const { city, type, maxCost, search } = req.query;
  if (city) result = result.filter(a => a.city.toLowerCase() === city.toLowerCase());
  if (type) result = result.filter(a => a.type === type);
  if (maxCost) result = result.filter(a => a.cost <= parseInt(maxCost));
  if (search) result = result.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
  res.json(result);
});

module.exports = router;
