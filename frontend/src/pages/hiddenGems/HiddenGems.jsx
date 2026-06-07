import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Heart, MapPin, Search, Filter, Gem } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'viewpoint', 'food', 'cultural', 'nature', 'adventure', 'other'];

export default function HiddenGems() {
  const { user } = useAuth();
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', city: '', category: 'viewpoint', tags: '' });

  useEffect(() => {
    const params = category !== 'all' ? `?category=${category}` : '';
    api.get(`/hidden-gems${params}`).then(r => setGems(r.data)).finally(() => setLoading(false));
  }, [category]);

  const likeGem = async (id) => {
    try {
      const { data } = await api.post(`/hidden-gems/${id}/like`);
      setGems(gems.map(g => g._id === id ? data : g));
    } catch { toast.error('Failed to like'); }
  };

  const submitGem = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/hidden-gems', { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
      setGems([data, ...gems]);
      setShowForm(false);
      setForm({ title: '', description: '', location: '', city: '', category: 'viewpoint', tags: '' });
      toast.success('Hidden gem shared!');
    } catch { toast.error('Failed to share gem'); }
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Hidden Gems</h1>
          <p className="text-white/70 mt-1">Discover secret spots shared by locals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-secondary self-start">
          <Plus className="w-5 h-5" /> Share a Gem
        </button>
      </div>

      {/* Share Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4">Share a Hidden Gem</h3>
          <form onSubmit={submitGem} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input-field" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input className="input-field" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
            </div>
            <input className="input-field" placeholder="Exact location/address" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            <textarea className="input-field resize-none" rows={3} placeholder="Describe this hidden gem..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            <div className="grid sm:grid-cols-2 gap-3">
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
              <input className="input-field" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center">Share Gem</button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${category === cat ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            {cat === 'all' ? '✨ All' : cat === 'viewpoint' ? '🔭 Viewpoint' : cat === 'food' ? '🍜 Food' : cat === 'cultural' ? '🏛️ Cultural' : cat === 'nature' ? '🌿 Nature' : cat === 'adventure' ? '🏔️ Adventure' : '📦 Other'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-48 animate-pulse bg-green-50" />)}
        </div>
      ) : gems.length === 0 ? (
        <div className="card p-12 text-center">
          <Gem className="w-16 h-16 text-green-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No hidden gems yet</h3>
          <p className="text-gray-500 mb-4">Be the first to share a secret spot!</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Share First Gem</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gems.map(gem => (
            <div key={gem._id} className="card overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-green-400 to-teal-600 relative overflow-hidden">
                {gem.images?.[0] ? (
                  <img src={gem.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gem className="w-12 h-12 text-white/50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="badge badge-green capitalize">{gem.category}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">{gem.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-green-500" />{gem.city} • {gem.location}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{gem.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                      {gem.user?.name?.[0]?.toUpperCase()}
                    </div>
                    {gem.user?.name}
                  </div>
                  <button onClick={() => likeGem(gem._id)}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${gem.likedBy?.includes(user?._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                    <Heart className={`w-4 h-4 ${gem.likedBy?.includes(user?._id) ? 'fill-red-500' : ''}`} />
                    {gem.likes}
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
