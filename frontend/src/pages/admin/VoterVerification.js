import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { Search, Filter, Users } from 'lucide-react';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import VoterTable from '../../components/admin/VoterTable';
import StatsCards from '../../components/admin/StatsCards';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VoterVerification = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers();
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await userAPI.verifyUser(userId);
      loadUsers();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await userAPI.rejectUser(userId);
      loadUsers();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pending' && !user.isVerified) ||
      (activeTab === 'verified' && user.isVerified);
    
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const pendingCount = allUsers.filter(u => !u.isVerified).length;
  const verifiedCount = allUsers.filter(u => u.isVerified).length;

  const statsData = [
    {
      icon: Users,
      label: 'Total Voters',
      value: allUsers.length,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'Verified Voters',
      value: verifiedCount,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Pending Verification',
      value: pendingCount,
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading voters..." />;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Voter Verification</h1>
        <p className="text-gray-600 mt-2">Review and approve voter registrations</p>
      </div>

      <StatsCards stats={statsData} />

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'verified'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({allUsers.length})
            </button>
          </div>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <VoterTable
          voters={filteredUsers}
          onView={(voter) => {
            setSelectedVoter(voter);
            setShowModal(true);
          }}
          onVerify={(voter) => {
            setConfirmAction(() => () => handleVerify(voter._id));
            setSelectedVoter(voter);
            setShowConfirm(true);
          }}
          onReject={(voter) => {
            setConfirmAction(() => () => handleReject(voter._id));
            setSelectedVoter(voter);
            setShowConfirm(true);
          }}
        />
      </div>

      {/* Voter Details Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Voter Details"
        size="lg"
      >
        {selectedVoter && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <p className="text-lg text-gray-900">{selectedVoter.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <p className="text-lg text-gray-900">{selectedVoter.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                <p className="text-lg text-gray-900">{new Date(selectedVoter.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Date</label>
                <p className="text-lg text-gray-900">{new Date(selectedVoter.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Wallet Address</label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <code className="text-sm text-gray-800 break-all">{selectedVoter.walletAddress}</code>
              </div>
            </div>

            {selectedVoter.idDocument && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ID Document</label>
                {selectedVoter.idDocument.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={`http://localhost:5000/uploads/${selectedVoter.idDocument}`}
                    alt="ID Document"
                    className="max-w-full h-auto rounded shadow-lg"
                  />
                ) : (
                  <a
                    href={`http://localhost:5000/uploads/${selectedVoter.idDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Document →
                  </a>
                )}
              </div>
            )}

            {!selectedVoter.isVerified && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleVerify(selectedVoter._id);
                    setShowModal(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
                >
                  ✓ Verify User
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedVoter._id);
                    setShowModal(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg"
                >
                  × Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAction}
        type="warning"
        title={confirmAction?.name?.includes('verify') ? 'Verify Voter' : 'Reject Voter'}
        message={`Are you sure you want to ${confirmAction?.name?.includes('verify') ? 'verify' : 'reject'} ${selectedVoter?.name}?`}
      />
    </div>
  );
};

export default VoterVerification;