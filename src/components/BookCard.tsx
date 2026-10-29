import React from 'react';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { Book } from '../types';
import { useStore } from '../context/StoreContext';
import { formatPrice, toPersianDigits } from '../utils/formatters';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, compact = false }) => {
  const { 
    goToBook, 
    goToAuthor, 
    goToPublisher, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useStore();

  const isFavorited = isInWishlist(book.id);

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-[#E3E8E1] hover:border-[#CAD5C7] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-[#2E3C33]/5"
      id={`book-card-${book.id}`}
    >
      {/* Top badges & Wishlist */}
      <div className="relative mb-3">
        <div 
          onClick={() => goToBook(book.id)}
          className="cursor-pointer overflow-hidden rounded-xl bg-[#F0F3ED] aspect-[2/3] flex items-center justify-center relative book-spine-effect"
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Quick view icon on hover */}
          <div className="absolute inset-0 bg-[#28382F]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 text-[#25362C] text-xs font-medium px-3 py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-1 shadow-sm">
              <Eye className="w-3.5 h-3.5" />
              <span>مشاهده و خواندن برش</span>
            </span>
          </div>
        </div>

        {/* Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book.id);
          }}
          className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs ${
            isFavorited
              ? 'bg-white text-[#BD5353]'
              : 'bg-white/80 text-[#5F7365] hover:bg-white hover:text-[#BD5353]'
          }`}
          title={isFavorited ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها'}
          id={`wishlist-btn-${book.id}`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#BD5353]' : ''}`} />
        </button>

        {/* Badges */}
        {book.discountPercent && (
          <span className="absolute top-2 right-2 bg-[#A34343] text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-xs">
            {toPersianDigits(book.discountPercent)}٪ تخفیف
          </span>
        )}
      </div>

      {/* Book Metadata */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill */}
          <span className="text-[11px] font-medium text-[#65796D] bg-[#EFF3ED] px-2 py-0.5 rounded-md inline-block mb-1.5">
            {book.categoryName}
          </span>

          {/* Book Title */}
          <h3 
            onClick={() => goToBook(book.id)}
            className="font-bold text-[#1C2821] text-base leading-snug hover:text-[#385343] cursor-pointer line-clamp-1 transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author Name */}
          <p className="text-xs text-[#526659] mt-1">
            نویسنده:{' '}
            <button
              onClick={() => goToAuthor(book.authorId)}
              className="hover:text-[#253D30] hover:underline font-medium focus:outline-none"
            >
              {book.authorName}
            </button>
          </p>

          {/* Publisher Name */}
          <p className="text-[11px] text-[#788C7F] mt-0.5">
            ناشر:{' '}
            <button
              onClick={() => goToPublisher(book.publisherId)}
              className="hover:text-[#364D3F] hover:underline focus:outline-none"
            >
              {book.publisherName}
            </button>
          </p>
        </div>

        {/* Rating and Reviews */}
        <div className="mt-3 pt-2.5 border-t border-[#EDF1EB] flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-[#6F8275]">
            <Star className="w-3.5 h-3.5 fill-[#D99B26] text-[#D99B26]" />
            <span className="font-bold text-[#2A3B31]">{toPersianDigits(book.rating)}</span>
            <span className="text-[10px] text-[#86998C]">({toPersianDigits(book.reviewCount)})</span>
          </div>

          {book.pages && (
            <span className="text-[11px] text-[#86998C]">
              {toPersianDigits(book.pages)} صفحه
            </span>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {book.originalPrice && (
              <span className="text-[11px] text-[#93A59A] line-through">
                {formatPrice(book.originalPrice)}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-[#203328]">
              {formatPrice(book.price)}
            </span>
          </div>

          <button
            onClick={() => addToCart(book)}
            className="p-2.5 bg-[#415A4C] hover:bg-[#304639] text-white rounded-xl transition-all active:scale-95 shadow-xs flex items-center justify-center"
            title="افزودن به سبد خرید"
            id={`add-to-cart-${book.id}`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
