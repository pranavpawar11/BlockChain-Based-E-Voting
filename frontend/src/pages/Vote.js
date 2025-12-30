import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { electionAPI, voteAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Vote = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteStatus, setVoteStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState(null);

  useEffect(() => {
    loadData();
  }, [electionId]);

  const loadData = async () => {
    try {
      const [electionsRes, candidatesRes, statusRes] = await Promise.all([
        electionAPI.getAll(),
        electionAPI.getCandidates(electionId),
        voteAPI.checkStatus(electionId)
      ]);
      
      const currentElection = electionsRes.data.find(e => e._id === electionId);
      setElection(currentElection);
      setCandidates(candidatesRes.data);
      setVoteStatus(statusRes.data);
    } catch (error) {
      setError('Failed to load election data');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = () => {
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    const candidate = candidates.find(c => c.candidateId === selectedCandidate);
    setSelectedCandidateDetails(candidate);
    setShowConfirmation(true);
  };

  const confirmVote = async () => {
    setShowConfirmation(false);
    setSubmitting(true);
    setError('');

    try {
      const response = await voteAPI.castVote({
        electionId,
        candidateId: selectedCandidate
      });
      
      setSuccess(response.data);
      setTimeout(() => navigate('/elections'), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (voteStatus?.hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vote Already Cast!</h2>
            <p className="text-lg text-gray-600 mb-6">You have already voted in this election.</p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Transaction Details:</p>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">Transaction Hash:</p>
                <code className="text-xs text-gray-800 break-all block mb-3">{voteStatus.voteRecord?.transactionHash}</code>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Block Number:</span> {voteStatus.voteRecord?.blockNumber}
                </p>
              </div>
            </div>
            
            <button onClick={() => navigate('/elections')} className="btn-primary">
              Back to Elections
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vote Cast Successfully!</h2>
            <p className="text-lg text-gray-600 mb-6">Your vote has been securely recorded on the blockchain.</p>
            
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Blockchain Confirmation:</p>
              <div className="bg-white p-4 rounded-lg border border-green-200 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Transaction Hash:</p>
                  <code className="text-xs text-gray-800 break-all block bg-gray-50 p-2 rounded">{success.transactionHash}</code>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Block Number:</span>
                  <span className="text-sm font-bold text-gray-900">{success.blockNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
              Redirecting to elections in a moment...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{election?.title}</h1>
          <p className="text-lg text-gray-600">{election?.description}</p>
        </div>

        {!user?.isVerified && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg animate-fade-in">
            <div className="flex items-start">
              <span className="text-yellow-500 text-2xl mr-3">⚠️</span>
              <div>
                <p className="text-yellow-800 font-semibold">Account Not Verified</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Your account is pending admin verification. You cannot vote until your account is approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Your Candidate</h3>
          <p className="text-gray-600">Click on a candidate card to select them</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {candidates.map((candidate, index) => (
            <div
              key={candidate._id}
              onClick={() => setSelectedCandidate(candidate.candidateId)}
              className={`card cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in ${
                selectedCandidate === candidate.candidateId
                  ? 'ring-4 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-xl'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-start justify-between mb-4">
                {candidate.photo ? (
                  <img
                    src={`http://localhost:5000/uploads/${candidate.photo}`}
                    alt={candidate.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl border-4 border-white shadow-lg">
                    👤
                  </div>
                )}
                {selectedCandidate === candidate.candidateId && (
                  <div className="bg-blue-600 text-white rounded-full p-2 animate-bounce">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 mb-2">{candidate.name}</h4>
              <p className="text-blue-600 font-semibold mb-3">{candidate.party}</p>
              <p className="text-gray-600 text-sm line-clamp-3">{candidate.manifesto}</p>
            </div>
          ))}
        </div>

        <div className="card animate-fade-in" style={{animationDelay: '0.4s'}}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-700 font-semibold mb-1">
                {selectedCandidate ? (
                  <span className="text-green-600">✓ Candidate selected</span>
                ) : (
                  <span className="text-gray-500">Please select a candidate to continue</span>
                )}
              </p>
              <p className="text-sm text-gray-500">Your vote will be securely recorded on the blockchain</p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/elections')}
                className="flex-1 sm:flex-none btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleVote}
                disabled={submitting || !selectedCandidate || !user?.isVerified}
                className={`flex-1 sm:flex-none btn-primary ${
                  (submitting || !selectedCandidate || !user?.isVerified) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Casting Vote...
                  </span>
                ) : (
                  'Cast Vote'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedCandidateDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">Confirm Your Vote</h2>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-gray-700 mb-4">Are you sure you want to vote for:</p>
                  
                  {selectedCandidateDetails.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/${selectedCandidateDetails.photo}`}
                      alt={selectedCandidateDetails.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4 border-4 border-blue-500">
                      👤
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900">{selectedCandidateDetails.name}</h3>
                  <p className="text-blue-600 font-semibold">{selectedCandidateDetails.party}</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-yellow-500 text-xl mr-2">⚠️</span>
                    <div>
                      <p className="text-yellow-800 font-semibold text-sm">Important!</p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Once submitted, your vote cannot be changed. This action will be recorded on the blockchain.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmVote}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    ✓ Confirm Vote
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vote;