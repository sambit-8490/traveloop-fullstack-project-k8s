import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Check, Trash2, RotateCcw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['clothing', 'electronics', 'documents', 'medicines', 'other'];
const CATEGORY_ICONS = { clothing: '👕', electronics: '📱', documents: '📄', medicines: '💊', other: '📦' };

const DEFAULT_ITEMS = {
  clothing: ['T-shirts', 'Jeans', 'Jacket', 'Underwear', 'Socks', 'Shoes'],
  electronics: ['Phone charger', 'Power bank', 'Camera', 'Earphones', 'Laptop'],
  documents: ['Passport/ID', 'Tickets', 'Hotel bookings', 'Travel insurance', 'Emergency contacts'],
  medicines: ['Pain relievers', 'Antacids', 'Band-aids', 'Sunscreen', 'Insect repellent'],
  other: ['Sunglasses', 'Water bottle', 'Snacks', 'Travel pillow', 'Umbrella']
};

export default function Checklist() {
  const { id } = useParams();
  const [checklist, setChecklist] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', category: 'other' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/checklist/trip/${id}`).then(r => setChecklist(r.data)).finally(() => setLoading(false));
  }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/checklist/trip/${id}/item`, newItem);
      setChecklist(data);
      setNewItem({ name: '', category: 'other' });
      toast.success('Item added!');
    } catch { toast.error('Failed to add item'); }
  };

  const toggleItem = async (itemId, packed) => {
    try {
      const { data } = await api.put(`/checklist/trip/${id}/item/${itemId}`, { packed: !packed });
      setChecklist(data);
    } catch { toast.error('Failed to update'); }
  };

  const deleteItem = async (itemId) => {
    try {
      const { data } = await api.delete(`/checklist/trip/${id}/item/${itemId}`);
      setChecklist(data);
    } catch { toast.error('Failed to delete'); }
  };

  const addDefaultItems = async (category) => {
    try {
      let updated = checklist;
      for (const name of DEFAULT_ITEMS[category]) {
        const { data } = await api.post(`/checklist/trip/${id}/item`, { name, category });
        updated = data;
      }
      setChecklist(updated);
      toast.success(`${category} items added!`);
    } catch { toast.error('Failed to add items'); }
  };

  const items = checklist?.items || [];
  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory);
  const packed = items.filter(i => i.packed).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <Link to={`/trips/${id}`} className="text-white/70 text-sm flex items-center gap-1 mb-1 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Trip
        </Link>
        <h1 className="text-2xl font-bold">Packing Checklist</h1>
        <p className="text-white/70 mt-1">{packed}/{items.length} items packed</p>
      </div>

      {/* Progress */}
      <div className="card p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">{packed} of {items.length} packed</span>
          <span>{items.length > 0 ? Math.round((packed / items.length) * 100) : 0}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${items.length > 0 ? (packed / items.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Add Item */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-800 mb-3">Add Item</h3>
        <form onSubmit={addItem} className="flex gap-2">
          <input className="input-field flex-1" placeholder="Item name" value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
          <select className="input-field w-36" value={newItem.category}
            onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
          </select>
          <button type="submit" className="btn-primary px-4"><Plus className="w-4 h-4" /></button>
        </form>
      </div>

      {/* Quick Add by Category */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-800 mb-3">Quick Add by Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => addDefaultItems(cat)}
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-sm font-medium text-green-700 hover:bg-green-100 transition-colors">
              {CATEGORY_ICONS[cat]} Add {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${activeCategory === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            {cat === 'all' ? 'All' : `${CATEGORY_ICONS[cat]} ${cat}`}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="card p-5">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No items in this category</p>
          ) : filtered.map(item => (
            <div key={item._id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${item.packed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
              <button onClick={() => toggleItem(item._id, item.packed)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.packed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}>
                {item.packed && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`flex-1 text-sm font-medium ${item.packed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.name}</span>
              <span className="text-xs text-gray-400">{CATEGORY_ICONS[item.category]}</span>
              <button onClick={() => deleteItem(item._id)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
