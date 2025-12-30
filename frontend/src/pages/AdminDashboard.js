import React, { useState, useEffect } from 'react';
import { electionAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [editingElection, setEditingElection] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showVotersModal, setShowVotersModal] = useState(false);
  const [electionVoters, setElectionVoters] = useState([]);
  const [selectedElectionForVoters, setSelectedElectionForVoters] = useState(null);
  
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    party: '',
    manifesto: '',
    candidateId: '',
    photo: null
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      loadCandidates(selectedElection);
    }
  }, [selectedElection]);

  const loadElections = async () => {
    try {
      const response = await electionAPI.getAll();
      setElections(response.data);
    } catch (error) {
      console.error('Error loading elections:', error);
    }
  };

  const loadCandidates = async (electionId) => {
    try {
      const response = await electionAPI.getCandidates(electionId);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      if (editingElection) {
        await electionAPI.update(editingElection._id, electionForm);
        setMessage({ type: 'success', text: '✅ Election updated successfully!' });
        setEditingElection(null);
      } else {
        await electionAPI.create(electionForm);
        setMessage({ type: 'success', text: '✅ Election created successfully!' });
      }
      setElectionForm({ title: '', description: '', startDate: '', endDate: '' });
      loadElections();
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save election' });
    }
  };

  const handleEditElection = (election) => {
    setEditingElection(election);
    setElectionForm({
      title: election.title,
      description: election.description,
      startDate: election.startDate.split('T')[0],
      endDate: election.endDate.split('T')[0]
    });
    setActiveTab('create');
    window.scrollTo(0, 0);
  };

  const handleDeleteElection = async (id) => {
    if (window.confirm('Are you sure? This will delete the election and all its candidates.')) {
      try {
        await electionAPI.delete(id);
        setMessage({ type: 'success', text: '✅ Election deleted successfully!' });
        loadElections();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete election' });
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await electionAPI.toggleStatus(id);
      setMessage({ type: 'success', text: '✅ Election status updated!' });
      loadElections();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleToggleResults = async (id) => {
    try {
      await electionAPI.toggleResults(id);
      setMessage({ type: 'success', text: '✅ Results visibility updated!' });
      loadElections();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update results visibility' });
    }
  };

  const handleViewVoters = async (election) => {
    try {
      const response = await electionAPI.getVoters(election._id);
      setElectionVoters(response.data.voters);
      setSelectedElectionForVoters(election);
      setShowVotersModal(true);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load voters' });
    }
  };

  const getStatusBadge = (election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (!election.isActive) {
      return <span className="text-xs px-3 py-1 rounded-full font-semibold bg-gray-100 text-gray-800">⚫ Inactive</span>;
    }

    if (now < start) {
      return <span className="text-xs px-3 py-1 rounded-full font-semibold bg-blue-100 text-blue-800">🔵 Upcoming</span>;
    } else if (now > end) {
      return <span className="text-xs px-3 py-1 rounded-full font-semibold bg-red-100 text-red-800">🔴 Ended</span>;
    } else {
      return <span className="text-xs px-3 py-1 rounded-full font-semibold bg-green-100 text-green-800">🟢 Active</span>;
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', candidateForm.name);
      data.append('party', candidateForm.party);
      data.append('manifesto', candidateForm.manifesto);
      data.append('electionId', selectedElection);
      data.append('candidateId', parseInt(candidateForm.candidateId));
      if (candidateForm.photo) {
        data.append('photo', candidateForm.photo);
      }

      if (editingCandidate) {
        await electionAPI.updateCandidate(editingCandidate._id, data);
        setMessage({ type: 'success', text: '✅ Candidate updated successfully!' });
        setEditingCandidate(null);
      } else {
        await electionAPI.addCandidate(data);
        setMessage({ type: 'success', text: '✅ Candidate added successfully!' });
      }
      
      setCandidateForm({ name: '', party: '', manifesto: '', candidateId: '', photo: null });
      loadCandidates(selectedElection);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save candidate' });
    }
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setCandidateForm({
      name: candidate.name,
      party: candidate.party,
      manifesto: candidate.manifesto,
      candidateId: candidate.candidateId,
      photo: null
    });
    window.scrollTo(0, 300);
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await electionAPI.deleteCandidate(id);
        setMessage({ type: 'success', text: '✅ Candidate deleted successfully!' });
        loadCandidates(selectedElection);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete candidate' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            Admin Dashboard 👑
          </h1>
          <p className="text-xl text-gray-600">Manage elections and candidates</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🗳️ Manage Elections
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'candidates'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            👤 Manage Candidates
          </button>
          <button
            onClick={() => navigate('/verify-voters')}
            className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            🔍 Verify Voters
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 animate-fade-in ${
              message.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'bg-red-50 border-red-500 text-red-700'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{message.type === 'success' ? '✅' : '⚠️'}</span>
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="card animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 text-white text-3xl">
                  🗳️
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingElection ? 'Edit Election' : 'Create New Election'}
                  </h2>
                  <p className="text-gray-600">Set up a blockchain-based election</p>
                </div>
              </div>

              <form onSubmit={handleCreateElection} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Election Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Student Council Election 2025"
                    value={electionForm.title}
                    onChange={(e) => setElectionForm({...electionForm, title: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the purpose of this election..."
                    value={electionForm.description}
                    onChange={(e) => setElectionForm({...electionForm, description: e.target.value})}
                    required
                    rows="4"
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={electionForm.startDate}
                      onChange={(e) => setElectionForm({...electionForm, startDate: e.target.value})}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={electionForm.endDate}
                      onChange={(e) => setElectionForm({...electionForm, endDate: e.target.value})}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="flex-1 btn-success">
                    {editingElection ? 'Update Election' : 'Create Election'}
                  </button>
                  {editingElection && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingElection(null);
                        setElectionForm({ title: '', description: '', startDate: '', endDate: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Elections List */}
            {elections.length > 0 && (
              <div className="card animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-4">All Elections</h3>
                <div className="space-y-3">
                  {elections.map((election) => (
                    <div key={election._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{election.title}</h4>
                            {getStatusBadge(election)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{election.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500 mb-3">
                            <span>📅 Start: {new Date(election.startDate).toLocaleDateString()}</span>
                            <span>🏁 End: {new Date(election.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleToggleStatus(election._id)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                election.isActive
                                  ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                                  : 'bg-green-100 hover:bg-green-200 text-green-700'
                              }`}
                            >
                              {election.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                            </button>
                            <button
                              onClick={() => handleToggleResults(election._id)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                election.resultsPublished
                                  ? 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                                  : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                              }`}
                            >
                              {election.resultsPublished ? '👁️ Hide Results' : '📊 Publish Results'}
                            </button>
                            <button
                              onClick={() => handleViewVoters(election)}
                              className="px-3 py-1 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              👥 View Voters
                            </button>
                            <button
                              onClick={() => handleEditElection(election)}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteElection(election._id)}
                              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="card animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-full p-4 text-white text-3xl">
                  👤
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
                  </h2>
                  <p className="text-gray-600">Add candidates to an election</p>
                </div>
              </div>

              <form onSubmit={handleAddCandidate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Election
                  </label>
                  <select
                    value={selectedElection}
                    onChange={(e) => setSelectedElection(e.target.value)}
                    required
                    className="input-field"
                  >
                    <option value="">Choose an election...</option>
                    {elections.map(election => (
                      <option key={election._id} value={election._id}>
                        {election.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Candidate Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCandidateForm({...candidateForm, photo: e.target.files[0]})}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload candidate's photo (JPG, PNG)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Party Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Progressive Party"
                    value={candidateForm.party}
                    onChange={(e) => setCandidateForm({...candidateForm, party: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Manifesto / Campaign Promise
                  </label>
                  <textarea
                    placeholder="What does this candidate stand for?"
                    value={candidateForm.manifesto}
                    onChange={(e) => setCandidateForm({...candidateForm, manifesto: e.target.value})}
                    rows="3"
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Candidate ID (Unique Number)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1, 2, 3..."
                    value={candidateForm.candidateId}
                    onChange={(e) => setCandidateForm({...candidateForm, candidateId: e.target.value})}
                    required
                    min="1"
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    💡 This must be unique for each candidate in the same election
                  </p>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="flex-1 btn-success">
                    {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
                  </button>
                  {editingCandidate && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCandidate(null);
                        setCandidateForm({ name: '', party: '', manifesto: '', candidateId: '', photo: null });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Candidates List */}
            {selectedElection && candidates.length > 0 && (
              <div className="card animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Candidates for {elections.find(e => e._id === selectedElection)?.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidates.map((candidate) => (
                    <div key={candidate._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {candidate.photo ? (
                          <img
                            src={`http://localhost:5000/uploads/${candidate.photo}`}
                            alt={candidate.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                            👤
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                          <p className="text-sm text-blue-600 font-semibold">{candidate.party}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {candidate.candidateId}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleEditCandidate(candidate)}
                          className="flex-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCandidate(candidate._id)}
                          className="flex-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Voters Modal */}
        {showVotersModal && selectedElectionForVoters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Voters List</h2>
                    <p className="text-teal-100">{selectedElectionForVoters.title}</p>
                  </div>
                  <button
                    onClick={() => setShowVotersModal(false)}
                    className="text-white hover:text-gray-200 text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 bg-teal-50 p-4 rounded-lg">
                  <p className="text-teal-800 font-semibold">
                    Total Votes Cast: {electionVoters.length}
                  </p>
                </div>

                {electionVoters.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-600">No votes cast yet in this election</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Voter Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Transaction Hash</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Voted At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {electionVoters.map((voter, index) => (
                          <tr key={voter._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{voter.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{voter.email}</td>
                            <td className="px-4 py-3 text-xs">
                              <code className="text-blue-600">{voter.transactionHash.slice(0, 20)}...</code>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {new Date(voter.votedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default AdminDashboard;