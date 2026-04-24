import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Search, MapPin, X, ArrowRight, Sparkles, Building2, SlidersHorizontal } from 'lucide-react';

const JOB_TYPES = ['All', 'Full-Time', 'Part-Time', 'Contract', 'Internship'];
const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Data / AI', 'Product', 'HR', 'Marketing'];

function JobCard({ job, index }) {
  const typeColor = {
    'Full-Time': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'Contract': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Part-Time': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Internship': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  }[job.type] || 'text-slate-400 bg-white/5 border-white/10';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Link to={`/jobs/${job._id}`} className="glass-card p-6 md:p-8 block border border-white/5 bg-[#111827] hover:bg-[#1f2937] hover:border-white/10 transition-colors shadow-lg">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-[#0b1120] border border-white/5 flex items-center justify-center text-primary-400 font-bold text-2xl shrink-0 transition-transform">
            {job.department?.[0] || 'J'}
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border tracking-wide uppercase ${typeColor}`}>
            {job.type}
          </span>
        </div>

        <h3 className="brand-font text-2xl font-bold text-white mb-3 leading-tight tracking-tight">{job.title}</h3>
        <p className="text-base text-slate-400 font-medium mb-8 line-clamp-2 leading-relaxed">{job.description}</p>

        <div className="flex items-center flex-wrap gap-4 pt-6 border-t border-white/5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Building2 className="w-4 h-4" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 ml-auto text-primary-400 font-bold uppercase text-xs tracking-wider group">
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [dept, setDept] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !search || j.title.toLowerCase().includes(q) || j.department?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q);
    const matchType = type === 'All' || j.type === type;
    const matchDept = dept === 'All' || j.department === dept;
    return matchSearch && matchType && matchDept;
  });

  return (
    <div className="min-h-screen relative font-sans text-slate-200">
      {/* Hero Search Header */}
      <div className="relative pt-24 pb-12 overflow-hidden z-10 border-b border-white/5 bg-[#111827]">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary-400 bg-primary-500/10 px-4 py-2 rounded-lg mb-6 border border-primary-500/20">
              <Sparkles className="w-4 h-4" />
              <span>{jobs.length} Opportunities Waiting For You</span>
            </span>
            <h1 className="brand-font text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight">Find Your Next Step</h1>
            <p className="text-slate-400 text-lg sm:text-xl font-medium">Discover career-defining roles at top global companies</p>
          </motion.div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, location, or team..."
                className="w-full bg-[#0b1120] border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-white placeholder:text-slate-500 focus:border-primary-500 transition-all font-medium outline-none text-lg"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl border text-sm font-semibold uppercase tracking-wider transition-all ${showFilters ? 'bg-primary-600 border-primary-500 text-white' : 'bg-[#0b1120] border-white/5 text-slate-300 hover:border-white/10'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 shadow-xl">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 ml-1">Job Type</p>
                    <div className="flex flex-wrap gap-2">
                      {JOB_TYPES.map(t => (
                        <button key={t} onClick={() => setType(t)} className={`text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all ${type === t ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 ml-1">Preferred Team</p>
                    <div className="flex flex-wrap gap-2">
                      {DEPARTMENTS.map(d => (
                        <button key={d} onClick={() => setDept(d)} className={`text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all ${dept === d ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Job Grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 animate-pulse bg-[#111827]">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-white/5" />
                  <div className="w-20 h-6 rounded-lg bg-white/5" />
                </div>
                <div className="h-6 rounded-lg bg-white/5 mb-4 w-3/4" />
                <div className="h-4 rounded-lg bg-white/5 mb-2 w-full" />
                <div className="h-4 rounded-lg bg-white/5 w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-[#111827] rounded-2xl border border-white/5">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="brand-font text-2xl font-bold text-white mb-2">No matching roles</h3>
            <p className="text-slate-400 font-medium text-lg">Try adjusting your filters to find more opportunities.</p>
            <button onClick={() => { setSearch(''); setType('All'); setDept('All'); }} className="mt-8 text-sm text-primary-400 hover:text-primary-300 font-bold uppercase tracking-wider transition-colors inline-block pb-1 border-b border-primary-500/30">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10 px-2">
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{filtered.length} curated role{filtered.length !== 1 ? 's' : ''} available</p>
              {(search || type !== 'All' || dept !== 'All') && (
                <button onClick={() => { setSearch(''); setType('All'); setDept('All'); }} className="text-xs text-slate-400 hover:text-rose-400 font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors">
                  <X className="w-4 h-4" /><span>Reset Search</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
