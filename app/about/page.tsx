import { websiteContent } from '@/shared/websiteContent';

export const metadata = {
  title: 'আমাদের সম্পর্কে | Ruhafiya',
  description: 'Ruhafiya সম্পর্কে জানুন – আমাদের লক্ষ্য, মূল্যবোধ এবং প্রতিশ্রুতি।',
};

export default function AboutPage() {
  const { footer } = websiteContent;
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      <section className="container mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-green-600/10 text-green-400 border border-green-600/30">
            <img src="/logo.png" alt="Ruhafiya" className="h-20 w-auto brightness-0 invert" />
            
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-6">আমাদের সম্পর্কে</h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
            আমরা প্রাকৃতিক উপাদানে তৈরি পেইন রিমুভাল অয়েল সরবরাহ করি যাতে আপনি ব্যথামুক্ত সুস্থ জীবনে ফিরতে পারেন।
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 hover:border-green-600/40 transition-all">
            <h3 className="text-xl font-semibold mb-2">আমাদের লক্ষ্য</h3>
            <p className="text-gray-300">বাংলাদেশের প্রতিটি মানুষের জন্য কার্যকর ও নিরাপদ ব্যথা উপশমের সমাধান পৌঁছে দেওয়া।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 hover:border-green-600/40 transition-all">
            <h3 className="text-xl font-semibold mb-2">গুণগত মান</h3>
            <p className="text-gray-300">নির্বাচিত ভেষজ উপাদান, পরিচ্ছন্ন উৎপাদন প্রক্রিয়া এবং কঠোর মাননিয়ন্ত্রণ।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 hover:border-green-600/40 transition-all">
            <h3 className="text-xl font-semibold mb-2">বিশ্বাস</h3>
            <p className="text-gray-300">হাজারো গ্রাহকের আস্থা আমাদের এগিয়ে যেতে অনুপ্রাণিত করে।</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-12 bg-gray-800/60 rounded-2xl p-6 md:p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-3">আমাদের গল্প</h2>
          <p className="text-gray-300 leading-relaxed">
            দীর্ঘদিন গবেষণা ও গ্রাহকের অভিজ্ঞতা বিশ্লেষণের মাধ্যমে আমরা এমন একটি সমাধান তৈরি করেছি যা সহজে ব্যবহারযোগ্য,
            পার্শ্বপ্রতিক্রিয়ামুক্ত এবং কার্যকর। আমাদের টিম প্রতিনিয়ত উন্নত মানের পণ্য ও সাপোর্ট দিতে প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-extrabold text-green-400">7,000+</div>
            <div className="text-gray-300 mt-1">সন্তুষ্ট গ্রাহক</div>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-extrabold text-green-400">95%</div>
            <div className="text-gray-300 mt-1">পুনঃক্রয় হার</div>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-extrabold text-green-400">24-48 ঘন্টা</div>
            <div className="text-gray-300 mt-1">দ্রুত ডেলিভারি</div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">কেন Ruhafiya?</h3>
            <ul className="space-y-3 text-gray-300 list-disc pl-5">
              <li>ভেষজ উপাদান ও প্রমাণভিত্তিক ফর্মুলেশন</li>
              <li>স্থানীয় চাহিদা মাথায় রেখে গবেষণা ও উন্নয়ন</li>
              <li>সাশ্রয়ী মূল্য ও নিরবচ্ছিন্ন সাপোর্ট</li>
              <li>গ্রাহক প্রতিক্রিয়ার ভিত্তিতে নিয়মিত উন্নতি</li>
            </ul>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">আমরা যেভাবে কাজ করি</h3>
            <ol className="space-y-3 text-gray-300 list-decimal pl-5">
              <li>উপাদান নির্বাচন — গুণগত মান যাচাই</li>
              <li>উৎপাদন — পরিচ্ছন্ন ও নিয়ন্ত্রিত প্রক্রিয়া</li>
              <li>মান নিশ্চয়তা — প্রতিটি ব্যাচে কড়া পরীক্ষণ</li>
            </ol>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800/60 rounded-2xl p-6 md:p-8 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">প্রশ্নোত্তর (FAQ)</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium">প্রোডাক্টটি কিভাবে ব্যবহার করবো?</p>
              <p className="text-gray-300">ব্যথার স্থানে পরিষ্কার করে হালকা ম্যাসাজ করে দিনে ৪-৫ বার প্রয়োগ করুন।</p>
            </div>
            <div>
              <p className="font-medium">কোন পার্শ্বপ্রতিক্রিয়া আছে?</p>
              <p className="text-gray-300">প্রাকৃতিক উপাদান হওয়ায় সাধারণত নেই। ত্বকে অ্যালার্জি থাকলে ব্যবহার বন্ধ করে চিকিৎসকের পরামর্শ নিন।</p>
            </div>
            <div>
              <p className="font-medium">ডেলিভারি কতদিনে পাবো?</p>
              <p className="text-gray-300">সাধারণত ২৪-৪৮ ঘন্টার মধ্যে দেশের অধিকাংশ জেলায় ডেলিভারি করা হয়।</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-green-600/20 to-green-500/10 border border-green-600/30 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">আরও জানতে চান?</h3>
            <p className="text-gray-300 mb-4">আমাদের টিম সবসময় আপনাকে সহায়তা করতে প্রস্তুত।</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={`mailto:${footer.contact.email}`} className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-500 transition-colors font-medium">
                ইমেইল করুন
              </a>
              <a href={`tel:${footer.contact.phone}`} className="px-5 py-2 rounded-full bg-gray-800 border border-gray-700 hover:border-green-600/50 transition-colors font-medium">
                কল করুন — {footer.contact.displayPhone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
