import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { voteAPI, electionAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Results = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [electionId]);

  const loadResults = async () => {
    try {
      const [electionsRes, resultsRes] = await Promise.all([
        electionAPI.getAll(),
        voteAPI.getResults(electionId)
      ]);
      
      const currentElection = electionsRes.data.find(e => e._id === electionId);
      setElection(currentElection);
      setResults(resultsRes.data.results || resultsRes.data);
    } catch (error) {
      console.error('Error loading results:', error);
      if (error.response?.status === 403) {
        setResults('hidden');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading results..." />;
  }

  if (results === 'hidden') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Results Not Published</h2>
            <p className="text-lg text-gray-600 mb-6">
              The election results have not been published yet by the administrator.
            </p>
            <p className="text-gray-500">Please check back later.</p>
            <button 
              onClick={() => navigate('/voter/elections')} 
              className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Back to Elections
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = Array.isArray(results) ? results.reduce((sum, r) => sum + r.votes, 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            {election?.title} - Results 📊
          </h1>
          <p className="text-lg text-gray-600">Live results from the blockchain</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-4xl font-bold text-gray-900">{totalVotes}</h3>
              <p className="text-gray-600">Total Votes Cast</p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <span className="animate-pulse text-2xl">⛓️</span>
              <span className="font-semibold">Verified on Blockchain</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Array.isArray(results) && results.map((result, index) => {
            const percentage = totalVotes > 0 ? (result.votes / totalVotes * 100).toFixed(1) : 0;
            const isWinner = index === 0 && result.votes > 0;
            
            return (
              <div
                key={result.candidateId}
                className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all ${
                  isWinner ? 'border-yellow-400 ring-4 ring-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-3xl font-bold ${
                      isWinner ? 'text-yellow-600' : 'text-gray-400'
                    }`}>
                      {isWinner ? '🏆' : `#${index + 1}`}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{result.name}</h3>
                      <p className="text-blue-600 font-semibold">{result.party}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">{result.votes}</div>
                    <div className="text-gray-600 font-semibold">votes</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Vote Share</span>
                    <span className="text-lg font-bold text-blue-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isWinner
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

        {Array.isArray(results) && results.length > 0 && results[0].votes > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 mt-8 text-white">
            <div className="text-center">
              <div className="text-5xl mb-4 animate-bounce">🏆</div>
              <h2 className="text-3xl font-extrabold mb-2">Winner Declared!</h2>
              <p className="text-xl mb-1">{results[0].name}</p>
              <p className="text-lg opacity-90">{results[0].party}</p>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-sm opacity-90">
                  Congratulations on winning with {results[0].votes} votes 
                  ({((results[0].votes / totalVotes) * 100).toFixed(1)}% of total votes)
                </p>
              </div>
            </div>
          </div>
        )}

        {Array.isArray(results) && results.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Votes Yet</h3>
            <p className="text-gray-600">Be the first to cast your vote!</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/voter/elections')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Back to Elections
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;