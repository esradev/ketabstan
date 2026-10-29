import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Tag, 
  ShoppingBag, 
  Check, 
  AlertCircle,
  Phone,
  User,
  Mail
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, toPersianDigits } from '../utils/formatters';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    userProfile, 
    updateProfile, 
    getCartTotal, 
    setActiveView, 
    goToHome, 
    showToast 
  } = useStore();

  const { subtotal, shippingFee, total } = getCartTotal();

  // Local shipping info initialized from profile
  const [recipientName, setRecipientName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [province, setProvince] = useState(userProfile.province);
  const [city, setCity] = useState(userProfile.city);
  const [address, setAddress] = useState(userProfile.address);
  const [postalCode, setPostalCode] = useState(userProfile.postalCode);

  // Delivery method
  const [shippingMethod, setShippingMethod] = useState<'pishtaz' | 'express'>('pishtaz');

  // Discount code
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-[#E3E8E1] space-y-4 max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-[#EEF4ED] text-[#486354] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1F2E24] font-serif">سبد خرید شما خالی است</h2>
        <p className="text-xs text-[#6F8274]">
          برای ثبت سفارش، ابتدا کتاب‌های مورد نظر خود را به سبد خرید اضافه کنید.
        </p>
        <button
          onClick={goToHome}
          className="px-6 py-3 bg-[#415A4C] text-white rounded-2xl text-xs font-bold hover:bg-[#31473B] transition-colors"
        >
          بازگشت به کتابخانه
        </button>
      </div>
    );
  }

  const expressAdditionalFee = shippingMethod === 'express' ? 35000 : 0;
  const currentShippingCost = shippingFee + expressAdditionalFee;
  const finalPayable = Math.max(0, subtotal + currentShippingCost - appliedDiscount);

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (code === 'BAHAR' || code === 'KETAB1404' || code === 'KETABESTAN') {
      setAppliedDiscount(30000);
      setDiscountMessage('کد تخفیف ۳۰,۰۰۰ تومانی با موفقیت اعمال شد');
      showToast('کد تخفیف با موفقیت اعمال شد', 'success');
    } else {
      setDiscountMessage('کد تخفیف وارد شده معتبر نیست');
      showToast('کد تخفیف نامعتبر است', 'error');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      showToast('لطفاً تمام فیلدهای نشانی و تحویل‌گیرنده را تکمیل کنید', 'error');
      return;
    }

    // Update saved profile with current inputs
    updateProfile({
      name: recipientName,
      phone,
      email,
      province,
      city,
      address,
      postalCode,
    });

    // Navigate to payment gateway
    setActiveView('payment-gateway');
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#DEE6DC] pb-4">
        <div>
          <span className="text-xs text-[#526B5C] font-semibold">مرحله نهایی خرید</span>
          <h1 className="text-2xl font-bold text-[#1B2921] font-serif mt-0.5">
            تایید آدرس و پرداخت آنلاین
          </h1>
        </div>
        <button
          onClick={() => setActiveView('home')}
          className="text-xs text-[#52685B] hover:text-[#25392D] flex items-center gap-1"
        >
          <span>ادامه خرید کتاب</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Shipping and Address Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <form id="checkout-form" onSubmit={handleProceedToPayment} className="bg-white rounded-3xl border border-[#E3E8E1] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EEF2EC]">
              <MapPin className="w-5 h-5 text-[#415A4C]" />
              <h3 className="font-bold text-base text-[#1E2E24] font-serif">نشانی پستی و مشخصات تحویل‌گیرنده</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#3B4D41] block mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none"
                  placeholder="مثال: سارا رضوانی"
                  id="checkout-name"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3B4D41] block mb-1">شماره تلفن همراه:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none"
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  id="checkout-phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#3B4D41] block mb-1">استان:</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none"
                  placeholder="تهران"
                  id="checkout-province"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3B4D41] block mb-1">شهر:</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none"
                  placeholder="تهران"
                  id="checkout-city"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3B4D41] block mb-1">کد پستی (۱۰ رقمی):</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none font-mono"
                  placeholder="۱۹۸۷۶۵۴۳۲۱"
                  id="checkout-postal-code"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#3B4D41] block mb-1">نشانی دقیق پستی:</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none leading-relaxed"
                placeholder="خیابان، کوچه، پلاک، واحد..."
                id="checkout-address"
              />
            </div>

            {/* Courier Selection */}
            <div className="pt-2">
              <label className="text-xs font-bold text-[#3B4D41] block mb-2">شیوه ارسال بسته:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setShippingMethod('pishtaz')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'pishtaz'
                      ? 'border-[#415A4C] bg-[#F1F6F0] text-[#1E2F24]'
                      : 'border-[#DEE5DD] hover:bg-[#F9FBF8] text-[#55695C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">پست پیشتاز سراسری</span>
                    <span className="text-xs font-bold">
                      {shippingFee === 0 ? 'رایگان' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E8174] mt-1">تحویل ۲ تا ۳ روز کاری به سراسر ایران</p>
                </div>

                <div
                  onClick={() => setShippingMethod('express')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-[#415A4C] bg-[#F1F6F0] text-[#1E2F24]'
                      : 'border-[#DEE5DD] hover:bg-[#F9FBF8] text-[#55695C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">پیک اختصاصی امروز (تهران)</span>
                    <span className="text-xs font-bold">{formatPrice(shippingFee + 35000)}</span>
                  </div>
                  <p className="text-[11px] text-[#6E8174] mt-1">تحویل همان روز با بسته‌بندی نفیس هدیه</p>
                </div>
              </div>
            </div>

          </form>

        </div>

        {/* Order Summary & Payment Button */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-[#E3E8E1] p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="font-bold text-base text-[#1C2C22] font-serif pb-3 border-b border-[#EEF2EC]">
              خلاصه سفارش ({toPersianDigits(cart.length)} عنوان کتاب)
            </h3>

            {/* Items list preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 pl-1">
              {cart.map((item) => (
                <div key={item.book.id} className="flex items-center gap-3">
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-11 h-14 object-cover rounded-lg shadow-2xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#1D2C22] truncate">{item.book.title}</h4>
                    <p className="text-[11px] text-[#6C7E72] truncate">{item.book.authorName}</p>
                    <span className="text-[10px] text-[#4F6858] bg-[#EEF3ED] px-2 py-0.5 rounded-md mt-1 inline-block">
                      تعداد: {toPersianDigits(item.quantity)} نسخه
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#233529] whitespace-nowrap">
                    {formatPrice(item.book.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discount Code Input */}
            <div className="pt-3 border-t border-[#EEF2EC]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="کد تخفیف (مثال: KETAB1404)"
                  className="flex-1 bg-[#F5F8F3] text-xs rounded-xl px-3 py-2 border border-[#DCE4DA] focus:outline-none focus:bg-white focus:border-[#415A4C]"
                  id="coupon-input"
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="px-4 py-2 bg-[#E6EFE4] hover:bg-[#D7E4D4] text-[#2F4437] text-xs font-bold rounded-xl transition-colors"
                >
                  اعمال
                </button>
              </div>
              {discountMessage && (
                <p className={`text-[11px] mt-1.5 ${appliedDiscount > 0 ? 'text-[#296841]' : 'text-[#A84545]'}`}>
                  {discountMessage}
                </p>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 pt-3 border-t border-[#EEF2EC] text-xs">
              <div className="flex justify-between text-[#617467]">
                <span>جمع کل اقلام:</span>
                <span className="font-medium text-[#24342A]">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#617467]">
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span className="font-medium text-[#24342A]">
                  {currentShippingCost === 0 ? <span className="text-[#2F7348] font-bold">رایگان</span> : formatPrice(currentShippingCost)}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#943F3F]">
                  <span>تخفیف اعمال‌شده:</span>
                  <span className="font-bold">- {formatPrice(appliedDiscount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#EAEFE8] flex justify-between text-base font-extrabold text-[#1A2820]">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="text-[#325240]">{formatPrice(finalPayable)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-4 bg-[#415A4C] hover:bg-[#304639] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
              id="goto-gateway-btn"
            >
              <CreditCard className="w-4 h-4" />
              <span>پرداخت آنلاین با کلیه کارت‌های بانکی</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#718578] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#446250]" />
              <span>اتصال امن به درگاه پرداخت رسمی شاپرک (به‌پرداخت ملت)</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
