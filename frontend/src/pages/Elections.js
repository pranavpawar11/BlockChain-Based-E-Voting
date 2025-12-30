import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { electionAPI } from '../services/api';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const response = await electionAPI.getActive();
      setElections(response.data);
    } catch (error) {
      console.error('Error loading elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (!election.isActive) {
      return { status: 'inactive', label: 'Inactive', color: 'gray', canVote: false };
    }

    if (now < start) {
      return { status: 'upcoming', label: 'Upcoming', color: 'blue', canVote: false };
    } else if (now > end) {
      return { status: 'ended', label: 'Ended', color: 'red', canVote: false };
    } else {
      return { status: 'active', label: 'Active', color: 'green', canVote: true };
    }
  };

  const isElectionActive = (election) => {
    return getElectionStatus(election).canVote;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-700 font-semibold">Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            Active Elections 🗳️
          </h1>
          <p className="text-xl text-gray-600">Cast your vote securely on the blockchain</p>
        </div>

        {elections.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Elections</h3>
            <p className="text-gray-600">There are no elections available at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election, index) => {
              const statusInfo = getElectionStatus(election);
              return (
                <div
                  key={election._id}
                  className="card hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">🗳️</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                      statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {statusInfo.color === 'green' && <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>}
                      {statusInfo.color === 'blue' && <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>}
                      {statusInfo.color === 'red' && <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>}
                      {statusInfo.color === 'gray' && <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>}
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{election.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{election.description}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📅</span>
                      <span className="font-semibold mr-2">Start:</span>
                      {new Date(election.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">🏁</span>
                      <span className="font-semibold mr-2">End:</span>
                      {new Date(election.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>

                  {statusInfo.status === 'upcoming' && (
                    <div className="mb-4 text-xs bg-blue-50 text-blue-700 p-2 rounded">
                      ⏰ Voting starts on {new Date(election.startDate).toLocaleDateString()}
                    </div>
                  )}

                  {statusInfo.status === 'ended' && (
                    <div className="mb-4 text-xs bg-red-50 text-red-700 p-2 rounded">
                      ⏱️ Voting ended on {new Date(election.endDate).toLocaleDateString()}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/vote/${election._id}`)}
                      disabled={!statusInfo.canVote}
                      className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
                        statusInfo.canVote
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {statusInfo.status === 'upcoming' ? 'Not Started' : 
                       statusInfo.status === 'ended' ? 'Voting Closed' : 
                       statusInfo.status === 'inactive' ? 'Inactive' : 
                       'Vote Now'}
                    </button>
                    <button
                      onClick={() => navigate(`/results/${election._id}`)}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Results
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Elections;