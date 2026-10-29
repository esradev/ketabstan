import React from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Quote, 
  Compass, 
  Award, 
  BookMarked, 
  Feather, 
  Building2, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BookCard } from '../components/BookCard';
import { formatPrice, toPersianDigits } from '../utils/formatters';

export const HomeView: React.FC = () => {
  const { 
    books, 
    categories, 
    authors, 
    publishers, 
    reviews, 
    goToBook, 
    goToCategory, 
    goToAuthor, 
    goToPublisher, 
    setActiveView 
  } = useStore();

  const featuredBooks = books.filter((b) => b.featured || b.bestseller).slice(0, 4);
  const editorPicks = books.filter((b) => b.editorPick).slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Editorial Boutique Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#EDF2EB] to-[#F7FAF6] border border-[#DEE6DC] p-6 sm:p-10 md:p-14">
        <div className="max-w-3xl space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0E9DE] text-[#2F4437] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#4B6856]" />
            <span>خلوتگاه گزیده کتاب‌های اصیل و ماندگار</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#19261E] font-serif leading-tight">
            کتاب‌هایی برای اندیشیدن، <br className="hidden sm:inline" />
            <span className="text-[#3D5B4B]">درنگی آرام در هیاهوی جهان</span>
          </h1>

          <p className="text-[#516457] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            کتابستان با دست‌چین کردن ترجمه‌های تراز اول، کاغذهای چشم‌نواز و شاهکارهای ادبیات، فلسفه و هنر، فضایی خلوت و آرامش‌بخش برای دوست‌داران کتاب فراهم آورده است.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => goToCategory(null)}
              className="px-6 py-3.5 bg-[#415A4C] hover:bg-[#304639] text-white rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-98"
              id="hero-explore-btn"
            >
              <span>مشاهده و انتخاب کتاب‌ها</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('authors-list')}
              className="px-5 py-3.5 bg-white hover:bg-[#F2F6F0] text-[#334639] border border-[#CFD8CD] rounded-2xl font-medium text-sm transition-all"
              id="hero-authors-btn"
            >
              نویسندگان و اندیشمندان
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-6 border-t border-[#D9E3D6] grid grid-cols-3 gap-4 max-w-lg">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1F2F25]">
                {toPersianDigits('2400')}+
              </div>
              <div className="text-xs text-[#62776A]">عنوان کتاب گزیده</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1F2F25]">
                {toPersianDigits('98')}٪
              </div>
              <div className="text-xs text-[#62776A]">رضایت خوانندگان</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1F2F25]">
                {toPersianDigits('24')} ساعته
              </div>
              <div className="text-xs text-[#62776A]">ارسال سریع کشوری</div>
            </div>
          </div>
        </div>

        {/* Decorative subtle background illustration elements */}
        <div className="absolute left-6 bottom-6 opacity-10 pointer-events-none hidden lg:block">
          <BookMarked className="w-80 h-80 text-[#3F594B]" />
        </div>
      </section>

      {/* Thematic Categories Carousel/Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#556F5F] tracking-wide">مسیرهای کاوش</span>
            <h2 className="text-2xl font-bold text-[#1B2921] font-serif mt-0.5">دسته‌بندی‌های موضوعی</h2>
          </div>
          <button
            onClick={() => goToCategory(null)}
            className="text-xs font-semibold text-[#405D4C] hover:text-[#2A4234] flex items-center gap-1 group"
          >
            <span>همه موضوعات</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => goToCategory(cat.id)}
              className="p-4 rounded-2xl bg-white border border-[#E3E8E1] hover:border-[#CAD6C6] hover:bg-[#F9FBF8] text-right transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
                style={{ backgroundColor: `${cat.accentColor}15`, color: cat.accentColor }}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#203126] group-hover:text-[#385343] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#718578] mt-1 line-clamp-1">
                  {toPersianDigits(cat.bookCount)} عنوان کتاب
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured & Bestsellers Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFE6] text-[#3D5747] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#567261]">محبوب‌ترین‌های کتابستان</span>
              <h2 className="text-2xl font-bold text-[#1B2921] font-serif">پرفروش‌ترین و پرطرفدارترین کتاب‌ها</h2>
            </div>
          </div>
          <button
            onClick={() => goToCategory(null)}
            className="text-xs font-semibold text-[#405D4C] hover:text-[#2A4234] flex items-center gap-1 group"
          >
            <span>مشاهده همه</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Quote / Literary Interlude */}
      <section className="rounded-3xl bg-[#34483C] text-white p-8 sm:p-12 relative overflow-hidden shadow-md">
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <Quote className="w-10 h-10 text-[#A2BEAC] mx-auto opacity-70" />
          <blockquote className="text-lg sm:text-2xl font-serif leading-relaxed text-[#F0F5F1]">
            «کتاب پناهگاهی است که در آن می‌توان با عمیق‌ترین افکار بشریت در سکوت گفت‌وگو کرد؛ بی‌آنکه قضاوت شوی یا شتابی در کار باشد.»
          </blockquote>
          <div className="pt-2">
            <span className="text-xs font-bold tracking-widest text-[#B5CFBF] uppercase">
              آلبر کامو — نویسنده و برنده جایزه نوبل
            </span>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#B5CFBF]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Editor's Choice Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFE6] text-[#3D5747] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#567261]">گزینش ویژه</span>
              <h2 className="text-2xl font-bold text-[#1B2921] font-serif">پیشنهادهای تحریریه کتابستان</h2>
            </div>
          </div>
          <button
            onClick={() => goToCategory(null)}
            className="text-xs font-semibold text-[#405D4C] hover:text-[#2A4234] flex items-center gap-1 group"
          >
            <span>فهرست کامل</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {editorPicks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Author Spotlight Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFE6] text-[#3D5747] flex items-center justify-center">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#567261]">اهل قلم</span>
              <h2 className="text-2xl font-bold text-[#1B2921] font-serif">صفحات اختصاصی نویسندگان</h2>
            </div>
          </div>
          <button
            onClick={() => setActiveView('authors-list')}
            className="text-xs font-semibold text-[#405D4C] hover:text-[#2A4234] flex items-center gap-1 group"
          >
            <span>مشاهده همه نویسندگان</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {authors.slice(0, 3).map((author) => (
            <div
              key={author.id}
              onClick={() => goToAuthor(author.id)}
              className="bg-white rounded-2xl border border-[#E3E8E1] hover:border-[#CAD6C6] p-5 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div className="flex items-center gap-4">
                <img
                  src={author.portrait}
                  alt={author.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#EBF0E8] group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="font-bold text-base text-[#1E2B23] group-hover:text-[#385343] transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-xs text-[#65796E] mt-0.5">
                    {author.nationality} • متولد {author.birthYear}
                  </p>
                  <span className="text-[11px] text-[#425B4C] bg-[#EFF4ED] px-2 py-0.5 rounded-full inline-block mt-1.5 font-medium">
                    {toPersianDigits(author.totalBooks)} اثر موجود در کتابستان
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#4F6255] italic line-clamp-2 mt-4 pt-3 border-t border-[#F0F3EE]">
                «{author.quote}»
              </p>

              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#3C5747]">
                <span>مشاهده بیوگرافی و آثار</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Esteemed Publishers Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFE6] text-[#3D5747] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#567261]">همکاران فرهنگی</span>
              <h2 className="text-2xl font-bold text-[#1B2921] font-serif">ناشران برگزیده و معتبر</h2>
            </div>
          </div>
          <button
            onClick={() => setActiveView('publishers-list')}
            className="text-xs font-semibold text-[#405D4C] hover:text-[#2A4234] flex items-center gap-1 group"
          >
            <span>همه ناشران</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {publishers.map((pub) => (
            <div
              key={pub.id}
              onClick={() => goToPublisher(pub.id)}
              className="bg-white rounded-2xl border border-[#E3E8E1] hover:border-[#CAD6C6] p-4 text-center cursor-pointer transition-all hover:shadow-xs group flex flex-col items-center justify-between"
            >
              <img
                src={pub.logo}
                alt={pub.name}
                className="w-14 h-14 rounded-2xl object-cover border border-[#E8EEE6] p-1 group-hover:scale-105 transition-transform mb-3"
              />
              <h3 className="font-bold text-sm text-[#1F2C24] group-hover:text-[#385343] transition-colors">
                {pub.name}
              </h3>
              <p className="text-[11px] text-[#788C80] mt-0.5">
                تأسیس {pub.foundedYear}
              </p>
              <span className="text-[10px] text-[#4F6859] mt-2 bg-[#F1F5EF] px-2 py-0.5 rounded-full">
                {toPersianDigits(pub.bookCount)} کتاب فعال
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Reader Community Reviews Snippets */}
      <section className="rounded-3xl bg-[#F0F4ED] border border-[#DEE6DB] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#4F6959]">صدای خوانندگان</span>
            <h3 className="text-xl font-bold text-[#1C2A21] font-serif">تازه‌ترین دیدگاه‌ها و حال‌وهوای مطالعه</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map((rev) => {
            const reviewedBook = books.find((b) => b.id === rev.bookId);
            return (
              <div 
                key={rev.id} 
                className="bg-white rounded-2xl p-4 border border-[#E0E7DE] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#27382E]">{rev.userName}</span>
                    <span className="text-[11px] text-[#557361] bg-[#EEF4EC] px-2 py-0.5 rounded-md font-medium">
                      {rev.moodTag}
                    </span>
                  </div>
                  <p className="text-xs text-[#4C5E53] leading-relaxed line-clamp-3">
                    «{rev.comment}»
                  </p>
                </div>

                {reviewedBook && (
                  <div 
                    onClick={() => goToBook(reviewedBook.id)}
                    className="mt-3 pt-2.5 border-t border-[#F0F4EE] flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={reviewedBook.coverImage} 
                      alt={reviewedBook.title} 
                      className="w-6 h-8 object-cover rounded shadow-2xs" 
                    />
                    <div className="truncate">
                      <span className="text-[11px] text-[#718578] block">درباره کتاب:</span>
                      <span className="text-xs font-bold text-[#23352A] truncate block">{reviewedBook.title}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
