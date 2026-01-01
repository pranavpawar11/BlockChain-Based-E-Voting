import React from 'react';
import { Calendar, Users, Vote } from 'lucide-react';

const ElectionCard = ({ election, onManage, onToggleStatus }) => {
  const getStatusBadge = (status) => {
    const badges = {
      active: { className: 'bg-green-100 text-green-800', label: 'Active' },
      upcoming: { className: 'bg-blue-100 text-blue-800', label: 'Upcoming' },
      ended: { className: 'bg-gray-100 text-gray-800', label: 'Ended' },
      inactive: { className: 'bg-red-100 text-red-800', label: 'Inactive' }
    };
    return badges[status] || badges.inactive;
  };

  const getElectionStatus = () => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (!election.isActive) return 'inactive';
    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

  const status = getElectionStatus();
  const statusBadge = getStatusBadge(status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{election.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{election.description}</p>
          </div>
          <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
            {statusBadge.label}
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
            onClick={() => onManage(election)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
          >
            Manage Election
          </button>
          <button
            onClick={() => onToggleStatus(election._id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              election.isActive
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {election.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectionCard;