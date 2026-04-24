import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Upload, ArrowLeft, ArrowRight, CheckCircle, Sparkles, AlertCircle, FileText, User, Phone, Mail, Globe, MessageSquare, Briefcase } from 'lucide-react';

const STEPS = ['Your Details', 'Resume Upload', 'Cover Letter', 'Submit'];

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    portfolioUrl: '',
    yearsExperience: '',
    coverLetter: '',
  });

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => setJob(r.data)).catch(() => navigate('/jobs'));
  }, [id]);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }
    setResumeFile(file);
    setError('');
  };

  const validate = () => {
    if (step === 0) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
        setError('Please fill in all required fields.');
        return false;
      }
    }
    if (step === 1 && !resumeFile) {
      setError('Please upload your resume.');
      return false;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validate()) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('jobId', id);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('resume', resumeFile);
      const res = await api.post('/candidates/apply', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="text-center max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300 }} className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <h2 className="brand-font text-4xl font-bold text-white mb-4">Application Sent!</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">Your application for <span className="text-white font-semibold">{job?.title}</span> has been submitted. The team will be in touch soon.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/candidate/applications" className="btn-primary flex items-center justify-center space-x-2">
              <Briefcase className="w-4 h-4" /><span>View My Applications</span>
            </Link>
            <Link to="/jobs" className="btn-ghost flex items-center justify-center space-x-2">
              <span>Browse More Jobs</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] pt-10 pb-12">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <Link to={`/jobs/${id}`} className="inline-flex items-center space-x-2 text-slate-500 hover:text-white text-sm font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /><span>Back to Job</span>
        </Link>

        {/* Job info banner */}
        {job && (
          <div className="glass-card rounded-2xl p-5 mb-8 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg shrink-0">
              {job.department?.[0]}
            </div>
            <div>
              <p className="text-white font-bold">{job.title}</p>
              <p className="text-slate-500 text-sm">{job.department} · {job.location}</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary-600 text-white ring-4 ring-primary-500/30' : 'bg-white/5 text-slate-600 border border-white/10'}`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all ${i < step ? 'bg-emerald-500' : 'bg-white/5'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Step Content */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="brand-font text-2xl font-bold text-white mb-2">{STEPS[step]}</h2>
          <p className="text-slate-500 text-sm mb-8">
            {step === 0 && "Tell us a bit about yourself."}
            {step === 1 && "Upload your latest resume (PDF or DOCX, max 5MB)."}
            {step === 2 && "Explain why you're a great fit for this role."}
            {step === 3 && "Review everything before submitting."}
          </p>

          {/* Step 0: Identity */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[['firstName', 'First Name', 'John'], ['lastName', 'Last Name', 'Doe']].map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label} *</label>
                    <input type="text" value={form[field]} onChange={e => updateField(field, e.target.value)} placeholder={placeholder} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email *</label>
                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" /><input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="you@example.com" required className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone *</label>
                  <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" /><input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+1 (555) 000-0000" required className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm" /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Years Experience</label>
                  <input type="number" min="0" max="50" value={form.yearsExperience} onChange={e => updateField('yearsExperience', e.target.value)} placeholder="e.g. 5" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Portfolio / LinkedIn URL</label>
                <div className="relative"><Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" /><input type="url" value={form.portfolioUrl} onChange={e => updateField('portfolioUrl', e.target.value)} placeholder="https://yourportfolio.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm" /></div>
              </div>
            </div>
          )}

          {/* Step 1: Resume */}
          {step === 1 && (
            <div>
              <label className="block cursor-pointer">
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${resumeFile ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 hover:border-primary-500/40 hover:bg-primary-500/5'}`}>
                  {resumeFile ? (
                    <div>
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                      <p className="text-emerald-400 font-bold">{resumeFile.name}</p>
                      <p className="text-slate-500 text-sm mt-1">{(resumeFile.size / 1024).toFixed(1)} KB · Click to replace</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-white font-bold text-lg mb-1">Drop your resume here</p>
                      <p className="text-slate-500 font-medium">or click to browse</p>
                      <p className="text-slate-600 text-xs mt-3">PDF or DOCX · Max 5MB</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          )}

          {/* Step 2: Cover Letter */}
          {step === 2 && (
            <div>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                <textarea value={form.coverLetter} onChange={e => updateField('coverLetter', e.target.value)} rows={8} placeholder="Tell us why you'd be a great fit for this role. Mention your relevant experience, what excites you about the position, and what you'd bring to the team..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:border-primary-500/50 transition-all text-sm resize-none leading-relaxed" />
              </div>
              <p className="text-xs text-slate-600 mt-2 text-right">{form.coverLetter.length} characters {form.coverLetter.length > 200 && '· Excellent!'}</p>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                {[
                  ['Name', `${form.firstName} ${form.lastName}`],
                  ['Email', form.email],
                  ['Phone', form.phone],
                  ['Experience', form.yearsExperience ? `${form.yearsExperience} years` : 'Not specified'],
                  ['Portfolio', form.portfolioUrl || 'Not provided'],
                  ['Resume', resumeFile?.name],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-500 font-semibold">{label}</span>
                    <span className="text-white font-medium text-right max-w-[60%] truncate">{val}</span>
                  </div>
                ))}
              </div>
              {form.coverLetter && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cover Letter Preview</p>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">{form.coverLetter}</p>
                </div>
              )}
              <div className="flex items-center space-x-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary-400 shrink-0" />
                <p className="text-primary-300 text-sm font-medium">An ATS score will be generated for your application upon submission.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(`/jobs/${id}`)} className="btn-ghost flex items-center space-x-2 text-sm">
              <ArrowLeft className="w-4 h-4" /><span>Back</span>
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={nextStep} className="btn-primary flex items-center space-x-2">
                <span>Continue</span><ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center space-x-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Submit Application</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
