
import { useState, useEffect } from 'react';

/**
 * Custom hook for handling local storage operations with cross-device synchronization
 * @param key Local storage key
 * @param initialValue Default value if key doesn't exist
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue());

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Create a custom event to notify other tabs/windows about the change
        const storageEvent = new CustomEvent('storageUpdate', { 
          detail: { key, value: valueToStore } 
        });
        window.dispatchEvent(storageEvent);
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Update local state if localStorage changes in another component or another tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for "${key}":`, error);
        }
      }
    };
    
    // Listen for our custom storage events (same-tab sync)
    const handleCustomStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };
    
    // Listen for regular storage events (cross-tab)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      // Listen for our custom storage events (same-tab sync)
      window.addEventListener('storageUpdate', handleCustomStorageChange);
    }
    
    // Force a refresh every second to ensure we're always up to date
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined') {
        const currentValue = localStorage.getItem(key);
        if (currentValue) {
          try {
            const parsedValue = JSON.parse(currentValue);
            // Only update if the value has actually changed
            if (JSON.stringify(parsedValue) !== JSON.stringify(storedValue)) {
              setStoredValue(parsedValue);
            }
          } catch (error) {
            console.warn(`Error refreshing localStorage value for "${key}":`, error);
          }
        }
      }
    }, 1000);
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('storageUpdate', handleCustomStorageChange);
        clearInterval(intervalId);
      }
    };
  }, [key, storedValue]);

  return [storedValue, setValue];
}
