import { useState } from 'react';
import api from '../utils/api';
import { Bot, Send, Sparkles, MapPin, DollarSign, Calendar, Loader, Key, ExternalLink, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const MOODS = ['general', 'adventure', 'relaxation', 'food', 'cultural', 'nature', 'photography', 'nightlife'];

const MOOD_EMOJI = { general: '🌍', adventure: '🏔️', relaxation: '🏖️', food: '🍜', cultural: '🏛️', nature: '🌿', photography: '📸', nightlife: '🌃' };

const EXAMPLES = [
  { label: '3-day Goa beach trip under ₹15,000', destination: 'Goa', days: 3, budget: 15000, mood: 'relaxation' },
  { label: '5-day Rajasthan cultural tour ₹30,000', destination: 'Jaipur', days: 5, budget: 30000, mood: 'cultural' },
  { label: '2-day Manali adventure ₹12,000', destination: 'Manali', days: 2, budget: 12000, mood: 'adventure' },
  { label: '4-day Varanasi spiritual trip ₹10,000', destination: 'Varanasi', days: 4, budget: 10000, mood: 'cultural' },
];

export default function AIAssistant() {
  const [form, setForm] = useState({ destination: '', days: 3, budget: 10000, mood: 'general', preferences: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [keyError, setKeyError] = useState(false);

  const generateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setKeyError(false);
    try {
      const { data } = await api.post('/ai/generate-itinerary', form);
      setResult(data);
      toast.success('AI itinerary generated!');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.isKeyError) {
        setKeyError(true);
      } else if (errData?.isQuota) {
        toast.error('Rate limit reached. Please wait ~1 minute and try again.', { duration: 6000 });
      } else {
        toast.error(errData?.message || 'AI generation failed');
      }
    } finally { setLoading(false); }
  };

  const getBudgetSuggestions = async () => {
    if (!form.destination) return toast.error('Enter a destination first');
    setSugLoading(true);
    setKeyError(false);
    try {
      const { data } = await api.post('/ai/budget-suggestions', { destination: form.destination, budget: form.budget, days: form.days });
      setSuggestions(data.suggestions || []);
      toast.success('Budget tips loaded!');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.isKeyError) setKeyError(true);
      else if (errData?.isQuota) toast.error('Rate limit reached. Please wait ~1 minute and try again.', { duration: 6000 });
      else toast.error(errData?.message || 'Failed to get suggestions');
    } finally { setSugLoading(false); }
  };

  const applyExample = (ex) => {
    setForm({ ...form, destination: ex.destination, days: ex.days, budget: ex.budget, mood: ex.mood });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Bot className="w-7 h-7" /> AI Trip Assistant
        </h1>
        <p className="text-white/70 mt-1">Powered by Google Gemini AI</p>
      </div>

      {/* API Key Setup Banner */}
      {keyError && (
        <div className="card p-5 border-l-4 border-orange-400 bg-orange-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-orange-800 mb-1">Gemini API Key Not Configured</p>
              <p className="text-sm text-orange-700 mb-3">To use AI features, add your free Gemini API key to <code className="bg-orange-100 px-1.5 py-0.5 rounded font-mono text-xs">backend/.env</code></p>
              <div className="bg-orange-100 rounded-xl p-3 font-mono text-xs text-orange-800 mb-3">
                GEMINI_API_KEY=your_actual_key_here
              </div>
              <div className="flex flex-wrap gap-2">
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                  className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
                  <Key className="w-4 h-4" /> Get Free API Key
                  <ExternalLink className="w-3 h-3" />
                </a>
                <div className="text-xs text-orange-600 self-center">Free • No credit card required</div>
              </div>
              <ol className="text-xs text-orange-700 mt-3 space-y-1 list-decimal list-inside">
                <li>Click "Get Free API Key" above</li>
                <li>Sign in with Google → Create API key</li>
                <li>Copy the key and paste it in <code className="bg-orange-100 px-1 rounded">backend/.env</code></li>
                <li>Restart the backend server: <code className="bg-orange-100 px-1 rounded">npm run dev</code></li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" /> Generate AI Itinerary
          </h3>

          {/* Quick Examples */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">Quick Examples:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex.label} type="button" onClick={() => applyExample(ex)}
                  className="text-xs px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition-colors">
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={generateItinerary} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <MapPin className="inline w-4 h-4 text-green-500 mr-1" />Destination *
              </label>
              <input className="input-field" placeholder="e.g. Goa, Manali, Jaipur, Varanasi" value={form.destination}
                onChange={e => setForm({ ...form, destination: e.target.value })} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <Calendar className="inline w-4 h-4 text-green-500 mr-1" />Days
                </label>
                <input className="input-field" type="number" min="1" max="30" value={form.days}
                  onChange={e => setForm({ ...form, days: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <DollarSign className="inline w-4 h-4 text-green-500 mr-1" />Budget (₹)
                </label>
                <input className="input-field" type="number" min="1000" value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Mood</label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => (
                  <button key={m} type="button" onClick={() => setForm({ ...form, mood: m })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${form.mood === m ? 'bg-green-600 text-white shadow-md' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'}`}>
                    {MOOD_EMOJI[m]} {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Special Preferences</label>
              <input className="input-field" placeholder="e.g. vegetarian food, no trekking, family-friendly, budget stays"
                value={form.preferences} onChange={e => setForm({ ...form, preferences: e.target.value })} />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
                {loading
                  ? <><Loader className="w-4 h-4 animate-spin" /> Generating...</>
                  : <><Send className="w-4 h-4" /> Generate Itinerary</>}
              </button>
              <button type="button" onClick={getBudgetSuggestions} disabled={sugLoading}
                title="Get budget tips" className="btn-secondary px-4 py-3">
                {sugLoading ? <Loader className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>

        {/* Budget Suggestions */}
        <div className="space-y-4">
          {suggestions.length > 0 && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" /> Budget Tips for {form.destination}
              </h3>
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <p className="text-sm text-gray-700">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How it works */}
          {!result && !loading && (
            <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-600" /> How AI Assistant Works
              </h3>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Enter your destination, days, and budget' },
                  { step: '2', text: 'Select your travel mood and preferences' },
                  { step: '3', text: 'Click Generate — AI creates a full day-wise itinerary' },
                  { step: '4', text: 'Use the ₹ button to get smart budget saving tips' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{step}</span>
                    <p className="text-sm text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-semibold">AI is crafting your perfect itinerary...</p>
          <p className="text-gray-400 text-sm mt-1">Analysing {form.destination} for {form.days} days within ₹{Number(form.budget).toLocaleString()}</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-500" /> Your AI Itinerary — {form.destination}
            </h3>
            {result.totalCost && (
              <span className="badge badge-green text-sm px-3 py-1">
                Total: ₹{result.totalCost?.toLocaleString()}
              </span>
            )}
          </div>

          {result.raw ? (
            <div className="bg-green-50 rounded-xl p-5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-green-200">
              {result.raw}
            </div>
          ) : (
            <div className="space-y-4">
              {result.days?.map((day, i) => (
                <div key={i} className="border border-green-200 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold">Day {day.day}</span>
                      {day.city && <span className="text-white/80 text-sm ml-2">— {day.city}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                      {day.transport && <span>🚗 {day.transport}</span>}
                      <span className="font-semibold text-white">₹{day.dailyCost?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {day.activities?.map((act, j) => (
                      <div key={j} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                        <span className="text-xs text-green-700 font-bold w-12 flex-shrink-0 mt-0.5">{act.time}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{act.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{act.duration} • ₹{act.cost?.toLocaleString()}</p>
                          {act.description && <p className="text-xs text-gray-500 mt-1 italic">{act.description}</p>}
                        </div>
                      </div>
                    ))}
                    {day.accommodation && (
                      <p className="text-xs text-gray-500 pt-1 flex items-center gap-1">
                        🏨 <span className="font-medium">Stay:</span> {day.accommodation}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {result.tips?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-bold text-amber-800 mb-3 flex items-center gap-2">💡 Travel Tips</p>
                  <div className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <p key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="text-amber-500 font-bold flex-shrink-0">•</span>{tip}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setResult(null); setForm({ destination: '', days: 3, budget: 10000, mood: 'general', preferences: '' }); }}
                  className="btn-secondary flex-1 justify-center">
                  Generate New
                </button>
                <button onClick={() => { window.print(); }} className="btn-primary flex-1 justify-center">
                  🖨️ Print / Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
