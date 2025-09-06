"use client";
import { Suspense, lazy } from 'react';
import { ContentProvider } from '../components/ContentProvider';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ErrorBoundary from '../components/ErrorBoundary';

// Lazy load components that are below the fold
const Benefits = lazy(() => 
  import('../components/Benefits').then(module => ({ 
    default: module.default 
  }))
);
const Offer = lazy(() => 
  import('../components/Offer').then(module => ({ 
    default: module.default 
  }))
);
const Testimonials = lazy(() => 
  import('../components/Testimonials').then(module => ({ 
    default: module.default 
  }))
);
const Safety = lazy(() => 
  import('../components/Safety').then(module => ({ 
    default: module.default 
  }))
);
const OrderForm = lazy(() => 
  import('../components/OrderForm').then(module => ({ 
    default: module.default 
  }))
);
const PaymentOptions = lazy(() => 
  import('../components/PaymentOptions').then(module => ({ 
    default: module.default 
  }))
);
const Footer = lazy(() => 
  import('../components/Footer').then(module => ({ 
    default: module.default 
  }))
);

// Optimized loading component
const SectionLoader = () => (
  <div className="py-8 flex justify-center">
    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  return (
    <ContentProvider>
      <div className="min-h-screen">
        <Header />
        <main id="main-content" role="main">
          <Hero />
          
          <div className="lazy-sections">
            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <Benefits />
              </Suspense>
            </ErrorBoundary>
            
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