import { useState } from 'react';
import { Map, Plus, Edit, Trash2, Clock, DollarSign, Users, Star, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_TOURS = [
  { _id: '1', name: 'Varanasi Sunrise Ganga Aarti', description: 'Experience the magical sunrise Ganga Aarti ceremony at the ghats with a local guide', duration: '3 hours', price: 1500, maxGroup: 8, category: 'spiritual', rating: 4.9, bookings: 45, active: true },
  { _id: '2', name: 'Old City Heritage Walk', description: 'Explore the narrow lanes of Varanasi old city, temples, and local markets', duration: '4 hours', price: 2000, maxGroup: 6, category: 'heritage', rating: 4.7, bookings: 32, active: true },
  { _id: '3', name: 'Varanasi Food Trail', description: 'Taste authentic Banarasi street food — chaat, lassi, kachori and more', duration: '3 hours', price: 1800, maxGroup: 10, category: 'food', rating: 4.8, bookings: 28, active: false },
];

export default function GuideTours() {
  const [tours, setTours] = useState(INITIAL_TOURS);
  const [showForm, setShowForm] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', duration: '', price: '', maxGroup: '', category: 'sightseeing' });

  const CATEGORIES = ['sightseeing', 'heritage', 'food', 'adventure', 'spiritual', 'photography', 'nature'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTour) {
      setTours(tours.map(t => t._id === editTour._id ? { ...t, ...form, price: Number(form.price), maxGroup: Number(form.maxGroup) } : t));
      toast.success('Tour updated!');
    } else {
      setTours([...tours, { ...form, _id: Date.now().toString(), price: Number(form.price), maxGroup: Number(form.maxGroup), rating: 0, bookings: 0, active: true }]);
      toast.success('Tour created!');
    }
    setShowForm(false);
    setEditTour(null);
    setForm({ name: '', description: '', duration: '', price: '', maxGroup: '', category: 'sightseeing' });
  };

  const deleteTour = (id) => {
    setTours(tours.filter(t => t._id !== id));
    toast.success('Tour deleted');
  };

  const toggleActive = (id) => {
    setTours(tours.map(t => t._id === id ? { ...t, active: !t.active } : t));
  };

  const startEdit = (tour) => {
    setEditTour(tour);
    setForm({ name: tour.name, description: tour.description, duration: tour.duration, price: tour.price, maxGroup: tour.maxGroup, category: tour.category });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3"><Map className="w-7 h-7" />My Tours</h1>
          <p className="text-white/70 mt-1">Create and manage your tour offerings</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditTour(null); setForm({ name: '', description: '', duration: '', price: '', maxGroup: '', category: 'sightseeing' }); }}
          className="btn-secondary self-start">
          <Plus className="w-5 h-5" /> Create Tour
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Tours', value: tours.length, color: 'bg-teal-500' },
          { label: 'Active', value: tours.filter(t => t.active).length, color: 'bg-green-500' },
          { label: 'Total Bookings', value: tours.reduce((s, t) => s + t.bookings, 0), color: 'bg-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card text-center">
            <p className={`text-2xl font-bold text-gray-800`}>{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4">{editTour ? 'Edit Tour' : 'Create New Tour'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input-field" placeholder="Tour name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <textarea className="input-field resize-none" rows={3} placeholder="Tour description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            <div className="grid sm:grid-cols-4 gap-3">
              <input className="input-field" placeholder="Duration (e.g. 3 hours)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required />
              <input className="input-field" type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              <input className="input-field" type="number" placeholder="Max group size" value={form.maxGroup} onChange={e => setForm({ ...form, maxGroup: e.target.value })} />
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditTour(null); }} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center">{editTour ? 'Update Tour' : 'Create Tour'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Tours List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.map(tour => (
          <div key={tour._id} className={`card overflow-hidden ${!tour.active ? 'opacity-70' : ''}`}>
            <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-800 flex-1 pr-2">{tour.name}</h3>
                <span className={`badge text-xs flex-shrink-0 ${tour.active ? 'badge-green' : 'badge-yellow'}`}>
                  {tour.active ? 'Active' : 'Paused'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tour.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-green-500" />{tour.duration}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-green-500" />₹{tour.price}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3 text-green-500" />Max {tour.maxGroup}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{tour.rating || 'New'}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-green capitalize text-xs">{tour.category}</span>
                <span className="text-xs text-gray-500">{tour.bookings} bookings</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(tour._id)}
                  className={`flex-1 text-sm py-1.5 rounded-xl font-medium border transition-colors ${tour.active ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                  {tour.active ? 'Pause' : 'Activate'}
                </button>
                <button onClick={() => startEdit(tour)} className="p-1.5 rounded-xl border border-green-200 text-green-600 hover:bg-green-50">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => deleteTour(tour._id)} className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
