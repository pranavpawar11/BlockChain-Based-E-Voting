import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            Welcome back, <span className="text-blue-600">{user?.name}</span>! 👋
          </h1>
          <p className="text-xl text-gray-600">Your blockchain voting dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold uppercase">Status</p>
                <p className="text-3xl font-bold mt-2">
                  {user?.isVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
              <div className="text-5xl opacity-80">
                {user?.isVerified ? '✅' : '⏳'}
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold uppercase">Role</p>
                <p className="text-3xl font-bold mt-2 capitalize">{user?.role}</p>
              </div>
              <div className="text-5xl opacity-80">
                {user?.role === 'admin' ? '👑' : '🗳️'}
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-transform animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold uppercase">Blockchain</p>
                <p className="text-lg font-bold mt-2">Connected</p>
              </div>
              <div className="text-5xl opacity-80">⛓️</div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 text-white text-3xl">
                👤
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                <p className="text-gray-600">Your account details and blockchain address</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start border-b border-gray-200 pb-4">
                <span className="font-semibold text-gray-700 w-32">Email:</span>
                <span className="text-gray-900">{user?.email}</span>
              </div>
              
              <div className="flex items-start border-b border-gray-200 pb-4">
                <span className="font-semibold text-gray-700 w-32">Role:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {user?.role}
                </span>
              </div>
              
              <div className="flex items-start border-b border-gray-200 pb-4">
                <span className="font-semibold text-gray-700 w-32">Status:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {user?.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                </span>
              </div>
              
              <div className="pt-2">
                <span className="font-semibold text-gray-700 block mb-2">Wallet Address:</span>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <code className="text-sm text-gray-800 break-all font-mono">{user?.walletAddress}</code>
                </div>
                <p className="text-xs text-gray-500 mt-2">🔐 This is your unique blockchain identifier</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card animate-fade-in" style={{animationDelay: '0.4s'}}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/elections')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
              >
                <span>View Elections</span>
                <span>🗳️</span>
              </button>

              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
                >
                  <span>Admin Panel</span>
                  <span>⚙️</span>
                </button>
              )}

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Security Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Blockchain verified
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    End-to-end encrypted
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Anonymous voting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;