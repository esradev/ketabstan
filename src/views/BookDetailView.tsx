import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  ArrowRight, 
  Check, 
  Truck, 
  ShieldCheck, 
  BookOpen, 
  Feather, 
  Building2, 
  Quote, 
  MessageSquare, 
  ThumbsUp, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BookCard } from '../components/BookCard';
import { formatPrice, toPersianDigits } from '../utils/formatters';

export const BookDetailView: React.FC = () => {
  const { 
    books, 
    selectedBookId, 
    reviews, 
    addReview, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    goToAuthor, 
    goToPublisher, 
    goToCategory,
    goToHome,
    showToast 
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'excerpt' | 'reviews'>('details');

  // New review form states
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewMood, setReviewMood] = useState<string>('عمیق و تامل‌برانگیز');
  const [hoverRating, setHoverRating] = useState<number>(0);

  const book = books.find((b) => b.id === selectedBookId) || books[0];
  const isFavorited = isInWishlist(book.id);

  // Filter reviews for this book
  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const relatedBooks = books.filter((b) => b.categoryId === book.categoryId && b.id !== book.id).slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('لطفاً متن نظر خود را بنویسید', 'error');
      return;
    }

    addReview({
      bookId: book.id,
      userName: reviewerName.trim() || 'خواننده گرامی',
      rating: reviewRating,
      comment: reviewComment.trim(),
      moodTag: reviewMood,
    });

    setReviewComment('');
    setReviewerName('');
    setActiveTab('reviews');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('پیوند کتاب در حافظه کپی شد', 'info');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#637669] flex-wrap">
        <button onClick={goToHome} className="hover:text-[#213428] transition-colors">
          صفحه اصلی
        </button>
        <span>/</span>
        <button onClick={() => goToCategory(book.categoryId)} className="hover:text-[#213428] transition-colors">
          {book.categoryName}
        </button>
        <span>/</span>
        <span className="text-[#203126] font-bold">{book.title}</span>
      </nav>

      {/* Main Book Detail Canvas */}
      <div className="bg-white rounded-3xl border border-[#E3E8E1] p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Cover & Gallery Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-[#F0F4ED] p-6 flex items-center justify-center border border-[#E0E7DD]">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full max-h-[440px] object-cover rounded-xl book-shadow book-spine-effect"
              />
            </div>

            {/* Micro actions */}
            <div className="flex items-center gap-3 mt-4 w-full max-w-sm justify-center">
              <button
                onClick={() => toggleWishlist(book.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  isFavorited
                    ? 'border-[#BD5353] bg-[#FCF2F2] text-[#BD5353]'
                    : 'border-[#D9E2D6] text-[#4E6254] hover:bg-[#F2F6F0]'
                }`}
                id="book-detail-wishlist-btn"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#BD5353]' : ''}`} />
                <span>{isFavorited ? 'نشان شده در قفسه' : 'نشان کردن کتاب'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-[#D9E2D6] text-[#4E6254] hover:bg-[#F2F6F0] transition-colors"
                title="اشتراک‌گذاری"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Book Info Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => goToCategory(book.categoryId)}
                  className="text-xs font-medium text-[#4B6856] bg-[#EDF3EB] px-3 py-1 rounded-full hover:bg-[#E3EDE0] transition-colors"
                >
                  {book.categoryName}
                </button>
                {book.bestseller && (
                  <span className="text-xs font-bold text-[#A84848] bg-[#FDF0F0] px-2.5 py-1 rounded-full">
                    پرفروش‌ترین
                  </span>
                )}
                {book.editorPick && (
                  <span className="text-xs font-bold text-[#3B6652] bg-[#EEF6F1] px-2.5 py-1 rounded-full">
                    پیشنهاد تحریریه
                  </span>
                )}
              </div>

              {/* Title & Original Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#19261E] font-serif leading-tight">
                  {book.title}
                </h1>
                {book.originalTitle && (
                  <p className="text-xs text-[#7D9184] mt-1 font-mono tracking-wide" dir="ltr">
                    {book.originalTitle}
                  </p>
                )}
              </div>

              {/* Rating & Review counter */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 bg-[#FFF9ED] text-[#916719] px-2.5 py-1 rounded-xl text-xs font-bold border border-[#F5E7C8]">
                  <Star className="w-3.5 h-3.5 fill-[#D99B26] text-[#D99B26]" />
                  <span>{toPersianDigits(book.rating)}</span>
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-[#5D7264] hover:underline"
                >
                  {toPersianDigits(book.reviewCount + bookReviews.length - 2)} دیدگاه ثبت‌شده
                </button>
              </div>

              {/* Author & Publisher clickable links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div 
                  onClick={() => goToAuthor(book.authorId)}
                  className="p-3 rounded-2xl bg-[#F6F8F4] hover:bg-[#EEF3EC] border border-[#E3EAE0] cursor-pointer transition-all flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E1EAE0] flex items-center justify-center text-[#3B5445]">
                    <Feather className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#697D70] block">نویسنده اثر:</span>
                    <span className="text-xs font-bold text-[#1E2D23] hover:underline">{book.authorName}</span>
                  </div>
                </div>

                <div 
                  onClick={() => goToPublisher(book.publisherId)}
                  className="p-3 rounded-2xl bg-[#F6F8F4] hover:bg-[#EEF3EC] border border-[#E3EAE0] cursor-pointer transition-all flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E1EAE0] flex items-center justify-center text-[#3B5445]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#697D70] block">ناشر و چاپ:</span>
                    <span className="text-xs font-bold text-[#1E2D23] hover:underline">{book.publisherName}</span>
                  </div>
                </div>
              </div>

              {/* Translator if exists */}
              {book.translator && (
                <div className="text-xs text-[#526558] flex items-center gap-1.5">
                  <span className="text-[#7A8E81]">مترجم:</span>
                  <span className="font-bold text-[#233328]">{book.translator}</span>
                </div>
              )}

              {/* Book Specs Mini Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E8EEE5]">
                  <span className="text-[10px] text-[#7A8E81] block">تعداد صفحه</span>
                  <span className="font-bold text-[#27382E]">{toPersianDigits(book.pages)} ص</span>
                </div>
                <div className="bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E8EEE5]">
                  <span className="text-[10px] text-[#7A8E81] block">سال انتشار</span>
                  <span className="font-bold text-[#27382E]">{toPersianDigits(book.publishYear)}</span>
                </div>
                <div className="bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E8EEE5]">
                  <span className="text-[10px] text-[#7A8E81] block">قطع و صحافی</span>
                  <span className="font-bold text-[#27382E]">{book.format}</span>
                </div>
                <div className="bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E8EEE5]">
                  <span className="text-[10px] text-[#7A8E81] block">شابک (ISBN)</span>
                  <span className="font-mono text-[11px] text-[#27382E] truncate block" dir="ltr">
                    {book.isbn}
                  </span>
                </div>
              </div>

              {/* Description preview */}
              <p className="text-xs sm:text-sm text-[#475A4E] leading-relaxed pt-2">
                {book.description}
              </p>

            </div>

            {/* Price Box & Add to Cart */}
            <div className="bg-[#F4F7F2] rounded-2xl p-5 border border-[#DEE6DC] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#6D8073]">قیمت کتاب:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#1B2921]">
                      {formatPrice(book.price)}
                    </span>
                    {book.originalPrice && (
                      <span className="text-xs text-[#8FA295] line-through">
                        {formatPrice(book.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-1 text-xs text-[#2A6643] font-medium bg-[#E7F0E6] px-3 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5 text-[#2A6643]" />
                  <span>موجود در انبار کتابستان</span>
                </div>
              </div>

              {/* Stepper and Add to Cart Button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#CFD8CD] bg-white rounded-2xl overflow-hidden p-1">
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#35493C] hover:bg-[#EEF3EC] rounded-xl transition-colors"
                  >
                    +
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-[#1F2F25]">
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#35493C] hover:bg-[#EEF3EC] rounded-xl transition-colors"
                  >
                    -
                  </button>
                </div>

                <button
                  onClick={() => addToCart(book, quantity)}
                  className="flex-1 py-3.5 bg-[#415A4C] hover:bg-[#2F4437] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                  id="book-detail-add-to-cart-btn"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>افزودن به سبد خرید</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E1E8DE] text-[11px] text-[#617568]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#4A6454]" />
                  <span>ارسال ایمن و سریع با پست پیشتاز</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4A6454]" />
                  <span>ضمانت ۱۰۰٪ اصالت نسخه و سلامت فیزیکی</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs: Excerpt, Description & Reviews */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#DFE6DD] pb-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === 'details'
                ? 'border-b-2 border-[#415A4C] text-[#203126]'
                : 'text-[#63776B] hover:text-[#203126]'
            }`}
          >
            معرفی و مشخصات
          </button>
          <button
            onClick={() => setActiveTab('excerpt')}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'excerpt'
                ? 'border-b-2 border-[#415A4C] text-[#203126]'
                : 'text-[#63776B] hover:text-[#203126]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#4B6856]" />
            <span>برشی از کتاب</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-b-2 border-[#415A4C] text-[#203126]'
                : 'text-[#63776B] hover:text-[#203126]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#4B6856]" />
            <span>نظرات خوانندگان ({toPersianDigits(bookReviews.length)})</span>
          </button>
        </div>

        {/* Tab 1: Detailed Intro */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E8E1] space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#1C2A21] font-serif mb-3">درباره این اثر</h3>
              <p className="text-sm text-[#485A4F] leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {book.quote && (
              <div className="bg-[#F3F7F1] p-5 rounded-2xl border-r-4 border-[#415A4C] space-y-1">
                <Quote className="w-5 h-5 text-[#516E5D] mb-1" />
                <p className="text-sm font-serif italic text-[#25362B]">
                  «{book.quote}»
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-[#607366] mb-2">کلیدواژه‌ها و درونمایه‌ها:</h4>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((t, idx) => (
                  <span key={idx} className="text-xs bg-[#EFF3ED] text-[#425749] px-3 py-1 rounded-xl">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reading Excerpt */}
        {activeTab === 'excerpt' && (
          <div className="bg-[#FBFDF9] rounded-3xl p-6 sm:p-10 border border-[#DEE6DC] relative">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs text-[#526B5C] font-semibold bg-[#E7EFE4] px-3 py-1 rounded-full inline-block">
                  طعم کلمات و شیوه نگارش
                </span>
                <h3 className="text-xl font-bold text-[#19261E] font-serif">برشی منتخب از صفحات کتاب</h3>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E3E8E1] shadow-xs text-sm sm:text-base font-serif leading-loose text-[#27382D]">
                {book.excerpt}
              </div>

              <p className="text-center text-xs text-[#6F8274]">
                این برش به شما کمک می‌کند تا با ریتم زبان، ترجمه و فضای عاطفی کتاب آشنا شوید.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews and Interactive Rating */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            
            {/* Review Submission Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E8E1] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#415A4C]" />
                <h3 className="text-lg font-bold text-[#1B2921] font-serif">دیدگاه و امتیاز خود را بنویسید</h3>
              </div>
              <p className="text-xs text-[#607466] mb-6">
                تجربه مطالعه این کتاب چگونه بود؟ به دیگر دوست‌داران کتابستان کمک کنید تا انتخاب سنجیده‌تری داشته باشند.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Rating Stars Selector */}
                <div>
                  <label className="text-xs font-bold text-[#35473B] block mb-1.5">امتیاز شما به این کتاب:</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                        id={`rate-star-${star}`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating || reviewRating) >= star
                              ? 'fill-[#D99B26] text-[#D99B26]'
                              : 'text-[#D0D9CE]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#2A3C30] mr-2">
                      ({toPersianDigits(hoverRating || reviewRating)} از ۵ ستاره)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#35473B] block mb-1">نام یا نام مستعار:</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="مثال: مریم صانعی"
                      className="w-full bg-[#F6F8F4] text-[#203126] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:outline-none focus:border-[#415A4C]"
                      id="reviewer-name-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#35473B] block mb-1">حال‌وهوای مطالعه:</label>
                    <select
                      value={reviewMood}
                      onChange={(e) => setReviewMood(e.target.value)}
                      className="w-full bg-[#F6F8F4] text-[#203126] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:outline-none focus:border-[#415A4C] cursor-pointer"
                    >
                      <option value="عمیق و تامل‌برانگیز">عمیق و تأمل‌برانگیز</option>
                      <option value="آرام‌بخش و التیام‌دهنده">آرام‌بخش و التیام‌دهنده</option>
                      <option value="نوستالژیک و شاعرانه">نوستالژیک و شاعرانه</option>
                      <option value="تکان‌دهنده و دگرگون‌کننده">تکان‌دهنده و دگرگون‌کننده</option>
                      <option value="آموزنده و روشنگر">آموزنده و روشنگر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#35473B] block mb-1">متن نقد یا دیدگاه شما:</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="درباره ترجمه، کشش داستان، عمق شخصیت‌ها و احساسی که هنگام خواندن داشتید بنویسید..."
                    className="w-full bg-[#F6F8F4] text-[#203126] text-xs rounded-xl p-3 border border-[#DCE4D9] focus:bg-white focus:outline-none focus:border-[#415A4C]"
                    id="reviewer-comment-input"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#415A4C] hover:bg-[#2F4437] text-white text-xs font-bold rounded-xl transition-all active:scale-98 shadow-xs"
                    id="submit-review-btn"
                  >
                    ثبت دیدگاه و امتیاز
                  </button>
                </div>

              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#1B2921]">
                نظرات ثبت‌شده خوانندگان ({toPersianDigits(bookReviews.length)})
              </h4>

              {bookReviews.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#E3E8E1] text-xs text-[#6F8274]">
                  هنوز نظری برای این کتاب ثبت نشده است. شما اولین دیدگاه را ثبت کنید!
                </div>
              ) : (
                bookReviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="bg-white rounded-2xl p-5 border border-[#E3E8E1] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E8EFE6] text-[#334A3C] font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#1E2E24] block">{rev.userName}</span>
                          <span className="text-[10px] text-[#788C80]">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {rev.moodTag && (
                          <span className="text-[10px] font-medium text-[#466151] bg-[#EFF4ED] px-2 py-0.5 rounded-md">
                            {rev.moodTag}
                          </span>
                        )}
                        <div className="flex items-center gap-0.5 text-xs text-[#D99B26]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-[#D99B26]' : 'text-[#DCE3D9]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#44564B] leading-relaxed">
                      {rev.comment}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#788C80] pt-2 border-t border-[#F2F5F0]">
                      <span>خریدار تاییدشده کتابستان</span>
                      <button className="flex items-center gap-1 hover:text-[#2E4134] transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>مفید بود ({toPersianDigits(rev.likes || 12)})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-[#DEE6DC]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#19261E] font-serif">کتاب‌های مرتبط و پیشنهادی</h3>
            <button
              onClick={() => goToCategory(book.categoryId)}
              className="text-xs font-semibold text-[#405D4C] hover:underline"
            >
              مشاهده بیشتر در این موضوع
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedBooks.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
