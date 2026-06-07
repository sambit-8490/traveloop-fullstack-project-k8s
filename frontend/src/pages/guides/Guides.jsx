import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Star, MapPin, Languages, DollarSign, CheckCircle, Users, Calendar, Heart, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

// Traveler-only view: browse & book guides
export default function Guides() {
  const { user } = useAuth();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('guideWishlist') || '[]'));
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '', duration: '1', notes: '' });
  const [reviewModal, setReviewModal] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get('/guides').then(r => setGuides(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? guides.filter(g => g.location?.toLowerCase().includes(search.toLowerCase()) || g.specialization?.some(s => s.toLowerCase().includes(search.toLowerCase())))
    : guides;

  const toggleWishlist = (id) => {
    const updated = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem('guideWishlist', JSON.stringify(updated));
    toast.success(wishlist.includes(id) ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!bookingForm.date) return toast.error('Select a date');
    const total = bookingModal.pricePerDay * Number(bookingForm.duration);
    toast.success(`Booking request sent! Total: ₹${total.toLocaleString()}. Guide will confirm shortly.`);
    setBookingModal(null);
    setBookingForm({ date: '', duration: '1', notes: '' });
  };

  const submitReview = (e) => {
    e.preventDefault();
    toast.success('Review submitted! Thank you.');
    setReviewModal(null);
    setReview({ rating: 5, comment: '' });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Local Guides</h1>
        <p className="text-white/70 mt-1">Book verified local experts for your trip</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
        <input className="input-field pl-10" placeholder="Search by city or specialization..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {wishlist.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
          <Heart className="w-4 h-4 fill-red-400 text-red-400" />
          {wishlist.length} guide{wishlist.length > 1 ? 's' : ''} in your wishlist
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-56 animate-pulse bg-green-50" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 text-green-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No guides found</h3>
          <p className="text-gray-500">Try a different city or specialization</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(guide => (
            <div key={guide._id} className="card p-5">
              <div className="flex items-start gap-4 mb-3">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {guide.user?.avatar
                      ? <img src={guide.user.avatar} alt="" className="w-full h-full object-cover" />
                      : guide.user?.name?.[0]?.toUpperCase()}
                  </div>
                  {guide.isApproved && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 truncate">{guide.user?.name}</h3>
                    <button onClick={() => toggleWishlist(guide._id)} className="flex-shrink-0 ml-1">
                      <Heart className={`w-4 h-4 ${wishlist.includes(guide._id) ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'}`} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-green-500" />{guide.location}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= Math.round(guide.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({guide.totalReviews || 0})</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.bio || 'Experienced local guide ready to show you the best of the city.'}</p>

              {guide.specialization?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {guide.specialization.map(s => <span key={s} className="badge badge-green text-xs">{s}</span>)}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Languages className="w-3 h-3 text-green-500" />{guide.languages?.slice(0, 2).join(', ')}
                </span>
                <span className="font-bold text-green-700 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />₹{guide.pricePerDay?.toLocaleString()}/day
                </span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setBookingModal(guide)} className="btn-primary flex-1 justify-center text-sm py-2">
                  <Calendar className="w-4 h-4" /> Book Guide
                </button>
                <button onClick={() => setReviewModal(guide)} className="btn-secondary px-3 py-2 text-sm">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-gray-800 text-lg mb-1">Book {bookingModal.user?.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{bookingModal.location} • ₹{bookingModal.pricePerDay?.toLocaleString()}/day</p>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tour Date</label>
                <input className="input-field" type="date" min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (days)</label>
                <select className="input-field" value={bookingForm.duration} onChange={e => setBookingForm({ ...bookingForm, duration: e.target.value })}>
                  {[1,2,3,4,5].map(d => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requests</label>
                <textarea className="input-field resize-none" rows={2} placeholder="Any special requirements..."
                  value={bookingForm.notes} onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })} />
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">₹{bookingModal.pricePerDay?.toLocaleString()} × {bookingForm.duration} day(s)</span>
                  <span className="font-bold text-green-700">₹{(bookingModal.pricePerDay * Number(bookingForm.duration)).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setBookingModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Rate {reviewModal.user?.name}</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReview({ ...review, rating: s })}>
                      <Star className={`w-8 h-8 transition-colors ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Review</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Share your experience..."
                  value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReviewModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
