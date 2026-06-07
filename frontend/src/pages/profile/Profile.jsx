import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Save, Camera, Trash2, Shield, Globe, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', phone: '', location: '', language: 'en' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    api.get('/profile').then(r => {
      const u = r.data;
      setForm({ name: u.name || '', bio: u.bio || '', phone: u.phone || '', location: u.location || '', language: u.language || 'en' });
    });
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); } finally { setLoading(false); }
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to deactivate your account?')) return;
    await api.delete('/profile');
    logout();
    toast.success('Account deactivated');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
        <p className="text-white/70 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className="badge badge-green mt-1 capitalize">{user?.role}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'profile', label: 'Profile', icon: User }, { id: 'safety', label: 'Safety', icon: Shield }, { id: 'preferences', label: 'Preferences', icon: Globe }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card p-6">
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                <input className="input-field pl-10" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
              <textarea className="input-field resize-none" rows={3} placeholder="Tell others about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input className="input-field pl-10" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input className="input-field pl-10" placeholder="Your city" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'safety' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Shield className="w-5 h-5 text-green-500" />Safety & Trust</h3>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="font-semibold text-green-800 mb-2">🆘 Emergency Information</p>
            <p className="text-sm text-gray-600">Keep your emergency contacts updated for safer travel.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="font-semibold text-blue-800 mb-2">📞 Emergency Numbers</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Police: 100</p>
              <p>Ambulance: 108</p>
              <p>Fire: 101</p>
              <p>Tourist Helpline: 1800-111-363</p>
            </div>
          </div>
          <div className="border-t border-red-200 pt-4">
            <button onClick={deleteAccount} className="btn-danger w-full justify-center flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Deactivate Account
            </button>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Globe className="w-5 h-5 text-green-500" />Preferences</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Language</label>
            <select className="input-field" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Interests</label>
            <div className="flex flex-wrap gap-2">
              {['Adventure', 'Beach', 'Mountains', 'Food', 'Culture', 'Photography', 'Wildlife', 'Spiritual'].map(interest => (
                <span key={interest} className="badge badge-green cursor-pointer hover:bg-green-200 transition-colors">{interest}</span>
              ))}
            </div>
          </div>
          <button onClick={saveProfile} disabled={loading} className="btn-primary w-full justify-center">
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}
