import { websiteContent } from '@/config/websiteContent';
import { useState, useCallback, memo } from 'react';
import { Play } from 'lucide-react';

// Optimized video component
const LazyVideo = memo(({ video, onPlay }: { video: any; onPlay: (id: number) => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const getVideoId = (url: string) => {
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('youtube.com/shorts/')) {
      return url.split('youtube.com/shorts/')[1].split('?')[0];
    }
    if (url.includes('youtube.com/watch')) {
      return new URLSearchParams(new URL(url).search).get('v');
    }
    return url;
  };

  const videoId = getVideoId(video.videoUrl);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  const handlePlay = useCallback(() => {
    setIsLoaded(true);
    onPlay(video.id);
  }, [video.id, onPlay]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-video bg-gray-100">
        {!isLoaded ? (
          <button
            onClick={handlePlay}
            className="relative w-full h-full group focus:outline-none focus:ring-4 focus:ring-red-300"
            aria-label={`Play video: ${video.title}`}
          >
            <img
              src={thumbnailUrl}
              alt={`Video thumbnail: ${video.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            className="w-full h-full rounded-t-xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
            loading="lazy"
          />
        )}
      </div>
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {video.title}
        </h3>
      </div>
    </div>
  );
});

LazyVideo.displayName = 'LazyVideo';

export default function Testimonials() {
  const { testimonials } = websiteContent;
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const handleVideoPlay = useCallback((videoId: number) => {
    setPlayingVideo(videoId);
  }, []);

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {testimonials.title}
          </h2>
          <p className="text-xl text-gray-600">
            {testimonials.subtitle}
          </p>
        </div>

        {/* Mobile: horizontal scroll with slight peek of next card */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 scrollbar-hide scroll-smooth pr-4">
            {testimonials.videos.map((video) => (
              <div key={video.id} className="min-w-[88%] snap-center">
                <LazyVideo video={video} onPlay={handleVideoPlay} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.videos.map((video) => (
            <LazyVideo key={video.id} video={video} onPlay={handleVideoPlay} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#order-form"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            আপনিও এখনই অর্ডার করুন
          </a>
        </div>
      </div>
    </section>
  );
}
