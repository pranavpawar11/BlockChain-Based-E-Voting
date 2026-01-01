import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import VoterLayout from './components/layouts/VoterLayout';
import PublicLayout from './components/layouts/PublicLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterAdmin from './pages/auth/RegisterAdmin';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ElectionManagement from './pages/admin/ElectionManagement';
import VoterVerification from './pages/admin/VoterVerification';

// Voter Pages
import VoterDashboard from './pages/voter/VoterDashboard';
import Elections from './pages/voter/Elections';
import VotingPage from './pages/voter/VotingPage';
import Results from './pages/voter/Results';

// Loading Component
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/voter/dashboard" />;
  }

  // Prevent admins from accessing voter routes
  if (!adminOnly && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
      </Route>

      {/* Admin Routes - Completely Separate */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="elections" element={<ElectionManagement />} />
        <Route path="voters" element={<VoterVerification />} />
      </Route>

      {/* Voter Routes - Completely Separate */}
      <Route path="/voter" element={
        <ProtectedRoute>
          <VoterLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/voter/dashboard" />} />
        <Route path="dashboard" element={<VoterDashboard />} />
        <Route path="elections" element={<Elections />} />
        <Route path="vote/:electionId" element={<VotingPage />} />
        <Route path="results/:electionId" element={<Results />} />
      </Route>

      {/* Redirect old routes */}
      <Route path="/dashboard" element={<Navigate to="/voter/dashboard" />} />
      <Route path="/elections" element={<Navigate to="/voter/elections" />} />
      <Route path="/vote/:electionId" element={<Navigate to="/voter/vote/:electionId" />} />
      <Route path="/results/:electionId" element={<Navigate to="/voter/results/:electionId" />} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;