import { Suspense } from 'react';
import Image from 'next/image';

// Simple fallback component for loading state
const LogoFallback = () => (
  <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
);

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <a href="/" aria-label="Ruhafiya - Go to homepage">
            <Suspense fallback={<LogoFallback />}>
              <Image
                src="/logo.png"
                alt="Ruhafiya - Natural Pain Relief Oil"
                width={120}
                height={48}
                className="h-12 w-auto"
                priority
                quality={90}
              />
            </Suspense>
          </a>
        </div>
      </div>
    </header>
  );
}
