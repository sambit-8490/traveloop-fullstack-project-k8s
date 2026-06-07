import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, CheckCircle, XCircle, Clock, User, DollarSign, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_BOOKINGS = [
  { _id: '1', travelerName: 'Priya Sharma', travelerEmail: 'priya@email.com', travelerPhone: '+91 98765 43210', date: '2024-12-20', duration: '1 day', location: 'Varanasi Ghats Tour', amount: 2500, status: 'pending', notes: 'Interested in sunrise Ganga Aarti and heritage walk' },
  { _id: '2', travelerName: 'Rahul Verma', travelerEmail: 'rahul@email.com', travelerPhone: '+91 87654 32109', date: '2024-12-22', duration: '2 days', location: 'Old City Food Tour', amount: 5000, status: 'confirmed', notes: 'Vegetarian food tour preferred' },
  { _id: '3', travelerName: 'Anita Patel', travelerEmail: 'anita@email.com', travelerPhone: '+91 76543 21098', date: '2024-12-25', duration: '1 day', location: 'Photography Walk', amount: 2500, status: 'pending', notes: 'Sunrise photography spots' },
];

export default function GuideBookings() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [filter, setFilter] = useState('all');

  const updateStatus = (id, status) => {
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    toast.success(`Booking ${status}!`);
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold flex items-center gap-3"><Calendar className="w-7 h-7" />Booking Requests</h1>
        <p className="text-white/70 mt-1">Manage traveler booking requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-yellow-500', icon: Clock },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500', icon: CheckCircle },
          { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'bg-red-500', icon: XCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="stat-card flex items-center gap-3">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
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
      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Bookings List */}
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {booking.travelerName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{booking.travelerName}</h3>
                    <span className={`badge text-xs ${booking.status === 'confirmed' ? 'badge-green' : booking.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3 text-green-500" />{booking.date} • {booking.duration}</p>
                    <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-green-500" />{booking.location}</p>
                    <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-green-500" />{booking.travelerPhone}</p>
                    {booking.notes && <p className="text-gray-600 italic">"{booking.notes}"</p>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="text-xl font-bold text-green-700">₹{booking.amount.toLocaleString()}</span>
                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(booking._id, 'confirmed')}
                      className="btn-primary text-sm py-1.5 px-3">
                      <CheckCircle className="w-4 h-4" /> Accept
                    </button>
                    <button onClick={() => updateStatus(booking._id, 'cancelled')}
                      className="btn-danger text-sm py-1.5 px-3 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </div>
                )}
                {booking.status === 'confirmed' && (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Confirmed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
