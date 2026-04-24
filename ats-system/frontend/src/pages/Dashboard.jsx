import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  Search, X, ExternalLink, ChevronDown, 
  Sparkles, MessageSquare, FileText
} from 'lucide-react';

const COLUMNS = [
  { id: 'New', title: 'New Applications', dot: 'bg-indigo-400' },
  { id: 'Under Review', title: 'Under Review', dot: 'bg-amber-400' },
  { id: 'Shortlisted', title: 'Shortlisted', dot: 'bg-emerald-400' },
  { id: 'Rejected', title: 'Rejected', dot: 'bg-rose-400' },
];

function CandidateModal({ candidate, onClose, onStatusChange }) {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(candidate.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/candidates/${candidate._id}/status`, { status, notes: note || undefined });
      onStatusChange(candidate._id, status);
      onClose();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const atsColor = candidate.atsScore >= 80 ? 'text-emerald-400' : candidate.atsScore >= 60 ? 'text-amber-400' : 'text-rose-400';
  const atsBg = candidate.atsScore >= 80 ? 'bg-emerald-500' : candidate.atsScore >= 60 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 flex items-start justify-between shrink-0 bg-[#111827]">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {candidate.firstName?.[0]}{candidate.lastName?.[0]}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1.5">{candidate.firstName} {candidate.lastName}</h3>
              <p className="text-slate-400 text-sm font-medium">{candidate.jobId?.title || 'Applied position'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {/* ATS Score */}
          <div className="bg-[#1f2937] border border-white/5 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Sparkles className={`w-6 h-6 ${atsColor}`} />
                <span className="text-sm font-semibold text-slate-300">ATS Match Score</span>
              </div>
              <span className={`text-3xl font-bold ${atsColor}`}>{candidate.atsScore}%</span>
            </div>
            <div className="h-3 w-full bg-[#0b1120] rounded-full overflow-hidden">
              <div className={`h-full ${atsBg}`} style={{ width: `${candidate.atsScore}%` }} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { label: 'Email', value: candidate.email },
              { label: 'Phone', value: candidate.phone },
              { label: 'Experience', value: candidate.yearsExperience ? `${candidate.yearsExperience} years` : 'N/A' },
              { label: 'Applied', value: new Date(candidate.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#1f2937] border border-white/5 rounded-xl p-5">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
                <p className="text-white text-[15px] font-medium truncate">{value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Cover Letter */}
          {candidate.coverLetter && (
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2"><MessageSquare className="w-4 h-4" /><span>Cover Letter</span></p>
              <div className="text-slate-300 text-[15px] leading-relaxed bg-[#1f2937] border border-white/5 rounded-xl p-6">
                {candidate.coverLetter}
              </div>
            </div>
          )}

          {/* Links */}
          {(candidate.portfolioUrl || candidate.resumeUrl) && (
            <div className="flex gap-4 mb-8">
              {candidate.resumeUrl && (
                <a href={`http://https://job-tracker-imch.onrender.com:5000${candidate.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
                  <FileText className="w-5 h-5 mr-2" /> View Resume
                </a>
              )}
              {candidate.portfolioUrl && (
                <a href={candidate.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1">
                  <ExternalLink className="w-5 h-5 mr-2" /> Portfolio
                </a>
              )}
            </div>
          )}

          {/* Status & Note */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Pipeline Status</label>
              <div className="grid grid-cols-4 gap-3">
                {COLUMNS.map(col => (
                  <button
                    key={col.id}
                    onClick={() => setStatus(col.id)}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all border ${status === col.id ? `bg-primary-600 border-primary-500 text-white` : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    {col.id === 'Under Review' ? 'Review' : col.id}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Interviewer Notes</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add private recruitment notes..." className="w-full text-[15px] resize-y" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-[#1f2937] shrink-0 mt-auto">
          <button onClick={handleSave} disabled={saving} className="w-full btn-primary bg-white text-black hover:bg-slate-200">
            {saving ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function KanbanCard({ candidate, onClick, provided, snapshot }) {
  const atsColor = candidate.atsScore >= 80 ? 'text-emerald-400' : candidate.atsScore >= 60 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={onClick}
      className={`glass-card p-5 cursor-pointer bg-[#1f2937] hover:bg-[#334155] ${snapshot.isDragging ? 'rotate-2 scale-[1.02] border-primary-500/50 shadow-2xl' : 'border-white/5'}`}
    >
      <div className="flex items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#0b1120] border border-white/5 flex items-center justify-center text-primary-400 font-bold shrink-0 mr-4">
          {candidate.firstName?.[0]}{candidate.lastName?.[0]}
        </div>
        <div className="min-w-0">
          <p className="text-white text-base font-bold truncate">{candidate.firstName} {candidate.lastName}</p>
          <p className="text-slate-400 text-xs font-medium truncate mt-1">{candidate.jobId?.title || '—'}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center space-x-1.5 bg-[#0b1120] px-2.5 py-1 rounded-md border border-white/5">
          <Sparkles className={`w-3.5 h-3.5 ${atsColor}`} />
          <span className={`text-[11px] font-bold tracking-wide ${atsColor}`}>{candidate.atsScore}%</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">{new Date(candidate.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [cRes, jRes] = await Promise.all([api.get('/candidates'), api.get('/jobs/me')]);
      setCandidates(cRes.data);
      setJobs(jRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;
    const newStatus = destination.droppableId;
    setCandidates(prev => prev.map(c => c._id === draggableId ? { ...c, status: newStatus } : c));
    try { await api.put(`/candidates/${draggableId}/status`, { status: newStatus }); }
    catch (err) { console.error('Status update failed:', err); fetchData(); }
  };

  const handleStatusChange = (id, newStatus) => {
    setCandidates(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
  };

  const getColCandidates = (status) => candidates.filter(c => {
    const matchJob = selectedJob === 'All' || c.jobId?._id === selectedJob;
    const matchSearch = !search || `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase());
    return c.status === status && matchJob && matchSearch;
  });

  const stats = {
    total: candidates.length,
    shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
    avgAts: candidates.length ? Math.round(candidates.reduce((s, c) => s + c.atsScore, 0) / candidates.length) : 0,
    jobs: jobs.length,
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full text-slate-200">
      {/* Top Header Section */}
      <div className="mb-10">
        <h1 className="brand-font text-4xl font-bold text-white mb-2">Recruitment Pipeline</h1>
        <p className="text-slate-400 text-lg">Manage and evaluate incoming talent applications.</p>
      </div>

      {/* Stats Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Output', value: stats.total, color: 'text-primary-400' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'text-emerald-400' },
          { label: 'Avg Accuracy', value: `${stats.avgAts}%`, color: 'text-purple-400' },
          { label: 'Active Jobs', value: stats.jobs, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-6 flex flex-col justify-center">
            <span className="text-slate-400 text-sm font-semibold mb-2">{s.label}</span>
            <span className={`text-4xl font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="w-full bg-[#111827] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:border-primary-500 focus:bg-[#1f2937]"
          />
        </div>
        <div className="relative w-64">
          <select
            value={selectedJob}
            onChange={e => setSelectedJob(e.target.value)}
            className="w-full bg-[#111827] border border-white/5 rounded-xl pl-4 pr-10 py-3 text-white outline-none focus:border-primary-500 appearance-none focus:bg-[#1f2937]"
          >
            <option value="All">All Jobs</option>
            {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto min-h-[500px] mb-8 pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-6 min-w-max">
            {COLUMNS.map(col => {
              const colCandidates = getColCandidates(col.id);
              return (
                <div key={col.id} className="flex flex-col w-[340px] bg-[#111827] rounded-2xl border border-white/5 p-4 shrink-0">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <h3 className="text-white font-semibold text-[15px]">{col.title}</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#1f2937] text-slate-400">
                      {colCandidates.length}
                    </span>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 rounded-xl p-2 transition-colors overflow-y-auto space-y-3 custom-scrollbar ${snapshot.isDraggingOver ? 'bg-white/5' : 'bg-transparent'}`}
                      >
                        {colCandidates.map((c, i) => (
                          <Draggable key={c._id} draggableId={c._id} index={i}>
                            {(provided, snapshot) => (
                              <KanbanCard
                                candidate={c}
                                provided={provided}
                                snapshot={snapshot}
                                onClick={() => setSelectedCandidate(c)}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Candidate Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
