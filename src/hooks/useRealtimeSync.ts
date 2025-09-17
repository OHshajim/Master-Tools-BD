
import { useEffect, useCallback } from 'react';

interface RealtimeSyncOptions {
  onCredentialsUpdate?: () => void;
  onCookiesUpdate?: () => void;
  onDataUpdate?: () => void;
  onUserSpecificUpdate?: () => void;
}

/**
 * Custom hook for real-time data synchronization across tabs and components
 */
export const useRealtimeSync = (options: RealtimeSyncOptions = {}) => {
  const { onCredentialsUpdate, onCookiesUpdate, onDataUpdate, onUserSpecificUpdate } = options;

  // Broadcast changes to other tabs
  const broadcastChange = useCallback((type: 'credentials' | 'cookies' | 'general' | 'userCredentials' | 'userCookies', data?: any) => {
    // Use BroadcastChannel for cross-tab communication
    const channel = new BroadcastChannel('data-sync');
    channel.postMessage({ type, data, timestamp: Date.now() });
    channel.close();

    // Also dispatch custom event for same-tab communication
    const customEvent = new CustomEvent('dataSync', {
      detail: { type, data, timestamp: Date.now() }
    });
    window.dispatchEvent(customEvent);
  }, []);

  // Listen for changes from other tabs and components
  useEffect(() => {
    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessVaultCredentials' && onCredentialsUpdate) {
        onCredentialsUpdate();
      } else if (e.key === 'accessVaultCookies' && onCookiesUpdate) {
        onCookiesUpdate();
      } else if (e.key?.startsWith('userSpecificCredentials') && (onUserSpecificUpdate || onCredentialsUpdate)) {
        onUserSpecificUpdate?.();
        onCredentialsUpdate?.();
      } else if (e.key?.startsWith('userSpecificCookies') && (onUserSpecificUpdate || onCookiesUpdate)) {
        onUserSpecificUpdate?.();
        onCookiesUpdate?.();
      }
      
      if (onDataUpdate) {
        onDataUpdate();
      }
    };

    // Listen for BroadcastChannel messages
    const channel = new BroadcastChannel('data-sync');
    const handleBroadcastMessage = (event: MessageEvent) => {
      const { type } = event.data;
      
      if (type === 'credentials' && onCredentialsUpdate) {
        onCredentialsUpdate();
      } else if (type === 'cookies' && onCookiesUpdate) {
        onCookiesUpdate();
      } else if (type === 'userCredentials' && (onUserSpecificUpdate || onCredentialsUpdate)) {
        onUserSpecificUpdate?.();
        onCredentialsUpdate?.();
      } else if (type === 'userCookies' && (onUserSpecificUpdate || onCookiesUpdate)) {
        onUserSpecificUpdate?.();
        onCookiesUpdate?.();
      }
      
      if (onDataUpdate) {
        onDataUpdate();
      }
    };

    // Listen for user-specific data changes
    const userChannel = new BroadcastChannel('user-data-sync');
    const handleUserBroadcastMessage = (event: MessageEvent) => {
      const { type } = event.data;
      
      if (type === 'userCredentials' && (onUserSpecificUpdate || onCredentialsUpdate)) {
        onUserSpecificUpdate?.();
        onCredentialsUpdate?.();
      } else if (type === 'userCookies' && (onUserSpecificUpdate || onCookiesUpdate)) {
        onUserSpecificUpdate?.();
        onCookiesUpdate?.();
      }
      
      if (onDataUpdate) {
        onDataUpdate();
      }
    };

    // Listen for custom events (same-tab)
    const handleCustomEvent = (event: CustomEvent) => {
      const { type } = event.detail;
      
      if (type === 'credentials' && onCredentialsUpdate) {
        onCredentialsUpdate();
      } else if (type === 'cookies' && onCookiesUpdate) {
        onCookiesUpdate();
      } else if (type === 'userCredentials' && (onUserSpecificUpdate || onCredentialsUpdate)) {
        onUserSpecificUpdate?.();
        onCredentialsUpdate?.();
      } else if (type === 'userCookies' && (onUserSpecificUpdate || onCookiesUpdate)) {
        onUserSpecificUpdate?.();
        onCookiesUpdate?.();
      }
      
      if (onDataUpdate) {
        onDataUpdate();
      }
    };

    // Listen for user data sync events
    const handleUserDataSync = (event: CustomEvent) => {
      const { type } = event.detail;
      
      if (type === 'userCredentials' && (onUserSpecificUpdate || onCredentialsUpdate)) {
        onUserSpecificUpdate?.();
        onCredentialsUpdate?.();
      } else if (type === 'userCookies' && (onUserSpecificUpdate || onCookiesUpdate)) {
        onUserSpecificUpdate?.();
        onCookiesUpdate?.();
      }
      
      if (onDataUpdate) {
        onDataUpdate();
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    channel.addEventListener('message', handleBroadcastMessage);
    userChannel.addEventListener('message', handleUserBroadcastMessage);
    window.addEventListener('dataSync', handleCustomEvent as EventListener);
    window.addEventListener('userDataSync', handleUserDataSync as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.removeEventListener('message', handleBroadcastMessage);
      userChannel.removeEventListener('message', handleUserBroadcastMessage);
      window.removeEventListener('dataSync', handleCustomEvent as EventListener);
      window.removeEventListener('userDataSync', handleUserDataSync as EventListener);
      channel.close();
      userChannel.close();
    };
  }, [onCredentialsUpdate, onCookiesUpdate, onDataUpdate, onUserSpecificUpdate]);

  return {
    broadcastChange
  };
};
