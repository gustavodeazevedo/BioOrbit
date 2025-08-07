import { useState, useEffect, useRef } from 'react';
import versionService from '../services/versionService';

/**
 * Custom hook for managing version updates
 * @param {Object} options - Configuration options
 * @param {number} options.checkInterval - Check interval in milliseconds (default: 5 minutes)
 * @param {boolean} options.autoStart - Whether to start checking automatically (default: true)
 */
const useVersionUpdate = (options = {}) => {
  const {
    checkInterval = 5 * 60 * 1000, // 5 minutes
    autoStart = true
  } = options;

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [newVersion, setNewVersion] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  
  const listenerRef = useRef(null);

  // Initialize version service
  useEffect(() => {
    const initializeService = async () => {
      try {
        const version = await versionService.initialize();
        setCurrentVersion(version);
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize version service:', err);
        setError(err);
        setIsInitialized(true);
      }
    };

    initializeService();
  }, []);

  // Set up version update listener
  useEffect(() => {
    if (!isInitialized) return;

    const handleVersionUpdate = (newVer, currentVer) => {
      setNewVersion(newVer);
      setCurrentVersion(currentVer);
      setIsUpdateAvailable(true);
    };

    listenerRef.current = handleVersionUpdate;
    versionService.addUpdateListener(handleVersionUpdate);

    return () => {
      if (listenerRef.current) {
        versionService.removeUpdateListener(listenerRef.current);
      }
    };
  }, [isInitialized]);

  // Start/stop periodic checking
  useEffect(() => {
    if (!isInitialized || !autoStart) return;

    versionService.startPeriodicChecking(checkInterval);

    return () => {
      versionService.stopPeriodicChecking();
    };
  }, [isInitialized, autoStart, checkInterval]);

  /**
   * Manually check for updates
   */
  const checkForUpdates = async () => {
    try {
      const hasUpdate = await versionService.checkForUpdates();
      setError(null);
      return hasUpdate;
    } catch (err) {
      setError(err);
      return false;
    }
  };

  /**
   * Reload the application
   */
  const reloadApplication = () => {
    versionService.reloadApplication();
  };

  /**
   * Dismiss the update notification (not recommended for forced updates)
   */
  const dismissUpdate = () => {
    setIsUpdateAvailable(false);
  };

  /**
   * Start periodic checking manually
   */
  const startChecking = () => {
    versionService.startPeriodicChecking(checkInterval);
  };

  /**
   * Stop periodic checking manually
   */
  const stopChecking = () => {
    versionService.stopPeriodicChecking();
  };

  return {
    // State
    isUpdateAvailable,
    currentVersion,
    newVersion,
    isInitialized,
    error,
    
    // Actions
    checkForUpdates,
    reloadApplication,
    dismissUpdate,
    startChecking,
    stopChecking
  };
};

export default useVersionUpdate;