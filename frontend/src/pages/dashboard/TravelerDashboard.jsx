import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { PlusCircle, MapPin, Calendar, Gem, Users, Compass, ArrowRight, Star, Bot } from 'lucide-react';
import { format } from 'date-fns';

const featuredDestinations = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', tag: 'Beach', rating: 4.8 },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400', tag: 'Adventure', rating: 4.9 },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400', tag: 'Cultural', rating: 4.7 },
  { name: 'Varanasi', image: 'https://images.unsplash.com/photo-1561361058-c24e01238a46?w=400', tag: 'Spiritual', rating: 4.8 },
];

export default function TravelerDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/trips').catch(() => ({ data: [] })),
      api.get('/hidden-gems').catch(() => ({ data: [] }))
    ]).then(([t, g]) => {
      setTrips(t.data.slice(0, 3));
      setGems(g.data.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const upcoming = trips.filter(t => t.status === 'upcoming');
  const ongoing = trips.filter(t => t.status === 'ongoing');

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="gradient-bg rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0]}! 🌍
            </h1>
            <p className="text-white/70 mt-1">Ready to plan your next adventure?</p>
            <div className="flex gap-6 mt-4">
              {[['Total Trips', trips.length], ['Upcoming', upcoming.length], ['Ongoing', ongoing.length]].map(([label, val]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-white/60 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <Link to="/trips/new" className="btn-secondary self-start lg:self-center">
            <PlusCircle className="w-5 h-5" /> Plan New Trip
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/trips/new', icon: PlusCircle, label: 'New Trip', color: 'bg-green-500', desc: 'Start planning' },
          { to: '/cities', icon: Compass, label: 'Explore', color: 'bg-emerald-500', desc: 'Discover cities' },
          { to: '/hidden-gems', icon: Gem, label: 'Hidden Gems', color: 'bg-teal-500', desc: 'Secret spots' },
          { to: '/ai-assistant', icon: Bot, label: 'AI Assistant', color: 'bg-cyan-600', desc: 'Smart planning' },
        ].map(({ to, icon: Icon, label, color, desc }) => (
          <Link key={to} to={to} className="card p-4 flex flex-col items-center text-center gap-2 hover:scale-105 transition-transform">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Trips */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">My Trips</h2>
            <Link to="/trips" className="text-green-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card p-4 h-20 animate-pulse bg-green-50" />)}</div>
          ) : trips.length === 0 ? (
            <div className="card p-8 text-center">
              <MapPin className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No trips yet. Start planning!</p>
              <Link to="/trips/new" className="btn-primary">Create First Trip</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map(trip => (
                <Link key={trip._id} to={`/trips/${trip._id}`} className="card p-4 flex items-center gap-4 block">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-green-100 flex-shrink-0">
                    {trip.coverImage
                      ? <img src={trip.coverImage} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><MapPin className="w-6 h-6 text-green-400" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{trip.title}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className={`badge ${trip.status === 'upcoming' ? 'badge-green' : trip.status === 'ongoing' ? 'badge-blue' : 'badge-yellow'}`}>
                    {trip.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Hidden Gems */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Hidden Gems</h2>
            <Link to="/hidden-gems" className="text-green-600 text-sm font-medium flex items-center gap-1">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {gems.length === 0 ? (
              <div className="card p-6 text-center">
                <Gem className="w-10 h-10 text-green-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No gems yet</p>
              </div>
            ) : gems.map(gem => (
              <div key={gem._id} className="card p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-green-100 flex-shrink-0">
                  {gem.images?.[0]
                    ? <img src={gem.images[0]} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Gem className="w-5 h-5 text-green-400" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{gem.title}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{gem.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Featured Destinations</h2>
          <Link to="/cities" className="text-green-600 text-sm font-medium flex items-center gap-1">
            Explore all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredDestinations.map(dest => (
            <Link key={dest.name} to={`/cities?search=${dest.name}`} className="card overflow-hidden group">
              <div className="h-32 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-800">{dest.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="badge badge-green text-xs">{dest.tag}</span>
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{dest.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
