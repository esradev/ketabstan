import React, { useState } from 'react';
import { Building2, BookOpen, MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BookCard } from '../components/BookCard';
import { toPersianDigits } from '../utils/formatters';

export const PublisherView: React.FC = () => {
  const { publishers, selectedPublisherId, books, goToHome, setActiveView } = useStore();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const publisher = publishers.find((p) => p.id === selectedPublisherId) || publishers[0];
  let publisherBooks = books.filter((b) => b.publisherId === publisher.id);

  if (activeCategoryFilter !== 'all') {
    publisherBooks = publisherBooks.filter((b) => b.categoryId === activeCategoryFilter);
  }

  // Get categories available in this publisher
  const publisherCategories = Array.from(
    new Set(books.filter((b) => b.publisherId === publisher.id).map((b) => b.categoryName))
  );

  return (
    <div className="space-y-12 pb-20">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#637669]">
        <button onClick={goToHome} className="hover:text-[#213428] transition-colors">
          صفحه اصلی
        </button>
        <span>/</span>
        <button onClick={() => setActiveView('publishers-list')} className="hover:text-[#213428] transition-colors">
          فهرست ناشران
        </button>
        <span>/</span>
        <span className="text-[#203126] font-bold">{publisher.name}</span>
      </nav>

      {/* Publisher Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#E3E8E1] p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Publisher Logo */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-[#F4F7F2] border-2 border-[#DEE6DC] p-3 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src={publisher.logo}
              alt={publisher.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-right space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-[#526D5E] font-medium bg-[#EEF4EC] px-3 py-1 rounded-full inline-block">
                ناشر رسمی و معتبر
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2921] font-serif">
                {publisher.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-[#6C8072] pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#516B5B]" />
                  <span>سال تأسیس: {publisher.foundedYear}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#516B5B]" />
                  <span>دفتر مرکزی: {publisher.city}</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#485C4F] leading-relaxed">
              {publisher.description}
            </p>

            {/* Mission quote */}
            <div className="bg-[#F8FAF6] p-4 rounded-2xl border-r-3 border-[#415A4C] text-right">
              <span className="text-[11px] font-bold text-[#556F60] block mb-1">خط‌مشی و تعهد نشر:</span>
              <p className="text-xs text-[#304437] font-medium leading-relaxed">
                {publisher.mission}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Publisher Books Catalog */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DEE6DC] pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#415A4C]" />
            <h2 className="text-xl font-bold text-[#1C2921] font-serif">
              کتاب‌های چاپ‌شده توسط {publisher.name} ({toPersianDigits(publisherBooks.length)} عنوان)
            </h2>
          </div>

          {/* Publisher category chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                activeCategoryFilter === 'all'
                  ? 'bg-[#3F5B4D] text-white'
                  : 'bg-white text-[#4D6154] border border-[#DEE5DC]'
              }`}
            >
              همه آثار
            </button>
            {publisherCategories.map((cName) => {
              const catObj = books.find((b) => b.categoryName === cName);
              if (!catObj) return null;
              return (
                <button
                  key={catObj.categoryId}
                  onClick={() => setActiveCategoryFilter(catObj.categoryId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                    activeCategoryFilter === catObj.categoryId
                      ? 'bg-[#3F5B4D] text-white'
                      : 'bg-white text-[#4D6154] border border-[#DEE5DC]'
                  }`}
                >
                  {cName}
                </button>
              );
            })}
          </div>
        </div>

        {publisherBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {publisherBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E3E8E1] text-xs text-[#6F8274]">
            کتابی در این دسته‌بندی برای این ناشر یافت نشد.
          </div>
        )}
      </div>

    </div>
  );
};
