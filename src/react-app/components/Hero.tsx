"use client";
import { useContent } from './ContentProvider';
import { ShoppingCart, Star } from 'lucide-react';
import OptimizedYouTube from './OptimizedYouTube';
import { memo, useCallback } from 'react';

const Hero = memo(() => {
  const { content } = useContent();
  const { hero } = content;

  const handleOrderClick = useCallback(() => {
    try {
      (window as any).fbq?.('track', 'AddToCart', {
        content_type: 'product',
        currency: 'BDT',
      });
    } catch {}
  }, []);

  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                ১৫-৩০ দিন নিয়মিত ব্যবহারে ব্যথা থেকে মুক্তি
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                চাই ৭০০০+ মানুষ আমাদের তেল ব্যবহার করে ব্যথা থেকে মুক্তি পেয়েছেন। এখনই অর্ডার করুন এবং ৩৭% ছাড় পান।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#order-form"
                onClick={handleOrderClick}
                className="bg-green-600"
              >
                অর্ডার করুন
              </a>
              <a
                href="#testimonials"
                style={{border: '2px solid #16a34a', color: '#16a34a', padding: '1rem 2rem', borderRadius: '9999px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}
              >
                গ্রাহক পর্যালোচনা
              </a>
            </div>
          </div>

          <div style={{position: 'relative'}}>
            <div style={{background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'}}>
              <OptimizedYouTube
                videoUrl={hero.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
                title="Ruhafiya Product Video"
                className="aspect-video rounded-xl overflow-hidden"
              />
            </div>
            
            <div style={{position: 'absolute', bottom: '-1.5rem', left: '-1.5rem', background: '#fbbf24', color: '#111827', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}>
              <div style={{fontSize: '1.5rem', fontWeight: '700'}}>৩৭% ছাড়!</div>
              <div style={{fontSize: '0.875rem'}}>শুধুমাত্র আজকের জন্য</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
