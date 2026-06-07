import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Calendar, MapPin, DollarSign, Users, Edit, Trash2, Map, CheckSquare, BookOpen, Share2, UserPlus, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    api.get(`/trips/${id}`).then(r => setTrip(r.data)).catch(() => toast.error('Trip not found')).finally(() => setLoading(false));
  }, [id]);

  const deleteTrip = async () => {
    if (!confirm('Delete this trip permanently?')) return;
    await api.delete(`/trips/${id}`);
    toast.success('Trip deleted');
    navigate('/trips');
  };

  const inviteCollaborator = async () => {
    try {
      const { data } = await api.post(`/group/${id}/invite`, { email: inviteEmail });
      setTrip(data);
      setInviteEmail('');
      setShowInvite(false);
      toast.success('Collaborator invited!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to invite'); }
  };

  const removeCollaborator = async (userId) => {
    try {
      const { data } = await api.delete(`/group/${id}/remove/${userId}`);
      setTrip(data);
      toast.success('Removed');
    } catch { toast.error('Failed to remove'); }
  };

  const shareTrip = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!trip) return <div className="card p-8 text-center"><p className="text-gray-500">Trip not found</p></div>;

  const days = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-700 relative">
          {trip.coverImage && <img src={trip.coverImage} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{trip.title}</h1>
              <p className="text-white/80 text-sm mt-1">{trip.description}</p>
            </div>
            <span className={`badge ${trip.status === 'upcoming' ? 'badge-green' : trip.status === 'ongoing' ? 'badge-blue' : 'badge-yellow'}`}>
              {trip.status}
            </span>
          </div>
        </div>
        <div className="p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-green-500" />
              {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-green-500" />{days} days</span>
            {trip.budget > 0 && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-green-500" />₹{trip.budget.toLocaleString()}</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={shareTrip} className="p-2 rounded-xl border border-green-200 text-green-600 hover:bg-green-50"><Share2 className="w-4 h-4" /></button>
            <Link to={`/trips/${id}/edit`} className="p-2 rounded-xl border border-green-200 text-green-600 hover:bg-green-50"><Edit className="w-4 h-4" /></Link>
            <button onClick={deleteTrip} className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: `/trips/${id}/itinerary`, icon: Map, label: 'Itinerary', color: 'bg-green-500' },
          { to: `/trips/${id}/budget`, icon: DollarSign, label: 'Budget', color: 'bg-emerald-500' },
          { to: `/trips/${id}/checklist`, icon: CheckSquare, label: 'Checklist', color: 'bg-teal-500' },
          { to: `/trips/${id}/journal`, icon: BookOpen, label: 'Journal', color: 'bg-cyan-500' },
        ].map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to} className="card p-4 flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* Tags */}
      {trip.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {trip.tags.map(tag => <span key={tag} className="badge badge-green">#{tag}</span>)}
        </div>
      )}

      {/* Collaborators */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Users className="w-5 h-5 text-green-500" />Collaborators</h3>
          <button onClick={() => setShowInvite(!showInvite)} className="btn-primary text-sm py-1.5 px-3">
            <UserPlus className="w-4 h-4" /> Invite
          </button>
        </div>
        {showInvite && (
          <div className="flex gap-2 mb-4">
            <input className="input-field flex-1" type="email" placeholder="Enter email to invite"
              value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            <button onClick={inviteCollaborator} className="btn-primary px-4">Send</button>
          </div>
        )}
        {trip.collaborators?.length === 0 ? (
          <p className="text-gray-500 text-sm">No collaborators yet. Invite friends to plan together!</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {trip.collaborators.map(c => (
              <div key={c._id} className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-sm">
                  {c.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </div>
                <button onClick={() => removeCollaborator(c._id)} className="text-red-400 hover:text-red-600 ml-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
