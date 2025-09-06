import { useContent } from '../providers/ContentProvider';
import { Check } from 'lucide-react';

interface BenefitItem {
  id: number;
  text: string;
}

export default function Benefits() {
  const { content, isLoading } = useContent();
  const { benefits } = content;

  // Ensure benefits and benefits.items exist and items is an array
  if (!benefits || !benefits.items || !Array.isArray(benefits.items)) {
    console.warn('Benefits data not available, using fallback data');
    // Fallback benefits data
    const fallbackBenefits = {
      title: "পেইন রিমুভাল তেলের উপকারিতা",
      subtitle: "আমাদের তেল ব্যবহারে আপনি আর্থ্রাইটিস, পেশীর টান এবং দীর্ঘস্থায়ী জয়েন্টের অস্বস্তি থেকে মুক্তি পাবেন।",
      items: [
        { id: 1, text: "শরীরের যেকোন অংশের ব্যথা দূর করে" },
        { id: 2, text: "জয়েন্টের ব্যথা দূর করে" },
        { id: 3, text: "ঘাড় ও কাঁধের ব্যথা দূর করে" },
        { id: 4, text: "হাঁটুর ব্যথা দূর করে" },
        { id: 5, text: "পিঠের ব্যথা দূর করে" },
        { id: 6, text: "কোমরের ব্যথা দূর করে" }
      ]
    };

    return (
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              {fallbackBenefits.title}
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              {fallbackBenefits.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {(fallbackBenefits.items as BenefitItem[]).map((item: BenefitItem) => (
              <div
                key={item.id}
                className="flex items-center space-x-5 p-7 bg-green-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 text-lg lg:text-xl font-medium leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <a
              href="#order-form"
              className="inline-block bg-green-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              এখনই অর্ডার করুন
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            {benefits.title}
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            {benefits.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(benefits.items as BenefitItem[]).map((item: BenefitItem) => (
            <div
              key={item.id}
              className="flex items-center space-x-5 p-7 bg-green-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-lg lg:text-xl font-medium leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="#order-form"
            className="inline-block bg-green-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            এখনই অর্ডার করুন
          </a>
        </div>
      </div>
    </section>
  );
}
