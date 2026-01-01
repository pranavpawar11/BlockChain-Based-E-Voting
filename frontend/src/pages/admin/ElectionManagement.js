import React, { useState, useEffect } from 'react';
import { electionAPI, voteAPI } from '../../services/api';
import { Plus, X, Calendar, User, Users, Vote, AlertCircle, Edit2, Eye, BarChart3, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ElectionCard from '../../components/admin/ElectionCard';
import CandidateTable from '../../components/admin/CandidateTable';
import VoterTable from '../../components/admin/VoterTable';
import StatsCards from '../../components/admin/StatsCards';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ElectionManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState({ title: '', message: '' });

  const [voterFilter, setVoterFilter] = useState('all');

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      loadCandidates(selectedElection._id);
      loadVoters(selectedElection._id);
      loadStats(selectedElection._id);
      loadResults(selectedElection._id);
    }
  }, [selectedElection]);

  const loadElections = async () => {
    setLoading(true);
    try {
      const response = await electionAPI.getAll();
      setElections(response.data);
    } catch (error) {
      console.error('Error loading elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async (electionId) => {
    try {
      const response = await electionAPI.getCandidates(electionId);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error loading candidates:', error);
      setCandidates([]);
    }
  };

  const loadVoters = async (electionId) => {
    try {
      const response = await electionAPI.getVoters(electionId);
      const data = response.data;

      // Handle both old and new API response format
      if (data.voters) {
        setVoters(data.voters);
      } else if (Array.isArray(data)) {
        setVoters(data);
      } else {
        setVoters([]);
      }
    } catch (error) {
      console.error('Error loading voters:', error);
      setVoters([]);
    }
  };

  const loadResults = async (electionId) => {
    try {
      const response = await voteAPI.getResults(electionId);
      setResults(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error loading results:', error);
      setResults([]);
    }
  };

  const loadStats = async (electionId) => {
    try {
      const [votersRes, candidatesRes] = await Promise.all([
        electionAPI.getVoters(electionId),
        electionAPI.getCandidates(electionId)
      ]);

      const votersData = votersRes.data;

      // Handle API response format
      let totalVoters = 0;
      let votedCount = 0;
      let verifiedCount = 0;

      if (votersData.voters) {
        // New API format
        totalVoters = votersData.totalVoters || votersData.voters.length;
        votedCount = votersData.votedCount || votersData.voters.filter(v => v.hasVoted).length;
        verifiedCount = votersData.voters.filter(v => v.isVerified).length;
      } else if (Array.isArray(votersData)) {
        // Fallback to array format
        totalVoters = votersData.length;
        votedCount = votersData.filter(v => v.hasVoted).length;
        verifiedCount = votersData.filter(v => v.isVerified).length;
      }

      setStats({
        totalVoters,
        verifiedVoters: verifiedCount,
        votedCount,
        totalCandidates: candidatesRes.data.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        totalVoters: 0,
        verifiedVoters: 0,
        votedCount: 0,
        totalCandidates: 0
      });
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await electionAPI.create({
        title: formData.get('title'),
        description: formData.get('description'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate')
      });
      loadElections();
      closeModal();
    } catch (error) {
      console.error('Error creating election:', error);
      alert('Failed to create election');
    }
  };

  const handleEditElection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await electionAPI.update(modalData._id, {
        title: formData.get('title'),
        description: formData.get('description'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate')
      });
      loadElections();
      if (selectedElection?._id === modalData._id) {
        setSelectedElection({
          ...selectedElection,
          title: formData.get('title'),
          description: formData.get('description'),
          startDate: formData.get('startDate'),
          endDate: formData.get('endDate')
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error updating election:', error);
      alert('Failed to update election');
    }
  };

  const handleDeleteElection = async () => {
    try {
      await electionAPI.delete(modalData._id);
      if (selectedElection?._id === modalData._id) {
        setSelectedElection(null);
        setActiveTab('overview');
      }
      loadElections();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error deleting election:', error);
      alert('Failed to delete election');
    }
  };

  const handleToggleStatus = async (electionId) => {
    try {
      await electionAPI.toggleStatus(electionId);
      loadElections();
      if (selectedElection?._id === electionId) {
        setSelectedElection({
          ...selectedElection,
          isActive: !selectedElection.isActive
        });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleToggleResults = async (electionId) => {
    try {
      await electionAPI.toggleResults(electionId);
      loadElections();
      if (selectedElection?._id === electionId) {
        setSelectedElection({
          ...selectedElection,
          resultsPublished: !selectedElection.resultsPublished
        });
      }
    } catch (error) {
      console.error('Error toggling results:', error);
      alert('Failed to toggle results publication');
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('electionId', selectedElection._id);

    try {
      await electionAPI.addCandidate(formData);
      loadCandidates(selectedElection._id);
      closeModal();
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Failed to add candidate');
    }
  };

  const handleEditCandidate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await electionAPI.updateCandidate(modalData._id, formData);
      loadCandidates(selectedElection._id);
      closeModal();
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate');
    }
  };

  const handleDeleteCandidate = async () => {
    try {
      await electionAPI.deleteCandidate(modalData._id);
      loadCandidates(selectedElection._id);
      setShowConfirm(false);
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Failed to delete candidate');
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setModalData(null);
  };

  const openConfirmDialog = (action, data, title, message) => {
    setConfirmAction(() => action);
    setModalData(data);
    setConfirmMessage({ title, message });
    setShowConfirm(true);
  };

  const getFilteredVoters = () => {
    if (!Array.isArray(voters)) return [];

    switch (voterFilter) {
      case 'voted':
        return voters.filter(v => v.hasVoted);
      case 'notVoted':
        return voters.filter(v => !v.hasVoted);
      default:
        return voters;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading elections..." />;
  }

  const statsData = [
    {
      icon: Vote,
      label: 'Total Candidates',
      value: stats.totalCandidates || 0,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'Total Voters',
      value: stats.totalVoters || 0,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600'
    },
    {
      icon: User,
      label: 'Votes Cast',
      value: stats.votedCount || 0,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600'
    },
    {
      icon: Calendar,
      label: 'Voter Turnout',
      value: stats.verifiedVoters ? `${Math.round((stats.votedCount / stats.verifiedVoters) * 100)}%` : '0%',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600'
    }
  ];

  const totalVotes = Array.isArray(results) ? results.reduce((sum, r) => sum + r.votes, 0) : 0;

  return (
    <div className="p-8">
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Elections Management</h1>
              <p className="text-gray-600 mt-2">Create and manage all elections</p>
            </div>
            <button
              onClick={() => openModal('createElection')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Create Election</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {elections.map((election) => (
              <div key={election._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{election.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{election.description}</p>
                    </div>
                    <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${election.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {election.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium mr-2">Start:</span>
                      {new Date(election.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium mr-2">End:</span>
                      {new Date(election.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedElection(election);
                        setActiveTab('candidates');
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => openModal('editElection', election)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-medium"
                      title="Edit election"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(election._id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${election.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                      {election.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => openConfirmDialog(
                        handleDeleteElection,
                        election,
                        'Delete Election',
                        `Are you sure you want to delete "${election.title}"? This action cannot be undone.`
                      )}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-medium"
                      title="Delete election"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {elections.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No elections created yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create Election" to get started</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'candidates' && selectedElection && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Elections
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggleResults(selectedElection._id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${selectedElection.resultsPublished
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
              >
                <Eye className="w-4 h-4" />
                <span>{selectedElection.resultsPublished ? 'Hide Results' : 'Publish Results'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Candidates</span>
                </button>
                <button
                  onClick={() => setActiveTab('voters')}
                  className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Voters</span>
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Results</span>
                </button>
              </nav>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedElection.title}</h2>
                  <p className="text-gray-600 mt-1">Manage candidates for this election</p>
                </div>
                <button
                  onClick={() => openModal('addCandidate')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Candidate</span>
                </button>
              </div>

              <StatsCards stats={statsData} />

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidates List</h3>
                <CandidateTable
                  candidates={candidates}
                  onEdit={(candidate) => openModal('editCandidate', candidate)}
                  onDelete={(candidate) => openConfirmDialog(
                    handleDeleteCandidate,
                    candidate,
                    'Delete Candidate',
                    `Are you sure you want to delete ${candidate.name}? This action cannot be undone.`
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'voters' && selectedElection && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActiveTab('candidates')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Candidates
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Candidates</span>
                </button>
                <button
                  onClick={() => setActiveTab('voters')}
                  className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Voters</span>
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Results</span>
                </button>
              </nav>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedElection.title}</h2>
              <p className="text-gray-600 mb-6">Voter participation and statistics</p>

              <StatsCards stats={statsData} />

              {/* ADD FILTER BUTTONS */}
              <div className="mt-6 mb-4 flex gap-3">
                <button
                  onClick={() => setVoterFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${voterFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  All Voters ({voters.length})
                </button>
                <button
                  onClick={() => setVoterFilter('voted')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${voterFilter === 'voted'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Voted ({voters.filter(v => v.hasVoted).length})
                </button>
                <button
                  onClick={() => setVoterFilter('notVoted')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${voterFilter === 'notVoted'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Not Voted ({voters.filter(v => !v.hasVoted).length})
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voters List</h3>
                <VoterTable
                  voters={getFilteredVoters()}
                  onView={(voter) => openModal('viewVoter', voter)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && selectedElection && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActiveTab('candidates')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Candidates
            </button>

            <button
              onClick={() => handleToggleResults(selectedElection._id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${selectedElection.resultsPublished
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
            >
              <Eye className="w-4 h-4" />
              <span>{selectedElection.resultsPublished ? 'Hide Results from Public' : 'Publish Results to Public'}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Candidates</span>
                </button>
                <button
                  onClick={() => setActiveTab('voters')}
                  className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Voters</span>
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Results</span>
                </button>
              </nav>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedElection.title}</h2>
                  <p className="text-gray-600 mt-1">Election results and statistics</p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${selectedElection.resultsPublished
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                  }`}>
                  {selectedElection.resultsPublished ? '✓ Results Published' : '⚠️ Results Hidden'}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">{totalVotes}</h3>
                    <p className="text-gray-600">Total Votes Cast</p>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="text-2xl">⛓️</span>
                    <span className="font-semibold">Blockchain Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Array.isArray(results) && results.map((result, index) => {
                  const percentage = totalVotes > 0 ? (result.votes / totalVotes * 100).toFixed(1) : 0;
                  const isWinner = index === 0 && result.votes > 0;

                  return (
                    <div
                      key={result.candidateId}
                      className={`rounded-xl p-6 border-2 transition-all ${isWinner ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200 bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`text-3xl font-bold ${isWinner ? 'text-yellow-600' : 'text-gray-400'
                            }`}>
                            {isWinner ? '🏆' : `#${index + 1}`}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{result.name}</h3>
                            <p className="text-blue-600 font-semibold">{result.party}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-extrabold text-gray-900">{result.votes}</div>
                          <div className="text-gray-600 font-semibold">votes</div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">Vote Share</span>
                          <span className="text-lg font-bold text-blue-600">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className={`h-full rounded-full ${isWinner
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600'
                              }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(!results || results.length === 0) && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No votes cast yet</p>
                  <p className="text-gray-400 text-sm mt-2">Results will appear here once voting begins</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showModal && modalType === 'createElection'} onClose={closeModal} title="Create New Election">
        <form onSubmit={handleCreateElection} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Election Title</label>
            <input type="text" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Student Council Elections 2025" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Brief description of the election" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" name="startDate" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" name="endDate" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium">Create Election</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showModal && modalType === 'editElection' && modalData} onClose={closeModal} title="Edit Election">
        <form onSubmit={handleEditElection} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Election Title</label>
            <input type="text" name="title" required defaultValue={modalData?.title} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" required rows="3" defaultValue={modalData?.description} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" name="startDate" required defaultValue={modalData?.startDate?.split('T')[0]} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" name="endDate" required defaultValue={modalData?.endDate?.split('T')[0]} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium">Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showModal && modalType === 'addCandidate'} onClose={closeModal} title="Add Candidate">
        <form onSubmit={handleAddCandidate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
            <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Party/Affiliation</label>
            <input type="text" name="party" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manifesto/Description</label>
            <textarea name="manifesto" required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
            <input type="file" name="photo" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium">Add Candidate</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showModal && modalType === 'editCandidate' && modalData} onClose={closeModal} title="Edit Candidate">
        <form onSubmit={handleEditCandidate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
            <input type="text" name="name" required defaultValue={modalData?.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Party/Affiliation</label>
            <input type="text" name="party" required defaultValue={modalData?.party} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manifesto/Description</label>
            <textarea name="manifesto" required rows="3" defaultValue={modalData?.manifesto} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Photo (Optional)</label>
            <input type="file" name="photo" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium">Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showModal && modalType === 'viewVoter' && modalData} onClose={closeModal} title="Voter Details" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <p className="text-lg text-gray-900">{modalData?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <p className="text-lg text-gray-900">{modalData?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Status</label>
              {modalData?.isVerified ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  ⏳ Pending
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Voting Status</label>
              {modalData?.hasVoted ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  ✓ Voted
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  ✕ Not Voted
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Wallet Address</label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <code className="text-sm text-gray-800 break-all">{modalData?.walletAddress}</code>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAction}
        type="danger"
        title={confirmMessage.title}
        message={confirmMessage.message}
      />
    </div>
  );
};

export default ElectionManagement;