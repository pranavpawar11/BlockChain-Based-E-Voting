import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const VerifyVoters = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        userAPI.getPendingUsers(),
        userAPI.getAllUsers()
      ]);
      setPendingUsers(pendingRes.data);
      setAllUsers(allRes.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleVerify = async (userId) => {
    try {
      await userAPI.verifyUser(userId);
      setMessage({ type: 'success', text: '✅ User verified successfully!' });
      loadUsers();
      handleCloseModal();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to verify user' });
    }
  };

  const handleReject = async (userId) => {
    try {
      await userAPI.rejectUser(userId);
      setMessage({ type: 'success', text: '❌ User verification rejected' });
      loadUsers();
      handleCloseModal();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reject user' });
    }
  };

  const verifiedUsers = allUsers.filter(u => u.isVerified);
  const totalPending = pendingUsers.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-700 font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            Voter Verification 🔍
          </h1>
          <p className="text-xl text-gray-600">Review and approve voter registrations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-yellow-500 to-orange-600 text-white animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-semibold uppercase">Pending</p>
                <p className="text-4xl font-bold mt-2">{totalPending}</p>
              </div>
              <div className="text-5xl opacity-80">⏳</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold uppercase">Verified</p>
                <p className="text-4xl font-bold mt-2">{verifiedUsers.length}</p>
              </div>
              <div className="text-5xl opacity-80">✅</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold uppercase">Total Voters</p>
                <p className="text-4xl font-bold mt-2">{allUsers.length}</p>
              </div>
              <div className="text-5xl opacity-80">👥</div>
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 animate-fade-in ${
              message.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'bg-red-50 border-red-500 text-red-700'
            }`}
          >
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⏳ Pending ({totalPending})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'verified'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ✅ Verified ({verifiedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            👥 All Users ({allUsers.length})
          </button>
        </div>

        {/* Pending Users */}
        {activeTab === 'pending' && (
          <div className="space-y-4 animate-fade-in">
            {totalPending === 0 ? (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending verifications at the moment.</p>
              </div>
            ) : (
              pendingUsers.map((user, index) => (
                <div key={user._id} className="card animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full p-3 text-white text-2xl">
                        👤
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="text-gray-500">
                            <span className="font-semibold">DOB:</span> {new Date(user.dob).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            <span className="font-semibold">Registered:</span> {new Date(user.createdAt).toLocaleString()}
                          </p>
                          {user.idDocument && (
                            <p className="text-blue-600 font-semibold">
                              📄 ID Document Uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        👁️ View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Verified Users */}
        {activeTab === 'verified' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {verifiedUsers.map((user, index) => (
              <div key={user._id} className="card animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-3 text-white text-2xl">
                    ✅
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                    Verified
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <p className="text-xs text-gray-500">
                  Verified: {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleViewDetails(user)}
                  className="mt-3 w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* All Users */}
        {activeTab === 'all' && (
          <div className="card animate-fade-in">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isVerified ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            ✅ Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            ⏳ Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Voter Details</h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-white hover:text-gray-200 text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <p className="text-lg text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <p className="text-lg text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                    <p className="text-lg text-gray-900">{new Date(selectedUser.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Date</label>
                    <p className="text-lg text-gray-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Status</label>
                    {selectedUser.isVerified ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        ✅ Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                    <p className="text-lg text-gray-900 capitalize">{selectedUser.role}</p>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blockchain Wallet Address</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <code className="text-sm text-gray-800 break-all">{selectedUser.walletAddress}</code>
                  </div>
                </div>

                {/* ID Document */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ID Document</label>
                  {selectedUser.idDocument ? (
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">📄</span>
                          <span className="font-semibold text-gray-900">Uploaded Document</span>
                        </div>
                        <a
                          href={`http://localhost:5000/uploads/${selectedUser.idDocument}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Open in New Tab ↗
                        </a>
                      </div>
                      
                      {/* Image Preview */}
                      {selectedUser.idDocument.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <img
                            src={`http://localhost:5000/uploads/${selectedUser.idDocument}`}
                            alt="ID Document"
                            className="max-w-full h-auto rounded shadow-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div style={{display: 'none'}} className="text-center py-8 text-gray-500">
                            <p className="text-4xl mb-2">📄</p>
                            <p>Unable to preview document</p>
                            <p className="text-sm mt-2">Click "Open in New Tab" to view</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-8 rounded-lg text-center">
                          <p className="text-4xl mb-2">📄</p>
                          <p className="text-gray-700 font-semibold">PDF Document</p>
                          <p className="text-sm text-gray-500 mt-2">Click "Open in New Tab" to view the document</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-yellow-800">⚠️ No ID document uploaded</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!selectedUser.isVerified && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVerify(selectedUser._id)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      ✅ Verify User
                    </button>
                    <button
                      onClick={() => handleReject(selectedUser._id)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}

                {selectedUser.isVerified && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-semibold">✅ This user is already verified</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyVoters;