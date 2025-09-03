"use client";
import { useContent } from './ContentProvider';
import { ShoppingCart, Star } from 'lucide-react';

export default function Hero() {
  const { content } = useContent();
  const { hero } = content;

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';

    // Handle YouTube Shorts URL
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // Handle regular YouTube embed URL
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) {
      return url;
    }

    // Handle regular YouTube watch URL
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(hero.videoUrl);

  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {hero.title}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                {hero.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#order-form"
                onClick={() => {
                  try {
                    (window as any).fbq?.('track', 'AddToCart', {
                      content_type: 'product',
                      currency: 'BDT',
                    });
                  } catch {}
                }}
                className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {hero.buttons.primary.text}
              </a>
              <a
                href="#testimonials"
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Star className="w-5 h-5" />
                {hero.buttons.secondary.text}
              </a>
            </div>

            
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden">
              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                {embedUrl ? (
                  <iframe
                    src={`${embedUrl}?autoplay=0&mute=1&loop=1&playlist=${embedUrl.split('/').pop()}`}
                    title="Ruhafiya Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-b-[20px] border-b-white border-r-[12px] border-r-transparent ml-1"></div>
                      </div>
                      <p className="text-sm opacity-75">Video unavailable</p>
                      <p className="text-xs opacity-50">This video is unavailable</p>
                    </div>
                  </div>
                )}
              </div>
              
            
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 px-6 py-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">৩৭% ছাড়!</div>
              <div className="text-sm">শুধুমাত্র আজকের জন্য</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
