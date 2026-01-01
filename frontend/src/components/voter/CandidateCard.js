import React from 'react';
import { CheckCircle } from 'lucide-react';

const CandidateCard = ({ candidate, isSelected, onSelect, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onSelect(candidate.candidateId || candidate._id)}
      className={`cursor-pointer transform transition-all duration-300 hover:scale-105 bg-white rounded-2xl shadow-md border-2 p-6 sm:p-8 relative ${
        isSelected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-200 shadow-xl'
          : 'border-gray-200 hover:shadow-xl hover:border-blue-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Selected Badge - Top Right */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2.5 shadow-lg animate-bounce">
          <CheckCircle className="w-6 h-6" />
        </div>
      )}

      {/* Centered Content */}
      <div className="flex flex-col items-center text-center">
        {/* Profile Image/Avatar */}
        <div className="mb-4 sm:mb-5">
          {candidate.photo ? (
            <img
              src={`http://localhost:5000/uploads/${candidate.photo}`}
              alt={candidate.name}
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-gray-100"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold border-4 border-white shadow-xl ring-4 ring-gray-100">
              {candidate.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Candidate Name */}
        <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {candidate.name}
        </h4>
        
        {/* Party Name */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-semibold text-sm sm:text-base mb-4 border border-blue-200">
          <span className="text-lg">🏛️</span>
          <span>{candidate.party}</span>
        </div>
        
        {/* Manifesto/Description */}
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-md">
          {candidate.manifesto || candidate.description}
        </p>
        
        {/* Selected Indicator */}
        {isSelected && (
          <div className="mt-5 pt-4 border-t-2 border-dashed border-blue-300 w-full">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md">
              <CheckCircle className="w-4 h-4" />
              <span>Selected for voting</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;