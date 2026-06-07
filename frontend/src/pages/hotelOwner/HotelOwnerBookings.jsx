import { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, User, Hotel, DollarSign, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_BOOKINGS = [
  { _id: '1', guestName: 'Priya Sharma', guestEmail: 'priya@email.com', guestPhone: '+91 98765 43210', hotel: 'Green Valley Resort', checkIn: '2024-12-20', checkOut: '2024-12-23', nights: 3, guests: 2, amount: 10500, status: 'pending', roomType: 'Deluxe Room' },
  { _id: '2', guestName: 'Rahul Verma', guestEmail: 'rahul@email.com', guestPhone: '+91 87654 32109', hotel: 'Beachside Haven', checkIn: '2024-12-22', checkOut: '2024-12-25', nights: 3, guests: 4, amount: 12600, status: 'confirmed', roomType: 'Family Suite' },
  { _id: '3', guestName: 'Anita Patel', guestEmail: 'anita@email.com', guestPhone: '+91 76543 21098', hotel: 'Green Valley Resort', checkIn: '2024-12-28', checkOut: '2024-12-30', nights: 2, guests: 2, amount: 7000, status: 'pending', roomType: 'Standard Room' },
  { _id: '4', guestName: 'Suresh Kumar', guestEmail: 'suresh@email.com', guestPhone: '+91 65432 10987', hotel: 'Heritage Palace Hotel', checkIn: '2024-12-15', checkOut: '2024-12-18', nights: 3, guests: 2, amount: 16500, status: 'completed', roomType: 'Heritage Suite' },
];

export default function HotelOwnerBookings() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [filter, setFilter] = useState('all');

  const updateStatus = (id, status) => {
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    toast.success(`Booking ${status}!`);
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const totalRevenue = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold flex items-center gap-3"><Calendar className="w-7 h-7" />Bookings</h1>
        <p className="text-white/70 mt-1">Manage guest reservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'bg-emerald-600', icon: Calendar },
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-yellow-500', icon: Clock },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500', icon: CheckCircle },
          { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'bg-teal-500', icon: DollarSign },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="stat-card flex items-center gap-3">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Bookings */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-green-200 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : filtered.map(booking => (
          <div key={booking._id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {booking.guestName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{booking.guestName}</h3>
                    <span className={`badge text-xs ${booking.status === 'confirmed' ? 'badge-green' : booking.status === 'pending' ? 'badge-yellow' : booking.status === 'completed' ? 'badge-blue' : 'badge-red'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p className="flex items-center gap-1"><Hotel className="w-3 h-3 text-green-500" />{booking.hotel} • {booking.roomType}</p>
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3 text-green-500" />
                      Check-in: {booking.checkIn} → Check-out: {booking.checkOut} ({booking.nights} nights)
                    </p>
                    <p className="flex items-center gap-1"><User className="w-3 h-3 text-green-500" />{booking.guests} guests • {booking.guestPhone}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="text-xl font-bold text-green-700">₹{booking.amount.toLocaleString()}</span>
                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(booking._id, 'confirmed')} className="btn-primary text-sm py-1.5 px-3">
                      <CheckCircle className="w-4 h-4" /> Confirm
                    </button>
                    <button onClick={() => updateStatus(booking._id, 'cancelled')} className="btn-danger text-sm py-1.5 px-3 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
