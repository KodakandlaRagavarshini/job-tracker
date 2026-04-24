import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, Building2, ArrowLeft, ArrowRight, Clock, Star, Sparkles, Share2, Bookmark, CheckCircle } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] pt-10 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) return null;

  const typeColor = {
    'Full-Time': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Contract': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Part-Time': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Internship': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }[job.type] || 'bg-white/5 text-slate-400 border-white/10';

  return (
    <div className="min-h-screen bg-[#0b1120] pt-10">
      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Back */}
        <Link to="/jobs" className="inline-flex items-center space-x-2 text-slate-500 hover:text-white text-sm font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Job Header */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-600/20 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-2xl shrink-0">
                  {job.department?.[0] || 'H'}
                </div>
                <div className="flex-1">
                  <h1 className="brand-font text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">{job.title}</h1>
                  <div className="flex items-center flex-wrap gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${typeColor}`}>{job.type}</span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5" /><span>{job.department}</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5" /><span>{job.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="brand-font text-xl font-bold text-white mb-4">Role Overview</h2>
              <p className="text-slate-400 leading-relaxed font-medium">{job.description}</p>

              {job.requirements?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h3 className="brand-font text-lg font-bold text-white mb-4">Requirements</h3>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start space-x-3 text-slate-400">
                        <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                        <span className="text-sm leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI Match Teaser */}
            {user?.role === 'job_seeker' && (
              <div className="glass-card rounded-2xl p-6 border-primary-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5" />
                <div className="relative z-10 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold">AI Match Score</p>
                    <p className="text-slate-400 text-sm">Apply to see your personalized ATS compatibility score.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="mb-6 pb-6 border-b border-white/5">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Posted</p>
                <p className="text-white font-semibold">{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Department</p>
                  <p className="text-white font-semibold">{job.department}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-white font-semibold">{job.location}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Type</p>
                  <p className="text-white font-semibold">{job.type}</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {user?.role === 'job_seeker' ? (
                  <Link
                    to={`/jobs/${id}/apply`}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : !user ? (
                  <Link
                    to={`/login?returnTo=/jobs/${id}/apply`}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <span>Sign In to Apply</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : null}
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`btn-ghost w-full flex items-center justify-center space-x-2 ${bookmarked ? 'text-primary-400 border-primary-500/30' : ''}`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-primary-400' : ''}`} />
                  <span>{bookmarked ? 'Saved' : 'Save Role'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
