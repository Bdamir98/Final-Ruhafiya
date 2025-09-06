"use client";
import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI or nothing
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

// Simple fallback component for lazy loading
export const LazyFallback = () => (
  <div className="py-8 flex justify-center">
    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Wrapper component that combines ErrorBoundary with lazy loading
export function SafeLazyWrapper({ 
  children, 
  fallback = <LazyFallback />,
  className = "" 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </ErrorBoundary>
  );
}