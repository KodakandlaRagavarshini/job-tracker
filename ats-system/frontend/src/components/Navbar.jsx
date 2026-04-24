import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'job_seeker' ? '/candidate/dashboard' : '/dashboard';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1120]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center bg-transparent">
        <Link to="/" className="brand-font text-2xl font-bold text-white hover:text-primary-400 transition-colors">
          HireMate
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-slate-400 text-sm font-semibold hidden sm:inline">Hi, {user.name?.split(' ')[0]}</span>
              <Link to={dashboardPath} className="btn-ghost inline-flex items-center justify-center font-bold">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-primary inline-flex items-center justify-center font-bold !bg-rose-500 hover:!bg-rose-600">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost inline-flex items-center justify-center font-bold">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary inline-flex items-center justify-center font-bold">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
