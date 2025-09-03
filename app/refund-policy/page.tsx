export const metadata = {
  title: 'রিফান্ড ও রিটার্ন | Ruhafiya',
  description: 'Ruhafiya পণ্যের রিফান্ড ও রিটার্ন নীতিমালা।',
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      <section className="container mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-green-600/10 text-green-400 border border-green-600/30">
            <img src="/logo.png" alt="Ruhafiya" className="h-20 w-auto brightness-0 invert" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">রিফান্ড ও রিটার্ন</h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">গ্রাহক সন্তুষ্টি আমাদের কাছে সর্বোচ্চ অগ্রাধিকার। নিচের শর্তসাপেক্ষে রিফান্ড/রিটার্ন গ্রহণ করা হয়।</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">রিটার্নের সময়সীমা</h2>
            <p className="text-gray-300">পণ্য গ্রহণের ৭ দিনের মধ্যে রিটার্নের জন্য আবেদন করতে হবে।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">যোগ্যতা</h2>
            <p className="text-gray-300">প্যাকেজিং অক্ষত, অপব্যবহার নয় এবং রসিদ সংযুক্ত থাকতে হবে।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">রিফান্ড প্রসেস</h2>
            <p className="text-gray-300">পণ্য যাচাইয়ের পর ৫-৭ কর্মদিবসের মধ্যে একই পেমেন্ট চ্যানেলে রিফান্ড প্রদান করা হবে।</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">সহায়তা</h2>
            <p className="text-gray-300">রিটার্ন বা রিফান্ড সংক্রান্ত যেকোন প্রশ্নে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন: <a href="mailto:contact.ruhafiya@gmail.com" className="text-green-400 underline">contact.ruhafiya@gmail.com</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}
