import React from 'react';
import { useVersion } from '../contexts/VersionContext';

const UpdateNotification = () => {
  const { hasUpdate, forceUpdate, dismissUpdate, versionInfo } = useVersion();

  if (!hasUpdate) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg 
              className="w-4 h-4 text-blue-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">
              Nova atualização disponível!
            </p>
            <p className="text-xs opacity-90">
              Versão: {versionInfo?.version?.substring(0, 20)}...
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={dismissUpdate}
            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-400 rounded transition-colors"
          >
            Ignorar
          </button>
          <button
            onClick={forceUpdate}
            className="px-4 py-1 text-xs bg-white text-blue-600 hover:bg-gray-100 rounded font-semibold transition-colors"
          >
            Atualizar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;