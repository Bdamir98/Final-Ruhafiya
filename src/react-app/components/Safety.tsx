import { websiteContent } from '@/shared/websiteContent';
import { Shield, Award, Clock } from 'lucide-react';

export default function Safety() {
  const { safety } = websiteContent;

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {safety.tag}
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {safety.title}
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              {safety.subtitle}
            </p>
            
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium">
                  {safety.stockInfo}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="text-gray-700 font-bold">১০০% নিরাপদ</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                <Award className="w-6 h-6 text-green-600" />
                <span className="text-gray-700 font-bold">BCSIR অনুমোদিত</span>
              </div>
            </div>
            
            <a
              href="#order-form"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {safety.buttonText}
            </a>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                BCSIR সার্টিফিকেট
              </h3>
              <p className="text-gray-600">
                বাংলাদেশ বিজ্ঞান ও শিল্প গবেষণা পরিষদ কর্তৃক অনুমোদিত
              </p>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
