import React, { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Vote, BarChart3, User, LogOut, Menu, X } from 'lucide-react';

const VoterLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setMobileMenuOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setMobileMenuOpen(true);
    }
  };

  const closeMobileMenu = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoutAndClose = () => {
    closeMobileMenu();
    setTimeout(() => {
      handleLogout();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Vote className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Blockchain Ballotbox</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/voter/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/voter/elections" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Elections
              </Link>
              
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Voter</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Side Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop with fade animation */}
            <div 
              className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ease-in-out ${
                isAnimating ? 'opacity-0' : 'opacity-50'
              }`}
              onClick={closeMobileMenu}
            ></div>

            {/* Side Menu with slide animation */}
            <div 
              className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden transition-transform duration-300 ease-in-out ${
                isAnimating ? 'translate-x-full' : 'translate-x-0'
              }`}
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Menu</span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                {/* User Info */}
                <div 
                  className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
                  style={{ animation: isAnimating ? 'none' : 'slideInRight 0.3s ease-out 0.1s both' }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">Voter</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items with stagger animation */}
                <div className="flex flex-col p-4 space-y-4 flex-1">
                  <Link 
                    to="/voter/dashboard" 
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all transform hover:translate-x-1"
                    style={{ animation: isAnimating ? 'none' : 'slideInRight 0.3s ease-out 0.15s both' }}
                  >
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <Link 
                    to="/voter/elections" 
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all transform hover:translate-x-1"
                    style={{ animation: isAnimating ? 'none' : 'slideInRight 0.3s ease-out 0.2s both' }}
                  >
                    <div className="flex items-center space-x-3">
                      <Vote className="w-5 h-5" />
                      <span>Elections</span>
                    </div>
                  </Link>
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={handleLogoutAndClose}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                    style={{ animation: isAnimating ? 'none' : 'slideInRight 0.3s ease-out 0.25s both' }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Main Content */}
      <Outlet />
    </div>
  );
};

export default VoterLayout;