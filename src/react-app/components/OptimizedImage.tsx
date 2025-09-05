"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    sizes?: string;
    fill?: boolean;
    loading?: 'lazy' | 'eager';
}

export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 75,
    placeholder = 'blur',
    blurDataURL,
    sizes,
    fill = false,
    loading = 'lazy',
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(priority);
    const imgRef = useRef<HTMLDivElement>(null);

    // Generate optimized blur placeholder
    const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj9v9H/2Q==';

    // Optimized intersection observer
    useEffect(() => {
        if (!priority && !shouldLoad && imgRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setShouldLoad(true);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '100px 0px', // Increased for mobile
                    threshold: 0.01,
                }
            );

            observer.observe(imgRef.current);

            return () => {
                observer.disconnect();
            };
        }
    }, [priority, shouldLoad]);

    const handleError = useCallback(() => {
        setHasError(true);
    }, []);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    // Error fallback with better mobile styling
    if (hasError) {
        return (
            <div
                className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}
                style={{ width, height }}
                role="img"
                aria-label={`Failed to load: ${alt}`}
            >
                <div className="text-center p-4">
                    <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-gray-500 text-xs">Image unavailable</span>
                </div>
            </div>
        );
    }

    // Mobile-optimized sizes
    const mobileSizes = sizes || '(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vw, 33vw';

    const imageProps = {
        src,
        alt,
        className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out`,
        onError: handleError,
        onLoad: handleLoad,
        quality: quality,
        placeholder: placeholder as any,
        blurDataURL: blurDataURL || defaultBlurDataURL,
        priority,
        sizes: mobileSizes,
        loading: loading as any,
        ...props,
    };

    // Don't render image until it should load (for non-priority images)
    if (!shouldLoad && !priority) {
        return (
            <div
                ref={imgRef}
                className={`bg-gray-100 animate-pulse ${className}`}
                style={{ width, height }}
                role="img"
                aria-label={`Loading: ${alt}`}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 text-gray-300">
                        <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    if (fill) {
        return (
            <div ref={imgRef} className="relative overflow-hidden">
                <Image
                    {...imageProps}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>
        );
    }

    return (
        <div ref={imgRef} className="relative">
            <Image
                {...imageProps}
                width={width || 400}
                height={height || 300}
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block'
                }}
            />
        </div>
    );
}