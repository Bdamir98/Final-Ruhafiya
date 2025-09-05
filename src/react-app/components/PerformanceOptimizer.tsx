"use client";
import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical images
      const criticalImages = ['/logo.png'];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      });
    };

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Delay non-critical scripts
      const scripts = document.querySelectorAll('script[data-delay]');
      scripts.forEach(script => {
        setTimeout(() => {
          const newScript = document.createElement('script');
          newScript.src = script.getAttribute('data-src') || '';
          newScript.async = true;
          document.head.appendChild(newScript);
        }, 3000); // Delay by 3 seconds
      });
    };

    // Intersection Observer for lazy loading
    const setupIntersectionObserver = () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    };

    // Run optimizations
    preloadCriticalResources();
    optimizeThirdPartyScripts();
    setupIntersectionObserver();

    // Cleanup function
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return null; // This component doesn't render anything
}