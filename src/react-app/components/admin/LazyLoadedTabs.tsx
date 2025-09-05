"use client";
import React, { Suspense, lazy } from 'react';
import type { FunctionComponent } from 'react';

// Lazy load components to reduce initial bundle size
const AnalyticsTabLazy = lazy(() => import('./AnalyticsTab'));
const CustomersTabLazy = lazy(() => import('./CustomersTab'));
const NotificationsTabLazy = lazy(() => import('./NotificationsTab'));
const ContentTabLazy = lazy(() => import('./ContentTab'));
const SettingsTabLazy = lazy(() => import('./SettingsTab'));
const FraudTabLazy = lazy(() => import('./FraudTab'));

// Loading fallback component
interface LoadingFallbackProps {
  height?: string;
}

function LoadingFallback({ height = 'h-64' }: LoadingFallbackProps) {
  return (
    <div className={`${height} flex items-center justify-center`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      <span className="ml-2 text-gray-500">Loading...</span>
    </div>
  );
}

// Re-export regular components for immediate loading
export { default as OrdersTab } from './OrdersTab';
export { default as ProductsTab } from './ProductsTab';
export { default as AdminSidebar } from './AdminSidebar';

// Lazy-loaded wrappers for better performance
export function AnalyticsTab(props: any) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnalyticsTabLazy {...props} />
    </Suspense>
  );
}

export function CustomersTab(props: any) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CustomersTabLazy {...props} />
    </Suspense>
  );
}

export function NotificationsTab(props: any) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NotificationsTabLazy {...props} />
    </Suspense>
  );
}

export function ContentTab(props: any) {
  return (
    <Suspense fallback={<LoadingFallback height="h-96" />}>
      <ContentTabLazy {...props} />
    </Suspense>
  );
}

export function SettingsTab(props: any) {
  return (
    <Suspense fallback={<LoadingFallback height="h-32" />}>
      <SettingsTabLazy {...props} />
    </Suspense>
  );
}

export function FraudTab(props: any) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FraudTabLazy {...props} />
    </Suspense>
  );
}