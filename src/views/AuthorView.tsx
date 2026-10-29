import React from 'react';
import { Feather, BookOpen, Quote, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BookCard } from '../components/BookCard';
import { toPersianDigits } from '../utils/formatters';

export const AuthorView: React.FC = () => {
  const { authors, selectedAuthorId, books, goToHome, setActiveView } = useStore();

  const author = authors.find((a) => a.id === selectedAuthorId) || authors[0];
  const authorBooks = books.filter((b) => b.authorId === author.id);

  return (
    <div className="space-y-12 pb-20">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#637669]">
        <button onClick={goToHome} className="hover:text-[#213428] transition-colors">
          صفحه اصلی
        </button>
        <span>/</span>
        <button onClick={() => setActiveView('authors-list')} className="hover:text-[#213428] transition-colors">
          فهرست نویسندگان
        </button>
        <span>/</span>
        <span className="text-[#203126] font-bold">{author.name}</span>
      </nav>

      {/* Author Hero Profile */}
      <div className="bg-white rounded-3xl border border-[#E3E8E1] p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Portrait */}
          <div className="relative shrink-0">
            <img
              src={author.portrait}
              alt={author.name}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-[#EEF3EC] shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 bg-[#415A4C] text-white p-2 rounded-2xl shadow-xs">
              <Feather className="w-4 h-4" />
            </div>
          </div>

          {/* Bio & Details */}
          <div className="flex-1 text-center md:text-right space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-[#526D5E] font-medium bg-[#EEF4EC] px-3 py-1 rounded-full inline-block">
                اهل قلم و اندیشه
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2921] font-serif">
                {author.name}
              </h1>
              <p className="text-xs text-[#6E8174]">
                ملیت: {author.nationality} • سال ولادت: {author.birthYear}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#485C4F] leading-relaxed">
              {author.bio}
            </p>

            {/* Author quote */}
            <div className="bg-[#F7F9F5] p-4 rounded-2xl border-r-3 border-[#415A4C] text-right">
              <p className="text-xs font-serif italic text-[#304437]">
                «{author.quote}»
              </p>
            </div>

            {/* Key Themes */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#62776A] block mb-2">درونمایه‌ها و سبک نگارش:</span>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {author.keyThemes.map((theme, idx) => (
                  <span key={idx} className="text-xs bg-[#EFF3EC] text-[#3E5547] px-3 py-1 rounded-xl">
                    {theme}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Author's Books Catalog in Store */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#DEE6DC] pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#415A4C]" />
            <h2 className="text-xl font-bold text-[#1C2921] font-serif">
              آثار موجود از {author.name} ({toPersianDigits(authorBooks.length)} کتاب)
            </h2>
          </div>
        </div>

        {authorBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {authorBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E3E8E1] text-xs text-[#6F8274]">
            در حال حاضر اثری از این نویسنده در انبار موجود نیست. به زودی تجدید چاپ خواهد شد.
          </div>
        )}
      </div>

    </div>
  );
};
