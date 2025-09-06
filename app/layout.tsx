import './globals.css';
import type { ReactNode } from 'react';
import { Hind_Siliguri } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
// Temporarily disabled for debugging
// import PerformanceMonitor from '@/react-app/components/PerformanceMonitor';

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin', 'bengali'],
  weight: ['400', '600'],
  variable: '--font-hind-siliguri',
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'রুহাফিয়া - পেইন রিমুভ অয়েল | ১৫-২০ দিনে ব্যথা থেকে মুক্তি',
  description: 'রুহাফিয়া পেইন রিমুভ অয়েল। জয়েন্ট ব্যথা, মাংসপেশির ব্যথা, কোমর ব্যথা থেকে ১৫-২০ দিনে স্থায়ী মুক্তি। ৭০০০+ সন্তুষ্ট গ্রাহক। ৩৭% ছাড়ে অর্ডার করুন।',
  keywords: 'রুহাফিয়া, ব্যথা নিরাময়, প্রাকৃতিক তেল, জয়েন্ট ব্যথা, মাংসপেশির ব্যথা, কোমর ব্যথা, pain relief oil, ruhafiya',
  author: 'Ruhafiya',
  robots: 'index, follow',
  language: 'bn',
  openGraph: {
    title: 'রুহাফিয়া - পেইন রিমুভ অয়েল',
    description: 'জয়েন্ট ব্যথা, মাংসপেশির ব্যথা থেকে ১৫-২০ দিনে স্থায়ী মুক্তি। ৭০০০+ সন্তুষ্ট গ্রাহক।',
    url: 'https://ruhafiya.com',
    siteName: 'Ruhafiya',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'রুহাফিয়া - পেইন রিমুভ অয়েল',
    description: 'জয়েন্ট ব্যথা, মাংসপেশির ব্যথা থেকে ১৫-২০ দিনে স্থায়ী মুক্তি।',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

function AlertDialog() {
  return (
    <Suspense fallback={null}>
      <div id="alert-dialog-root" />
    </Suspense>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="canonical" href="https://ruhafiya.com" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="geo.region" content="BD" />
        <meta name="geo.country" content="Bangladesh" />
        <meta name="geo.placename" content="Dhaka, Bangladesh" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Conditionally preload critical images only if they will be used immediately */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <meta name="theme-color" content="#16a34a" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Ruhafiya",
              "alternateName": "রুহাফিয়া",
              "url": "https://ruhafiya.com",
              "logo": "https://ruhafiya.com/logo.png",
              "description": "রুহাফিয়া প্রাকৃতিক ব্যথা নিরাময়ের তেল। জয়েন্ট ব্যথা, মাংসপেশির ব্যথা থেকে ১৫-৩০ দিনে স্থায়ী মুক্তি।",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BD",
                "addressRegion": "Dhaka"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["Bengali", "English"]
              },
              "sameAs": [
                "https://www.facebook.com/ruhafiya",
                "https://www.youtube.com/ruhafiya"
              ]
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "রুহাফিয়া ব্যথা নিরাময়ের তেল",
              "description": "প্রাকৃতিক ব্যথা নিরাময়ের তেল। জয়েন্ট ব্যথা, মাংসপেশির ব্যথা থেকে ১৫-৩০ দিনে স্থায়ী মুক্তি।",
              "brand": {
                "@type": "Brand",
                "name": "Ruhafiya"
              },
              "category": "Health & Wellness",
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "priceCurrency": "BDT",
                "seller": {
                  "@type": "Organization",
                  "name": "Ruhafiya"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "5000"
              }
            })
          }}
        />

        {/* Critical CSS - Optimized for Performance */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body{font-family:var(--font-hind-siliguri),-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin:0;line-height:1.5;font-display:swap}
            .container{max-width:1024px;margin:0 auto;padding:0 1rem}
            .grid{display:grid}
            .flex{display:flex}
            .items-center{align-items:center}
            .justify-center{justify-content:center}
            .bg-gradient-to-br{background:linear-gradient(135deg,#f0fdf4,#dcfce7)}
            .text-4xl{font-size:clamp(1.5rem,4vw,2.25rem);font-weight:700;color:#111827;line-height:1.25}
            .text-xl{font-size:clamp(1rem,2.5vw,1.25rem);color:#374151;line-height:1.625}
            .bg-green-600{background:#16a34a;color:#fff;padding:1rem 2rem;border-radius:9999px;text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;will-change:transform}
            .py-16{padding:clamp(2rem,8vw,4rem) 0}
            .space-y-8>*+*{margin-top:2rem}
            .space-y-4>*+*{margin-top:1rem}
            .lazy-load{opacity:0;transition:opacity .3s ease}
            .lazy-loaded{opacity:1}
            @media(min-width:1024px){.lg\\:grid-cols-2{grid-template-columns:1fr 1fr;gap:3rem;align-items:center}}
            @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
          `
        }} />

        {/* Analytics - Optimized Loading */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        )}

        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}'${process.env.NEXT_PUBLIC_FB_TEST_EVENT_CODE ? `, {'test_event_code': '${process.env.NEXT_PUBLIC_FB_TEST_EVENT_CODE}'}` : ''});
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* Noscript fallbacks */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
          </noscript>
        )}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
      </head>
      <body className={`${hindSiliguri.variable} font-sans`} suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-600 text-white px-4 py-2 rounded z-50">
          Skip to main content
        </a>
        {children}
        <AlertDialog />
        {/* Temporarily disabled for debugging */}
        {/* <PerformanceMonitor /> */}

      </body>
    </html>
  );
}
