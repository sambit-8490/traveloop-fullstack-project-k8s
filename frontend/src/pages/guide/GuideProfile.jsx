import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, MapPin, DollarSign, Star, Save, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GuideProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    location: '', specialization: '', languages: '', experience: '',
    pricePerDay: '', bio: '', services: '', availability: true
  });

  useEffect(() => {
    api.get('/guides/my-profile').then(r => {
      if (r.data) {
        setProfile(r.data);
        setForm({
          location: r.data.location || '',
          specialization: r.data.specialization?.join(', ') || '',
          languages: r.data.languages?.join(', ') || '',
          experience: r.data.experience || '',
          pricePerDay: r.data.pricePerDay || '',
          bio: r.data.bio || '',
          services: r.data.services?.join(', ') || '',
          availability: r.data.availability ?? true
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        location: form.location,
        specialization: form.specialization.split(',').map(s => s.trim()).filter(Boolean),
        languages: form.languages.split(',').map(l => l.trim()).filter(Boolean),
        experience: Number(form.experience),
        pricePerDay: Number(form.pricePerDay),
        bio: form.bio,
        services: form.services.split(',').map(s => s.trim()).filter(Boolean),
        availability: form.availability
      };
      const { data } = profile
        ? await api.put('/guides/my-profile', payload)
        : await api.post('/guides/register', payload);
      setProfile(data);
      toast.success('Guide profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold flex items-center gap-3"><UserCheck className="w-7 h-7" />My Guide Profile</h1>
        <p className="text-white/70 mt-1">Manage your guide information visible to travelers</p>
      </div>

      {/* Status Banner */}
      {profile && (
        <div className={`card p-4 flex items-center gap-3 border-l-4 ${profile.isApproved ? 'border-green-500 bg-green-50' : 'border-yellow-400 bg-yellow-50'}`}>
          {profile.isApproved
            ? <><CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /><div><p className="font-semibold text-green-800">Profile Verified ✓</p><p className="text-sm text-green-700">Your profile is live and visible to travelers</p></div></>
            : <><Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" /><div><p className="font-semibold text-yellow-800">Pending Admin Approval</p><p className="text-sm text-yellow-700">Your profile is under review. You'll be notified once approved.</p></div></>}
        </div>
      )}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <MapPin className="inline w-4 h-4 text-green-500 mr-1" />City / Location *
              </label>
              <input className="input-field" placeholder="e.g. Varanasi, Goa" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <DollarSign className="inline w-4 h-4 text-green-500 mr-1" />Price Per Day (₹) *
              </label>
              <input className="input-field" type="number" placeholder="e.g. 2500" value={form.pricePerDay}
                onChange={e => setForm({ ...form, pricePerDay: e.target.value })} required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Years of Experience</label>
              <input className="input-field" type="number" placeholder="e.g. 5" value={form.experience}
                onChange={e => setForm({ ...form, experience: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Languages Spoken</label>
              <input className="input-field" placeholder="English, Hindi, Tamil" value={form.languages}
                onChange={e => setForm({ ...form, languages: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specializations</label>
            <input className="input-field" placeholder="Heritage Tours, Food Tours, Adventure, Photography" value={form.specialization}
              onChange={e => setForm({ ...form, specialization: e.target.value })} />
            <p className="text-xs text-gray-400 mt-1">Comma separated</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Services Offered</label>
            <input className="input-field" placeholder="City tours, Airport pickup, Custom itineraries" value={form.services}
              onChange={e => setForm({ ...form, services: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio / About You</label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="Tell travelers about your experience, what makes you unique, and why they should choose you..."
              value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
            <input type="checkbox" id="availability" checked={form.availability}
              onChange={e => setForm({ ...form, availability: e.target.checked })}
              className="w-4 h-4 accent-green-600" />
            <label htmlFor="availability" className="text-sm font-medium text-gray-700 cursor-pointer">
              I am currently available for bookings
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Guide Profile'}
          </button>
        </form>
      </div>

      {/* Profile Preview */}
      {profile && (
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4">How Travelers See You</h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800 text-lg">{user?.name}</h3>
                {profile.isApproved && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3 text-green-500" />{profile.location}</p>
              <p className="text-sm text-gray-600 mb-3">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.specialization?.map(s => <span key={s} className="badge badge-green text-xs">{s}</span>)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{profile.rating || 'New'} ({profile.totalReviews} reviews)</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-green-500" />₹{profile.pricePerDay}/day</span>
                <span>{profile.experience} yrs exp</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
