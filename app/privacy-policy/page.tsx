export const metadata = {
  title: 'প্রাইভেসি পলিসি | Ruhafiya',
  description: 'Ruhafiya ব্যবহারকারীর তথ্যের গোপনীয়তা ও সুরক্ষা নীতিমালা।',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      <section className="container mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-green-600/10 text-green-400 border border-green-600/30">
            <img src="/logo.png" alt="Ruhafiya" className="h-20 w-auto brightness-0 invert" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">প্রাইভেসি পলিসি</h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">আপনার ব্যক্তিগত তথ্যের সুরক্ষা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। নিচে আমাদের তথ্য ব্যবহারের নীতিমালা দেয়া হলো।</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">তথ্য সংগ্রহ</h2>
            <p className="text-gray-300">অর্ডার, ডেলিভারি এবং সাপোর্টের জন্য আপনার নাম, ঠিকানা, মোবাইল ও ইমেইল সংগ্রহ করা হতে পারে।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">তথ্যের ব্যবহার</h2>
            <p className="text-gray-300">শুধুমাত্র সেবা প্রদান, অর্ডার আপডেট, এবং কাস্টমার সাপোর্টের উদ্দেশ্যে তথ্য ব্যবহার করা হয়।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">তথ্যের সুরক্ষা</h2>
            <p className="text-gray-300">আপনার তথ্য সুরক্ষায় আমরা যুক্তিযুক্ত টেকনিক্যাল ও অর্গানাইজেশনাল ব্যবস্থা গ্রহণ করি।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">তৃতীয় পক্ষ</h2>
            <p className="text-gray-300">ডেলিভারি ও পেমেন্ট সুবিধার জন্য সীমিত তথ্য নির্ভরযোগ্য তৃতীয় পক্ষের সাথে শেয়ার করা হতে পারে।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">যোগাযোগ</h2>
            <p className="text-gray-300">গোপনীয়তা সংক্রান্ত প্রশ্নে আমাদের সাথে যোগাযোগ করুন: <a href="mailto:contact.ruhafiya@gmail.com" className="text-green-400 underline"></a></p>
          </div>
        </div>
      </section>
    </main>
  );
}
