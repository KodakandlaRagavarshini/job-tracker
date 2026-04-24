import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, MapPin } from 'lucide-react';

const initialApplications = [
  { id: 1, title: 'Senior React Developer', company: 'TechFlow', location: 'Remote', status: 'In Review', date: '2026-04-15', match: 94 },
  { id: 2, title: 'Product Designer', company: 'CreativePulse', location: 'Hybrid', status: 'Shortlisted', date: '2026-04-12', match: 88 },
  { id: 3, title: 'Fullstack Engineer', company: 'NexusSystems', location: 'New York, NY', status: 'Interview', date: '2026-04-10', match: 91 },
  { id: 4, title: 'Backend Lead', company: 'CloudNative', location: 'Remote', status: 'Rejected', date: '2026-04-05', match: 76 },
  { id: 5, title: 'Mobile Developer', company: 'AppWorks', location: 'Austin, TX', status: 'Applied', date: '2026-04-16', match: 82 },
];

const statusConfig = {
  'Applied': { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  'In Review': { icon: Search, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  'Shortlisted': { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  'Interview': { icon: AlertCircle, color: 'text-primary-400', bg: 'bg-primary-400/10', border: 'border-primary-400/20' },
  'Rejected': { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
};

export default function CandidateApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = initialApplications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full text-slate-200 font-sans mx-auto max-w-[1440px]">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="brand-font text-4xl font-bold text-white tracking-tight">My Applications</h1>
        <p className="text-slate-400 text-lg font-medium">Track your progress across {initialApplications.length} positions.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by role or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-white/5 rounded-xl pl-12 pr-6 py-3 text-white placeholder-slate-500 focus:border-primary-500 outline-none focus:bg-[#1f2937]"
          />
        </div>
        <div className="relative w-full md:w-64 group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-[#111827] border border-white/5 rounded-xl pl-12 pr-10 py-3 text-white appearance-none focus:border-primary-500 outline-none font-medium cursor-pointer focus:bg-[#1f2937]"
          >
            <option value="All">All Statuses</option>
            {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Applications List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#1f2937]">
                <th className="px-8 py-5 text-sm font-semibold text-slate-400 uppercase tracking-wider">Position & Company</th>
                <th className="px-8 py-5 text-sm font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-sm font-semibold text-slate-400 uppercase tracking-wider">Date Applied</th>
                <th className="px-8 py-5 text-sm font-semibold text-slate-400 uppercase tracking-wider">Match Score</th>
                <th className="px-8 py-5 text-sm font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filtered.map((app) => {
                  const status = statusConfig[app.status];
                  return (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={app.id}
                      className="hover:bg-[#1f2937]/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-5">
                          <div className="w-14 h-14 rounded-xl bg-[#0b1120] border border-white/5 flex items-center justify-center text-primary-400 font-bold text-2xl shrink-0">
                            {app.company[0]}
                          </div>
                          <div>
                            <div className="text-white text-lg font-bold mb-1">{app.title}</div>
                            <div className="flex items-center text-slate-400 text-sm font-medium">
                              <span className="mr-3">{app.company}</span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-slate-500 group-hover:text-primary-400 transition-colors" />
                                {app.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border ${status.bg} ${status.color} ${status.border}`}>
                          <status.icon className="w-4 h-4 mr-2" />
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-slate-300 font-medium text-sm">{new Date(app.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 h-3 w-28 bg-[#0b1120] rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={`h-full rounded-full ${app.match >= 90 ? 'bg-emerald-500' : 'bg-primary-500'}`}
                              style={{ width: `${app.match}%` }}
                            />
                          </div>
                          <span className="text-white font-bold text-[15px]">{app.match}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right flex justify-end">
                        <button className="p-3 rounded-lg bg-transparent text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1f2937] flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-white font-bold text-xl mb-2">No applications found</p>
              <p className="text-slate-400 text-base">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
