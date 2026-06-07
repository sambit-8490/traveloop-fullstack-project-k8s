const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Trip = require('./models/Trip');
const HiddenGem = require('./models/HiddenGem');
const Hotel = require('./models/Hotel');
const Guide = require('./models/Guide');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Trip.deleteMany(), HiddenGem.deleteMany(), Hotel.deleteMany(), Guide.deleteMany()]);
    console.log('Cleared existing data');

    // Create users
    const adminUser = await User.create({ name: 'Admin User', email: 'admin@traveloop.com', password: 'admin123', role: 'admin', isVerified: true });
    const traveler = await User.create({ name: 'Priya Sharma', email: 'user@traveloop.com', password: 'user123', role: 'traveler', isVerified: true, bio: 'Passionate traveler exploring India' });
    const guideUser = await User.create({ name: 'Ravi Kumar', email: 'guide@traveloop.com', password: 'guide123', role: 'guide', isVerified: true });
    const hotelOwner = await User.create({ name: 'Suresh Patel', email: 'hotel@traveloop.com', password: 'hotel123', role: 'hotel_owner', isVerified: true });
    console.log('Users created');

    // Create trips
    await Trip.create([
      { user: traveler._id, title: 'Goa Beach Vacation', description: 'Sun, sand and seafood!', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-25'), destinations: ['Goa'], budget: 25000, status: 'upcoming', isPublic: true, tags: ['beach', 'relaxation'] },
      { user: traveler._id, title: 'Rajasthan Heritage Tour', description: 'Exploring the royal heritage of Rajasthan', startDate: new Date('2024-11-01'), endDate: new Date('2024-11-08'), destinations: ['Jaipur', 'Udaipur', 'Jodhpur'], budget: 40000, status: 'completed', isPublic: true, tags: ['cultural', 'heritage'] },
      { user: traveler._id, title: 'Manali Adventure', description: 'Snow, trekking and adventure sports', startDate: new Date('2025-01-15'), endDate: new Date('2025-01-20'), destinations: ['Manali'], budget: 30000, status: 'upcoming', tags: ['adventure', 'mountains'] }
    ]);
    console.log('Trips created');

    // Create hidden gems
    await HiddenGem.create([
      { user: traveler._id, title: 'Secret Waterfall Trail', description: 'A hidden waterfall 3km from Manali town, rarely visited by tourists. Crystal clear water and stunning views.', location: 'Near Old Manali', city: 'Manali', category: 'nature', likes: 24, tags: ['waterfall', 'trekking', 'hidden'] },
      { user: guideUser._id, title: 'Rooftop Chai Stall', description: 'Best masala chai in Varanasi with a stunning view of the ghats. Only locals know about this place.', location: 'Near Assi Ghat', city: 'Varanasi', category: 'food', likes: 47, tags: ['chai', 'rooftop', 'ghats'] },
      { user: traveler._id, title: 'Sunrise Photography Spot', description: 'Perfect spot to capture the Taj Mahal at sunrise without the crowds. Arrive by 5:30 AM.', location: 'Mehtab Bagh', city: 'Agra', category: 'viewpoint', likes: 89, tags: ['photography', 'sunrise', 'tajmahal'] },
      { user: guideUser._id, title: 'Underground Spice Market', description: 'Authentic spice market hidden in the lanes of Old Delhi. Best prices and freshest spices in the city.', location: 'Khari Baoli, Old Delhi', city: 'Delhi', category: 'cultural', likes: 33, tags: ['spices', 'market', 'authentic'] }
    ]);
    console.log('Hidden gems created');

    // Create hotels
    await Hotel.create([
      { owner: hotelOwner._id, name: 'Green Valley Resort', description: 'Luxury resort surrounded by lush greenery with mountain views', location: 'Old Manali Road', city: 'Manali', pricePerNight: 3500, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Parking'], rating: 4.7, totalReviews: 128, isAvailable: true },
      { owner: hotelOwner._id, name: 'Beachside Haven', description: 'Cozy beach resort with direct beach access and water sports', location: 'Calangute Beach Road', city: 'Goa', pricePerNight: 4200, amenities: ['WiFi', 'Beach Access', 'Water Sports', 'Bar', 'Restaurant'], rating: 4.5, totalReviews: 256, isAvailable: true },
      { owner: hotelOwner._id, name: 'Heritage Palace Hotel', description: 'Experience royal Rajasthani hospitality in a heritage property', location: 'City Palace Road', city: 'Jaipur', pricePerNight: 5500, amenities: ['WiFi', 'Pool', 'Heritage Tours', 'Restaurant', 'Spa'], rating: 4.8, totalReviews: 89, isAvailable: true }
    ]);
    console.log('Hotels created');

    // Create guide profile
    await Guide.create({
      user: guideUser._id, location: 'Varanasi', specialization: ['Spiritual Tours', 'Heritage Walks', 'Food Tours'],
      languages: ['English', 'Hindi', 'Bengali'], experience: 8, pricePerDay: 2500,
      bio: 'Born and raised in Varanasi, I offer authentic spiritual and cultural experiences. Expert in Ganga Aarti ceremonies and hidden temple tours.',
      isApproved: true, rating: 4.9, totalReviews: 156, availability: true
    });
    console.log('Guide created');

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📧 Demo Accounts:');
    console.log('Admin:       admin@traveloop.com / admin123');
    console.log('Traveler:    user@traveloop.com / user123');
    console.log('Guide:       guide@traveloop.com / guide123');
    console.log('Hotel Owner: hotel@traveloop.com / hotel123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
