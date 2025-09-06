"use client";
import { useEffect, useState } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export default function PerformanceMonitor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Skip if not in browser environment or not mounted
    if (!isMounted || typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    // Core Web Vitals monitoring
    const sendToAnalytics = (metric: PerformanceMetric) => {
      try {
        // Send to analytics service
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'web_vital', {
            name: metric.name,
            value: Math.round(metric.value),
            rating: metric.rating,
          });
        }
        
        // Optional: Send to custom analytics
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metric:', metric);
        }
      } catch (error) {
        // Silently fail in production
        if (process.env.NODE_ENV === 'development') {
          console.warn('Analytics tracking failed:', error);
        }
      }
    };

    const getCLS = () => {
      try {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          
          const rating = cls <= 0.1 ? 'good' : cls <= 0.25 ? 'needs-improvement' : 'poor';
          sendToAnalytics({ name: 'CLS', value: cls, rating });
        });

        if ('LayoutShift' in window && PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
          observer.observe({ type: 'layout-shift', buffered: true });
        }
      } catch (error) {
        // Silently fail
      }
    };

    const getFID = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fid = (entry as any).processingStart - entry.startTime;
            const rating = fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor';
            sendToAnalytics({ name: 'FID', value: fid, rating });
          }
        });

        if ('PerformanceEventTiming' in window && PerformanceObserver.supportedEntryTypes.includes('first-input')) {
          observer.observe({ type: 'first-input', buffered: true });
        }
      } catch (error) {
        // Silently fail
      }
    };

    const getLCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            const lcp = lastEntry.startTime;
            const rating = lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor';
            sendToAnalytics({ name: 'LCP', value: lcp, rating });
          }
        });

        if ('LargestContentfulPaint' in window && PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
        }
      } catch (error) {
        // Silently fail
      }
    };

    const getFCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              const fcp = entry.startTime;
              const rating = fcp <= 1800 ? 'good' : fcp <= 3000 ? 'needs-improvement' : 'poor';
              sendToAnalytics({ name: 'FCP', value: fcp, rating });
            }
          }
        });

        if (PerformanceObserver.supportedEntryTypes.includes('paint')) {
          observer.observe({ type: 'paint', buffered: true });
        }
      } catch (error) {
        // Silently fail
      }
    };

    const getTTFB = () => {
      try {
        if (typeof performance !== 'undefined' && performance.getEntriesByType) {
          const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navEntry && navEntry.responseStart && navEntry.requestStart) {
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            const rating = ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor';
            sendToAnalytics({ name: 'TTFB', value: ttfb, rating });
          }
        }
      } catch (error) {
        // Silently fail
      }
    };

    // Initialize performance monitoring with error handling
    const initPerformanceMonitoring = () => {
      try {
        if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
          getCLS();
          getFID();
          getLCP();
          getFCP();
          getTTFB();
        }
      } catch (error) {
        console.warn('Performance monitoring initialization failed:', error);
      }
    };

    // Delay monitoring to not interfere with page load
    const timer = setTimeout(initPerformanceMonitoring, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isMounted]);

  return null; // This component doesn't render anything
}

// Hook for manual performance tracking
export function usePerformanceTracking() {
  const trackEvent = (eventName: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const totalDuration = duration || (endTime - startTime);
        
        // Send to analytics
        if ((window as any).gtag) {
          (window as any).gtag('event', 'timing_complete', {
            name: eventName,
            value: Math.round(totalDuration),
          });
        }
        
        console.log(`Performance: ${eventName} took ${totalDuration.toFixed(2)}ms`);
      };
    }
    
    return () => {};
  };

  return { trackEvent };
}