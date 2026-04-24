import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?returnTo=${location.pathname}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user lacks permission, redirect to their proper dashboard
    const defaultDash = user.role === 'job_seeker' ? '/candidate/dashboard' : '/dashboard';
    return <Navigate to={defaultDash} replace />;
  }

  return children;
}
