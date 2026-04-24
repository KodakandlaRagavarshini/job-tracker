import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Briefcase, LogOut, Bell,
  Zap, ChevronRight, Menu, X
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const sidebarLinks = user.role === 'job_seeker'
    ? [
        { to: '/candidate/dashboard', label: 'My Dashboard', icon: LayoutDashboard, end: true },
        { to: '/candidate/applications', label: 'Applications', icon: Briefcase },
        { to: '/jobs', label: 'Browse Jobs', icon: Zap },
      ]
    : [
        { to: '/dashboard', label: 'Kanban Board', icon: LayoutDashboard, end: true },
        { to: '/dashboard/jobs', label: 'Manage Jobs', icon: Briefcase },
      ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = ({ isMobile = false }) => (
    <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'hidden md:flex flex-col'} ${collapsed && !isMobile ? 'w-[88px]' : 'w-[280px]'} bg-[#111827] border-r border-white/5 flex flex-col justify-between transition-all duration-300 overflow-y-auto`}>
      <div>
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className={`flex items-center space-x-4 ${collapsed && !isMobile ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            {(!collapsed || isMobile) && (
              <span className="brand-font text-2xl font-bold text-white tracking-tight">
                HireMate
              </span>
            )}
          </div>
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} className="ml-auto p-2 text-slate-400 hover:text-white rounded-lg bg-white/5">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Card */}
        {(!collapsed || isMobile) && (
          <div className="px-6 py-6">
            <div className="flex items-center space-x-4 px-4 py-3 rounded-xl bg-[#1f2937] border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {user.name?.[0]?.toUpperCase() || 'R'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                  {user.role === 'job_seeker' ? 'Candidate' : 'Recruiter'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="px-4 mt-2 space-y-2">
          {(!collapsed || isMobile) && (
            <p className="text-[12px] font-semibold text-slate-500 px-4 mb-4 uppercase tracking-wider">Main Menu</p>
          )}
          {sidebarLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center ${collapsed && !isMobile ? 'justify-center px-0 py-3.5' : 'space-x-4 px-5 py-3.5'} rounded-xl text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-primary-600'
                    : 'text-slate-400 hover:text-white hover:bg-[#1f2937]'
                }`
              }
            >
              <Icon className={`w-5 h-5 shrink-0 ${collapsed && !isMobile ? '' : ''}`} />
              {(!collapsed || isMobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#0b1120] overflow-hidden text-slate-300 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden z-50 relative w-[280px] h-full"
            >
              <Sidebar isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 bg-[#111827] border-b border-white/5 flex items-center justify-between px-8 lg:px-10 shrink-0 z-30">
          <div className="flex items-center space-x-6">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-6">
             <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#111827]" />
            </button>
            {/* User avatar + logout dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center space-x-3 bg-white/5 border border-white/5 rounded-xl px-2 py-2 pr-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.[0]?.toUpperCase() || 'R'}
                </div>
                <span className="text-white text-sm font-medium hidden sm:block">{user.name?.split(' ')[0]}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${dropOpen ? 'rotate-90' : '0'}`} />
              </button>
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-[#1f2937] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 p-2"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-white font-medium text-sm truncate">{user.name}</p>
                      <p className="text-slate-400 text-xs truncate mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 transition-all font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto w-full h-full p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
