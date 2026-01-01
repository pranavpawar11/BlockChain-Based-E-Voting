import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Vote, Menu, X } from 'lucide-react';

const PublicLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Hide navbar on landing page for clean hero section
  const showNavbar = location.pathname !== '/';

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

  return (
    <div className="min-h-screen">
      {showNavbar && (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <Vote className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Blockchain Ballotbox</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Contact
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
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
                style={{ animation: isAnimating ? 'none' : 'fadeIn 0.3s ease-in-out' }}
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

                  {/* Menu Items with stagger animation */}
                  <div className="flex flex-col p-4 space-y-4">
                    <Link 
                      to="/" 
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all transform hover:translate-x-1"
                      style={{ animation: 'slideInRight 0.3s ease-out 0.1s both' }}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/about" 
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all transform hover:translate-x-1"
                      style={{ animation: 'slideInRight 0.3s ease-out 0.15s both' }}
                    >
                      About
                    </Link>
                    <Link 
                      to="/contact" 
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all transform hover:translate-x-1"
                      style={{ animation: 'slideInRight 0.3s ease-out 0.2s both' }}
                    >
                      Contact
                    </Link>
                    <Link 
                      to="/login" 
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all transform hover:translate-x-1"
                      style={{ animation: 'slideInRight 0.3s ease-out 0.25s both' }}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={closeMobileMenu}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-center transform hover:scale-105"
                      style={{ animation: 'slideInRight 0.3s ease-out 0.3s both' }}
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.5;
          }
        }

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
      
      <Outlet />
    </div>
  );
};

export default PublicLayout;