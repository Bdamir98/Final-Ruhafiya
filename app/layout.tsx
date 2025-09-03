import './globals.css';
import type { ReactNode } from 'react';
import { Hind_Siliguri } from 'next/font/google';
import Script from 'next/script';
import AlertDialog from '../src/react-app/components/AlertDialog';

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin', 'bengali'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        ) : null}
        {/* Facebook Pixel */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID ? (
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
        ) : null}
      </head>
      <body className={`${hindSiliguri.variable} font-sans`}>
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
          </noscript>
        ) : null}
        {/* Facebook Pixel (noscript) */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID ? (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        ) : null}
        {children}

        {/* Alert Dialog System */}
        <AlertDialog />
      </body>
    </html>
  );
}

