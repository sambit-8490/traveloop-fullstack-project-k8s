import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Map, PlusCircle, Briefcase, DollarSign, CheckSquare,
  Users, Hotel, Gem, BookOpen, Settings, LogOut, Menu, X,
  Shield, Compass, Bot, Globe, Star, Package, Calendar,
  BarChart2, UserCheck, ClipboardList, Layers
} from 'lucide-react';

const travelerNav = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/trips', icon: Briefcase, label: 'My Trips' },
  { path: '/cities', icon: Compass, label: 'Explore Cities' },
  { path: '/hotels', icon: Hotel, label: 'Browse Hotels' },
  { path: '/guides', icon: Users, label: 'Find Guides' },
  { path: '/hidden-gems', icon: Gem, label: 'Hidden Gems' },
  { path: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { path: '/profile', icon: Settings, label: 'Profile' },
];

const guideNav = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/guide/profile', icon: UserCheck, label: 'My Guide Profile' },
  { path: '/guide/tours', icon: Map, label: 'My Tours' },
  { path: '/guide/bookings', icon: Calendar, label: 'Booking Requests' },
  { path: '/guide/earnings', icon: DollarSign, label: 'Earnings' },
  { path: '/cities', icon: Compass, label: 'Explore Cities' },
  { path: '/hidden-gems', icon: Gem, label: 'Hidden Gems' },
  { path: '/profile', icon: Settings, label: 'Settings' },
];

const hotelOwnerNav = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/hotel-owner/hotels', icon: Hotel, label: 'My Hotels' },
  { path: '/hotel-owner/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/hotel-owner/packages', icon: Package, label: 'Packages' },
  { path: '/hotel-owner/analytics', icon: BarChart2, label: 'Analytics' },
  { path: '/cities', icon: Compass, label: 'Explore Cities' },
  { path: '/profile', icon: Settings, label: 'Settings' },
];

const adminNav = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/admin', icon: Shield, label: 'Admin Panel' },
  { path: '/admin/users', icon: Users, label: 'User Management' },
  { path: '/admin/guides', icon: UserCheck, label: 'Guide Approvals' },
  { path: '/admin/hotels', icon: Hotel, label: 'Hotel Management' },
  { path: '/admin/reports', icon: ClipboardList, label: 'Reports' },
  { path: '/cities', icon: Compass, label: 'Cities' },
  { path: '/hidden-gems', icon: Gem, label: 'Hidden Gems' },
  { path: '/profile', icon: Settings, label: 'Settings' },
];

const roleNavMap = {
  traveler: travelerNav,
  guide: guideNav,
  hotel_owner: hotelOwnerNav,
  admin: adminNav,
};

const roleColors = {
  traveler: 'bg-green-500',
  guide: 'bg-teal-500',
  hotel_owner: 'bg-emerald-600',
  admin: 'bg-green-800',
};

const roleLabels = {
  traveler: 'Traveler',
  guide: 'Local Guide',
  hotel_owner: 'Hotel Owner',
  admin: 'Admin',
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const navItems = roleNavMap[user?.role] || travelerNav;

  const isActive = (path) =>
    location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path + '/'));

  return (
    <div className="flex h-screen bg-[#f0fdf4] overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col gradient-bg shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Traveloop</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.avatar
                  ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  : <span className="text-white font-bold">{user?.name?.[0]?.toUpperCase()}</span>}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                <span className={`text-xs px-2 py-0.5 ${roleColors[user?.role] || 'bg-white/20'} text-white rounded-full`}>
                  {roleLabels[user?.role] || user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(path) ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white text-sm font-medium transition-all">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-green-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-green-50 text-green-700">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-medium">Traveloop</span>
            <span>/</span>
            <span className="capitalize">{location.pathname.split('/')[1] || 'dashboard'}</span>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'traveler' && (
              <Link to="/trips/new" className="btn-primary text-sm py-2 px-4">
                <PlusCircle className="w-4 h-4" /> New Trip
              </Link>
            )}
            {user?.role === 'guide' && (
              <Link to="/guide/tours" className="btn-primary text-sm py-2 px-4">
                <Map className="w-4 h-4" /> Manage Tours
              </Link>
            )}
            {user?.role === 'hotel_owner' && (
              <Link to="/hotel-owner/hotels" className="btn-primary text-sm py-2 px-4">
                <Hotel className="w-4 h-4" /> My Hotels
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="btn-primary text-sm py-2 px-4">
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
