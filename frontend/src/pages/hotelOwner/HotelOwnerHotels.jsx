import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { Hotel, Plus, Edit, Trash2, Star, MapPin, DollarSign, ToggleLeft, ToggleRight, X, Image, Video, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const AMENITY_OPTIONS = ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking', 'AC', 'Room Service', 'Laundry', 'Airport Transfer', 'Beach Access', 'Pet Friendly', 'Conference Room', 'Kids Play Area'];

const EMPTY_FORM = { name: '', description: '', location: '', city: '', pricePerNight: '', amenities: [], isAvailable: true, mediaFiles: [], mediaPreviews: [] };

export default function HotelOwnerHotels() {
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [cityList, setCityList] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDrop, setShowCityDrop] = useState(false);
  const cityRef = useRef(null);

  // Pre-fill city if coming from Explore Cities "List Hotel Here"
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const preCity = params.get('city');
    if (preCity) {
      setForm(f => ({ ...f, city: preCity }));
      setCitySearch(preCity);
      setShowForm(true);
    }
  }, [location.search]);

  useEffect(() => {
    api.get('/hotels/my-hotels').then(r => setHotels(r.data)).catch(() => setHotels([])).finally(() => setLoading(false));
    api.get('/cities/names').then(r => setCityList(r.data)).catch(() => {});
  }, []);

  // Close city dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (cityRef.current && !cityRef.current.contains(e.target)) setShowCityDrop(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredCities = cityList.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      name: file.name
    }));
    setForm(f => ({
      ...f,
      mediaFiles: [...f.mediaFiles, ...files],
      mediaPreviews: [...f.mediaPreviews, ...newPreviews]
    }));
  };

  const removeMedia = (idx) => {
    setForm(f => ({
      ...f,
      mediaFiles: f.mediaFiles.filter((_, i) => i !== idx),
      mediaPreviews: f.mediaPreviews.filter((_, i) => i !== idx)
    }));
  };

  const toggleAmenity = (amenity) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter(a => a !== amenity)
        : [...f.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In production, upload media to Cloudinary here
      // For now, use object URLs as placeholder images
      const images = form.mediaPreviews.filter(m => m.type === 'image').map(m => m.url);
      const payload = {
        name: form.name,
        description: form.description,
        location: form.location,
        city: form.city,
        pricePerNight: Number(form.pricePerNight),
        amenities: form.amenities,
        isAvailable: form.isAvailable,
        images
      };
      if (editHotel) {
        const { data } = await api.put(`/hotels/${editHotel._id}`, payload);
        setHotels(hotels.map(h => h._id === editHotel._id ? data : h));
        toast.success('Hotel updated!');
      } else {
        const { data } = await api.post('/hotels', payload);
        setHotels([data, ...hotels]);
        toast.success('Hotel added!');
      }
      resetForm();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save hotel'); }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditHotel(null);
    setForm(EMPTY_FORM);
    setCitySearch('');
  };

  const deleteHotel = async (id) => {
    if (!confirm('Delete this hotel?')) return;
    await api.delete(`/hotels/${id}`);
    setHotels(hotels.filter(h => h._id !== id));
    toast.success('Hotel deleted');
  };

  const toggleAvailability = async (hotel) => {
    try {
      const { data } = await api.put(`/hotels/${hotel._id}`, { isAvailable: !hotel.isAvailable });
      setHotels(hotels.map(h => h._id === hotel._id ? data : h));
      toast.success(`Marked as ${!hotel.isAvailable ? 'available' : 'unavailable'}`);
    } catch { toast.error('Failed to update'); }
  };

  const startEdit = (hotel) => {
    setEditHotel(hotel);
    setCitySearch(hotel.city);
    setForm({
      name: hotel.name, description: hotel.description || '',
      location: hotel.location, city: hotel.city,
      pricePerNight: hotel.pricePerNight,
      amenities: hotel.amenities || [],
      isAvailable: hotel.isAvailable,
      mediaFiles: [], mediaPreviews: (hotel.images || []).map(url => ({ url, type: 'image', name: '' }))
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3"><Hotel className="w-7 h-7" />My Hotels</h1>
          <p className="text-white/70 mt-1">{hotels.length} properties listed</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-secondary self-start">
          <Plus className="w-5 h-5" /> Add Hotel
        </button>
      </div>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 text-lg">{editHotel ? 'Edit Hotel' : 'Add New Hotel'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + City */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hotel Name *</label>
                <input className="input-field" placeholder="e.g. Green Valley Resort" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>

              {/* City Dropdown */}
              <div ref={cityRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
                  <input
                    className="input-field pl-10 pr-8"
                    placeholder="Search or select city..."
                    value={citySearch}
                    onChange={e => { setCitySearch(e.target.value); setForm({ ...form, city: e.target.value }); setShowCityDrop(true); }}
                    onFocus={() => setShowCityDrop(true)}
                    required
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  {showCityDrop && filteredCities.length > 0 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-green-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                      {filteredCities.map(city => (
                        <button key={city} type="button"
                          onClick={() => { setForm({ ...form, city }); setCitySearch(city); setShowCityDrop(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 transition-colors ${form.city === city ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'}`}>
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address *</label>
              <input className="input-field" placeholder="Street address, area, landmark" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea className="input-field resize-none" rows={3}
                placeholder="Describe your property — what makes it special, nearby attractions, unique features..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Price */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price Per Night (₹) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input className="input-field pl-10" type="number" placeholder="e.g. 3500" value={form.pricePerNight}
                    onChange={e => setForm({ ...form, pricePerNight: e.target.value })} required min="0" />
                </div>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-green-50 rounded-xl border border-green-200 w-full">
                  <input type="checkbox" checked={form.isAvailable}
                    onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-green-600" />
                  <span className="text-sm font-medium text-gray-700">Available for bookings</span>
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map(a => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${form.amenities.includes(a) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photos & Videos
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:bg-green-50 transition-colors">
                <div className="flex items-center gap-3 text-green-600">
                  <Image className="w-6 h-6" />
                  <Video className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to upload photos & videos</p>
                <p className="text-xs text-gray-400">JPG, PNG, MP4, MOV supported</p>
                <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleMediaUpload} />
              </label>

              {/* Media Previews */}
              {form.mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                  {form.mediaPreviews.map((media, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-green-200">
                      {media.type === 'video' ? (
                        <video src={media.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={media.url} alt="" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      <button type="button" onClick={() => removeMedia(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3 text-white" />
                      </button>
                      {media.type === 'video' && (
                        <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1">
                          <Video className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {idx === 0 && (
                        <div className="absolute bottom-1 right-1 bg-green-600 rounded px-1.5 py-0.5">
                          <span className="text-white text-xs font-bold">Cover</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {form.mediaPreviews.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">First image is used as cover photo. Drag to reorder.</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={resetForm} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center">
                {editHotel ? 'Update Hotel' : 'Add Hotel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hotels Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-64 animate-pulse bg-green-50" />)}
        </div>
      ) : hotels.length === 0 ? (
        <div className="card p-12 text-center">
          <Hotel className="w-16 h-16 text-green-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No hotels listed yet</h3>
          <p className="text-gray-500 mb-4">Add your first property to start receiving bookings</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add First Hotel</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map(hotel => (
            <div key={hotel._id} className="card overflow-hidden">
              {/* Image Carousel */}
              <div className="h-44 bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
                {hotel.images?.length > 0 ? (
                  <img src={hotel.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Hotel className="w-12 h-12 text-white/50" /></div>
                )}
                {hotel.images?.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 rounded-lg px-2 py-1 flex items-center gap-1">
                    <Image className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">{hotel.images.length}</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`badge text-xs ${hotel.isAvailable ? 'badge-green' : 'badge-red'}`}>
                    {hotel.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-800">{hotel.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600">{hotel.rating || 'New'}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-green-500" />{hotel.city}
                </p>
                {hotel.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 3).map(a => <span key={a} className="badge badge-green text-xs">{a}</span>)}
                    {hotel.amenities.length > 3 && <span className="badge badge-green text-xs">+{hotel.amenities.length - 3}</span>}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-100">
                  <span className="font-bold text-green-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />₹{hotel.pricePerNight?.toLocaleString()}/night
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => toggleAvailability(hotel)} title="Toggle availability"
                      className="p-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50">
                      {hotel.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => startEdit(hotel)} className="p-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteHotel(hotel._id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
