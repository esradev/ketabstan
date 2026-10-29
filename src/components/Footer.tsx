import React from 'react';
import { BookOpen, ShieldCheck, Truck, RefreshCw, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toPersianDigits } from '../utils/formatters';

export const Footer: React.FC = () => {
  const { goToHome, goToCategory, setActiveView, goToUserPanel, categories, authors, publishers } = useStore();

  return (
    <footer className="bg-[#243329] text-[#DFE7E0] pt-16 pb-12 border-t border-[#314438] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions / Promises */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#34473B]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#314639] flex items-center justify-center text-[#BBD2C0] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F0F5F1]">اصالت ۱۰۰٪ کتاب‌ها</h4>
              <p className="text-xs text-[#9BB1A2] mt-0.5">تهیه مستقیم از ناشران معتبر کشور</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#314639] flex items-center justify-center text-[#BBD2C0] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F0F5F1]">ارسال امن و سریع</h4>
              <p className="text-xs text-[#9BB1A2] mt-0.5">بسته‌بندی ضدضربه و تحویل سراسری</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#314639] flex items-center justify-center text-[#BBD2C0] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F0F5F1]">ضمانت سلامت فیزیکی</h4>
              <p className="text-xs text-[#9BB1A2] mt-0.5">امکان تعویض بی قیدوشرط تا ۷ روز</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#314639] flex items-center justify-center text-[#BBD2C0] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F0F5F1]">پشتیبانی مهربان</h4>
              <p className="text-xs text-[#9BB1A2] mt-0.5">همراهی از انتخاب تا تحویل کتاب</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-[#34473B]">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#415A4C] flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5 text-[#E6EFE6]" />
              </div>
              <span className="text-2xl font-bold text-white font-serif tracking-tight">کتابستان</span>
            </div>
            <p className="text-xs leading-relaxed text-[#A4BAAB] max-w-md">
              کتابستان خلوتگاهی برای کتاب‌دوستان است؛ جایی که خواندن نه یک مسابقه، بلکه فرصتی برای درنگ و اندیشیدن است. ما با گلچین کردن برترین چاپ‌ها و ترجمه‌ها، همراه لحظه‌های خلوت و بالندگی شما هستیم.
            </p>
            <div className="pt-2 text-xs text-[#8BA193] space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#75917F] shrink-0" />
                <span>تهران، خیابان انقلاب، خیابان فخر رازی، پلاک ۴۲</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#75917F] shrink-0" />
                <span>تلفن تماس: {toPersianDigits('021-66489012')} (شنبه تا پنج‌شنبه ۹ تا ۲۱)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#75917F] shrink-0" />
                <span>پست الکترونیک: salam@ketabestan.ir</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2.5 text-xs text-[#A4BAAB]">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => goToCategory(cat.id)}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => goToCategory(null)}
                  className="hover:text-white transition-colors text-[#BBD2C0]"
                >
                  همه دسته‌بندی‌ها...
                </button>
              </li>
            </ul>
          </div>

          {/* Authors & Publishers */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">اهل قلم و ناشران</h4>
            <ul className="space-y-2.5 text-xs text-[#A4BAAB]">
              <li>
                <button onClick={() => setActiveView('authors-list')} className="hover:text-white transition-colors">
                  فهرست نویسندگان
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('publishers-list')} className="hover:text-white transition-colors">
                  فهرست ناشران برگزیده
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('cat-fiction')} className="hover:text-white transition-colors">
                  شاهکارهای ادبیات جهان
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('cat-philosophy')} className="hover:text-white transition-colors">
                  آثار فلسفی و تأملی
                </button>
              </li>
            </ul>
          </div>

          {/* User & Services */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">خدمات کاربران</h4>
            <ul className="space-y-2.5 text-xs text-[#A4BAAB]">
              <li>
                <button onClick={() => goToUserPanel('orders')} className="hover:text-white transition-colors">
                  پیگیری آنلاین سفارشات
                </button>
              </li>
              <li>
                <button onClick={() => goToUserPanel('profile')} className="hover:text-white transition-colors">
                  ویرایش اطلاعات و آدرس‌ها
                </button>
              </li>
              <li>
                <button onClick={() => goToUserPanel('wishlist')} className="hover:text-white transition-colors">
                  قفسه کتاب‌های نشان‌شده
                </button>
              </li>
              <li>
                <span className="text-[#849C8D]">شیوه پرداخت آنلاین با کلیه کارت‌های عضو شتاب</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A9182] gap-4">
          <p>© {toPersianDigits('1404')} تمامی حقوق مادی و معنوی برای فروشگاه کتابستان محفوظ است.</p>
          <div className="flex items-center gap-4">
            <span className="bg-[#2E4034] px-3 py-1.5 rounded-lg border border-[#3D5445] text-[11px] text-[#A6BDAD]">
              مجوز نشر دیجیتال و نماد اعتماد پرداخت الکترونیکی
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
