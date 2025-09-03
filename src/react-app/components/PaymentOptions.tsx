import { websiteContent } from '@/shared/websiteContent';
import { CreditCard, Truck, Shield } from 'lucide-react';

export default function PaymentOptions() {
  const { paymentOptions } = websiteContent;

  const icons = {
    0: CreditCard,
    1: Truck,
    2: Shield
  };

  return (
    <section className="py-12 bg-gradient-to-b from-green-600 to-green-700 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 md:mb-8 tracking-tight drop-shadow">
          {paymentOptions.title}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {paymentOptions.options.map((option, index) => {
            const IconComponent = icons[index as keyof typeof icons];
            return (
              <div
                key={index}
                className="text-center p-5 md:p-6 bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-xl border border-white/20 shadow-lg ring-1 ring-white/10"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-white/20 rounded-full flex items-center justify-center ring-1 ring-white/20 shadow-inner">
                  <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <p className="text-base sm:text-lg font-bold">
                  {option.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
