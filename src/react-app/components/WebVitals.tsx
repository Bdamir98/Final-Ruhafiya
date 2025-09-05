"use client";
import { useEffect } from 'react';

export default function WebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
        function sendToAnalytics({ name, delta, value, id }: any) {
          // Send to Google Analytics 4 via GTM
          if (window.gtag) {
            window.gtag('event', name, {
              event_category: 'Web Vitals',
              event_label: id,
              value: Math.round(name === 'CLS' ? delta * 1000 : delta),
              non_interaction: true,
            });
          }

          // Send to GTM DataLayer
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'web_vitals',
              web_vitals_name: name,
              web_vitals_value: Math.round(name === 'CLS' ? delta * 1000 : delta),
              web_vitals_id: id,
            });
          }

          // Log for debugging
          console.log(`${name}: ${Math.round(name === 'CLS' ? delta * 1000 : delta)}`);
        }

        // Measure all Core Web Vitals
        onCLS(sendToAnalytics);
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
      });
    }
  }, []);

  return null;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}