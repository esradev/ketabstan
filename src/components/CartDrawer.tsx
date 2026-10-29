import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, toPersianDigits } from '../utils/formatters';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    getCartTotal, 
    goToCheckout,
    goToHome 
  } = useStore();

  if (!isCartOpen) return null;

  const { subtotal, shippingFee, total, itemCount } = getCartTotal();
  const freeShippingThreshold = 500000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#1A261F]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 pr-10">
        <div className="w-screen max-w-md bg-[#FBFDFB] text-[#243329] shadow-2xl flex flex-col border-r border-[#E0E7DE] animate-in slide-in-from-left duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E3E8E1] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#3F594B]" />
              <h2 className="font-bold text-lg text-[#1C2A22]">سبد خرید شما</h2>
              <span className="text-xs bg-[#EAF0E8] text-[#3F594B] px-2 py-0.5 rounded-full font-medium">
                {toPersianDigits(itemCount)} کتاب
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#6D7E73] hover:text-[#233128] hover:bg-[#EEF3EC] rounded-xl transition-colors"
              id="close-cart-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#F0F5EE] px-5 py-3 border-b border-[#E1E8DE]">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#43594B]">
                  <span>فقط <b>{formatPrice(remainingForFreeShipping)}</b> تا ارسال کاملاً رایگان</span>
                  <span className="font-bold">{toPersianDigits(freeShippingPercent)}٪</span>
                </div>
                <div className="w-full h-1.5 bg-[#DCE4D9] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#415A4C] rounded-full transition-all duration-500" 
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#2A6643] font-medium">
                <Sparkles className="w-4 h-4 text-[#2A6643]" />
                <span>تبریک! سفارش شما مشمول <b>ارسال رایگان</b> شد.</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#EEF3EC] flex items-center justify-center text-[#6A8072]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#25362B]">سبد خرید شما در حال حاضر خالی است</h3>
                  <p className="text-xs text-[#6F8275] mt-1 max-w-xs">
                    مجموعه شاهکارهای ادبی، فلسفه، روانشناسی و هنر کتابستان را ورق بزنید و کتاب‌های دلخواهتان را انتخاب کنید.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    goToHome();
                  }}
                  className="px-5 py-2.5 bg-[#415A4C] text-white text-xs font-medium rounded-xl hover:bg-[#304639] transition-colors"
                >
                  مرور و کاوش کتاب‌ها
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.book.id}
                  className="flex gap-3.5 bg-white p-3.5 rounded-2xl border border-[#E4EAE1] shadow-2xs"
                >
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-16 h-22 object-cover rounded-lg shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1C2820] truncate">{item.book.title}</h4>
                      <p className="text-xs text-[#62776A] truncate mt-0.5">{item.book.authorName}</p>
                      <p className="text-[11px] text-[#7F9185] mt-0.5">{item.book.publisherName}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2F5F0]">
                      {/* Stepper */}
                      <div className="flex items-center border border-[#D9E2D6] rounded-xl bg-[#F8FAF7] overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.book.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-[#EAEFE7] text-[#3D5244] transition-colors"
                          title="افزایش"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#233128]">
                          {toPersianDigits(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.book.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-[#EAEFE7] text-[#3D5244] transition-colors"
                          title="کاهش"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-[#B84E4E]" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-bold text-sm text-[#23362B]">
                        {formatPrice(item.book.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E3E8E1] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#5C7063]">
                  <span>مجموع قیمت کتاب‌ها:</span>
                  <span className="font-medium text-[#293A30]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#5C7063]">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span className="font-medium text-[#293A30]">
                    {shippingFee === 0 ? <span className="text-[#2F7348] font-bold">رایگان</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EEF2EC] flex justify-between text-base font-bold text-[#1B2921]">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-[#325240]">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={goToCheckout}
                className="w-full py-3.5 bg-[#415A4C] hover:bg-[#2F4438] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
                id="checkout-drawer-btn"
              >
                <span>تکمیل خرید و پرداخت آنلاین</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#718578] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#486353]" />
                <span>ضمانت اصالت نسخه، بازگشت ۷ روزه و سلامت فیزیکی کتاب</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
