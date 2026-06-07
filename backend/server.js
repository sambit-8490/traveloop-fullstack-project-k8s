const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/itinerary', require('./routes/itinerary'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/checklist', require('./routes/checklist'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/hidden-gems', require('./routes/hiddenGems'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/group', require('./routes/group'));
app.use('/api/guide', require('./routes/guideRoutes'));

app.get('/', (req, res) => res.json({ message: 'Traveloop API Running' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));
