import { DollarSign, TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Jul', earnings: 8500, bookings: 4 },
  { month: 'Aug', earnings: 12000, bookings: 6 },
  { month: 'Sep', earnings: 9500, bookings: 5 },
  { month: 'Oct', earnings: 15000, bookings: 7 },
  { month: 'Nov', earnings: 18500, bookings: 9 },
  { month: 'Dec', earnings: 22000, bookings: 11 },
];

const recentPayments = [
  { traveler: 'Priya Sharma', tour: 'Sunrise Ganga Aarti', date: '2024-12-15', amount: 2500, status: 'paid' },
  { traveler: 'Rahul Verma', tour: 'Old City Heritage Walk', date: '2024-12-12', amount: 5000, status: 'paid' },
  { traveler: 'Anita Patel', tour: 'Food Trail', date: '2024-12-10', amount: 1800, status: 'pending' },
  { traveler: 'Suresh Kumar', tour: 'Sunrise Ganga Aarti', date: '2024-12-08', amount: 2500, status: 'paid' },
];

export default function GuideEarnings() {
  const totalEarnings = monthlyData.reduce((s, m) => s + m.earnings, 0);
  const thisMonth = monthlyData[monthlyData.length - 1].earnings;
  const lastMonth = monthlyData[monthlyData.length - 2].earnings;
  const growth = (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold flex items-center gap-3"><DollarSign className="w-7 h-7" />Earnings</h1>
        <p className="text-white/70 mt-1">Track your income and payment history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'bg-green-600', sub: 'All time' },
          { label: 'This Month', value: `₹${thisMonth.toLocaleString()}`, icon: Calendar, color: 'bg-teal-500', sub: `${growth > 0 ? '+' : ''}${growth}% vs last month` },
          { label: 'Total Bookings', value: monthlyData.reduce((s, m) => s + m.bookings, 0), icon: TrendingUp, color: 'bg-emerald-500', sub: 'All time' },
          { label: 'Avg Per Booking', value: `₹${Math.round(totalEarnings / monthlyData.reduce((s, m) => s + m.bookings, 0)).toLocaleString()}`, icon: TrendingUp, color: 'bg-cyan-600', sub: 'Per tour' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
            <p className={`text-xs flex items-center gap-1 ${sub.includes('+') ? 'text-green-600' : 'text-gray-400'}`}>
              {sub.includes('+') && <ArrowUp className="w-3 h-3" />}
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Monthly Earnings (₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
              <Bar dataKey="earnings" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} dot={{ fill: '#059669', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment History */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-800 mb-4">Payment History</h3>
        <div className="space-y-3">
          {recentPayments.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
              <div>
                <p className="font-medium text-gray-800 text-sm">{p.traveler}</p>
                <p className="text-xs text-gray-500">{p.tour} • {p.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-700">₹{p.amount.toLocaleString()}</span>
                <span className={`badge text-xs ${p.status === 'paid' ? 'badge-green' : 'badge-yellow'}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
