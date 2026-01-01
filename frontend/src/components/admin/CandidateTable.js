import React from 'react';
import { Edit2, Trash2, User } from 'lucide-react';

const CandidateTable = ({ candidates, onEdit, onDelete }) => {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">No candidates added yet</p>
        <p className="text-gray-400 text-sm mt-2">Click "Add Candidate" to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <div
          key={candidate._id}
          className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4 flex-1">
              {candidate.photo ? (
                <img
                  src={`http://localhost:5000/uploads/${candidate.photo}`}
                  alt={candidate.name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl">
                  {candidate.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{candidate.party}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{candidate.manifesto || candidate.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(candidate)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit candidate"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(candidate)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete candidate"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateTable;