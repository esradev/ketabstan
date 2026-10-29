import React from 'react';
import { Feather, ArrowLeft, BookOpen } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toPersianDigits } from '../utils/formatters';

export const AuthorsListView: React.FC = () => {
  const { authors, goToAuthor, goToHome } = useStore();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-[#EDF3EB] rounded-3xl p-6 sm:p-10 border border-[#DBE5D8]">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A6655] bg-white/70 px-3 py-1 rounded-full">
            <Feather className="w-3.5 h-3.5" />
            <span>اهل قلم و اندیشه</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2921] font-serif">
            نویسندگان و متفکران کتابستان
          </h1>

          <p className="text-sm text-[#506356] leading-relaxed">
            صفحات اختصاصی نویسندگان، مترجمان و فیلسوفان برجسته؛ همراه با بیوگرافی، سبک نگارش، نقل‌قول‌های ماندگار و دسترسی به تمام آثار چاپ‌شده.
          </p>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            onClick={() => goToAuthor(author.id)}
            className="bg-white rounded-3xl border border-[#E3E8E1] hover:border-[#CAD6C6] p-6 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={author.portrait}
                  alt={author.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#EEF3EC] group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="font-bold text-lg text-[#1C2A21] group-hover:text-[#385343] transition-colors font-serif">
                    {author.name}
                  </h3>
                  <p className="text-xs text-[#6C8073] mt-0.5">
                    {author.nationality} • متولد {author.birthYear}
                  </p>
                  <span className="text-[11px] font-medium text-[#405A4B] bg-[#EFF4ED] px-2.5 py-0.5 rounded-full inline-block mt-1.5">
                    {toPersianDigits(author.totalBooks)} اثر در کتابستان
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#506356] leading-relaxed line-clamp-3">
                {author.bio}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0F4EE] flex items-center justify-between text-xs font-bold text-[#3B5546]">
              <span>مشاهده صفحه اختصاصی و کتاب‌ها</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
