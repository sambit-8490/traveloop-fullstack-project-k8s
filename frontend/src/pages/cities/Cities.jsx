import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Search, MapPin, TrendingUp, DollarSign, Plus, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MOODS = ['all', 'adventure', 'relaxation', 'food', 'nature', 'cultural', 'nightlife'];

export default function Cities() {
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState('all');
  const [sort, setSort] = useState('popularity');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (mood !== 'all') params.set('mood', mood);
    if (sort) params.set('sort', sort);
    api.get(`/cities?${params}`).then(r => setCities(r.data)).finally(() => setLoading(false));
  }, [search, mood, sort]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Explore Cities</h1>
        <p className="text-white/70 mt-1">Discover amazing destinations across India</p>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          <input className="input-field pl-10" placeholder="Search cities..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-40" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="popularity">Most Popular</option>
          <option value="cost_low">Lowest Cost</option>
        </select>
      </div>

      {/* Mood Filter */}
      <div className="flex gap-2 flex-wrap">
        {MOODS.map(m => (
          <button key={m} onClick={() => setMood(m)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${mood === m ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            {m === 'all' ? '🌍 All' : m === 'adventure' ? '🏔️ Adventure' : m === 'relaxation' ? '🏖️ Relaxation' : m === 'food' ? '🍜 Food' : m === 'nature' ? '🌿 Nature' : m === 'cultural' ? '🏛️ Cultural' : '🌃 Nightlife'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="card h-64 animate-pulse bg-green-50" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map(city => (
            <div key={city.id} className="card overflow-hidden group">
              <div className="h-44 overflow-hidden relative">
                <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg">{city.name}</h3>
                    <p className="text-white/80 text-sm">{city.country}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-medium">{(city.popularity / 20).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">{city.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Popularity: {city.popularity}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>Cost: {city.costIndex}/100</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {city.mood.map(m => <span key={m} className="badge badge-green text-xs capitalize">{m}</span>)}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  <strong>Top Attractions:</strong> {city.attractions?.slice(0, 2).join(', ')}
                </div>
                {user?.role === 'traveler' && (
                  <Link to="/trips/new" className="btn-primary w-full justify-center text-sm py-2">
                    <Plus className="w-4 h-4" /> Plan Trip Here
                  </Link>
                )}
                {user?.role === 'guide' && (
                  <Link to="/guide/tours" className="btn-secondary w-full justify-center text-sm py-2">
                    Offer Tours Here
                  </Link>
                )}
                {(user?.role === 'hotel_owner' || user?.role === 'admin') && (
                  <Link to={`/hotel-owner/hotels?city=${encodeURIComponent(city.name)}`} className="btn-secondary w-full justify-center text-sm py-2">
                    List Hotel Here
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
