# 🚀 Traveloop — Setup & Run Guide

## Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

---

## ⚡ Quick Start

### 1. Configure Backend Environment
Edit `backend/.env` and fill in your credentials:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=traveloop_jwt_secret_key_2024
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

> MongoDB runs locally — make sure MongoDB is installed and running on your machine.
> Start it with: `mongod` (or it may already run as a Windows service)

### 2. Get Required API Keys

| Service | URL | Free Tier |
|---------|-----|-----------|
| Cloudinary | https://cloudinary.com | 25GB free |
| Gemini API | https://makersuite.google.com/app/apikey | Free |

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Seed Demo Data

```bash
cd backend
node seed.js
```

This creates demo accounts:
- **Admin:** admin@traveloop.com / admin123
- **Traveler:** user@traveloop.com / user123
- **Guide:** guide@traveloop.com / guide123
- **Hotel Owner:** hotel@traveloop.com / hotel123

### 5. Run the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 6. Open in Browser
Navigate to: **http://localhost:5173**

---

## 📁 Project Structure

```
traveloop/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/       # Auth & upload
│   ├── server.js        # Express server
│   ├── seed.js          # Demo data seeder
│   └── .env             # Environment variables
└── frontend/
    └── src/
        ├── pages/       # All page components
        ├── components/  # Reusable components
        ├── context/     # Auth context
        └── utils/       # API utility
```

---

## 🌟 Features Implemented

✅ Authentication (Login/Register/Forgot Password/JWT)  
✅ Dashboard with stats & featured destinations  
✅ Create/Edit/Delete/Duplicate Trips  
✅ Itinerary Builder (day-wise with AI generation)  
✅ Budget Tracker with pie charts  
✅ Packing Checklist with categories  
✅ City Explorer with mood filters  
✅ Hidden Gems (share & like)  
✅ Local Guides directory  
✅ Hotels management  
✅ Travel Journal & Reminders  
✅ AI Trip Assistant (Gemini API)  
✅ Group Trip Collaboration  
✅ Admin Dashboard with analytics  
✅ User Profile & Settings  
✅ Role-based access (Traveler/Guide/Hotel Owner/Admin)  
✅ Green Mist UI theme  
✅ Fully responsive design  
