// components/common/ConfirmDialog.js
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-900',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-900',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-900',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-4`}>
            <div className="flex items-start">
              <AlertCircle className={`w-5 h-5 ${style.icon} mt-0.5 mr-3 flex-shrink-0`} />
              <div>
                <p className={`text-sm font-medium ${style.text}`}>{title}</p>
                <p className={`text-sm ${style.text} mt-1`}>{message}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2 ${style.button} text-white rounded-lg transition-colors font-medium`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;