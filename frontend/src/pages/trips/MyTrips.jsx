import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { PlusCircle, MapPin, Calendar, Edit, Trash2, Eye, Copy, Users } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/trips').then(r => setTrips(r.data)).catch(() => toast.error('Failed to load trips')).finally(() => setLoading(false));
  }, []);

  const deleteTrip = async (id) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t._id !== id));
      toast.success('Trip deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const duplicateTrip = async (id) => {
    try {
      const { data } = await api.post(`/trips/${id}/duplicate`);
      setTrips([data, ...trips]);
      toast.success('Trip duplicated!');
    } catch { toast.error('Failed to duplicate'); }
  };

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Trips</h1>
          <p className="text-white/70 mt-1">{trips.length} trips planned</p>
        </div>
        <Link to="/trips/new" className="btn-secondary self-start">
          <PlusCircle className="w-5 h-5" /> New Trip
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-64 animate-pulse bg-green-50" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-16 h-16 text-green-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No trips found</h3>
          <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
          <Link to="/trips/new" className="btn-primary">Create Your First Trip</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(trip => (
            <div key={trip._id} className="card overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
                {trip.coverImage ? (
                  <img src={trip.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-white/50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`badge ${trip.status === 'upcoming' ? 'badge-green' : trip.status === 'ongoing' ? 'badge-blue' : 'badge-yellow'}`}>
                    {trip.status}
                  </span>
                </div>
                {trip.isPublic && (
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-purple">Public</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg truncate">{trip.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{trip.description || 'No description'}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-green-500" />
                    {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d')}
                  </span>
                  {trip.collaborators?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-green-500" />
                      {trip.collaborators.length}
                    </span>
                  )}
                </div>
                {trip.budget > 0 && (
                  <div className="mt-2 text-sm font-medium text-green-700">
                    Budget: ₹{trip.budget.toLocaleString()}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Link to={`/trips/${trip._id}`} className="flex-1 btn-primary text-sm py-2 justify-center">
                    <Eye className="w-4 h-4" /> View
                  </Link>
                  <Link to={`/trips/${trip._id}/edit`} className="p-2 rounded-xl border border-green-200 text-green-600 hover:bg-green-50 transition-colors">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => duplicateTrip(trip._id)} className="p-2 rounded-xl border border-green-200 text-green-600 hover:bg-green-50 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTrip(trip._id)} className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
