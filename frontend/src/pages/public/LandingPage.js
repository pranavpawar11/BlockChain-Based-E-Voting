import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, CheckCircle, TrendingUp, Vote, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Vote className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Blockchain Ballotbox</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-blue-400 font-medium transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-blue-400 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-white hover:text-blue-400 font-medium transition-colors">
                Contact
              </Link>
              <Link to="/login" className="text-white hover:text-blue-400 font-medium transition-colors">
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
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Side Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
              onClick={closeMobileMenu}
            ></div>

            {/* Side Menu */}
            <div className="fixed top-0 right-0 h-full w-64 bg-slate-900 shadow-2xl z-50 md:hidden border-l border-slate-800">
              <div className="flex flex-col h-full bg-slate-900">
                {/* Menu Header */}
                <div className="flex bg-slate-900 justify-between items-center p-4 border-b border-slate-800">
                  <span className="text-lg font-bold text-white">Menu</span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col p-4 space-y-4 bg-slate-900">
                  <Link 
                    to="/" 
                    onClick={closeMobileMenu}
                    className="text-white hover:text-blue-400 font-medium py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={closeMobileMenu}
                    className="text-white hover:text-blue-400 font-medium py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={closeMobileMenu}
                    className="text-white hover:text-blue-400 font-medium py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Contact
                  </Link>
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu}
                    className="text-white hover:text-blue-400 font-medium py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={closeMobileMenu}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-center"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">Secure • Transparent • Immutable</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Democracy Meets
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Blockchain Technology
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              Experience the future of voting with our decentralized, transparent, and tamper-proof blockchain-based voting system. Every vote counts, every vote matters, every vote is secure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
              >
                Start Voting Now
              </button>
              <button
                onClick={() => navigate('/about')}
                className="bg-slate-800/50 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold text-lg border border-slate-700 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all">
              <div className="bg-blue-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Secure by Design</h3>
              <p className="text-gray-400">
                Military-grade encryption and blockchain technology ensure your vote remains private and tamper-proof.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all">
              <div className="bg-cyan-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">100% Transparent</h3>
              <p className="text-gray-400">
                Every vote is recorded on the blockchain, providing complete transparency while maintaining anonymity.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all">
              <div className="bg-purple-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Real-Time Results</h3>
              <p className="text-gray-400">
                Watch election results update in real-time with instant blockchain verification and validation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-sm sm:text-base text-gray-400">Transparent</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">⛓️</div>
              <div className="text-sm sm:text-base text-gray-400">Blockchain Secured</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">🔒</div>
              <div className="text-sm sm:text-base text-gray-400">Anonymous Voting</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">✓</div>
              <div className="text-sm sm:text-base text-gray-400">Verified Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-gray-400">Simple, secure, and transparent voting in three steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Register & Verify</h3>
              <p className="text-gray-400">
                Create your account and get verified by administrators to ensure election integrity.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cast Your Vote</h3>
              <p className="text-gray-400">
                Select your candidate and confirm your vote. It's immediately recorded on the blockchain.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">View Results</h3>
              <p className="text-gray-400">
                Track real-time results with complete transparency and blockchain verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 to-cyan-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Experience the Future of Voting?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-10">
            Join thousands of users who trust blockchain technology for secure, transparent elections.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-gray-100 text-blue-900 px-10 py-4 rounded-lg font-bold text-lg shadow-2xl transition-all transform hover:scale-105"
          >
            Create Your Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Vote className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold text-white">Blockchain Ballotbox</span>
              </div>
              <p className="text-gray-400 mb-4">
                Revolutionizing democracy through blockchain technology. Secure, transparent, and immutable voting for everyone.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Powered by Blockchain Technology</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Login</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-white transition-colors">Register</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Admin</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/register-admin')} className="hover:text-white transition-colors">Admin Registration</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-gray-500 text-sm">
            <p>&copy; 2025 Blockchain Ballotbox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;