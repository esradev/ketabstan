import React, { useState, useMemo } from 'react';
import { Layers, SlidersHorizontal, ArrowUpDown, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BookCard } from '../components/BookCard';
import { toPersianDigits } from '../utils/formatters';

export const CategoriesView: React.FC = () => {
  const { books, categories, selectedCategoryId, goToCategory } = useStore();

  const [sortOption, setSortOption] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [activePublisherFilter, setActivePublisherFilter] = useState<string>('all');

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by category
    if (selectedCategoryId) {
      result = result.filter((b) => b.categoryId === selectedCategoryId);
    }

    // Filter by stock
    if (onlyInStock) {
      result = result.filter((b) => b.inStock);
    }

    // Filter by publisher
    if (activePublisherFilter !== 'all') {
      result = result.filter((b) => b.publisherId === activePublisherFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'popular') {
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
      if (sortOption === 'newest') {
        return parseInt(b.publishYear) < parseInt(a.publishYear) ? 1 : -1;
      }
      if (sortOption === 'price-asc') {
        return a.price - b.price;
      }
      if (sortOption === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });

    return result;
  }, [books, selectedCategoryId, onlyInStock, activePublisherFilter, sortOption]);

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Category Header */}
      <div className="bg-[#EDF3EB] rounded-3xl p-6 sm:p-10 border border-[#DBE5D8]">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A6655] bg-white/70 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5" />
            <span>دسته‌بندی موضوعی کتاب‌ها</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1B2921] font-serif">
            {currentCategory ? currentCategory.name : 'کتابخانه جامع کتابستان'}
          </h1>

          <p className="text-sm text-[#506356] leading-relaxed">
            {currentCategory 
              ? currentCategory.description 
              : 'مجموعه‌ای گزینش‌شده از شاهکارهای ادبیات داستانی، فلسفه و حکمت، روانشناسی و آرامش ذهن، هنر و شعر با ترجمه‌های ممتاز و چاپ‌های باکیفیت.'}
          </p>
        </div>

        {/* Category Horizontal Pills */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => goToCategory(null)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              selectedCategoryId === null
                ? 'bg-[#3F5B4D] text-white shadow-sm'
                : 'bg-white text-[#4A5D50] hover:bg-[#F2F6F0] border border-[#DEE5DC]'
            }`}
          >
            همه موضوعات ({toPersianDigits(books.length)})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => goToCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategoryId === cat.id
                  ? 'bg-[#3F5B4D] text-white shadow-sm'
                  : 'bg-white text-[#4A5D50] hover:bg-[#F2F6F0] border border-[#DEE5DC]'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategoryId === cat.id ? 'bg-white/20 text-white' : 'bg-[#EDF2EB] text-[#697D70]'
              }`}>
                {toPersianDigits(cat.bookCount)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Control & Sorting Bar */}
      <div className="bg-white rounded-2xl border border-[#E3E8E1] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Count and filter tags */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-[#526558] font-medium">
            نمایش <b className="text-[#1D2B22]">{toPersianDigits(filteredBooks.length)}</b> عنوان کتاب
          </span>

          <label className="flex items-center gap-2 text-xs text-[#485C4F] cursor-pointer mr-auto sm:mr-4 select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded accent-[#3F5B4D] w-4 h-4 cursor-pointer"
            />
            <span>فقط کتاب‌های موجود</span>
          </label>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-[#6F8275] flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>مرتب‌سازی:</span>
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="text-xs font-medium bg-[#F4F7F2] text-[#293B30] border border-[#DCE4DA] rounded-xl px-3 py-2 focus:outline-none focus:border-[#4B6856] cursor-pointer"
          >
            <option value="popular">محبوب‌ترین و بیشترین امتیاز</option>
            <option value="newest">تازه‌ترین چاپ‌ها</option>
            <option value="price-asc">ارزان‌ترین قیمت</option>
            <option value="price-desc">گران‌ترین قیمت</option>
          </select>
        </div>

      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E3E8E1] space-y-3">
          <p className="text-sm font-bold text-[#2A3C31]">کتابی با فیلترهای انتخابی شما یافت نشد</p>
          <p className="text-xs text-[#6A7E71]">لطفاً فیلتر موجودی یا دسته‌بندی را تغییر دهید.</p>
          <button
            onClick={() => {
              goToCategory(null);
              setOnlyInStock(false);
            }}
            className="px-4 py-2 bg-[#415A4C] text-white text-xs font-medium rounded-xl hover:bg-[#32463A] transition-colors"
          >
            مشاهده همه کتاب‌ها
          </button>
        </div>
      )}

    </div>
  );
};
