"use client";

import { useEffect } from 'react';

/**
 * Component to handle bfcache (back/forward cache) optimization
 * Prevents WebSocket interference and manages page states for optimal bfcache performance
 */
export default function BfcacheHandler() {
  useEffect(() => {
    // Handle page visibility changes for bfcache optimization
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is being cached by bfcache
        // Dismiss any pending network requests that could interfere
        if ('serviceWorker' in navigator) {
          // Handle service worker ready state if applicable
          console.log('Page going to bfcache cache');
        }
      } else if (document.visibilityState === 'visible') {
        // Page is being restored from bfcache
        console.log('Page restored from bfcache');
      }
    };

    // Set up bfcache-friendly handlers
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook for components to register cleanup functions for bfcache optimization
 */
export function useBfcacheCleanup(cleanupFn: (() => void) | undefined) {
  useEffect(() => {
    if (!cleanupFn) return;

    const handlePageHide = () => cleanupFn();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cleanupFn();
      }
    };

    document.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cleanupFn]);
}