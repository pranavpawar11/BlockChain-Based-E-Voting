import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import RegisterAdmin from './pages/RegisterAdmin';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Elections from './pages/Elections';
import Vote from './pages/Vote';
import Results from './pages/Results';
import AdminDashboard from './pages/AdminDashboard';
import VerifyVoters from './pages/VerifyVoters';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/elections" 
            element={
              <ProtectedRoute>
                <Elections />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vote/:electionId" 
            element={
              <ProtectedRoute>
                <Vote />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results/:electionId" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/verify-voters" 
            element={
              <ProtectedRoute adminOnly={true}>
                <VerifyVoters />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;