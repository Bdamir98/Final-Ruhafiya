export default function CriticalCSS() {
  return (
    <style jsx>{`
      /* Critical mobile-first styles */
      .hero-section {
        min-height: 100vh;
        min-height: 100svh; /* Use small viewport height for mobile */
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        overflow-x: hidden;
      }
      
      .hero-content {
        max-width: 1200px;
        width: 100%;
        text-align: center;
      }
      
      .hero-title {
        font-size: clamp(1.75rem, 6vw, 4rem);
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.75rem;
        line-height: 1.1;
        letter-spacing: -0.025em;
      }
      
      .hero-subtitle {
        font-size: clamp(0.9rem, 3vw, 1.5rem);
        color: #6b7280;
        margin-bottom: 1.5rem;
        line-height: 1.4;
      }
      
      .cta-button {
        background: #16a34a;
        color: white;
        padding: 0.875rem 1.75rem;
        border-radius: 9999px;
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: background-color 0.2s ease;
        touch-action: manipulation;
        min-height: 44px;
        font-size: 1rem;
      }
      
      .cta-button:hover {
        background: #15803d;
      }
      
      .cta-button:active {
        transform: scale(0.98);
      }
      
      /* Header styles - mobile optimized */
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 50;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #e5e7eb;
        height: 64px;
      }
      
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
      }
      
      .logo {
        height: 32px;
        width: auto;
        max-width: 120px;
      }
      
      /* Optimized loading states */
      .loading-skeleton {
        background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%);
        background-size: 200% 100%;
        animation: loading 1.2s ease-in-out infinite;
        border-radius: 4px;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Mobile-specific optimizations */
      @media (max-width: 640px) {
        .hero-section {
          padding: 0.75rem;
          min-height: calc(100vh - 64px);
          min-height: calc(100svh - 64px);
        }
        
        .hero-title {
          font-size: clamp(1.5rem, 8vw, 2.5rem);
          margin-bottom: 0.5rem;
        }
        
        .hero-subtitle {
          font-size: clamp(0.875rem, 4vw, 1.125rem);
          margin-bottom: 1.25rem;
        }
        
        .cta-button {
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          width: 100%;
          max-width: 280px;
        }
        
        .header {
          padding: 0.5rem 0.75rem;
          height: 56px;
        }
        
        .logo {
          height: 28px;
          max-width: 100px;
        }
      }
      
      /* Tablet optimizations */
      @media (min-width: 641px) and (max-width: 1024px) {
        .hero-section {
          padding: 1rem;
        }
        
        .cta-button {
          padding: 0.875rem 2rem;
        }
      }
      
      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        .loading-skeleton {
          animation: none;
          background: #f8f9fa;
        }
        
        .cta-button {
          transition: none;
        }
        
        .cta-button:active {
          transform: none;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .cta-button {
          border: 2px solid currentColor;
        }
        
        .header {
          border-bottom-width: 2px;
        }
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .hero-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        
        .hero-title {
          color: #f8fafc;
        }
        
        .hero-subtitle {
          color: #cbd5e1;
        }
        
        .header {
          background: rgba(15, 23, 42, 0.95);
          border-bottom-color: #334155;
        }
      }
    `}</style>
  );
}