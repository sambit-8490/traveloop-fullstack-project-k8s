import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset instructions sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen gradient-bg hero-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <Globe className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-white/70 mt-2">We'll send you reset instructions</p>
        </div>
        <div className="glass rounded-2xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Check Your Email</h3>
              <p className="text-gray-600 text-sm">Reset instructions sent to {email}</p>
              <Link to="/login" className="btn-primary mt-4 inline-flex">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input className="input-field pl-10" type="email" placeholder="your@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-green-600 mt-2">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
