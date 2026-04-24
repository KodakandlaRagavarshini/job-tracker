import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Zap, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      
      if (returnTo) {
        navigate(returnTo);
      } else {
        const dashboardPath = res.data.role === 'job_seeker' ? '/candidate/dashboard' : '/dashboard';
        navigate(dashboardPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
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
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="brand-font text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-[15px] font-medium">Sign in to your HireMate workspace</p>
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
              <label className="block text-sm font-semibold text-slate-300 mb-2">Professional Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
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
                  placeholder="••••••••"
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
                'Enter Workspace'
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 text-center">One-Click Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Recruiter', email: 'admin@hiremate.com', pass: 'password123', bg: 'hover:bg-primary-500/10 hover:border-primary-500/30' },
                { label: 'Candidate', email: 'candidate@hiremate.com', pass: 'password123', bg: 'hover:bg-purple-500/10 hover:border-purple-500/30' },
              ].map(({ label, email, pass, bg }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ email, password: pass })}
                  className={`p-3 rounded-xl border border-white/5 bg-[#0b1120] transition-colors text-left outline-none ${bg}`}
                >
                  <span className="block text-xs font-bold mb-1 text-slate-300">{label}</span>
                  <span className="block text-[11px] text-slate-500 truncate">{email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-8 font-medium">
          New to HireMate?{' '}
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
