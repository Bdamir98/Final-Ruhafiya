"use client";
import { useState } from 'react';
import { websiteContent } from '@/config/websiteContent';
import { ShoppingCart, Package, Truck } from 'lucide-react';
import { showSuccessAlert, showErrorAlert } from '../ui/AlertDialog';
import BanglaText from '../ui/BanglaText';

export default function OrderForm() {
  const { orderForm } = websiteContent;
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    fullAddress: '',
    mobileNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helpers to handle Bangla digit strings in content
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const enToBnMap: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  const toNumber = (v: unknown): number => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const normalized = v
        .replace(/[০-৯]/g, (d) => bnToEnMap[d] ?? d)
        .replace(/[^0-9+\-.]/g, '');
      const n = parseFloat(normalized);
      const result = isNaN(n) ? 0 : n;
      
      // Debug logging for development
      if (process.env.NODE_ENV === 'development' && result === 0) {
        const vString = String(v);
        if (vString !== '0' && vString !== '০' && vString !== '') {
          console.warn('toNumber conversion resulted in 0:', { original: v, normalized, result });
        }
      }
      
      return result;
    }
    return 0;
  };
  const formatBn = (n: number): string => String(n).replace(/[0-9]/g, (d) => enToBnMap[d] ?? d);

  const selectedProduct = orderForm.packages.find(pkg => pkg.id === selectedPackage);
  const shippingChargeAmount = orderForm.summary.shippingCharge.amount;
  const shippingCharge = toNumber(shippingChargeAmount);
  const productPrice = toNumber(selectedProduct?.price as any);
  const totalAmount = productPrice + shippingCharge;

  // Handle package select
  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        productId: selectedPackage,
        quantity: 1
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        console.error('Order submission failed:', response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          showErrorAlert('অর্ডার ত্রুটি', errorData.error || 'অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        } catch (e) {
          console.error('Could not parse error response:', e);
          showErrorAlert('সংযোগ ত্রুটি', 'অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
        return;
      }

      const data = await response.json();
      showSuccessAlert('অর্ডার সফল', 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
      setFormData({ fullName: '', fullAddress: '', mobileNumber: '' });
    } catch (error) {
      console.error('Order submission failed:', error);
      showErrorAlert('অর্ডার ত্রুটি', 'অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {orderForm.tag}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {orderForm.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {orderForm.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Package Selection */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Package className="w-6 h-6 mr-2 text-green-600" />
                    {orderForm.steps.package}
                  </h3>
                  <div className="space-y-4">
                    {orderForm.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selectedPackage === pkg.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => handleSelectPackage(pkg)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              id={`package-${pkg.id}`}
                              name="package"
                              value={pkg.id}
                              checked={selectedPackage === pkg.id}
                              onChange={() => handleSelectPackage(pkg)}
                              aria-label={`${pkg.name} - ${pkg.price} টাকা`}
                              className="w-5 h-5 text-green-600"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900"><BanglaText>{pkg.name}</BanglaText></h4>
                              {pkg.savings && (
                                <span className="text-sm font-bold text-green-700">
                                  <BanglaText>{pkg.savings}</BanglaText>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">৳<BanglaText>{pkg.price}</BanglaText></div>
                            {pkg.originalPrice && (
                              <div className="text-sm font-bold text-red-600 line-through">
                                ৳<BanglaText>{pkg.originalPrice}</BanglaText>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Truck className="w-6 h-6 mr-2 text-green-600" />
                    {orderForm.steps.delivery}
                  </h3>
                  <div className="space-y-4">
                    {orderForm.formFields.map((field) => (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                          {field.placeholder}
                        </label>
                        {field.name === 'fullAddress' ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            aria-label={field.placeholder}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <input
                            id={field.name}
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            required
                            aria-label={field.placeholder}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-4 px-8 rounded-full text-xl font-bold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      প্রক্রিয়াকরণ...
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6 mr-2" />
                      {orderForm.confirmButton.text}
                    </>
                  )}
                </button>
                
                <p className="text-center text-xl font-bold text-gray-600">
                  <BanglaText>{orderForm.confirmButton.subtext}</BanglaText>
                </p>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-xl sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {orderForm.summary.title}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-bold"><BanglaText>{selectedProduct?.name || ''}</BanglaText></span>
                    <span className="font-bold">৳<BanglaText>{selectedProduct?.price || ''}</BanglaText></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">{orderForm.summary.shippingCharge.label}</span>
                    <span className="font-semibold">৳<BanglaText>{shippingChargeAmount}</BanglaText></span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-xl font-bold text-green-600">
                    <span>{orderForm.summary.total}</span>
                    <span>৳<BanglaText>{formatBn(totalAmount)}</BanglaText></span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    {orderForm.deliveryInfo.title}
                  </h4>
                  <p className="text-sm text-blue-800">
                    <BanglaText>{orderForm.deliveryInfo.text}</BanglaText>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
