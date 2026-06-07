import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { UserCheck, Calendar, DollarSign, Star, MapPin, ArrowRight, CheckCircle, Clock, XCircle, Map, TrendingUp } from 'lucide-react';

export default function GuideDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/guides/my-profile').then(r => setProfile(r.data)).catch(() => {});
    api.get('/guide/bookings').then(r => setBookings(r.data)).catch(() => setBookings([]));
    setLoading(false);
  }, []);

  const totalEarnings = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.amount || 0), 0);
  const pending = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="gradient-bg rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge bg-teal-400/30 text-white text-xs">Local Guide</span>
              {profile?.isApproved && <span className="badge bg-green-400/30 text-white text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>}
              {!profile?.isApproved && profile && <span className="badge bg-yellow-400/30 text-white text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Approval</span>}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-white/70 mt-1">{profile ? profile.location : 'Complete your guide profile to get started'}</p>
            <div className="flex gap-6 mt-4">
              {[['Bookings', bookings.length], ['Pending', pending], ['Earnings', `₹${totalEarnings.toLocaleString()}`]].map(([label, val]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-white/60 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <Link to="/guide/profile" className="btn-secondary self-start lg:self-center">
            <UserCheck className="w-5 h-5" /> {profile ? 'Edit Profile' : 'Setup Profile'}
          </Link>
        </div>
      </div>

      {/* Profile incomplete warning */}
      {!profile && (
        <div className="card p-5 border-l-4 border-yellow-400 bg-yellow-50">
          <p className="font-semibold text-yellow-800">⚠️ Complete your guide profile</p>
          <p className="text-sm text-yellow-700 mt-1">Set up your guide profile to start receiving booking requests from travelers.</p>
          <Link to="/guide/profile" className="btn-primary mt-3 text-sm py-2 inline-flex">Setup Now</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'bg-teal-500' },
          { label: 'Pending Requests', value: pending, icon: Clock, color: 'bg-yellow-500' },
          { label: 'Confirmed Tours', value: confirmed, icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-600' },
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
          { to: '/guide/profile', icon: UserCheck, label: 'My Profile', desc: 'Manage guide info', color: 'bg-teal-500' },
          { to: '/guide/bookings', icon: Calendar, label: 'Bookings', desc: 'View requests', color: 'bg-green-500' },
          { to: '/guide/tours', icon: Map, label: 'My Tours', desc: 'Manage tours', color: 'bg-emerald-500' },
          { to: '/guide/earnings', icon: TrendingUp, label: 'Earnings', desc: 'Track income', color: 'bg-cyan-600' },
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

      {/* Recent Bookings */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Booking Requests</h2>
          <Link to="/guide/bookings" className="text-green-600 text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-green-200 mx-auto mb-3" />
            <p className="text-gray-500">No booking requests yet</p>
            <p className="text-sm text-gray-400 mt-1">Complete your profile to attract travelers</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map(b => (
              <div key={b._id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{b.travelerName || 'Traveler'}</p>
                  <p className="text-xs text-gray-500">{b.date} • {b.duration}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-700 text-sm">₹{b.amount?.toLocaleString()}</span>
                  <span className={`badge text-xs ${b.status === 'confirmed' ? 'badge-green' : b.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guide Profile Preview */}
      {profile && (
        <div className="card p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Your Public Profile</h2>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800">{user?.name}</h3>
                {profile.isApproved && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3 text-green-500" />{profile.location}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.specialization?.map(s => <span key={s} className="badge badge-green text-xs">{s}</span>)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{profile.rating || 'New'}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-green-500" />₹{profile.pricePerDay}/day</span>
                <span>{profile.experience} yrs experience</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
