import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { electionAPI, voteAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import CandidateCard from '../../components/voter/CandidateCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { X, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const VotingPage = () => {
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

  const handleCandidateSelect = (candidateId) => {
    // Toggle selection - unselect if clicking the same candidate
    if (selectedCandidate === candidateId) {
      setSelectedCandidate(null);
    } else {
      setSelectedCandidate(candidateId);
    }
  };

  const handleVote = () => {
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    const candidate = candidates.find(c => (c.candidateId || c._id) === selectedCandidate);
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
      setTimeout(() => navigate('/voter/elections'), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading election..." />;
  }

  if (voteStatus?.hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Vote Already Cast!</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">You have already voted in this election.</p>
            
            <div className="bg-blue-50 p-4 sm:p-6 rounded-xl mb-6 border border-blue-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Transaction Details:</p>
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Transaction Hash:</p>
                <code className="text-xs sm:text-sm text-gray-800 break-all block mb-3 bg-gray-50 p-2 rounded">{voteStatus.voteRecord?.transactionHash}</code>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Block Number:</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{voteStatus.voteRecord?.blockNumber}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/voter/elections')} 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Elections
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Vote Cast Successfully!</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">Your vote has been securely recorded on the blockchain.</p>
            
            <div className="bg-green-50 p-4 sm:p-6 rounded-xl mb-6 border border-green-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Blockchain Confirmation:</p>
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-200 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Transaction Hash:</p>
                  <code className="text-xs sm:text-sm text-gray-800 break-all block bg-gray-50 p-2 rounded">{success.transactionHash}</code>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Block Number:</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{success.blockNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-500 flex items-center justify-center gap-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
              Redirecting to elections in a moment...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/voter/elections')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base font-medium">Back to Elections</span>
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">{election?.title}</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">{election?.description}</p>
        </div>

        {/* Alerts */}
        {!user?.isVerified && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-xl shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-semibold text-sm sm:text-base">Account Not Verified</p>
                <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                  Your account is pending admin verification. You cannot vote until your account is approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        {/* Selected Candidate Info Card */}
        {selectedCandidate && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Candidate Selected</p>
                  <p className="text-xs text-gray-600">
                    {candidates.find(c => (c.candidateId || c._id) === selectedCandidate)?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-500 hover:text-red-600 transition-colors"
                title="Unselect candidate"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Select Your Candidate</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Tap on a candidate card to select. Tap again to unselect.
          </p>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              isSelected={selectedCandidate === (candidate.candidateId || candidate._id)}
              onSelect={handleCandidateSelect}
              disabled={!user?.isVerified}
            />
          ))}
        </div>

        {/* Action Bar - Fixed on mobile */}
        <div className="fixed bottom-0 left-0 right-0 sm:static bg-white sm:rounded-2xl shadow-lg border-t sm:border border-gray-200 p-4 sm:p-6 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="text-center sm:text-left w-full sm:w-auto">
                <p className="text-sm sm:text-base font-semibold mb-1">
                  {selectedCandidate ? (
                    <span className="text-green-600 flex items-center justify-center sm:justify-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Candidate selected
                    </span>
                  ) : (
                    <span className="text-gray-500">Please select a candidate to continue</span>
                  )}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Your vote will be securely recorded on the blockchain
                </p>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/voter/elections')}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVote}
                  disabled={submitting || !selectedCandidate || !user?.isVerified}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all shadow-md text-sm sm:text-base ${
                    (submitting || !selectedCandidate || !user?.isVerified) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Casting...
                    </span>
                  ) : (
                    'Cast Vote'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for fixed action bar on mobile */}
        <div className="h-24 sm:h-0"></div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedCandidateDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 sm:p-6 rounded-t-2xl">
                <h2 className="text-xl sm:text-2xl font-bold">Confirm Your Vote</h2>
              </div>

              <div className="p-5 sm:p-6">
                <div className="text-center mb-6">
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">Are you sure you want to vote for:</p>
                  
                  {selectedCandidateDetails.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/${selectedCandidateDetails.photo}`}
                      alt={selectedCandidateDetails.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl mx-auto mb-4 border-4 border-blue-500 shadow-lg font-bold">
                      {selectedCandidateDetails.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedCandidateDetails.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm sm:text-base">{selectedCandidateDetails.party}</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-6 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-semibold text-xs sm:text-sm">Important!</p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Once submitted, your vote cannot be changed. This action will be recorded on the blockchain.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmVote}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base inline-flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Confirm Vote
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

export default VotingPage;