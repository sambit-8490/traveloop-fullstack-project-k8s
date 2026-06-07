import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Hotel, Calendar, DollarSign, Star, TrendingUp, Package, ArrowRight, Plus, Users, BarChart2 } from 'lucide-react';

export default function HotelOwnerDashboard() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hotels/my-hotels').then(r => setHotels(r.data)).catch(() => setHotels([])).finally(() => setLoading(false));
  }, []);

  const totalHotels = hotels.length;
  const availableHotels = hotels.filter(h => h.isAvailable).length;
  const avgRating = hotels.length ? (hotels.reduce((s, h) => s + (h.rating || 0), 0) / hotels.length).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="gradient-bg rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <span className="badge bg-emerald-400/30 text-white text-xs mb-2 inline-block">Hotel Owner</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-white/70 mt-1">Manage your properties and bookings</p>
            <div className="flex gap-6 mt-4">
              {[['Properties', totalHotels], ['Available', availableHotels], ['Avg Rating', avgRating]].map(([label, val]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-white/60 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <Link to="/hotel-owner/hotels" className="btn-secondary self-start lg:self-center">
            <Plus className="w-5 h-5" /> Add New Hotel
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Properties', value: totalHotels, icon: Hotel, color: 'bg-emerald-600' },
          { label: 'Available Now', value: availableHotels, icon: Calendar, color: 'bg-green-500' },
          { label: 'Avg Rating', value: avgRating, icon: Star, color: 'bg-yellow-500' },
          { label: 'Total Reviews', value: hotels.reduce((s, h) => s + (h.totalReviews || 0), 0), icon: Users, color: 'bg-teal-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card flex items-center gap-3">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/hotel-owner/hotels', icon: Hotel, label: 'My Hotels', desc: 'Manage properties', color: 'bg-emerald-600' },
          { to: '/hotel-owner/bookings', icon: Calendar, label: 'Bookings', desc: 'View reservations', color: 'bg-green-500' },
          { to: '/hotel-owner/packages', icon: Package, label: 'Packages', desc: 'Travel packages', color: 'bg-teal-500' },
          { to: '/hotel-owner/analytics', icon: BarChart2, label: 'Analytics', desc: 'Performance stats', color: 'bg-cyan-600' },
        ].map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to} className="card p-4 flex flex-col items-center text-center gap-2 hover:scale-105 transition-transform">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </Link>
        ))}
      </div>

      {/* My Hotels */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">My Properties</h2>
          <Link to="/hotel-owner/hotels" className="text-green-600 text-sm font-medium flex items-center gap-1">
            Manage all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 animate-pulse bg-green-50 rounded-xl" />)}</div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-8">
            <Hotel className="w-12 h-12 text-green-200 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">No hotels listed yet</p>
            <Link to="/hotel-owner/hotels" className="btn-primary text-sm py-2">Add Your First Hotel</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {hotels.slice(0, 4).map(hotel => (
              <div key={hotel._id} className="flex items-center gap-4 p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {hotel.images?.[0]
                    ? <img src={hotel.images[0]} alt="" className="w-full h-full object-cover" />
                    : <Hotel className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{hotel.name}</p>
                  <p className="text-sm text-gray-500">{hotel.city} • ₹{hotel.pricePerNight?.toLocaleString()}/night</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{hotel.rating || 'New'}
                  </span>
                  <span className={`badge text-xs ${hotel.isAvailable ? 'badge-green' : 'badge-red'}`}>
                    {hotel.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
