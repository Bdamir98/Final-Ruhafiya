"use client";
import { useState, useEffect, Suspense, ReactNode } from 'react';

interface PerformanceWrapperProps {
  children: ReactNode;
  delay?: number;
  priority?: boolean;
  fallback?: ReactNode;
  className?: string;
}

const DefaultFallback = () => (
  <div className="py-16 flex justify-center">
    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function PerformanceWrapper({ 
  children, 
  delay = 100, 
  priority = false,
  fallback = <DefaultFallback />,
  className = ""
}: PerformanceWrapperProps) {
  const [shouldRender, setShouldRender] = useState(priority);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!priority && isMounted) {
      try {
        // Use requestIdleCallback if available, otherwise setTimeout
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            setTimeout(() => setShouldRender(true), delay);
          }, { timeout: delay + 1000 });
        } else {
          setTimeout(() => setShouldRender(true), delay);
        }
      } catch (error) {
        // Fallback to immediate rendering on error
        if (process.env.NODE_ENV === 'development') {
          console.warn('Performance wrapper error:', error);
        }
        setTimeout(() => setShouldRender(true), delay);
      }
    }
  }, [delay, priority, isMounted]);

  if (!shouldRender) {
    return (
      <div className={`lazy-load ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={`lazy-loaded ${className}`}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
}

// Hook for intersection-based loading
export function useIntersectionLoad(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!ref || !isMounted || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(ref);
          }
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1,
          ...options
        }
      );

      observer.observe(ref);

      return () => {
        observer.disconnect();
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Intersection observer error:', error);
      }
      // Fallback to immediate visibility
      setIsVisible(true);
    }
  }, [ref, options, isMounted]);

  return [setRef, isVisible] as const;
}