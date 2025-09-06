"use client";
import { useContent } from '../providers/ContentProvider';
import BanglaText from '../ui/BanglaText';

export default function Offer() {
  const { content } = useContent();
  const { offer } = content;

  return (
    <section className="py-16 bg-gradient-to-r from-red-500 to-red-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block bg-yellow-400 text-red-600 px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
            {offer.tag}
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <BanglaText>{offer.title}</BanglaText>
          </h2>
          
          <div className="space-y-2 mb-6">
            <p className="text-xl font-bold opacity-90 line-through">
              <BanglaText>{offer.previousPrice}</BanglaText>
            </p>
            <div className="text-2xl font-bold bg-yellow-400 text-red-600 px-4 py-2 rounded-lg inline-block">
              <BanglaText>{offer.discount}</BanglaText>
            </div>
          </div>
          
          <p className="text-xl font-bold mb-8 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
            <BanglaText>{offer.bundleOffer}</BanglaText>
          </p>
          
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
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            এখনই অর্ডার করুন
          </a>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
    </section>
  );
}
