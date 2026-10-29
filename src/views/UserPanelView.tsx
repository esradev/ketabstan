import React, { useState } from 'react';
import { 
  Package, 
  User, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  ExternalLink, 
  ShoppingBag, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BookCard } from '../components/BookCard';
import { formatPrice, toPersianDigits } from '../utils/formatters';
import { Order, OrderStatus } from '../types';

export const UserPanelView: React.FC = () => {
  const { 
    orders, 
    userProfile, 
    updateProfile, 
    userPanelTab, 
    setUserPanelTab, 
    wishlist, 
    books, 
    goToHome, 
    addToCart, 
    showToast 
  } = useStore();

  // Profile edit states
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [province, setProvince] = useState(userProfile.province);
  const [city, setCity] = useState(userProfile.city);
  const [address, setAddress] = useState(userProfile.address);
  const [postalCode, setPostalCode] = useState(userProfile.postalCode);

  // Expanded order accordion
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);

  // Postal tracking modal simulation
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);

  const wishlistBooks = books.filter((b) => wishlist.includes(b.id));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      email,
      province,
      city,
      address,
      postalCode,
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="bg-[#EAF5EC] text-[#2A7545] text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تحویل شده</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-[#EBF3FC] text-[#2563EB] text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>تحویل به اداره پست</span>
          </span>
        );
      case 'processing':
        return (
          <span className="bg-[#FEF7EC] text-[#C27803] text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>در حال آماده‌سازی</span>
          </span>
        );
      default:
        return (
          <span className="bg-[#F1F5F0] text-[#55695C] text-xs px-3 py-1 rounded-full font-bold">
            در انتظار بررسی
          </span>
        );
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} کپی شد`, 'info');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* User Greeting & Header */}
      <div className="bg-white rounded-3xl border border-[#E3E8E1] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#415A4C] text-white flex items-center justify-center text-xl font-bold font-serif shadow-xs">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <span className="text-xs text-[#5D7364] font-medium">خوش آمدید،</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1C2C22] font-serif">
              {userProfile.name}
            </h1>
            <p className="text-xs text-[#788C7E] mt-0.5">
              عضو کتابستان از {userProfile.joinDate} • {userProfile.phone}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 bg-[#F6F8F4] p-3 rounded-2xl border border-[#E2EAE0]">
          <div className="text-center px-3 border-l border-[#DFE6DD]">
            <span className="text-lg font-bold text-[#1C2C22] block">{toPersianDigits(orders.length)}</span>
            <span className="text-[11px] text-[#697D70]">کل سفارش‌ها</span>
          </div>
          <div className="text-center px-3">
            <span className="text-lg font-bold text-[#1C2C22] block">{toPersianDigits(wishlist.length)}</span>
            <span className="text-[11px] text-[#697D70]">کتاب‌های نشان‌شده</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#DFE6DD] pb-1 overflow-x-auto">
        <button
          onClick={() => setUserPanelTab('orders')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
            userPanelTab === 'orders'
              ? 'bg-[#415A4C] text-white shadow-xs'
              : 'bg-white text-[#4A5D50] hover:bg-[#F2F6F0] border border-[#DEE5DC]'
          }`}
          id="tab-orders-btn"
        >
          <Package className="w-4 h-4" />
          <span>پیگیری سفارشات ({toPersianDigits(orders.length)})</span>
        </button>

        <button
          onClick={() => setUserPanelTab('profile')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
            userPanelTab === 'profile'
              ? 'bg-[#415A4C] text-white shadow-xs'
              : 'bg-white text-[#4A5D50] hover:bg-[#F2F6F0] border border-[#DEE5DC]'
          }`}
          id="tab-profile-btn"
        >
          <User className="w-4 h-4" />
          <span>ویرایش مشخصات و آدرس</span>
        </button>

        <button
          onClick={() => setUserPanelTab('wishlist')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
            userPanelTab === 'wishlist'
              ? 'bg-[#415A4C] text-white shadow-xs'
              : 'bg-white text-[#4A5D50] hover:bg-[#F2F6F0] border border-[#DEE5DC]'
          }`}
          id="tab-wishlist-btn"
        >
          <Heart className="w-4 h-4" />
          <span>قفسه کتاب‌های نشان‌شده ({toPersianDigits(wishlist.length)})</span>
        </button>
      </div>

      {/* Tab 1: Orders and Tracking */}
      {userPanelTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1C2C22] font-serif">تاریخچه و پیگیری سفارشات</h2>
              <p className="text-xs text-[#62776A] mt-0.5">
                مراحل بسته‌بندی، ارسال و کد رهگیری پستی مرسوله‌های کتاب شما
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-[#E3E8E1] space-y-3">
              <Package className="w-12 h-12 text-[#809587] mx-auto" />
              <h3 className="font-bold text-base text-[#1E2F24]">هنوز سفارشی ثبت نکرده‌اید</h3>
              <p className="text-xs text-[#6F8274]">
                مجموعه کتاب‌های کتابستان را بررسی کرده و اولین سفارش خود را ثبت کنید.
              </p>
              <button
                onClick={goToHome}
                className="px-5 py-2.5 bg-[#415A4C] text-white text-xs font-bold rounded-xl hover:bg-[#31463A]"
              >
                کاوش کتاب‌ها
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-[#E3E8E1] overflow-hidden shadow-xs transition-all"
                  >
                    {/* Order Summary Bar */}
                    <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#FAFBF9] border-b border-[#EAEFE7]">
                      
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                        <div>
                          <span className="text-[#788C7F] block text-[11px]">شماره سفارش:</span>
                          <span className="font-bold text-[#1C2C22] font-mono text-sm">{order.trackingCode}</span>
                        </div>

                        <div>
                          <span className="text-[#788C7F] block text-[11px]">تاریخ ثبت:</span>
                          <span className="font-medium text-[#293B30]">{order.date}</span>
                        </div>

                        <div>
                          <span className="text-[#788C7F] block text-[11px]">مبلغ پرداخت‌شده:</span>
                          <span className="font-bold text-[#2A6643] text-sm">{formatPrice(order.total)}</span>
                        </div>

                        <div>
                          <span className="text-[#788C7F] block text-[11px]">وضعیت فعلی:</span>
                          <div className="mt-0.5">{getStatusBadge(order.status)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 lg:pt-0">
                        {order.postalTrackingCode && (
                          <button
                            onClick={() => setTrackingModalOrder(order)}
                            className="px-3.5 py-2 bg-white hover:bg-[#F2F6F0] text-[#344E40] border border-[#CFD8CD] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#415A4C]" />
                            <span>پیگیری پستی مرسوله</span>
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="px-3 py-2 text-xs font-medium text-[#506356] hover:bg-[#EEF3EC] rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'بستن جزئیات' : 'مشاهده اقلام'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                    </div>

                    {/* Live Status Timeline */}
                    <div className="px-6 py-5 bg-white border-b border-[#F0F4EE]">
                      <div className="max-w-2xl mx-auto">
                        <div className="grid grid-cols-4 relative">
                          
                          {/* Step 1: Paid */}
                          <div className="flex flex-col items-center text-center">
                            <div className="w-7 h-7 rounded-full bg-[#415A4C] text-white flex items-center justify-center text-xs font-bold z-10 shadow-xs">
                              <Check className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-[#203126] mt-1.5">ثبت و پرداخت</span>
                            <span className="text-[10px] text-[#718577]">تأیید شاپرک</span>
                          </div>

                          {/* Step 2: Preparing */}
                          <div className="flex flex-col items-center text-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-xs ${
                              order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                                ? 'bg-[#415A4C] text-white'
                                : 'bg-[#E3EAE1] text-[#7E9184]'
                            }`}>
                              <Package className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[11px] font-bold text-[#203126] mt-1.5">بسته‌بندی</span>
                            <span className="text-[10px] text-[#718577]">انبار کتابستان</span>
                          </div>

                          {/* Step 3: Shipped */}
                          <div className="flex flex-col items-center text-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-xs ${
                              order.status === 'shipped' || order.status === 'delivered'
                                ? 'bg-[#415A4C] text-white'
                                : 'bg-[#E3EAE1] text-[#7E9184]'
                            }`}>
                              <Truck className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[11px] font-bold text-[#203126] mt-1.5">تحویل به پست</span>
                            <span className="text-[10px] text-[#718577]">پست پیشتاز</span>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="flex flex-col items-center text-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-xs ${
                              order.status === 'delivered'
                                ? 'bg-[#2A7545] text-white'
                                : 'bg-[#E3EAE1] text-[#7E9184]'
                            }`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[11px] font-bold text-[#203126] mt-1.5">تحویل نهایی</span>
                            <span className="text-[10px] text-[#718577]">مقصد خریدار</span>
                          </div>

                          {/* Connector Line behind steps */}
                          <div className="absolute top-3.5 right-12 left-12 h-0.5 bg-[#E1E7DF] -z-0" />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details: Items and Shipping Info */}
                    {isExpanded && (
                      <div className="p-6 bg-[#FBFDFB] space-y-6">
                        
                        {/* Books List in this Order */}
                        <div>
                          <h4 className="text-xs font-bold text-[#55695C] mb-3">کتاب‌های این سفارش:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E4EAE1]">
                                <img
                                  src={item.bookCover}
                                  alt={item.bookTitle}
                                  className="w-12 h-16 object-cover rounded-lg shadow-2xs shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-xs font-bold text-[#1E2E23] truncate">{item.bookTitle}</h5>
                                  <p className="text-[11px] text-[#697D70] mt-0.5">{item.authorName}</p>
                                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F2F5F0]">
                                    <span className="text-[11px] text-[#55695C]">{toPersianDigits(item.quantity)} نسخه</span>
                                    <span className="text-xs font-bold text-[#24372B]">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping & Payment Meta */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-2xl border border-[#E4EAE1]">
                          <div className="space-y-1">
                            <span className="text-[11px] text-[#7A8E80] block font-semibold">آدرس و تحویل‌گیرنده:</span>
                            <p className="text-[#203126] font-medium">
                              {order.shippingAddress.recipientName} ({order.shippingAddress.phone})
                            </p>
                            <p className="text-[#526659] leading-relaxed">
                              {order.shippingAddress.province}، {order.shippingAddress.city}، {order.shippingAddress.address}
                            </p>
                            <p className="text-[#7A8E80] font-mono">
                              کد پستی: {order.shippingAddress.postalCode}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] text-[#7A8E80] block font-semibold">مشخصات پرداخت:</span>
                            <p className="text-[#203126]">{order.paymentMethod}</p>
                            <p className="text-[#526659] font-mono">کد مرجع بانکی: {order.paymentRefId}</p>
                            {order.postalTrackingCode && (
                              <div className="pt-2 flex items-center gap-2">
                                <span className="text-[11px] text-[#7A8E80]">کد رهگیری پستی:</span>
                                <span className="font-mono font-bold text-[#24372C]">{order.postalTrackingCode}</span>
                                <button
                                  onClick={() => copyToClipboard(order.postalTrackingCode, 'کد رهگیری پستی')}
                                  className="p-1 text-[#657A6C] hover:text-[#1F2F24]"
                                  title="کپی کد رهگیری"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Edit Profile & Address */}
      {userPanelTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-[#E3E8E1] p-6 sm:p-10 shadow-xs max-w-3xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#EEF2EC]">
            <User className="w-5 h-5 text-[#415A4C]" />
            <div>
              <h2 className="font-bold text-lg text-[#1C2C22] font-serif">ویرایش اطلاعات کاربری و آدرس پیش‌فرض</h2>
              <p className="text-xs text-[#6A7E71] mt-0.5">
                این اطلاعات به عنوان آدرس پیش‌فرض شما برای سفارش‌های بعدی در نظر گرفته می‌شود.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#35483B] block mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none"
                  id="profile-name"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#35483B] block mb-1">شماره همراه:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none"
                  id="profile-phone"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#35483B] block mb-1">پست الکترونیک (ایمیل):</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none text-left"
                dir="ltr"
                id="profile-email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#35483B] block mb-1">استان:</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none"
                  id="profile-province"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#35483B] block mb-1">شهر:</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none"
                  id="profile-city"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#35483B] block mb-1">کد پستی (۱۰ رقمی):</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none font-mono"
                  id="profile-postal"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#35483B] block mb-1">نشانی دقیق پستی:</label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#F6F8F4] text-[#223327] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:border-[#415A4C] focus:outline-none leading-relaxed"
                id="profile-address"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-[#415A4C] hover:bg-[#304639] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs active:scale-98"
                id="save-profile-btn"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تغییرات مشخصات</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {userPanelTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1C2C22] font-serif">قفسه کتاب‌های نشان‌شده</h2>
              <p className="text-xs text-[#62776A] mt-0.5">
                کتاب‌هایی که برای خرید در فرصت‌های آتی ذخیره کرده‌اید
              </p>
            </div>
          </div>

          {wishlistBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlistBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E3E8E1] space-y-3">
              <Heart className="w-10 h-10 text-[#BD5353]/60 mx-auto" />
              <h3 className="font-bold text-base text-[#1F2F25]">قفسه نشان‌شده‌های شما خالی است</h3>
              <p className="text-xs text-[#6D8072]">
                روی آیکون قلب در هر کتاب کلیک کنید تا آن را در این قفسه نگه دارید.
              </p>
              <button
                onClick={goToHome}
                className="px-5 py-2.5 bg-[#415A4C] text-white text-xs font-bold rounded-xl hover:bg-[#31463A]"
              >
                کاوش کتاب‌ها
              </button>
            </div>
          )}
        </div>
      )}

      {/* Postal Tracking Simulation Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div 
            onClick={() => setTrackingModalOrder(null)}
            className="absolute inset-0 bg-[#16221A]/50 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCE4DA] shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-right">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2EC]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8EFE6] text-[#365040] flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1C2C22]">سامانه رهگیری مرسولات شرکت ملی پست</h3>
                  <span className="text-[10px] text-[#718578]">استعلام برخط وضعیت جابه‌جایی بسته</span>
                </div>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="text-xs text-[#6F8274] hover:text-[#1C2C22]"
              >
                بستن
              </button>
            </div>

            <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">شماره پیگیری پستی:</span>
                <span className="font-mono font-bold text-[#0F172A]">{trackingModalOrder.postalTrackingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">نوع خدمت:</span>
                <span className="font-medium text-[#0F172A]">پیشتاز با بیمه کامل مرسوله</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">فرستنده:</span>
                <span className="font-medium text-[#0F172A]">انتشارات و فروشگاه کتابستان (تهران)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">گیرنده:</span>
                <span className="font-medium text-[#0F172A]">{trackingModalOrder.shippingAddress.recipientName}</span>
              </div>
            </div>

            {/* Postal Events Log */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#3B4E41] block">رویدادهای ثبت‌شده در باجه و خطوط پستی:</span>
              <div className="space-y-2 text-xs border-r-2 border-[#415A4C] pr-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#203126] block">مرسوله در مرکز تجزیه و مبادلات پستی استان مقصد</span>
                  <span className="text-[10px] text-[#75897C]">امروز ساعت ۰۹:۴۵ • آماده تحویل به موزع</span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-[#45574C] block">خروج از هاب پستی چهارراه لشکر تهران</span>
                  <span className="text-[10px] text-[#75897C]">دیروز ساعت ۱۶:۲۰</span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-[#45574C] block">پذیرش در باجه مرکزی پست انقلاب</span>
                  <span className="text-[10px] text-[#75897C]">دو روز پیش ساعت ۱۱:۱۰</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="w-full py-2.5 bg-[#415A4C] text-white text-xs font-bold rounded-xl hover:bg-[#32473A] transition-colors"
              >
                تایید و بازگشت
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
