import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, Send, CheckCircle, TrendingUp, 
  MapPin, Clock, ArrowRight, Zap, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Applications', icon: Send, value: '12', color: 'text-primary-400', bg: 'bg-primary-600' },
  { label: 'Active Pipeline', icon: Briefcase, value: '5', color: 'text-purple-400', bg: 'bg-purple-600' },
  { label: 'Interview Invites', icon: CheckCircle, value: '3', color: 'text-emerald-400', bg: 'bg-emerald-600' },
  { label: 'Profile Rank', icon: TrendingUp, value: 'Top 5%', color: 'text-indigo-400', bg: 'bg-indigo-600' },
];

const appliedJobs = [
  { id: 1, title: 'Senior React Developer', company: 'TechFlow', status: 'In Review', date: '2 days ago', match: 94 },
  { id: 2, title: 'Product Designer', company: 'CreativePulse', status: 'Shortlisted', date: '5 days ago', match: 88 },
  { id: 3, title: 'Fullstack Engineer', company: 'NexusSystems', status: 'Interview', date: '1 week ago', match: 91 },
];

export default function CandidateDashboard() {
  const { user } = useAuth();

  return (
    <div className="w-full text-slate-200 font-sans mx-auto max-w-[1440px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="space-y-2"
        >
          <h1 className="brand-font text-4xl font-bold text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-400 text-lg font-medium">Your career journey is looking promising today.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link to="/jobs" className="btn-primary group flex items-center shadow-lg">
            <Sparkles className="w-5 h-5 mr-3" />
            <span>Browse New Opportunities</span>
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid - Large Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 md:p-8 flex items-center gap-6 group hover:border-white/10"
          >
            <div className={`w-16 h-16 rounded-xl ${stat.bg} flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105`}>
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="brand-font text-2xl font-bold text-white">Active Pipeline</h2>
            <Link to="/candidate/applications" className="text-primary-400 hover:text-primary-300 text-sm font-semibold flex items-center space-x-2 transition-colors">
              <span>View History</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {appliedJobs.map((job) => (
              <div key={job.id} className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-[#1f2937] transition-all cursor-pointer">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0b1120] border border-white/5 flex items-center justify-center text-primary-400 font-bold text-2xl shrink-0">
                    {job.company[0]}
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-bold mb-1">{job.title}</h3>
                    <p className="text-slate-400 text-sm font-medium flex items-center">
                      {job.company} 
                      <span className="mx-2 w-1 h-1 rounded-full bg-slate-600" /> 
                      Applied {job.date}
                    </p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border bg-[#0b1120] ${
                        job.status === 'Shortlisted' ? 'text-emerald-400 border-emerald-500/20' :
                        job.status === 'Interview' ? 'text-primary-400 border-primary-500/20' :
                        'text-slate-400 border-white/10'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex flex-col sm:items-end mt-4 sm:mt-0">
                   <div className="flex items-center justify-between mb-2 w-full sm:w-36">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Match</span>
                      <span className="text-[15px] font-bold text-white">{job.match}%</span>
                   </div>
                   <div className="h-3 w-full sm:w-36 bg-[#0b1120] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${job.match}%` }} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Profile Completion / Recommended */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <h2 className="brand-font text-2xl font-bold text-white mb-6">Profile Strength</h2>
            <div className="h-4 bg-[#0b1120] rounded-full mb-4 overflow-hidden border border-white/5">
              <div className="h-full w-[85%] bg-primary-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between mb-8">
              <span className="text-white font-bold">85% Complete</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-md">Exceptional</span>
            </div>
            <button className="w-full btn-ghost py-3 flex items-center justify-center">
              <span>Improve Profile</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8"
          >
            <h2 className="brand-font text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 text-amber-400 mr-2" />
              Hot Matches
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Frontend Specialist', loc: 'Remote', salary: '$120k-$150k' },
                { title: 'Product Manager', loc: 'Hybrid', salary: '$140k-$170k' },
              ].map((job, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0b1120] hover:bg-[#1f2937] border border-white/5 transition-colors cursor-pointer">
                  <h4 className="text-white font-bold text-[15px] mb-2">{job.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {job.loc}
                    </span>
                    <span className="text-primary-400 text-xs font-bold bg-primary-500/10 px-2.5 py-1 rounded-md">{job.salary}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
