import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, ShieldAlert, Sparkles, Loader2, FileText, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const startAnalysis = async () => {
    if (!file) return;
    if (!jobDescription.trim()) {
       setError("Please provide a job description.");
       return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      
      const { data } = await api.post('/ats/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to analyze resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] font-sans relative overflow-hidden pb-20 pt-8">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center px-5 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase text-[#a5b4fc] bg-white/[0.03] border border-white/10 shadow-[0_0_20px_rgba(79,70,229,0.15)] backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 mr-2" fill="currentColor" /> AI Resume Scanner
          </div>
          <h1 className="brand-font text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Is your resume <span className="bg-gradient-to-r from-primary-400 via-purple-300 to-indigo-400 text-transparent bg-clip-text">ATS-ready?</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Upload your resume below to our simulated AI engine. We'll score your keywords, formatting, and match potential against real industry standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          {/* Uploader Panel */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="glass-card mb-6">
              <h3 className="brand-font text-2xl font-bold text-white mb-4 flex items-center">Target Job Description</h3>
              <textarea 
                 className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary-500 focus:outline-none transition-colors resize-y h-40"
                 placeholder="Paste the job description here..."
                 value={jobDescription}
                 onChange={(e) => {
                    setJobDescription(e.target.value);
                    setError(null);
                 }}
              ></textarea>
            </div>

            <div className="glass-card flex-1">
              <h3 className="brand-font text-2xl font-bold text-white mb-6 flex items-center"><FileText className="w-6 h-6 mr-3 text-primary-400" /> Upload Resume</h3>
              
              <div className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-colors ${file ? 'bg-primary-500/10 border-primary-500/30' : 'bg-[#0f172a] border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                {file ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto shadow-sm ring-1 ring-white/10 mb-4 text-primary-400 border border-primary-500/20 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                      <CheckCircle2 className="w-8 h-8 text-primary-400" />
                    </div>
                    <span className="text-base font-bold text-white block truncate max-w-[200px] mx-auto">{file.name}</span>
                    <p className="text-sm font-medium text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <div className="mt-6 flex space-x-3">
                      <label className="cursor-pointer text-xs font-bold uppercase tracking-wider text-white hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl shadow-sm border border-white/10 transition-colors">
                        Replace File
                        <input type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer text-center w-full block">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-sm ring-1 ring-white/10 mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-8 w-8 text-slate-500" />
                    </div>
                    <span className="text-sm font-bold text-primary-400">Click to browse</span>
                    <span className="text-sm font-medium text-slate-400"> or drag file here</span>
                    <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase mt-2">PDF</p>
                    <input type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              {error && (
                 <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[13px] font-semibold rounded-xl text-center">
                    {error}
                 </div>
              )}

              <button 
                onClick={startAnalysis}
                disabled={!file || !jobDescription.trim() || analyzing}
                className={`mt-4 w-full py-4 rounded-2xl flex items-center justify-center text-[15px] font-bold tracking-wide transition-all duration-300 ${(!file || !jobDescription.trim() || analyzing) ? 'bg-white/5 text-slate-500 cursor-not-allowed shadow-none border border-white/5' : 'bg-primary-600 text-white shadow-[0_10px_30px_-5px_rgba(79,70,229,0.5)] hover:bg-primary-500 hover:scale-[1.02] border border-primary-500/50'}`}
              >
                {analyzing ? (
                  <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Analyzing Document...</>
                ) : 'Run AI Analysis'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !analyzing && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full glass-card border-dashed flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                   <ShieldAlert className="w-16 h-16 text-slate-600 mb-6" />
                   <h3 className="brand-font text-2xl font-bold text-slate-500">Awaiting Resume</h3>
                   <p className="text-slate-500 mt-2 font-medium">Upload a document to view your personalized AI breakdown.</p>
                </motion.div>
              )}

              {analyzing && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full glass-card flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                   <div className="relative z-10">
                      <div className="w-24 h-24 border-4 border-white/5 rounded-full border-t-primary-500 animate-spin mx-auto"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary-400 animate-pulse" />
                   </div>
                   <h3 className="brand-font text-2xl font-bold text-white mt-8 relative z-10">Simulating Baseline...</h3>
                   <p className="text-slate-400 mt-2 font-medium relative z-10">Extracting textual nodes and comparing against 10M+ job requisitions.</p>
                </motion.div>
              )}

              {result && !analyzing && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                     <div>
                       <h2 className="brand-font text-2xl font-bold text-white">Analysis Results</h2>
                       <p className="text-sm font-medium text-slate-400 mt-1">Simulated breakdown based on ATS standards.</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Overall Match</p>
                       <div className="flex items-center space-x-2">
                         <span className={`text-4xl font-extrabold brand-font tracking-tighter ${result.score >= 80 ? 'text-green-400' : result.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{result.score}</span>
                         <span className="text-slate-500 font-bold self-end mb-1">/ 100</span>
                       </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <ScoreGauge title="Skills Match" score={result.skillsMatch} />
                    <ScoreGauge title="Keyword Density" score={result.keywordMatch} />
                    <ScoreGauge title="ATS Formatting" score={result.formatting} />
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h4 className="font-bold text-white text-sm tracking-wide uppercase mb-4 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-primary-400" /> Actionable Recommendations</h4>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-slate-300 leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreGauge = ({ title, score }) => {
  const isGood = score >= 80;
  const isAvg = score >= 60 && score < 80;
  
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/20 transition-all">
      <div className="w-full relative pt-[100%] rounded-full mb-4">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className={`transition-all duration-1000 ease-out ${isGood ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : isAvg ? 'text-amber-400' : 'text-rose-400'}`} strokeWidth="3" strokeDasharray={`${score}, 100`} stroke="currentColor" fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white brand-font">{score}%</span>
        </div>
      </div>
      <h4 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase text-center">{title}</h4>
    </div>
  );
};
export default ResumeAnalyzer;
