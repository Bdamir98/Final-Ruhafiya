'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          কিছু ভুল হয়েছে!
        </h1>
        <p className="text-gray-600 mb-8">
          দুঃখিত, একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।
        </p>
        <button
          onClick={reset}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mr-4"
        >
          আবার চেষ্টা করুন
        </button>
        <a
          href="/"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          হোম পেজে যান
        </a>
      </div>
    </div>
  );
}