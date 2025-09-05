"use client";
import { Suspense, lazy } from 'react';
import { ContentProvider } from '../components/ContentProvider';
import Header from '../components/Header';
import Hero from '../components/Hero';

// Lazy load components that are below the fold
const Benefits = lazy(() => import('../components/Benefits'));
const Offer = lazy(() => import('../components/Offer'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Safety = lazy(() => import('../components/Safety'));
const OrderForm = lazy(() => import('../components/OrderForm'));
const PaymentOptions = lazy(() => import('../components/PaymentOptions'));
const Footer = lazy(() => import('../components/Footer'));

// Simple loading component
const SectionLoader = () => (
  <div className="py-16 flex justify-center">
    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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
            <Suspense fallback={<SectionLoader />}>
              <Benefits />
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <Offer />
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <Testimonials />
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <Safety />
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <OrderForm />
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <PaymentOptions />
            </Suspense>
          </div>
        </main>
        
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </div>
    </ContentProvider>
  );
}

