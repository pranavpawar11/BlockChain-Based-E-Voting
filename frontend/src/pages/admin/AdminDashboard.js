// pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { electionAPI, userAPI } from '../../services/api';
import { Vote, Users, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    totalVoters: 0,
    pendingVerifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [electionsRes, usersRes, pendingRes] = await Promise.all([
        electionAPI.getAll(),
        userAPI.getAllUsers(),
        userAPI.getPendingUsers()
      ]);

      const activeCount = electionsRes.data.filter(e => e.isActive).length;

      setStats({
        totalElections: electionsRes.data.length,
        activeElections: activeCount,
        totalVoters: usersRes.data.length,
        pendingVerifications: pendingRes.data.length
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Vote,
      label: 'Total Elections',
      value: stats.totalElections,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      icon: CheckCircle,
      label: 'Active Elections',
      value: stats.activeElections,
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Total Voters',
      value: stats.totalVoters,
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600'
    },
    {
      icon: Clock,
      label: 'Pending Verifications',
      value: stats.pendingVerifications,
      color: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin control panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.iconBg} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
        <p className="text-blue-100 mb-6">Navigate to key sections of the admin panel</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/admin/elections'}
            className="bg-white/20 hover:bg-white/30 backdrop-blur text-white py-3 px-6 rounded-lg font-semibold transition-all text-left"
          >
            📋 Manage Elections
          </button>
          <button
            onClick={() => window.location.href = '/admin/voters'}
            className="bg-white/20 hover:bg-white/30 backdrop-blur text-white py-3 px-6 rounded-lg font-semibold transition-all text-left"
          >
            ✅ Verify Voters
          </button>
          <button
            className="bg-white/20 hover:bg-white/30 backdrop-blur text-white py-3 px-6 rounded-lg font-semibold transition-all text-left"
          >
            📊 View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;