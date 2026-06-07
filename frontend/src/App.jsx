import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Landing
import LandingPage from './pages/LandingPage';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard (role-aware)
import Dashboard from './pages/dashboard/Dashboard';

// Traveler
import MyTrips from './pages/trips/MyTrips';
import CreateTrip from './pages/trips/CreateTrip';
import TripDetail from './pages/trips/TripDetail';
import EditTrip from './pages/trips/EditTrip';
import ItineraryBuilder from './pages/itinerary/ItineraryBuilder';
import Budget from './pages/budget/Budget';
import Checklist from './pages/checklist/Checklist';
import Journal from './pages/journal/Journal';
import Cities from './pages/cities/Cities';
import HiddenGems from './pages/hiddenGems/HiddenGems';
import Guides from './pages/guides/Guides';
import Hotels from './pages/hotels/Hotels';
import AIAssistant from './pages/AIAssistant';

// Guide
import GuideProfile from './pages/guide/GuideProfile';
import GuideBookings from './pages/guide/GuideBookings';
import GuideTours from './pages/guide/GuideTours';
import GuideEarnings from './pages/guide/GuideEarnings';

// Hotel Owner
import HotelOwnerHotels from './pages/hotelOwner/HotelOwnerHotels';
import HotelOwnerBookings from './pages/hotelOwner/HotelOwnerBookings';
import HotelOwnerPackages from './pages/hotelOwner/HotelOwnerPackages';
import HotelOwnerAnalytics from './pages/hotelOwner/HotelOwnerAnalytics';

// Shared
import Profile from './pages/profile/Profile';
import Admin from './pages/admin/Admin';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const LandingRoute = ({ children }) => {
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute><LandingPage /></LandingRoute>} />

      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Shared — read-only browse pages */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/cities" element={<ProtectedRoute><Cities /></ProtectedRoute>} />
      <Route path="/hidden-gems" element={<ProtectedRoute><HiddenGems /></ProtectedRoute>} />

      {/* Traveler-only routes */}
      <Route path="/guides" element={<ProtectedRoute roles={['traveler']}><Guides /></ProtectedRoute>} />
      <Route path="/hotels" element={<ProtectedRoute roles={['traveler']}><Hotels /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute roles={['traveler']}><MyTrips /></ProtectedRoute>} />
      <Route path="/trips/new" element={<ProtectedRoute roles={['traveler']}><CreateTrip /></ProtectedRoute>} />
      <Route path="/trips/:id" element={<ProtectedRoute roles={['traveler']}><TripDetail /></ProtectedRoute>} />
      <Route path="/trips/:id/edit" element={<ProtectedRoute roles={['traveler']}><EditTrip /></ProtectedRoute>} />
      <Route path="/trips/:id/itinerary" element={<ProtectedRoute roles={['traveler']}><ItineraryBuilder /></ProtectedRoute>} />
      <Route path="/trips/:id/budget" element={<ProtectedRoute roles={['traveler']}><Budget /></ProtectedRoute>} />
      <Route path="/trips/:id/checklist" element={<ProtectedRoute roles={['traveler']}><Checklist /></ProtectedRoute>} />
      <Route path="/trips/:id/journal" element={<ProtectedRoute roles={['traveler']}><Journal /></ProtectedRoute>} />
      <Route path="/ai-assistant" element={<ProtectedRoute roles={['traveler']}><AIAssistant /></ProtectedRoute>} />

      {/* Guide routes */}
      <Route path="/guide/profile" element={<ProtectedRoute roles={['guide']}><GuideProfile /></ProtectedRoute>} />
      <Route path="/guide/bookings" element={<ProtectedRoute roles={['guide']}><GuideBookings /></ProtectedRoute>} />
      <Route path="/guide/tours" element={<ProtectedRoute roles={['guide']}><GuideTours /></ProtectedRoute>} />
      <Route path="/guide/earnings" element={<ProtectedRoute roles={['guide']}><GuideEarnings /></ProtectedRoute>} />

      {/* Hotel Owner routes */}
      <Route path="/hotel-owner/hotels" element={<ProtectedRoute roles={['hotel_owner', 'admin']}><HotelOwnerHotels /></ProtectedRoute>} />
      <Route path="/hotel-owner/bookings" element={<ProtectedRoute roles={['hotel_owner', 'admin']}><HotelOwnerBookings /></ProtectedRoute>} />
      <Route path="/hotel-owner/packages" element={<ProtectedRoute roles={['hotel_owner', 'admin']}><HotelOwnerPackages /></ProtectedRoute>} />
      <Route path="/hotel-owner/analytics" element={<ProtectedRoute roles={['hotel_owner', 'admin']}><HotelOwnerAnalytics /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
      <Route path="/admin/guides" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
      <Route path="/admin/hotels" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' },
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
          error: { style: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' } }
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
