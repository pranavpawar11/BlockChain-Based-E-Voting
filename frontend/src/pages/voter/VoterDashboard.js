import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { electionAPI, voteAPI } from '../../services/api';
import { CheckCircle, XCircle, Shield, Vote, Calendar } from 'lucide-react';
import StatsCards from '../../components/admin/StatsCards';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VoterDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeElections: 0,
    votescast: 0,
    upcomingElections: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const electionsRes = await electionAPI.getActive();
      const elections = electionsRes.data;
      
      let votedCount = 0;
      for (const election of elections) {
        try {
          const statusRes = await voteAPI.checkStatus(election._id);
          if (statusRes.data.hasVoted) votedCount++;
        } catch (e) {
          // Continue if election not accessible
        }
      }

      const now = new Date();
      const active = elections.filter(e => {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        return e.isActive && now >= start && now <= end;
      }).length;

      const upcoming = elections.filter(e => {
        const start = new Date(e.startDate);
        return e.isActive && now < start;
      }).length;

      setStats({
        activeElections: active,
        votescast: votedCount,
        upcomingElections: upcoming
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      icon: Vote,
      label: 'Active Elections',
      value: stats.activeElections,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600'
    },
    {
      icon: CheckCircle,
      label: 'Votes Cast',
      value: stats.votescast,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      icon: Calendar,
      label: 'Upcoming Elections',
      value: stats.upcomingElections,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600'
    }
  ];

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Responsive with gradient text */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2">
            <span className="text-gray-900">Welcome back, </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {user?.name}
            </span>
            <span className="text-gray-900">! 👋</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Your blockchain voting dashboard
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="mb-6 sm:mb-8">
          <StatsCards stats={statsData} />
        </div>

        {/* Verification Alert - Mobile Responsive */}
        {!user?.isVerified && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-start">
              <span className="text-yellow-500 text-xl sm:text-2xl mr-3">⚠️</span>
              <div>
                <p className="text-yellow-800 font-semibold text-sm sm:text-base">Account Not Verified</p>
                <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                  Your account is pending admin verification. You cannot vote until your account is approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information - Takes full width on mobile */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-5 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-3 sm:p-4 text-white text-2xl sm:text-3xl shadow-lg">
                👤
              </div>
              <div className="ml-3 sm:ml-4 flex-1">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Profile Information</h3>
                <p className="text-xs sm:text-sm text-gray-600">Your account details and blockchain address</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                <span className="font-semibold text-gray-700 sm:w-32 mb-1 sm:mb-0 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-blue-600">📧</span> Email:
                </span>
                <span className="text-gray-900 break-all text-sm sm:text-base">{user?.email}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                <span className="font-semibold text-gray-700 sm:w-32 mb-2 sm:mb-0 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-purple-600">🎯</span> Status:
                </span>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold w-fit shadow-sm ${
                  user?.isVerified 
                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                    : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300'
                }`}>
                  {user?.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                <span className="font-semibold text-gray-700 block mb-3 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-yellow-600">🔐</span> Wallet Address:
                </span>
                <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 shadow-inner">
                  <code className="text-xs sm:text-sm text-gray-800 break-all font-mono">{user?.walletAddress}</code>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>🔒</span> This is your unique blockchain identifier
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions - Full width on mobile, sidebar on desktop */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 sm:p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Quick Actions
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/voter/elections')}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-between text-sm sm:text-base"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">🗳️</span> View Elections
                </span>
                <span className="text-xl">→</span>
              </button>

              <div className="pt-4 border-t-2 border-dashed border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-green-500">🛡️</span> Security Features
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-600 mr-2 text-lg">✓</span>
                    <span className="font-medium">Blockchain verified</span>
                  </li>
                  <li className="flex items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-blue-600 mr-2 text-lg">✓</span>
                    <span className="font-medium">End-to-end encrypted</span>
                  </li>
                  <li className="flex items-center p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-purple-600 mr-2 text-lg">✓</span>
                    <span className="font-medium">Anonymous voting</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-base">💡</span>
                    <span>Your votes are permanently recorded on the blockchain and cannot be altered or deleted.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;