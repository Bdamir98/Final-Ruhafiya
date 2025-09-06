"use client";
import { Suspense, lazy, useEffect } from 'react';
import { ContentProvider } from '../providers/ContentProvider';
import Header from '../layout/Header';
import Hero from './Hero';
import Benefits from './Benefits'; // Load immediately, no lazy loading
import ErrorBoundary, { SafeLazyWrapper } from '../ui/ErrorBoundary';

// Lazy load components that are below the fold - load progressively
const Offer = lazy(() => 
  import('./Offer').then(module => ({ 
    default: module.default 
  }))
);
const Testimonials = lazy(() => 
  import('./Testimonials').then(module => ({ 
    default: module.default 
  }))
);
const Safety = lazy(() => 
  import('./Safety').then(module => ({ 
    default: module.default 
  }))
);
const OrderForm = lazy(() => 
  import('./OrderForm').then(module => ({ 
    default: module.default 
  }))
);
const PaymentOptions = lazy(() => 
  import('./PaymentOptions').then(module => ({ 
    default: module.default 
  }))
);
const Footer = lazy(() => 
  import('../layout/Footer').then(module => ({ 
    default: module.default 
  }))
);

// Invisible loading component
const SectionLoader = () => (
  <div className="py-8">
  </div>
);

export default function Home() {
  // Always start from top on page load/refresh for better UX
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentProvider>
      <div className="min-h-screen">
        <Header />
        <main id="main-content" role="main">
          <Hero />
          
          {/* Benefits section loads immediately - no lazy loading for better UX */}
          <Benefits />
          
          <div className="lazy-sections">
            {/* Progressive loading: Other sections load with standard Suspense */}
            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <Offer />
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <Testimonials />
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <Safety />
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <OrderForm />
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <PaymentOptions />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
        
        <ErrorBoundary fallback={<SectionLoader />}>
          <Suspense fallback={<SectionLoader />}>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ContentProvider>
  );
}

