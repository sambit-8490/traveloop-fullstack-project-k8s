const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ======================================================
// ✅ GEMINI CONFIG
// ======================================================

const MODEL_NAME = 'gemini-2.0-flash';

const getGenAI = () => {
  const key = process.env.GEMINI_API_KEY;

  if (!key || key === 'your_gemini_api_key') {
    throw new Error('GEMINI_API_KEY not configured in backend/.env');
  }

  return new GoogleGenerativeAI(key);
};

// ======================================================
// ✅ GENERATE AI RESPONSE
// ======================================================

const generateAIResponse = async (prompt) => {
  try {
    const genAI = getGenAI();

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();

  } catch (err) {

    console.error(
      'FULL GEMINI ERROR:',
      err?.response?.data || err.message || err
    );

    throw err;
  }
};

// ======================================================
// ✅ EXTRACT JSON
// ======================================================

const extractJSON = (text) => {
  try {

    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    // Try JSON object
    const objMatch = cleaned.match(/\{[\s\S]*\}/);

    if (objMatch) {
      return JSON.parse(objMatch[0]);
    }

    // Try JSON array
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);

    if (arrMatch) {
      return JSON.parse(arrMatch[0]);
    }

    return null;

  } catch (err) {
    console.error('JSON Parse Error:', err);
    return null;
  }
};

// ======================================================
// ✅ MOCK FALLBACK DATA
// ======================================================

const generateMockItinerary = ({
  destination,
  days,
  budget,
  mood
}) => {

  const perDay = Math.floor(budget / days);

  const itineraryDays = [];

  for (let i = 1; i <= days; i++) {

    itineraryDays.push({
      day: i,
      city: destination,

      activities: [
        {
          name: `${destination} Local Sightseeing`,
          time: '09:00 AM',
          duration: '3 hours',
          cost: 500,
          description: `Explore famous places in ${destination}`
        },

        {
          name: `${mood} Activity`,
          time: '02:00 PM',
          duration: '2 hours',
          cost: 700,
          description: `Enjoy ${mood} experiences`
        }
      ],

      accommodation: 'Budget Hotel',
      transport: 'Local Taxi',
      dailyCost: perDay
    });
  }

  return {
    days: itineraryDays,

    totalCost: budget,

    tips: [
      'Book hotels early for cheaper prices',
      'Use local transport to save money',
      'Carry reusable water bottles',
      'Visit attractions during morning hours',
      'Try local street food for authentic experience'
    ],

    fallback: true
  };
};

// ======================================================
// ✅ ERROR HANDLER
// ======================================================

const buildErrorResponse = (err) => {

  const msg =
    err?.response?.data?.error?.message ||
    err.message ||
    'Unknown AI error';

  const isKeyError =
    msg.includes('API key') ||
    msg.includes('API_KEY') ||
    msg.includes('not configured');

  const isQuota =
    msg.includes('429');

  return {
    message: isKeyError
      ? 'Gemini API key not configured'
      : isQuota
      ? 'Gemini quota exceeded temporarily'
      : msg,

    isKeyError,
    isQuota,
  };
};

// ======================================================
// ✅ GENERATE ITINERARY
// ======================================================

router.post('/generate-itinerary', protect, async (req, res) => {

  try {

    const {
      destination,
      days,
      budget,
      mood,
      preferences,
    } = req.body;

    // ✅ Smaller prompt = lower quota usage
    const prompt = `
Create a ${days}-day travel itinerary for ${destination}, India.

Budget: ₹${budget}
Mood: ${mood || 'general'}
Preferences: ${preferences || 'none'}

Return ONLY JSON:
{
  "days": [],
  "totalCost": 0,
  "tips": []
}
`;

    const text = await generateAIResponse(prompt);

    const parsed = extractJSON(text);

    if (parsed && parsed.days) {
      return res.json(parsed);
    }

    // fallback raw response
    return res.json({
      raw: text,
    });

  } catch (err) {

    console.error('ITINERARY ERROR:', err);

    // ✅ AUTO FALLBACK IF GEMINI LIMIT EXCEEDED
    if (err.status === 429) {

      const mockData = generateMockItinerary(req.body);

      return res.json(mockData);
    }

    return res
      .status(500)
      .json(buildErrorResponse(err));
  }
});

// ======================================================
// ✅ BUDGET SUGGESTIONS
// ======================================================

router.post('/budget-suggestions', protect, async (req, res) => {

  try {

    const {
      destination,
      budget,
      days,
    } = req.body;

    const prompt = `
Give exactly 5 short budget travel tips for:

Destination: ${destination}
Days: ${days}
Budget: ₹${budget}

Return ONLY JSON array.
`;

    const text = await generateAIResponse(prompt);

    const parsed = extractJSON(text);

    if (Array.isArray(parsed)) {

      return res.json({
        suggestions: parsed,
      });
    }

    // fallback parsing
    const lines = text
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 5);

    return res.json({
      suggestions: lines,
    });

  } catch (err) {

    console.error('BUDGET ERROR:', err);

    // ✅ FALLBACK TIPS IF QUOTA EXCEEDED
    if (err.status === 429) {

      return res.json({
        suggestions: [
          'Use public transport instead of taxis',
          'Book hotels in advance',
          'Travel during weekdays',
          'Eat at local restaurants',
          'Use combo attraction tickets'
        ]
      });
    }

    return res
      .status(500)
      .json(buildErrorResponse(err));
  }
});

module.exports = router;