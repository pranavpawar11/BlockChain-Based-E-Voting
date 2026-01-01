import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false, message = 'Loading...' }) => {
  const sizes = {
    sm: 'h-8 w-8 border-2',
    md: 'h-16 w-16 border-4',
    lg: 'h-24 w-24 border-4'
  };

  const spinner = (
    <div className="text-center">
      <div className={`inline-block animate-spin rounded-full border-t-blue-600 border-b-blue-600 border-gray-200 ${sizes[size]}`}></div>
      {message && <p className="mt-4 text-gray-700 font-semibold">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;