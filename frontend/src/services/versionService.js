/**
 * Service for checking application version updates
 */

class VersionService {
  constructor() {
    this.currentVersion = null;
    this.checkInterval = null;
    this.listeners = [];
    this.isChecking = false;
  }

  /**
   * Initialize version service and get current version
   */
  async initialize() {
    try {
      this.currentVersion = await this.fetchVersion();
      console.log('Version service initialized:', this.currentVersion?.shortHash);
      return this.currentVersion;
    } catch (error) {
      console.warn('Failed to initialize version service:', error);
      return null;
    }
  }

  /**
   * Fetch version information from server
   */
  async fetchVersion() {
    try {
      const response = await fetch('/version.json?t=' + Date.now(), {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const version = await response.json();
      return version;
    } catch (error) {
      console.warn('Failed to fetch version:', error);
      throw error;
    }
  }

  /**
   * Check for version updates
   */
  async checkForUpdates() {
    if (this.isChecking || !this.currentVersion) {
      return false;
    }

    this.isChecking = true;
    
    try {
      const latestVersion = await this.fetchVersion();
      
      // Compare version hashes
      if (latestVersion.hash !== this.currentVersion.hash) {
        console.log('New version detected:', {
          current: this.currentVersion.shortHash,
          latest: latestVersion.shortHash
        });
        
        // Notify listeners
        this.notifyListeners(latestVersion);
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Failed to check for updates:', error);
      return false;
    } finally {
      this.isChecking = false;
    }
  }

  /**
   * Start periodic version checking
   * @param {number} intervalMs - Check interval in milliseconds (default: 5 minutes)
   */
  startPeriodicChecking(intervalMs = 5 * 60 * 1000) {
    this.stopPeriodicChecking();
    
    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, intervalMs);
    
    console.log(`Version checking started (interval: ${intervalMs / 1000}s)`);
  }

  /**
   * Stop periodic version checking
   */
  stopPeriodicChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Version checking stopped');
    }
  }

  /**
   * Add listener for version updates
   * @param {function} callback - Callback function to call when update is detected
   */
  addUpdateListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove update listener
   * @param {function} callback - Callback function to remove
   */
  removeUpdateListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all listeners about version update
   * @param {object} newVersion - New version information
   */
  notifyListeners(newVersion) {
    this.listeners.forEach(callback => {
      try {
        callback(newVersion, this.currentVersion);
      } catch (error) {
        console.error('Error in version update listener:', error);
      }
    });
  }

  /**
   * Get current version info
   */
  getCurrentVersion() {
    return this.currentVersion;
  }

  /**
   * Force page reload
   */
  reloadApplication() {
    window.location.reload();
  }
}

// Create singleton instance
const versionService = new VersionService();

export default versionService;