import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Map, Hotel, UserCheck, Shield, TrendingUp, CheckCircle, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingGuides, setPendingGuides] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/guides/pending')
    ]).then(([statsRes, usersRes, guidesRes]) => {
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPendingGuides(guidesRes.data);
    }).catch(() => toast.error('Failed to load admin data')).finally(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      setUsers(users.map(u => u._id === id ? data : u));
      toast.success(`User ${data.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update user'); }
  };

  const approveGuide = async (id) => {
    try {
      await api.put(`/admin/guides/${id}/approve`);
      setPendingGuides(pendingGuides.filter(g => g._id !== id));
      toast.success('Guide approved!');
    } catch { toast.error('Failed to approve guide'); }
  };

  const roleChartData = stats?.roleStats?.map(r => ({ name: r._id, count: r.count })) || [];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold flex items-center gap-3"><Shield className="w-7 h-7" />Admin Dashboard</h1>
        <p className="text-white/70 mt-1">Platform monitoring & management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats?.users, icon: Users, color: 'bg-green-500' },
          { label: 'Total Trips', value: stats?.trips, icon: Map, color: 'bg-emerald-500' },
          { label: 'Guides', value: stats?.guides, icon: UserCheck, color: 'bg-teal-500' },
          { label: 'Hotels', value: stats?.hotels, icon: Hotel, color: 'bg-cyan-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card flex items-center gap-4">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value || 0}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[{ id: 'overview', label: 'Overview' }, { id: 'users', label: `Users (${users.length})` }, { id: 'guides', label: `Pending Guides (${pendingGuides.length})` }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" />User Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roleChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 border-b border-green-200">
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3"><span className="badge badge-green capitalize text-xs">{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`badge text-xs ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleUser(u._id)} className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}>
                        {u.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="space-y-4">
          {pendingGuides.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-200 mx-auto mb-4" />
              <p className="text-gray-500">No pending guide approvals</p>
            </div>
          ) : pendingGuides.map(guide => (
            <div key={guide._id} className="card p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold">
                  {guide.user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{guide.user?.name}</p>
                  <p className="text-sm text-gray-500">{guide.user?.email}</p>
                  <p className="text-sm text-gray-500">{guide.location} • {guide.experience} years exp</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approveGuide(guide._id)} className="btn-primary text-sm py-2 px-4">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button className="btn-danger text-sm py-2 px-4 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
