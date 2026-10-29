import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  RotateCw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { formatPrice, toPersianDigits } from '../utils/formatters';

export const PaymentGatewayView: React.FC = () => {
  const { 
    cart, 
    userProfile, 
    getCartTotal, 
    addOrder, 
    goToUserPanel, 
    setActiveView, 
    showToast 
  } = useStore();

  const { subtotal, shippingFee, total } = getCartTotal();

  // Gateway form fields
  const [cardNumber, setCardNumber] = useState('6104 3378 ');
  const [cvv2, setCvv2] = useState('');
  const [expMonth, setExpMonth] = useState('08');
  const [expYear, setExpYear] = useState('06');
  const [otp, setOtp] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('78291');

  // OTP Countdown
  const [otpCooldown, setOtpCooldown] = useState<number>(0);
  const [otpRequested, setOtpRequested] = useState<boolean>(false);

  // Gateway Session Countdown: 10 minutes
  const [sessionSeconds, setSessionSeconds] = useState<number>(599);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [generatedTrackingCode, setGeneratedTrackingCode] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let otpTimer: any;
    if (otpCooldown > 0) {
      otpTimer = setInterval(() => {
        setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(otpTimer);
  }, [otpCooldown]);

  const refreshCaptcha = () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
    setCaptchaCode(randomCode);
    setCaptchaInput('');
  };

  const handleRequestOtp = () => {
    if (cardNumber.replace(/\s/g, '').length < 16) {
      showToast('لطفاً ابتدا شماره ۱۶ رقمی کارت را وارد نمایید', 'error');
      return;
    }
    setOtpCooldown(120);
    setOtpRequested(true);
    // Simulate SMS notification
    const simulatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setTimeout(() => {
      setOtp(simulatedOtp);
      showToast(`رمز پویا پیامک شد: ${toPersianDigits(simulatedOtp)} (خودکار درج شد)`, 'info');
    }, 1200);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Identify bank from card prefix
  const getBankName = (number: string) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('610433')) return 'بانک ملت';
    if (clean.startsWith('603799')) return 'بانک ملی ایران';
    if (clean.startsWith('621986')) return 'بانک سامان';
    if (clean.startsWith('502229')) return 'بانک پاسارگاد';
    if (clean.startsWith('627353')) return 'بانک تجارت';
    if (clean.startsWith('603770')) return 'بانک کشاورزی';
    if (clean.startsWith('589210')) return 'بانک سپه';
    if (clean.startsWith('622106')) return 'بانک پارسیان';
    return 'کارت شتابی معتبر';
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) {
      showToast('شماره کارت بانکی باید ۱۶ رقم باشد', 'error');
      return;
    }
    if (cvv2.length < 3) {
      showToast('کد CVV2 باید ۳ یا ۴ رقم باشد', 'error');
      return;
    }
    if (!otp) {
      showToast('لطفاً رمز پویا را وارد نمایید', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Trigger Confetti celebratory celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#415A4C', '#84A98C', '#D4AF37', '#2F3E46'],
        });
      } catch {}

      // Save order
      const newOrder = addOrder({
        items: cart,
        subtotal,
        shippingFee,
        discountAmount: 0,
        total,
        shippingAddress: userProfile,
        paymentMethod: `درگاه شاپرک (${getBankName(cardNumber)})`,
        paymentRefId: `SHP-${Math.floor(100000000 + Math.random() * 900000000)}`,
      });

      setGeneratedTrackingCode(newOrder.trackingCode);
      showToast('پرداخت با موفقیت انجام شد و سفارش ثبت گردید', 'success');
    }, 1600);
  };

  const minutes = Math.floor(sessionSeconds / 60);
  const seconds = sessionSeconds % 60;

  return (
    <div className="max-w-2xl mx-auto my-6 sm:my-10 pb-16">
      
      {/* Shaparak / Banking Header */}
      <div className="bg-[#1C2A3A] text-white rounded-t-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#2D3F54]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#283C52] flex items-center justify-center text-[#93C5FD] border border-[#3E5572]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg font-serif">درگاه پرداخت اینترنتی شاپرک</h1>
              <span className="text-[10px] bg-[#2F445C] text-[#BFDBFE] px-2 py-0.5 rounded-full">
                شبکه الکترونیکی پرداخت کارت
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              پذیرنده: فروشگاه آنلاین کتابستان • پایانه: {toPersianDigits('98210344')}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-[#0F172A]/60 px-3.5 py-1.5 rounded-xl border border-[#334155] text-xs font-mono" dir="ltr">
          <Clock className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-bold text-[#E2E8F0]">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Success State Modal/Card */}
      {paymentSuccess ? (
        <div className="bg-white rounded-b-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-[#ECFDF5] text-[#059669] mx-auto flex items-center justify-center border-4 border-[#D1FAE5]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#059669] bg-[#D1FAE5] px-3 py-1 rounded-full inline-block">
              تراکنش موفقیت‌آمیز
            </span>
            <h2 className="text-2xl font-extrabold text-[#0F172A] font-serif">
              پرداخت با موفقیت انجام شد
            </h2>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              سفارش شما در کتابستان ثبت شد و هم‌اکنون به بخش آماده‌سازی و بسته‌بندی انتقال یافت.
            </p>
          </div>

          {/* Receipt Info Card */}
          <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] text-xs space-y-3 max-w-md mx-auto text-right">
            <div className="flex justify-between text-[#64748B]">
              <span>کد پیگیری سفارش:</span>
              <span className="font-bold text-[#0F172A] font-mono">{generatedTrackingCode}</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>مبلغ پرداخت‌شده:</span>
              <span className="font-bold text-[#059669]">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>درگاه و کارت:</span>
              <span className="font-medium text-[#0F172A]">{getBankName(cardNumber)} (•••• {cardNumber.slice(-4)})</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>تحویل‌گیرنده:</span>
              <span className="font-medium text-[#0F172A]">{userProfile.name}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => goToUserPanel('orders')}
              className="px-6 py-3.5 bg-[#415A4C] hover:bg-[#31463A] text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
              id="view-order-tracking-btn"
            >
              مشاهده و پیگیری سفارش در پنل کاربری
            </button>
            <button
              onClick={() => setActiveView('home')}
              className="px-6 py-3.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-2xl text-xs font-medium transition-all"
            >
              بازگشت به صفحه اصلی کتابستان
            </button>
          </div>
        </div>
      ) : (
        /* Payment Form */
        <div className="bg-white rounded-b-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xl space-y-6">
          
          {/* Payable Amount Highlight */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#166534] block">مبلغ قابل پرداخت:</span>
              <span className="text-2xl font-extrabold text-[#15803D]">
                {formatPrice(total)}
              </span>
            </div>
            <div className="text-left text-xs text-[#166534]">
              <span>معادل به ریال:</span>
              <span className="font-bold block font-mono">
                {toPersianDigits(new Intl.NumberFormat('fa-IR').format(total * 10))} ریال
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmitPayment} className="space-y-5">
            
            {/* Card Number */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#1E293B]">شماره کارت ۱۶ رقمی:</label>
                <span className="text-xs font-medium text-[#2563EB]">
                  {getBankName(cardNumber)}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="6104 3378 0000 0000"
                  className="w-full bg-[#F8FAFC] text-[#0F172A] text-base font-mono tracking-widest rounded-xl p-3 pl-10 border border-[#CBD5E1] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  id="gateway-card-number"
                />
                <CreditCard className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* CVV2 and Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="text-xs font-bold text-[#1E293B] block mb-1">شماره شناسایی دوم (CVV2):</label>
                <div className="relative">
                  <input
                    type="password"
                    dir="ltr"
                    maxLength={4}
                    required
                    value={cvv2}
                    onChange={(e) => setCvv2(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full bg-[#F8FAFC] text-[#0F172A] text-sm font-mono tracking-widest rounded-xl p-3 pl-10 border border-[#CBD5E1] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                    id="gateway-cvv2"
                  />
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E293B] block mb-1">تاریخ انقضای کارت (ماه / سال):</label>
                <div className="flex items-center gap-2" dir="ltr">
                  <input
                    type="text"
                    maxLength={2}
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, ''))}
                    placeholder="08"
                    className="w-1/2 bg-[#F8FAFC] text-center text-[#0F172A] text-sm font-mono rounded-xl p-3 border border-[#CBD5E1] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  />
                  <span className="text-[#94A3B8] font-bold">/</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value.replace(/\D/g, ''))}
                    placeholder="06"
                    className="w-1/2 bg-[#F8FAFC] text-center text-[#0F172A] text-sm font-mono rounded-xl p-3 border border-[#CBD5E1] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Dynamic OTP */}
            <div>
              <label className="text-xs font-bold text-[#1E293B] block mb-1">رمز دوم پویا (یکبار مصرف):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  dir="ltr"
                  maxLength={7}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="رمز پیامک‌شده"
                  className="flex-1 bg-[#F8FAFC] text-[#0F172A] text-sm font-mono tracking-wider rounded-xl p-3 border border-[#CBD5E1] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  id="gateway-otp"
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpCooldown > 0}
                  className={`px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    otpCooldown > 0
                      ? 'bg-[#E2E8F0] text-[#64748B] cursor-not-allowed'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs'
                  }`}
                  id="request-otp-btn"
                >
                  {otpCooldown > 0 ? `درخواست مجدد (${toPersianDigits(otpCooldown)})` : 'دریافت رمز پویا'}
                </button>
              </div>
            </div>

            {/* Captcha Security Code */}
            <div>
              <label className="text-xs font-bold text-[#1E293B] block mb-1">کد امنیتی تصویر:</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  dir="ltr"
                  value={captchaInput || captchaCode}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="کد تصویر"
                  className="flex-1 bg-[#F8FAFC] text-[#0F172A] text-sm font-mono rounded-xl p-3 border border-[#CBD5E1] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                />
                <div className="bg-[#E2E8F0] px-4 py-2.5 rounded-xl font-mono text-base font-extrabold tracking-widest text-[#1E293B] select-none border border-[#CBD5E1]">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-3 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors"
                  title="کد جدید"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-4 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-75"
                id="submit-payment-btn"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>در حال ارتباط با شاپرک و تایید پرداخت...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>پرداخت {formatPrice(total)} و ثبت نهایی</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveView('checkout')}
                className="px-6 py-4 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] rounded-2xl font-medium text-xs transition-colors"
                id="cancel-payment-btn"
              >
                انصراف و بازگشت
              </button>
            </div>

            {/* Security Guarantee Footnote */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
              <Lock className="w-3.5 h-3.5 text-[#059669]" />
              <span>اتصال رمزگذاری‌شده ۲۵۶ بیتی SSL مورد تأیید بانک مرکزی جمهوری اسلامی ایران</span>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
