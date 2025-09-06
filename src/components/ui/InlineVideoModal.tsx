'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface InlineVideoModalProps {
  videoUrl: string | null;
  onClose: () => void;
}

export default function InlineVideoModal({ videoUrl, onClose }: InlineVideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Handle escape key to close
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!videoUrl) return null;

  // Extract video ID from different YouTube URL formats
  const getVideoId = (url: string) => {
    // Handle youtu.be/ID format
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    // Handle youtube.com/shorts/ID format
    if (url.includes('youtube.com/shorts/')) {
      return url.split('youtube.com/shorts/')[1].split('?')[0];
    }
    // Handle youtube.com/watch?v=ID format
    if (url.includes('youtube.com/watch')) {
      return new URLSearchParams(new URL(url).search).get('v');
    }
    return url;
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 text-white rounded-full p-2 hover:bg-opacity-90 transition-all duration-200"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video container - half screen size */}
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-t-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            গ্রাহক পর্যালোচনা ভিডিও • ESC চেপে বন্ধ করুন
          </p>
        </div>
      </div>
    </div>
  );
}
