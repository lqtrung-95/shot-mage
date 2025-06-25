import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Hook to check if the framework is ready
 * This is useful for cases where we need to wait for the JS engine to be fully initialized
 */
export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set a timeout to ensure the framework is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return isReady;
}

/**
 * Function to safely access global objects
 * This helps prevent errors when accessing objects that might not be available yet
 */
export function safelyAccessGlobal<T>(accessor: () => T, fallback: T): T {
  try {
    const value = accessor();
    return value !== undefined && value !== null ? value : fallback;
  } catch (e) {
    return fallback;
  }
}
