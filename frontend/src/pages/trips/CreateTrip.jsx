import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { MapPin, Calendar, DollarSign, FileText, Image, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', startDate: '', endDate: '',
    budget: '', isPublic: false, tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return toast.error('End date must be after start date');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/trips', {
        ...form,
        budget: Number(form.budget) || 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      toast.success('Trip created!');
      navigate(`/trips/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Create New Trip</h1>
        <p className="text-white/70 mt-1">Plan your perfect adventure</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <MapPin className="inline w-4 h-4 text-green-500 mr-1" />Trip Title *
            </label>
            <input className="input-field" placeholder="e.g. Goa Beach Vacation 2024" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <FileText className="inline w-4 h-4 text-green-500 mr-1" />Description
            </label>
            <textarea className="input-field resize-none" rows={3} placeholder="Describe your trip..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Calendar className="inline w-4 h-4 text-green-500 mr-1" />Start Date *
              </label>
              <input className="input-field" type="date" value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Calendar className="inline w-4 h-4 text-green-500 mr-1" />End Date *
              </label>
              <input className="input-field" type="date" value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <DollarSign className="inline w-4 h-4 text-green-500 mr-1" />Budget (₹)
            </label>
            <input className="input-field" type="number" placeholder="e.g. 50000" value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })} min="0" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (comma separated)</label>
            <input className="input-field" placeholder="e.g. beach, adventure, family" value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })} />
          </div>

          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
            <input type="checkbox" id="isPublic" checked={form.isPublic}
              onChange={e => setForm({ ...form, isPublic: e.target.checked })}
              className="w-4 h-4 accent-green-600" />
            <label htmlFor="isPublic" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <Globe className="w-4 h-4 text-green-600" />
              Make this trip public (share with community)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/trips')} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
