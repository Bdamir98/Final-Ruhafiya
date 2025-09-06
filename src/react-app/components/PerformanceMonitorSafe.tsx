"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Use the existing PerformanceMonitor instead of PerformanceMonitorCore
const ClientOnlyPerformanceMonitor = dynamic(() => import('./PerformanceMonitor'), {
  ssr: false,
  loading: () => null,
});

export default function PerformanceMonitorSafe() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Delay mounting to ensure page is fully loaded
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Only render on client after delay
  return shouldRender ? <ClientOnlyPerformanceMonitor /> : null;
}