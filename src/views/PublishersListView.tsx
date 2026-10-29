import React from 'react';
import { Building2, ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toPersianDigits } from '../utils/formatters';

export const PublishersListView: React.FC = () => {
  const { publishers, goToPublisher, goToHome } = useStore();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-[#EDF3EB] rounded-3xl p-6 sm:p-10 border border-[#DBE5D8]">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A6655] bg-white/70 px-3 py-1 rounded-full">
            <Building2 className="w-3.5 h-3.5" />
            <span>ناشران برگزیده</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2921] font-serif">
            خانه‌های نشر و پیشگامان فرهنگ
          </h1>

          <p className="text-sm text-[#506356] leading-relaxed">
            آشنایی با تاریخچه، تعهد فرهنگی، سال تاسیس و کتاب‌های منتشرشده توسط برترین ناشران ادبی، فلسفی و دانشگاهی ایران.
          </p>
        </div>
      </div>

      {/* Publishers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishers.map((pub) => (
          <div
            key={pub.id}
            onClick={() => goToPublisher(pub.id)}
            className="bg-white rounded-3xl border border-[#E3E8E1] hover:border-[#CAD6C6] p-6 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-[#F6F8F4] border-2 border-[#EEF3EC] p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={pub.logo}
                    alt={pub.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1C2A21] group-hover:text-[#385343] transition-colors font-serif">
                    {pub.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#6C8073] mt-1">
                    <span>تأسیس {pub.foundedYear}</span>
                    <span>•</span>
                    <span>{pub.city}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#405A4B] bg-[#EFF4ED] px-2.5 py-0.5 rounded-full inline-block mt-2">
                    {toPersianDigits(pub.bookCount)} کتاب در کتابستان
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#506356] leading-relaxed line-clamp-3">
                {pub.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0F4EE] flex items-center justify-between text-xs font-bold text-[#3B5546]">
              <span>مشاهده کارنامه و آثار چاپ‌شده</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
