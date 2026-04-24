import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';
import DashboardJobs from './pages/DashboardJobs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateApplications from './pages/CandidateApplications';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import AICopilot from './components/AICopilot';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/candidate');
  
  if (isDashboard) return children;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120]">
      <Navbar />
      <main className="flex-grow flex flex-col pt-20">
        {children}
      </main>
      <AICopilot />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/jobs/:id/apply" element={<Apply />} />
            <Route path="/analyzer" element={<ResumeAnalyzer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Recruiter Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['hiring_official']}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/jobs" element={
              <ProtectedRoute allowedRoles={['hiring_official']}>
                <DashboardLayout>
                  <DashboardJobs />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Candidate Dashboard */}
            <Route path="/candidate/dashboard" element={
              <ProtectedRoute allowedRoles={['job_seeker']}>
                <DashboardLayout>
                  <CandidateDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/candidate/applications" element={
              <ProtectedRoute allowedRoles={['job_seeker']}>
                <DashboardLayout>
                  <CandidateApplications />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    </ErrorBoundary>
  );
}