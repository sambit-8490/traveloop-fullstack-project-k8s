import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Hotel, MapPin, Star, DollarSign, Search, Heart, Calendar, CheckCircle, Wifi, Coffee, Waves } from 'lucide-react';
import toast from 'react-hot-toast';

// Traveler-only view: browse & book hotels
export default function Hotels() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('hotelWishlist') || '[]'));
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({ checkIn: '', checkOut: '', guests: 1 });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('city', search);
    if (maxPrice) params.set('maxPrice', maxPrice);
    api.get(`/hotels?${params}`).then(r => setHotels(r.data)).finally(() => setLoading(false));
  }, [search, maxPrice]);

  const toggleWishlist = (id) => {
    const updated = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem('hotelWishlist', JSON.stringify(updated));
    toast.success(wishlist.includes(id) ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!bookingForm.checkIn || !bookingForm.checkOut) return toast.error('Select check-in and check-out dates');
    const nights = Math.ceil((new Date(bookingForm.checkOut) - new Date(bookingForm.checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return toast.error('Check-out must be after check-in');
    toast.success(`Booking request sent for ${nights} night(s)! Hotel will confirm shortly.`);
    setBookingModal(null);
    setBookingForm({ checkIn: '', checkOut: '', guests: 1 });
  };

  const nights = bookingModal && bookingForm.checkIn && bookingForm.checkOut
    ? Math.max(0, Math.ceil((new Date(bookingForm.checkOut) - new Date(bookingForm.checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Hotels & Stays</h1>
        <p className="text-white/70 mt-1">Find and book perfect accommodations for your trip</p>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          <input className="input-field pl-10" placeholder="Search by city..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative sm:w-48">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          <input className="input-field pl-10" type="number" placeholder="Max price/night (₹)" value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)} />
        </div>
      </div>

      {/* Wishlist count */}
      {wishlist.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
          <Heart className="w-4 h-4 fill-red-400 text-red-400" />
          {wishlist.length} hotel{wishlist.length > 1 ? 's' : ''} in your wishlist
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-72 animate-pulse bg-green-50" />)}
        </div>
      ) : hotels.length === 0 ? (
        <div className="card p-12 text-center">
          <Hotel className="w-16 h-16 text-green-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No hotels found</h3>
          <p className="text-gray-500">Try a different city or adjust your price filter</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map(hotel => (
            <div key={hotel._id} className="card overflow-hidden group">
              <div className="h-44 bg-gradient-to-br from-green-400 to-teal-600 relative overflow-hidden">
                {hotel.images?.[0]
                  ? <img src={hotel.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full flex items-center justify-center"><Hotel className="w-12 h-12 text-white/50" /></div>}
                <button onClick={() => toggleWishlist(hotel._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                  <Heart className={`w-4 h-4 ${wishlist.includes(hotel._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                {!hotel.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="badge badge-red text-sm">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-800">{hotel.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600 font-medium">{hotel.rating || 'New'}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-green-500" />{hotel.city} • {hotel.location}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{hotel.description}</p>
                {hotel.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 4).map(a => (
                      <span key={a} className="badge badge-green text-xs">{a}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-100">
                  <div>
                    <span className="font-bold text-green-700 text-lg">₹{hotel.pricePerNight?.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs">/night</span>
                  </div>
                  <button
                    onClick={() => hotel.isAvailable && setBookingModal(hotel)}
                    disabled={!hotel.isAvailable}
                    className={`btn-primary text-sm py-2 px-4 ${!hotel.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Calendar className="w-4 h-4" /> Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-gray-800 text-lg mb-1">Book {bookingModal.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
              <MapPin className="w-3 h-3 text-green-500" />{bookingModal.city}
            </p>
            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Check-in</label>
                  <input className="input-field" type="date" min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.checkIn} onChange={e => setBookingForm({ ...bookingForm, checkIn: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Check-out</label>
                  <input className="input-field" type="date" min={bookingForm.checkIn || new Date().toISOString().split('T')[0]}
                    value={bookingForm.checkOut} onChange={e => setBookingForm({ ...bookingForm, checkOut: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Guests</label>
                <input className="input-field" type="number" min="1" max="10" value={bookingForm.guests}
                  onChange={e => setBookingForm({ ...bookingForm, guests: e.target.value })} />
              </div>
              {nights > 0 && (
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">₹{bookingModal.pricePerNight?.toLocaleString()} × {nights} nights</span>
                    <span className="font-bold text-green-700">₹{(bookingModal.pricePerNight * nights).toLocaleString()}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setBookingModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
