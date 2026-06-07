import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Save, Trash2, Clock, DollarSign, MapPin, ChevronDown, ChevronUp, Bot, ArrowLeft } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

const activityTypes = ['sightseeing', 'food', 'adventure', 'cultural', 'wellness', 'shopping', 'transport', 'accommodation'];

export default function ItineraryBuilder() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [days, setDays] = useState([]);
  const [saving, setSaving] = useState(false);
  const [expandedDay, setExpandedDay] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/trips/${id}`), api.get(`/itinerary/trip/${id}`)]).then(([tripRes, itinRes]) => {
      setTrip(tripRes.data);
      const tripData = tripRes.data;
      const totalDays = differenceInDays(new Date(tripData.endDate), new Date(tripData.startDate)) + 1;
      if (itinRes.data?.days?.length > 0) {
        setDays(itinRes.data.days);
        setItinerary(itinRes.data);
      } else {
        const initialDays = Array.from({ length: totalDays }, (_, i) => ({
          day: i + 1,
          date: addDays(new Date(tripData.startDate), i),
          city: '', activities: [], notes: '', accommodation: '', transport: '', dailyCost: 0
        }));
        setDays(initialDays);
      }
    }).catch(() => toast.error('Failed to load itinerary'));
  }, [id]);

  const addActivity = (dayIdx) => {
    const updated = [...days];
    updated[dayIdx].activities.push({ name: '', time: '09:00', duration: '1 hour', cost: 0, type: 'sightseeing', notes: '' });
    setDays(updated);
  };

  const updateActivity = (dayIdx, actIdx, field, value) => {
    const updated = [...days];
    updated[dayIdx].activities[actIdx][field] = value;
    updated[dayIdx].dailyCost = updated[dayIdx].activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
    setDays(updated);
  };

  const removeActivity = (dayIdx, actIdx) => {
    const updated = [...days];
    updated[dayIdx].activities.splice(actIdx, 1);
    updated[dayIdx].dailyCost = updated[dayIdx].activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
    setDays(updated);
  };

  const updateDay = (dayIdx, field, value) => {
    const updated = [...days];
    updated[dayIdx][field] = value;
    setDays(updated);
  };

  const saveItinerary = async () => {
    setSaving(true);
    try {
      const totalCost = days.reduce((sum, d) => sum + (d.dailyCost || 0), 0);
      await api.post(`/itinerary/trip/${id}`, { days, totalCost });
      toast.success('Itinerary saved!');
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const generateAI = async () => {
    if (!trip) return;
    setAiLoading(true);
    try {
      const totalDays = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
      const { data } = await api.post('/ai/generate-itinerary', {
        destination: trip.destinations?.[0] || trip.title,
        days: totalDays, budget: trip.budget || 10000, mood: 'general'
      });
      if (data.days) {
        const merged = days.map((d, i) => ({
          ...d, ...(data.days[i] || {}),
          date: d.date, day: d.day
        }));
        setDays(merged);
        toast.success('AI itinerary generated!');
      } else {
        toast.error('AI response format unexpected');
      }
    } catch { toast.error('AI generation failed. Check your API key.'); } finally { setAiLoading(false); }
  };

  const totalCost = days.reduce((sum, d) => sum + (d.dailyCost || 0), 0);

  if (!trip) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to={`/trips/${id}`} className="text-white/70 text-sm flex items-center gap-1 mb-1 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Trip
          </Link>
          <h1 className="text-2xl font-bold">Itinerary Builder</h1>
          <p className="text-white/70 mt-1">{trip.title} • {days.length} days • Total: ₹{totalCost.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={generateAI} disabled={aiLoading} className="btn-secondary text-sm py-2">
            <Bot className="w-4 h-4" /> {aiLoading ? 'Generating...' : 'AI Generate'}
          </button>
          <button onClick={saveItinerary} disabled={saving} className="btn-primary text-sm py-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day, dayIdx) => (
          <div key={dayIdx} className="card overflow-hidden">
            <button onClick={() => setExpandedDay(expandedDay === dayIdx ? -1 : dayIdx)}
              className="w-full p-4 flex items-center justify-between hover:bg-green-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-bg rounded-xl flex flex-col items-center justify-center text-white">
                  <span className="text-xs font-medium">Day</span>
                  <span className="text-lg font-bold leading-none">{day.day}</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">{day.city || `Day ${day.day}`}</p>
                  <p className="text-sm text-gray-500">{day.date ? format(new Date(day.date), 'EEEE, MMM d') : ''} • {day.activities.length} activities • ₹{day.dailyCost?.toLocaleString() || 0}</p>
                </div>
              </div>
              {expandedDay === dayIdx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {expandedDay === dayIdx && (
              <div className="p-4 border-t border-green-100 space-y-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                    <input className="input-field text-sm py-2" placeholder="City name" value={day.city}
                      onChange={e => updateDay(dayIdx, 'city', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Accommodation</label>
                    <input className="input-field text-sm py-2" placeholder="Hotel/Hostel" value={day.accommodation}
                      onChange={e => updateDay(dayIdx, 'accommodation', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Transport</label>
                    <input className="input-field text-sm py-2" placeholder="Flight/Train/Bus" value={day.transport}
                      onChange={e => updateDay(dayIdx, 'transport', e.target.value)} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Activities</h4>
                    <button onClick={() => addActivity(dayIdx)} className="btn-primary text-xs py-1.5 px-3">
                      <Plus className="w-3 h-3" /> Add Activity
                    </button>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((act, actIdx) => (
                      <div key={actIdx} className="bg-green-50 rounded-xl p-3 border border-green-200">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                          <input className="input-field text-sm py-1.5 col-span-2" placeholder="Activity name"
                            value={act.name} onChange={e => updateActivity(dayIdx, actIdx, 'name', e.target.value)} />
                          <input className="input-field text-sm py-1.5" type="time" value={act.time}
                            onChange={e => updateActivity(dayIdx, actIdx, 'time', e.target.value)} />
                          <select className="input-field text-sm py-1.5" value={act.type}
                            onChange={e => updateActivity(dayIdx, actIdx, 'type', e.target.value)}>
                            {activityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input className="input-field text-sm py-1.5" placeholder="Duration" value={act.duration}
                            onChange={e => updateActivity(dayIdx, actIdx, 'duration', e.target.value)} />
                          <input className="input-field text-sm py-1.5" type="number" placeholder="Cost ₹" value={act.cost}
                            onChange={e => updateActivity(dayIdx, actIdx, 'cost', e.target.value)} />
                          <button onClick={() => removeActivity(dayIdx, actIdx)} className="btn-danger text-xs py-1.5 justify-center flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {day.activities.length === 0 && (
                      <div className="text-center py-6 text-gray-400 border-2 border-dashed border-green-200 rounded-xl">
                        <p className="text-sm">No activities yet. Add your first activity!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Day Notes</label>
                  <textarea className="input-field text-sm resize-none" rows={2} placeholder="Notes for this day..."
                    value={day.notes} onChange={e => updateDay(dayIdx, 'notes', e.target.value)} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
