import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '', budget: '', isPublic: false, tags: '' });

  useEffect(() => {
    api.get(`/trips/${id}`).then(r => {
      const t = r.data;
      setForm({
        title: t.title, description: t.description || '',
        startDate: t.startDate?.split('T')[0], endDate: t.endDate?.split('T')[0],
        budget: t.budget || '', isPublic: t.isPublic,
        tags: t.tags?.join(', ') || ''
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/trips/${id}`, { ...form, budget: Number(form.budget) || 0, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
      toast.success('Trip updated!');
      navigate(`/trips/${id}`);
    } catch { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Edit Trip</h1>
      </div>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trip Title *</label>
            <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
              <input className="input-field" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
              <input className="input-field" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget (₹)</label>
            <input className="input-field" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
            <input className="input-field" placeholder="beach, adventure, family" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isPublic" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} className="w-4 h-4 accent-green-600" />
            <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 cursor-pointer">Make trip public</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(`/trips/${id}`)} className="btn-secondary flex-1 justify-center">
              <ArrowLeft className="w-4 h-4" /> Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
