"use client";
import { useState, useCallback, memo } from 'react';
import { Play } from 'lucide-react';

interface OptimizedYouTubeProps {
    videoUrl: string;
    title?: string;
    className?: string;
}

const OptimizedYouTube = memo(({ videoUrl, title = "Video", className = "" }: OptimizedYouTubeProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const getVideoId = useCallback((url: string): string | null => {
        if (!url) return null;

        // Handle YouTube Shorts URL
        const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
        if (shortsMatch) return shortsMatch[1];

        // Handle regular YouTube embed URL
        const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
        if (embedMatch) return embedMatch[1];

        // Handle regular YouTube watch URL
        const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
        if (watchMatch) return watchMatch[1];

        return null;
    }, []);

    const videoId = getVideoId(videoUrl);

    const handleLoadVideo = useCallback(() => {
        setIsLoaded(true);
    }, []);

    if (!videoId) {
        return (
            <div className={`flex items-center justify-center bg-gray-900 text-white ${className}`}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 ml-1" />
                    </div>
                    <p className="text-sm opacity-75">Video unavailable</p>
                </div>
            </div>
        );
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    return (
        <div className={`relative bg-gray-900 ${className}`}>
            {!isLoaded ? (
                <button
                    className="relative cursor-pointer group w-full h-full focus:outline-none focus:ring-4 focus:ring-red-300"
                    onClick={handleLoadVideo}
                    aria-label={`Play video: ${title}`}
                    type="button"
                >
                    <img
                        src={thumbnailUrl}
                        alt={`Video thumbnail: ${title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" aria-hidden="true" />
                        </div>
                    </div>
                    <span className="sr-only">Click to play video: {title}</span>
                </button>
            ) : (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={title}
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                />
            )}
        </div>
    );
});

OptimizedYouTube.displayName = 'OptimizedYouTube';

export default OptimizedYouTube;