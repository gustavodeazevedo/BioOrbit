import React, { useState, useEffect } from 'react';
import './UpdateNotification.css';

const UpdateNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [newVersion, setNewVersion] = useState(null);

  // Check for updates every minute
  useEffect(() => {
    let initialVersion = null;
    
    // Load the version when the component mounts
    const loadInitialVersion = async () => {
      try {
        const response = await fetch('/version.json?t=' + new Date().getTime());
        const data = await response.json();
        initialVersion = data;
        setCurrentVersion(data);
      } catch (error) {
        console.error('Error loading initial version:', error);
      }
    };
    
    loadInitialVersion();

    // Set up periodic check
    const interval = setInterval(async () => {
      try {
        // Add timestamp to prevent caching
        const response = await fetch('/version.json?t=' + new Date().getTime());
        const data = await response.json();
        
        // Compare timestamps or versions
        if (initialVersion && 
            (data.version !== initialVersion.version || 
             data.buildTime !== initialVersion.buildTime)) {
          setNewVersion(data);
          setShowNotification(true);
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!showNotification) return null;

  return (
    <div className="update-notification">
      <div className="update-notification-content">
        <h3>Nova atualização disponível!</h3>
        <p>Uma nova versão do BioOrbit está disponível.</p>
        <p>Para garantir o funcionamento correto, atualize a página.</p>
        <div className="update-buttons">
          <button onClick={handleRefresh} className="update-button">
            Atualizar agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;