import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
              <span className="text-3xl">🗳️</span>
              <span className="text-xl font-bold hidden sm:block">Blockchain Ballotbox</span>
              <span className="text-xl font-bold sm:hidden">BBallot</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-blue-100 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/elections" className="text-white hover:text-blue-100 font-medium transition-colors">
                  Elections
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="text-white text-sm bg-blue-700 px-4 py-2 rounded-lg">
                    <span className="font-semibold">{user.name}</span>
                    <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">{user.role}</span>
                  </div>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-blue-100 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-600 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-blue-600">
                  Dashboard
                </Link>
                <Link to="/elections" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-blue-600">
                  Elections
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-blue-600">
                    Admin Panel
                  </Link>
                )}
                <div className="px-3 py-2 text-white text-sm">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-blue-200">{user.role}</div>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-blue-600">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-blue-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;