import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart2, TrendingUp, Users, DollarSign, Star, Hotel } from 'lucide-react';

const monthlyRevenue = [
  { month: 'Jul', revenue: 45000, bookings: 12 },
  { month: 'Aug', revenue: 62000, bookings: 18 },
  { month: 'Sep', revenue: 55000, bookings: 15 },
  { month: 'Oct', revenue: 78000, bookings: 22 },
  { month: 'Nov', revenue: 91000, bookings: 26 },
  { month: 'Dec', revenue: 110000, bookings: 31 },
];

const hotelPerformance = [
  { name: 'Green Valley', revenue: 145000, bookings: 42, rating: 4.7 },
  { name: 'Beachside Haven', revenue: 198000, bookings: 58, rating: 4.5 },
  { name: 'Heritage Palace', revenue: 167000, bookings: 35, rating: 4.8 },
];

const roomTypeData = [
  { name: 'Standard', value: 35 },
  { name: 'Deluxe', value: 40 },
  { name: 'Suite', value: 25 },
];

const COLORS = ['#059669', '#10b981', '#34d399'];

export default function HotelOwnerAnalytics() {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = monthlyRevenue.reduce((s, m) => s + m.bookings, 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold flex items-center gap-3"><BarChart2 className="w-7 h-7" />Analytics</h1>
        <p className="text-white/70 mt-1">Performance overview of your properties</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-emerald-600', trend: '+18%' },
          { label: 'Total Bookings', value: totalBookings, icon: Users, color: 'bg-green-500', trend: '+24%' },
          { label: 'Avg Rating', value: '4.67', icon: Star, color: 'bg-yellow-500', trend: '+0.2' },
          { label: 'Properties', value: hotelPerformance.length, icon: Hotel, color: 'bg-teal-500', trend: '' },
        ].map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
            {trend && <p className="text-xs text-green-600 font-medium">{trend} this month</p>}
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Monthly Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} dot={{ fill: '#059669', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hotel Performance */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Property Performance</h3>
          <div className="space-y-4">
            {hotelPerformance.map(h => (
              <div key={h.name} className="p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800 text-sm">{h.name}</p>
                  <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{h.rating}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>₹{h.revenue.toLocaleString()} revenue</span>
                  <span>{h.bookings} bookings</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${(h.revenue / 200000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Type Distribution */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Bookings by Room Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roomTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {roomTypeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
