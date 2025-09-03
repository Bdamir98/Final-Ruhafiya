import { websiteContent } from '@/shared/websiteContent';

export default function Testimonials() {
  const { testimonials } = websiteContent;

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

  const getEmbedUrl = (videoUrl: string) => {
    const videoId = getVideoId(videoUrl);
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  };

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
              <div
                key={video.id}
                className="min-w-[88%] snap-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video bg-gray-100">
                  <iframe
                    src={getEmbedUrl(video.videoUrl)}
                    className="w-full h-full rounded-t-2xl"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {video.title}
                  </h3>
                 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet grid remains unchanged */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative aspect-video bg-gray-100">
                <iframe
                  src={getEmbedUrl(video.videoUrl)}
                  className="w-full h-full rounded-t-xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {video.title}
                </h3>
                
              </div>
            </div>
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
