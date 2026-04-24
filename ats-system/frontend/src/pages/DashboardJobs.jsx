import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Plus, Pencil, Trash2, X, Briefcase, MapPin, Building2, Clock, Users, Eye, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

const TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
const DEPARTMENTS = ['Engineering', 'Design', 'Data / AI', 'Product', 'HR', 'Marketing', 'Sales', 'Operations'];

function JobModal({ job, onClose, onSaved }) {
  const isEdit = !!job;
  const [form, setForm] = useState(
    job
      ? { title: job.title, department: job.department, location: job.location, type: job.type, description: job.description, requirements: job.requirements?.join('\n') || '' }
      : { title: '', department: '', location: '', type: 'Full-Time', description: '', requirements: '' }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.title || !form.department || !form.location || !form.description) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
      };
      if (isEdit) {
        const res = await api.put(`/jobs/${job._id}`, payload);
        onSaved(res.data, 'update');
      } else {
        const res = await api.post('/jobs', payload);
        onSaved(res.data, 'create');
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1120]/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-[#111827] shadow-2xl rounded-3xl w-full max-w-2xl mx-4 overflow-hidden border border-white/10 max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="brand-font text-xl font-bold text-white">{isEdit ? 'Edit Requisition' : 'Post New Job'}</h2>
            <p className="text-slate-500 text-sm">{isEdit ? `Editing: ${job.title}` : 'Fill in the details below to post a new position.'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Job Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Frontend Engineer" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Department *</label>
              <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 transition-all text-sm appearance-none">
                <option value="" disabled className="bg-[#070d1a]">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#070d1a]">{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Employment Type *</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 transition-all text-sm appearance-none">
                {TYPES.map(t => <option key={t} value={t} className="bg-[#070d1a]">{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Location *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. San Francisco, CA | Remote | Hybrid" className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Job Description *</label>
            <textarea rows={5} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the role, responsibilities, and day-to-day tasks..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm resize-none leading-relaxed" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Requirements <span className="text-slate-600 normal-case font-normal">(one per line)</span></label>
            <textarea rows={4} value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} placeholder={"3+ years of React experience\nStrong TypeScript skills\nExperience with REST APIs"} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm resize-none leading-relaxed" />
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex space-x-3 shrink-0">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle className="w-4 h-4" /><span>{isEdit ? 'Update Job' : 'Post Job'}</span></>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalJob, setModalJob] = useState(undefined); // undefined = closed, null = create, object = edit
  const [deleting, setDeleting] = useState(null);
  const [success, setSuccess] = useState('');

  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get('/jobs/me');
      setJobs(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSaved = (savedJob, action) => {
    if (action === 'create') {
      setJobs(prev => [savedJob, ...prev]);
      setSuccess('Job posted successfully!');
    } else {
      setJobs(prev => prev.map(j => j._id === savedJob._id ? savedJob : j));
      setSuccess('Job updated successfully!');
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return;
    setDeleting(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      setSuccess('Job deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    finally { setDeleting(null); }
  };

  const typeColors = {
    'Full-Time': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Contract': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Part-Time': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Internship': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="brand-font text-3xl font-bold text-white mb-1">Manage Requisitions</h1>
          <p className="text-slate-400 font-medium">{jobs.length} active job posting{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setModalJob(null)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" /><span>Post a Job</span>
        </button>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center space-x-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-emerald-400 text-sm font-medium">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-28 animate-pulse" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl mb-2">No jobs posted yet</h3>
          <p className="text-slate-500 mb-6">Create your first job listing to start receiving applications.</p>
          <button onClick={() => setModalJob(null)} className="btn-primary inline-flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Post Your First Job</span></button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div key={job._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card rounded-2xl p-6 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-primary-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg shrink-0">
                    {job.department?.[0] || 'J'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="brand-font text-lg font-bold text-white mb-1 truncate">{job.title}</h3>
                    <div className="flex items-center flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1.5 font-semibold"><Building2 className="w-3.5 h-3.5" /><span>{job.department}</span></span>
                      <span className="flex items-center space-x-1.5"><MapPin className="w-3.5 h-3.5" /><span>{job.location}</span></span>
                      <span className={`px-2.5 py-1 rounded-lg border font-bold ${typeColors[job.type] || 'bg-white/5 text-slate-400 border-white/10'}`}>{job.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setModalJob(job)}
                    className="p-2.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={deleting === job._id}
                    className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === job._id ? <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mt-4 ml-16">{job.description}</p>
              <div className="ml-16 mt-3 text-xs text-slate-600 font-medium">
                Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalJob !== undefined && (
          <JobModal job={modalJob} onClose={() => setModalJob(undefined)} onSaved={handleSaved} />
        )}
      </AnimatePresence>
    </div>
  );
}
