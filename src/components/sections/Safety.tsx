import { websiteContent } from '@/config/websiteContent';
import { Shield, Award, Clock } from 'lucide-react';
import BanglaText from '../ui/BanglaText';

export default function Safety() {
  const { safety } = websiteContent;

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 px-4">

  <h2 className="text-3xl font-bold text-gray-900 leading-tight text-center">
    {safety.title}
  </h2>

  <p className="text-xl text-gray-700 leading-relaxed text-center">
    {safety.subtitle}
  </p>

  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg mx-auto max-w-md">
    <div className="flex items-center justify-center">
      <Clock className="w-5 h-5 text-yellow-600 mr-2" />
      <p className="text-yellow-800 font-medium text-center">
        {safety.stockInfo}
      </p>
    </div>
  </div>

  <div className="flex flex-wrap gap-3 justify-center">
    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
      <Shield className="w-6 h-6 text-green-600" />
      <BanglaText className="text-gray-700 font-bold">১০০% নিরাপদ</BanglaText>
    </div>
    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
      <Award className="w-6 h-6 text-green-600" />
      <span className="text-gray-700 font-bold">BCSIR অনুমোদিত</span>
    </div>
  </div>

  {/* ——— Mobile Only: Button & Tag in same row, centered, with spacing ——— */}
  <div className="flex items-center justify-center gap-4 flex-nowrap">
    <a
      href="#order-form"
      className="inline-block bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 active:bg-green-800 transition-all duration-200 shadow-md"
    >
      {safety.buttonText}
    </a>
    <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
      {safety.tag}
    </div>
  </div>

</div>
          
          <div className="relative w-100 h-100 mx-auto">
  <img 
    src="/bcsir.jpg" 
    alt="BCSIR Certificate" 
    className="w-full h-full object-contain rounded-lg"
  />
  
  <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full">
    <Shield className="w-6 h-6" />
  </div>
</div>


        </div>
      </div>
    </section>
  );
}
