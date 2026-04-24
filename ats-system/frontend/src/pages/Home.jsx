import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, LayoutDashboard, Zap, Shield, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b1120] font-sans selection:bg-primary-500/30 overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-500/20 to-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwSDB2NjBoNjBWMHpNMCAwaDYwdjYwSDBWMHoiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSLCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] -z-10 opacity-50" />

      {/* Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-semibold tracking-wide text-slate-300 uppercase">HireMate 2.0 is Live</span>
          </div>
          
          <h1 className="brand-font text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            The intelligent way to <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">hire top talent.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            A premium talent operating system designed for high-growth teams. Experience seamless candidate pipelines, automated AI intelligence, and unparalleled role management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/signup" className="group relative w-full sm:w-auto flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:-translate-y-1">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/jobs" className="group w-full sm:w-auto flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1">
              Explore Job Board
            </Link>
          </div>
        </motion.div>

        {/* Floating Mockup Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="mt-24 relative mx-auto max-w-5xl"
        >
          {/* Mockup Outer Frame */}
          <div className="rounded-3xl bg-[#111827] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Mockup Header */}
            <div className="h-16 border-b border-white/5 flex items-center px-6 space-x-4 bg-[#0b1120]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-6 w-64 bg-white/5 rounded-md hidden sm:block" />
            </div>
            
            {/* Mockup Content - Mini Kanban */}
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-b from-[#111827] to-[#0b1120] min-h-[400px]">
              {["New Applicants", "Technical Interview", "Culture Fit", "Offer Stage"].map((col, idx) => (
                <div key={col} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${['bg-indigo-400', 'bg-amber-400', 'bg-purple-400', 'bg-emerald-400'][idx]}`} />
                    <span className="text-sm font-bold text-white">{col}</span>
                  </div>
                  
                  {/* Fake Cards */}
                  {[1, 2].map(card => (
                    <div key={card} className="bg-[#1f2937] border border-white/5 rounded-xl p-4 shadow-lg">
                      <div className="w-3/4 h-3 bg-white/10 rounded mb-3" />
                      <div className="flex justify-between items-center w-full">
                         <div className="w-1/2 h-2 bg-white/5 rounded" />
                         <div className="w-6 h-6 rounded-full bg-primary-500/20" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative Floaters */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-12 top-20 hidden lg:flex items-center space-x-3 bg-[#1f2937] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
             <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Zap className="w-5 h-5" /></div>
             <div>
                <p className="text-white font-bold text-sm">ATS Optimized</p>
                <p className="text-emerald-400 text-xs font-semibold">98.4% Accuracy</p>
             </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-12 bottom-20 hidden lg:flex items-center space-x-3 bg-[#1f2937] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
             <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><LayoutDashboard className="w-5 h-5" /></div>
             <div>
                <p className="text-white font-bold text-sm">Unified Kanban</p>
                <p className="text-slate-400 text-xs font-semibold">Real-time sync</p>
             </div>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
           {[
             { title: "Smart Sourcing", icon: Users, desc: "Leverage AI models to parse specific skills, experience, and format viability automatically." },
             { title: "Seamless Operations", icon: Zap, desc: "A beautifully flat, native-feeling workspace designed to reduce recruiter fatigue entirely." },
             { title: "Role-Based Integrity", icon: Shield, desc: "Strictly compartmentalized multi-tenant endpoints map exactly what each officer should see." }
           ].map((feat, i) => (
             <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors">
               <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-400 mb-6">
                 <feat.icon className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
               <p className="text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
