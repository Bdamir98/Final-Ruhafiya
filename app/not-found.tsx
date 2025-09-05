import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          পৃষ্ঠা খুঁজে পাওয়া যায়নি
        </h2>
        <p className="text-gray-600 mb-8">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই।
        </p>
        <Link
          href="/"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}