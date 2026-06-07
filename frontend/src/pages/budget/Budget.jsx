import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Plus, Trash2, DollarSign, TrendingUp, AlertTriangle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
const CATEGORIES = ['hotels', 'transport', 'activities', 'food', 'miscellaneous'];

export default function Budget() {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [trip, setTrip] = useState(null);
  const [form, setForm] = useState({ category: 'food', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [totalBudget, setTotalBudget] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/trips/${id}`), api.get(`/budget/trip/${id}`)]).then(([tripRes, budgetRes]) => {
      setTrip(tripRes.data);
      setBudget(budgetRes.data);
      setTotalBudget(budgetRes.data?.totalBudget || tripRes.data?.budget || '');
    }).finally(() => setLoading(false));
  }, [id]);

  const saveBudget = async () => {
    try {
      const { data } = await api.post(`/budget/trip/${id}`, { totalBudget: Number(totalBudget) });
      setBudget(data);
      toast.success('Budget saved!');
    } catch { toast.error('Failed to save budget'); }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/budget/trip/${id}/expense`, { ...form, amount: Number(form.amount) });
      setBudget(data);
      setForm({ category: 'food', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
      toast.success('Expense added!');
    } catch { toast.error('Failed to add expense'); }
  };

  const deleteExpense = async (expId) => {
    try {
      const { data } = await api.delete(`/budget/trip/${id}/expense/${expId}`);
      setBudget(data);
      toast.success('Expense removed');
    } catch { toast.error('Failed to remove'); }
  };

  const totalSpent = budget?.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const remaining = (budget?.totalBudget || 0) - totalSpent;
  const percentage = budget?.totalBudget ? Math.min((totalSpent / budget.totalBudget) * 100, 100) : 0;

  const categoryData = CATEGORIES.map(cat => ({
    name: cat, value: budget?.expenses?.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0) || 0
  })).filter(d => d.value > 0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <Link to={`/trips/${id}`} className="text-white/70 text-sm flex items-center gap-1 mb-1 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Trip
        </Link>
        <h1 className="text-2xl font-bold">Budget Tracker</h1>
        <p className="text-white/70 mt-1">{trip?.title}</p>
      </div>

      {/* Budget Overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-green-700">₹{(budget?.totalBudget || 0).toLocaleString()}</p>
          <div className="flex gap-2 mt-3">
            <input className="input-field text-sm py-1.5 flex-1" type="number" placeholder="Set budget" value={totalBudget}
              onChange={e => setTotalBudget(e.target.value)} />
            <button onClick={saveBudget} className="btn-primary text-sm py-1.5 px-3">Set</button>
          </div>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-red-600">₹{totalSpent.toLocaleString()}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{percentage.toFixed(0)}% used</span>
              <span>{(100 - percentage).toFixed(0)}% left</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${percentage}%` }} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Remaining</p>
          <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            ₹{Math.abs(remaining).toLocaleString()} {remaining < 0 ? 'over' : ''}
          </p>
          {remaining < 0 && (
            <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
              <AlertTriangle className="w-3 h-3" /> Over budget!
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Expense */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-green-500" />Add Expense</h3>
          <form onSubmit={addExpense} className="space-y-3">
            <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
            <input className="input-field" placeholder="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" type="number" placeholder="Amount ₹" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} required min="0" />
              <input className="input-field" type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Add Expense</button>
          </form>
        </div>

        {/* Chart */}
        {categoryData.length > 0 && (
          <div className="card p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" />Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Expense List */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-800 mb-4">Expense History</h3>
        {!budget?.expenses?.length ? (
          <p className="text-gray-500 text-center py-6">No expenses yet</p>
        ) : (
          <div className="space-y-2">
            {budget.expenses.map(exp => (
              <div key={exp._id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <span className={`badge ${exp.category === 'food' ? 'badge-green' : exp.category === 'hotels' ? 'badge-blue' : exp.category === 'transport' ? 'badge-yellow' : 'badge-purple'}`}>
                    {exp.category}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{exp.description}</p>
                    <p className="text-xs text-gray-500">{exp.date ? new Date(exp.date).toLocaleDateString() : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-600">₹{exp.amount.toLocaleString()}</span>
                  <button onClick={() => deleteExpense(exp._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
