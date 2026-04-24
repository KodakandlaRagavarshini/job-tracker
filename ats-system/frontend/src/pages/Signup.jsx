import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Zap, ArrowRight, Eye, EyeOff, Briefcase, Users, AlertCircle } from 'lucide-react';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramRole = searchParams.get('role');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: paramRole || 'job_seeker',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      const dashboardPath = res.data.role === 'job_seeker' ? '/candidate/dashboard' : '/dashboard';
      navigate(dashboardPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="brand-font text-4xl font-bold text-white mb-2 tracking-tight">Join HireMate</h1>
          <p className="text-slate-400 text-[15px] font-medium">Start your career journey today</p>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center bg-[#111827] border border-white/5 rounded-2xl p-1.5 mb-6 shadow-sm">
          {[
            { value: 'job_seeker', label: 'Find a Job', icon: Briefcase },
            { value: 'hiring_official', label: 'Hire Talent', icon: Users },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setForm({ ...form, role: value })}
              className={`flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                form.role === value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="glass-card bg-[#111827] rounded-3xl p-8 sm:p-10 border border-white/5 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-6"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-rose-400 text-sm font-semibold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                required
                className="w-full bg-[#0b1120] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:bg-[#1f2937] focus:border-primary-500 transition-colors font-medium outline-none text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full bg-[#0b1120] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:bg-[#1f2937] focus:border-primary-500 transition-colors font-medium outline-none text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Security Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full bg-[#0b1120] border border-white/5 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-slate-500 focus:bg-[#1f2937] focus:border-primary-500 transition-colors font-medium outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Workspace'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 mt-8 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
