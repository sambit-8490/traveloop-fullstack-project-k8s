import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, BookOpen, Bell, Camera, Smile, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MOODS = ['happy', 'excited', 'tired', 'neutral', 'amazing'];
const MOOD_EMOJI = { happy: '😊', excited: '🤩', tired: '😴', neutral: '😐', amazing: '🌟' };

export default function Journal() {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('entries');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [entryForm, setEntryForm] = useState({ title: '', content: '', mood: 'happy', location: '', day: 1 });
  const [reminderForm, setReminderForm] = useState({ title: '', date: '', time: '' });

  useEffect(() => {
    api.get(`/journal/trip/${id}`).then(r => setJournal(r.data)).finally(() => setLoading(false));
  }, [id]);

  const addEntry = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/journal/trip/${id}/entry`, { ...entryForm, date: new Date() });
      setJournal(data);
      setShowEntryForm(false);
      setEntryForm({ title: '', content: '', mood: 'happy', location: '', day: 1 });
      toast.success('Journal entry added!');
    } catch { toast.error('Failed to add entry'); }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/journal/trip/${id}/reminder`, reminderForm);
      setJournal(data);
      setShowReminderForm(false);
      setReminderForm({ title: '', date: '', time: '' });
      toast.success('Reminder set!');
    } catch { toast.error('Failed to set reminder'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <Link to={`/trips/${id}`} className="text-white/70 text-sm flex items-center gap-1 mb-1 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Trip
        </Link>
        <h1 className="text-2xl font-bold">Travel Journal</h1>
        <p className="text-white/70 mt-1">Your travel memories & reminders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'entries', icon: BookOpen, label: 'Journal Entries' }, { id: 'reminders', icon: Bell, label: 'Reminders' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-green-200 hover:border-green-400'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'entries' && (
        <div className="space-y-4">
          <button onClick={() => setShowEntryForm(!showEntryForm)} className="btn-primary">
            <Plus className="w-4 h-4" /> New Entry
          </button>

          {showEntryForm && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-4">New Journal Entry</h3>
              <form onSubmit={addEntry} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Entry title" value={entryForm.title} onChange={e => setEntryForm({ ...entryForm, title: e.target.value })} required />
                  <input className="input-field" placeholder="Location" value={entryForm.location} onChange={e => setEntryForm({ ...entryForm, location: e.target.value })} />
                </div>
                <textarea className="input-field resize-none" rows={4} placeholder="Write about your day..." value={entryForm.content} onChange={e => setEntryForm({ ...entryForm, content: e.target.value })} required />
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-gray-700 self-center">Mood:</span>
                  {MOODS.map(m => (
                    <button key={m} type="button" onClick={() => setEntryForm({ ...entryForm, mood: m })}
                      className={`text-2xl p-1 rounded-lg transition-all ${entryForm.mood === m ? 'bg-green-100 scale-125' : 'hover:bg-gray-100'}`}>
                      {MOOD_EMOJI[m]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowEntryForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 justify-center">Save Entry</button>
                </div>
              </form>
            </div>
          )}

          {journal?.entries?.length === 0 ? (
            <div className="card p-12 text-center">
              <BookOpen className="w-16 h-16 text-green-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No journal entries yet</h3>
              <p className="text-gray-500">Start documenting your travel memories!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {journal?.entries?.map(entry => (
                <div key={entry._id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{MOOD_EMOJI[entry.mood]}</span>
                        <h3 className="font-bold text-gray-800">{entry.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{entry.location} • {entry.date ? format(new Date(entry.date), 'MMM d, yyyy') : ''}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <button onClick={() => setShowReminderForm(!showReminderForm)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Reminder
          </button>

          {showReminderForm && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-4">New Reminder</h3>
              <form onSubmit={addReminder} className="space-y-3">
                <input className="input-field" placeholder="Reminder title" value={reminderForm.title} onChange={e => setReminderForm({ ...reminderForm, title: e.target.value })} required />
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" type="date" value={reminderForm.date} onChange={e => setReminderForm({ ...reminderForm, date: e.target.value })} required />
                  <input className="input-field" type="time" value={reminderForm.time} onChange={e => setReminderForm({ ...reminderForm, time: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowReminderForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 justify-center">Set Reminder</button>
                </div>
              </form>
            </div>
          )}

          {journal?.reminders?.length === 0 ? (
            <div className="card p-12 text-center">
              <Bell className="w-16 h-16 text-green-200 mx-auto mb-4" />
              <p className="text-gray-500">No reminders set</p>
            </div>
          ) : (
            <div className="space-y-3">
              {journal?.reminders?.map(reminder => (
                <div key={reminder._id} className={`card p-4 flex items-center gap-4 ${reminder.completed ? 'opacity-60' : ''}`}>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-gray-800 ${reminder.completed ? 'line-through' : ''}`}>{reminder.title}</p>
                    <p className="text-sm text-gray-500">{reminder.date ? format(new Date(reminder.date), 'MMM d, yyyy') : ''} {reminder.time && `at ${reminder.time}`}</p>
                  </div>
                  <span className={`badge ${reminder.completed ? 'badge-yellow' : 'badge-green'}`}>
                    {reminder.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
