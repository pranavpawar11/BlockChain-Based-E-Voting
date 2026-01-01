import React, { useState, useEffect } from 'react';
import { electionAPI } from '../../services/api';
import ElectionList from '../../components/voter/ElectionList';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'ended'

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      // Load ALL elections, not just active ones
      const response = await electionAPI.getAll();
      setElections(response.data);
    } catch (error) {
      console.error('Error loading elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredElections = () => {
    const now = new Date();
    
    return elections.filter(election => {
      const start = new Date(election.startDate);
      const end = new Date(election.endDate);
      
      if (filter === 'active') {
        return election.isActive && now >= start && now <= end;
      } else if (filter === 'ended') {
        return now > end || !election.isActive;
      }
      return true; // 'all'
    });
  };

  const filteredElections = getFilteredElections();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading elections..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            Elections 🗳️
          </h1>
          <p className="text-xl text-gray-600">Cast your vote securely on the blockchain</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            All Elections
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'active'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('ended')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'ended'
                ? 'bg-gray-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Ended
          </button>
        </div>

        <ElectionList elections={filteredElections} />
      </div>
    </div>
  );
};

export default Elections;