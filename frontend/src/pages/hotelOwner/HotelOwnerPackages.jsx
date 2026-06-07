import { useState } from 'react';
import { Package, Plus, Edit, Trash2, Clock, DollarSign, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_PACKAGES = [
  { _id: '1', name: 'Goa Beach Getaway', hotel: 'Beachside Haven', duration: 3, price: 15000, includes: ['3 nights stay', 'Daily breakfast', 'Airport transfer', 'Beach activities'], active: true },
  { _id: '2', name: 'Manali Adventure Package', hotel: 'Green Valley Resort', duration: 5, price: 28000, includes: ['5 nights stay', 'All meals', 'Trekking guide', 'Paragliding', 'Rohtang Pass trip'], active: true },
  { _id: '3', name: 'Jaipur Heritage Tour', hotel: 'Heritage Palace Hotel', duration: 4, price: 22000, includes: ['4 nights stay', 'Daily breakfast', 'Heritage city tour', 'Elephant ride', 'Cultural show'], active: false },
];

export default function HotelOwnerPackages() {
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [showForm, setShowForm] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [form, setForm] = useState({ name: '', hotel: '', duration: '', price: '', includes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, duration: Number(form.duration), price: Number(form.price), includes: form.includes.split('\n').map(s => s.trim()).filter(Boolean) };
    if (editPkg) {
      setPackages(packages.map(p => p._id === editPkg._id ? { ...p, ...payload } : p));
      toast.success('Package updated!');
    } else {
      setPackages([...packages, { ...payload, _id: Date.now().toString(), active: true }]);
      toast.success('Package created!');
    }
    resetForm();
  };

  const resetForm = () => { setShowForm(false); setEditPkg(null); setForm({ name: '', hotel: '', duration: '', price: '', includes: '' }); };

  const startEdit = (pkg) => {
    setEditPkg(pkg);
    setForm({ name: pkg.name, hotel: pkg.hotel, duration: pkg.duration, price: pkg.price, includes: pkg.includes.join('\n') });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3"><Package className="w-7 h-7" />Travel Packages</h1>
          <p className="text-white/70 mt-1">Create bundled travel packages for guests</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-secondary self-start">
          <Plus className="w-5 h-5" /> Create Package
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4">{editPkg ? 'Edit Package' : 'Create New Package'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="input-field" placeholder="Package name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="input-field" placeholder="Hotel name" value={form.hotel} onChange={e => setForm({ ...form, hotel: e.target.value })} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="input-field" type="number" placeholder="Duration (nights)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required />
              <input className="input-field" type="number" placeholder="Package price (₹)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">What's Included (one per line)</label>
              <textarea className="input-field resize-none" rows={5} placeholder="3 nights stay&#10;Daily breakfast&#10;Airport transfer&#10;City tour" value={form.includes} onChange={e => setForm({ ...form, includes: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={resetForm} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center">{editPkg ? 'Update' : 'Create Package'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map(pkg => (
          <div key={pkg._id} className={`card overflow-hidden ${!pkg.active ? 'opacity-70' : ''}`}>
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex-1 pr-2">{pkg.name}</h3>
                <span className={`badge text-xs flex-shrink-0 ${pkg.active ? 'badge-green' : 'badge-yellow'}`}>{pkg.active ? 'Active' : 'Paused'}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{pkg.hotel}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-green-500" />{pkg.duration} nights</span>
                <span className="flex items-center gap-1 font-bold text-green-700"><DollarSign className="w-3 h-3" />₹{pkg.price.toLocaleString()}</span>
              </div>
              <div className="space-y-1 mb-4">
                {pkg.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPackages(packages.map(p => p._id === pkg._id ? { ...p, active: !p.active } : p))}
                  className={`flex-1 text-sm py-1.5 rounded-xl font-medium border transition-colors ${pkg.active ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                  {pkg.active ? 'Pause' : 'Activate'}
                </button>
                <button onClick={() => startEdit(pkg)} className="p-1.5 rounded-xl border border-green-200 text-green-600 hover:bg-green-50"><Edit className="w-4 h-4" /></button>
                <button onClick={() => { setPackages(packages.filter(p => p._id !== pkg._id)); toast.success('Package deleted'); }} className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
