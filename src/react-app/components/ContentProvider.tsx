"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { websiteContent } from '@/shared/websiteContent';

interface ContentContextType {
  content: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  // Add a global refetch trigger
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
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());

  const fetchContent = async (force = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add timestamp for cache busting
      const timestamp = force ? Date.now() : lastFetchTime;
      const response = await fetch(`/api/admin/website-content?t=${timestamp}`);
      if (response.ok) {
        const data = await response.json();

        // Merge database content with static content as fallback
        const mergedContent = { ...websiteContent, ...data.content };

        // Special handling for benefits items - ensure they're parsed as arrays
        if (data.content?.benefits?.items && typeof data.content.benefits.items === 'string') {
          try {
            const parsedItems = JSON.parse(data.content.benefits.items);
            mergedContent.benefits = {
              ...mergedContent.benefits,
              items: parsedItems
            };
          } catch (e) {
            console.error('Failed to parse benefits items:', e);
          }
        }

        setContent(mergedContent);
        setLastFetchTime(Date.now());
      } else {
        setError('Failed to fetch content');
        setContent(websiteContent);
      }
    } catch (err) {
      setError('Error fetching content');
      setContent(websiteContent);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchContent(true);
  };

  // Poll for content updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchContent(false);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Listen for global content refresh events
  useEffect(() => {
    const handleContentRefresh = () => {
      fetchContent(true);
    };

    window.addEventListener('contentRefresh', handleContentRefresh);

    return () => {
      window.removeEventListener('contentRefresh', handleContentRefresh);
    };
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchContent();
  }, []);

  const value: ContentContextType = {
    content,
    isLoading,
    error,
    refetch,
    refreshContent: () => {
      // Trigger a global content refresh by updating a state that components can watch
      window.dispatchEvent(new CustomEvent('contentRefresh'));
    },
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
