import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Component that shows a notification when a new version is available
 */
const VersionUpdateNotification = ({ isVisible, onReload, currentVersion, newVersion }) => {
  if (!isVisible) return null;

  const handleReload = () => {
    onReload();
  };

  const handleBackgroundClick = (e) => {
    // Prevent closing when clicking the modal content
    if (e.target === e.currentTarget) {
      // Don't allow closing by clicking outside - force user to update
      return;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Nova atualização disponível
        </h3>
        
        <p className="text-gray-600 text-center mb-6">
          Uma nova versão do BioOrbit foi lançada. Por favor, atualize a página para ter acesso às últimas funcionalidades e correções.
        </p>
        
        {currentVersion && newVersion && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6 text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Versão atual:</span>
              <span className="font-mono text-gray-800">{currentVersion.shortHash}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nova versão:</span>
              <span className="font-mono text-green-600">{newVersion.shortHash}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={handleReload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar página
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          Esta atualização é obrigatória para continuar usando o BioOrbit
        </p>
      </div>
    </div>
  );
};

export default VersionUpdateNotification;