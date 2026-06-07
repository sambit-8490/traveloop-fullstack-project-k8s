import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Globe, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg hero-pattern flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #34d399 0%, transparent 60%), radial-gradient(circle at 70% 20%, #10b981 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-6 animate-float">
            <Globe className="w-11 h-11 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-3">Traveloop</h2>
          <p className="text-white/70 text-lg max-w-xs leading-relaxed">
            Your intelligent travel companion for unforgettable journeys
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {['AI Itineraries', 'Hidden Gems', 'Budget Planner', 'Local Guides'].map(f => (
              <div key={f} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                <span className="text-white/90 text-sm font-medium">✦ {f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-800 text-xl font-bold">Traveloop</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to continue your adventure</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                <input
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                  type="email" placeholder="your@email.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                <input
                  className="w-full pl-10 pr-11 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                  type={showPass ? 'text' : 'password'} placeholder="Your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-emerald-600 hover:underline font-medium">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <p className="text-xs text-emerald-700 font-semibold mb-1">Demo Accounts</p>
            <p className="text-xs text-gray-600">Admin: admin@traveloop.com / admin123</p>
            <p className="text-xs text-gray-600">User: user@traveloop.com / user123</p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            New to Traveloop?{' '}
            <Link to="/register" className="text-emerald-600 font-semibold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
