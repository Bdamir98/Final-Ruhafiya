"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { websiteContent } from '@/shared/websiteContent';

interface ContentContextType {
  content: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<Record<string, any>>(websiteContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async (force = false) => {
    // Skip if already loading to prevent duplicate requests
    if (isLoading && !force) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(`/api/admin/website-content`, {
        signal: controller.signal,
        cache: force ? 'no-cache' : 'default',
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const mergedContent = { ...websiteContent, ...data.content };

        // Optimize benefits parsing
        if (data.content?.benefits?.items && typeof data.content.benefits.items === 'string') {
          try {
            mergedContent.benefits = {
              ...mergedContent.benefits,
              items: JSON.parse(data.content.benefits.items)
            };
          } catch (e) {
            console.warn('Failed to parse benefits items:', e);
          }
        }

        setContent(mergedContent);
      } else {
        setContent(websiteContent);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Error fetching content');
      }
      setContent(websiteContent);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchContent(true);
  };

  // Reduced polling frequency for better performance
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Only poll in development or when explicitly needed
    if (process.env.NODE_ENV === 'development') {
      interval = setInterval(() => {
        fetchContent(false);
      }, 60000); // Check every 60 seconds instead of 30
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Optimized event listener
  useEffect(() => {
    const handleContentRefresh = () => {
      fetchContent(true);
    };

    window.addEventListener('contentRefresh', handleContentRefresh, { passive: true });
    return () => {
      window.removeEventListener('contentRefresh', handleContentRefresh);
    };
  }, []);

  // Completely skip all fetching in production for maximum performance
  useEffect(() => {
    // Only fetch in development, skip entirely in production
    if (process.env.NODE_ENV === 'development') {
      // Delay initial fetch significantly to not block rendering
      const timer = setTimeout(() => {
        fetchContent();
      }, 5000); // Increased delay to 5 seconds
      return () => clearTimeout(timer);
    }
    // In production, just use static content without any fetching
  }, []);

  const value: ContentContextType = useMemo(() => ({
    content,
    isLoading,
    error,
    refetch,
    refreshContent: () => {
      window.dispatchEvent(new CustomEvent('contentRefresh'));
    },
  }), [content, isLoading, error]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
