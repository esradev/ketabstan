import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  Layers,
  Users,
  Building2,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toPersianDigits, formatPrice } from '../utils/formatters';

export const Navbar: React.FC = () => {
  const {
    books,
    cart,
    wishlist,
    categories,
    activeView,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    goToHome,
    goToCategory,
    goToAuthor,
    goToPublisher,
    goToBook,
    goToUserPanel,
    setActiveView,
    getCartTotal
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { itemCount } = getCartTotal();

  // Search autocomplete results
  const searchResults = searchQuery.trim().length > 1 ? books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.publisherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) : [];

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F9F5]/95 backdrop-blur-md border-b border-[#E3E8E1] transition-all">
      {/* Top Banner with soft soothing accent */}
      <div className="bg-[#415A4C] text-[#F3F6F3] text-xs py-2 px-4 text-center font-normal tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D1DEC9] inline-block" />
        <span>ارسال رایگان سفارش‌های کتاب به سراسر کشور برای خریدهای بالای ۵۰۰ هزار تومان با بسته‌بندی محافظ</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6">
            <button 
              onClick={goToHome}
              className="flex items-center gap-3 group text-right focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#415A4C] flex items-center justify-center text-white shadow-sm group-hover:bg-[#2F4439] transition-colors">
                <BookOpen className="w-5 h-5 text-[#E6EFE6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#1F2C24] tracking-tight font-serif">کتابستان</span>
                <span className="text-[11px] text-[#5C6E62] font-light">فروشگاه مدرن کتاب و اندیشه</span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 mr-4">
              <button
                onClick={goToHome}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeView === 'home' 
                    ? 'text-[#284133] bg-[#E9EFE7]' 
                    : 'text-[#506256] hover:text-[#284133] hover:bg-[#EEF2EC]'
                }`}
                id="nav-home-btn"
              >
                صفحه اصلی
              </button>

              {/* Categories dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  onMouseEnter={() => setIsCategoryMenuOpen(true)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    activeView === 'categories'
                      ? 'text-[#284133] bg-[#E9EFE7]'
                      : 'text-[#506256] hover:text-[#284133] hover:bg-[#EEF2EC]'
                  }`}
                  id="nav-categories-btn"
                >
                  <Layers className="w-4 h-4 text-[#5F7567]" />
                  <span>دسته‌بندی موضوعی</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isCategoryMenuOpen && (
                  <div 
                    onMouseLeave={() => setIsCategoryMenuOpen(false)}
                    className="absolute top-full right-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-[#E3E8E1] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 text-xs font-semibold text-[#6C7E72] border-b border-[#F0F3EE]">
                      موضوعات کتاب‌ها
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          goToCategory(cat.id);
                          setIsCategoryMenuOpen(false);
                        }}
                        className="w-full text-right px-4 py-2.5 text-sm text-[#2E3C33] hover:bg-[#F2F6F0] flex items-center justify-between transition-colors"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-xs text-[#7A8C80] bg-[#EFF3ED] px-2 py-0.5 rounded-full">
                          {toPersianDigits(cat.bookCount)}
                        </span>
                      </button>
                    ))}
                    <div className="p-2 border-t border-[#F0F3EE] mt-1">
                      <button
                        onClick={() => {
                          goToCategory(null);
                          setIsCategoryMenuOpen(false);
                        }}
                        className="w-full text-center text-xs text-[#395344] font-medium py-1.5 hover:bg-[#EDF3EC] rounded-lg transition-colors"
                      >
                        مشاهده همه کتاب‌ها
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Authors Link */}
              <button
                onClick={() => setActiveView('authors-list')}
                className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  activeView === 'authors-list' || activeView === 'author-detail'
                    ? 'text-[#284133] bg-[#E9EFE7]'
                    : 'text-[#506256] hover:text-[#284133] hover:bg-[#EEF2EC]'
                }`}
                id="nav-authors-btn"
              >
                <Users className="w-4 h-4 text-[#5F7567]" />
                <span>نویسندگان</span>
              </button>

              {/* Publishers Link */}
              <button
                onClick={() => setActiveView('publishers-list')}
                className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  activeView === 'publishers-list' || activeView === 'publisher-detail'
                    ? 'text-[#284133] bg-[#E9EFE7]'
                    : 'text-[#506256] hover:text-[#284133] hover:bg-[#EEF2EC]'
                }`}
                id="nav-publishers-btn"
              >
                <Building2 className="w-4 h-4 text-[#5F7567]" />
                <span>ناشران برگزیده</span>
              </button>
            </nav>
          </div>

          {/* Search bar with live suggestions */}
          <div className="flex-1 max-w-md mx-2 relative hidden md:block" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="جستجوی کتاب، نویسنده، ناشر یا موضوع..."
                className="w-full bg-[#EDF1EA] text-[#242E28] placeholder-[#798C80] text-sm rounded-2xl pr-10 pl-4 py-2.5 border border-transparent focus:border-[#4B6856] focus:bg-white focus:outline-none transition-all"
                id="desktop-search-input"
              />
              <Search className="w-4 h-4 text-[#6A7D71] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#7A8C80] hover:text-[#242E28]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E3E8E1] p-2 z-50">
                <div className="px-3 py-1.5 text-xs text-[#7A8C80]">نتایج مرتبط:</div>
                {searchResults.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      goToBook(book.id);
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-right p-2 hover:bg-[#F2F6F0] rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-9 h-12 object-cover rounded shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#1F2C24] truncate">{book.title}</h4>
                      <p className="text-xs text-[#63756A] truncate">
                        {book.authorName} • {book.publisherName}
                      </p>
                    </div>
                    <span className="text-xs text-[#3F5B4D] font-medium whitespace-nowrap">
                      {formatPrice(book.price)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons (User, Wishlist, Cart) */}
          <div className="flex items-center gap-2">
            
            {/* Wishlist Button */}
            <button
              onClick={() => goToUserPanel('wishlist')}
              className="p-2.5 text-[#4D6053] hover:text-[#233328] hover:bg-[#EAEFE8] rounded-2xl relative transition-colors focus:outline-none"
              title="کتاب‌های نشان‌شده"
              id="header-wishlist-btn"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#BD5353] text-[#BD5353]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#BD5353] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {toPersianDigits(wishlist.length)}
                </span>
              )}
            </button>

            {/* Cart Button with counter and price */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#415A4C] hover:bg-[#32473B] text-white rounded-2xl text-sm font-medium transition-all shadow-xs active:scale-98"
              id="header-cart-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">سبد خرید</span>
              {itemCount > 0 && (
                <span className="bg-[#5B7566] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {toPersianDigits(itemCount)}
                </span>
              )}
            </button>

            {/* User Profile Panel Link */}
            <button
              onClick={() => goToUserPanel('orders')}
              className={`p-2.5 rounded-2xl flex items-center gap-2 border transition-all ${
                activeView === 'user-panel'
                  ? 'border-[#415A4C] bg-[#EAF0E8] text-[#2C4135]'
                  : 'border-[#DEE4DC] text-[#4A5D50] hover:bg-[#EFF3ED]'
              }`}
              title="حساب کاربری و پیگیری سفارشات"
              id="header-user-panel-btn"
            >
              <User className="w-5 h-5 text-[#4A5D50]" />
              <span className="text-xs font-medium hidden md:inline">پیگیری و سفارش‌ها</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#46594C] hover:bg-[#ECEFEA] rounded-xl"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی کتاب، نویسنده، ناشر..."
              className="w-full bg-[#EDF1EA] text-[#242E28] placeholder-[#798C80] text-sm rounded-xl pr-9 pl-3 py-2 border border-transparent focus:bg-white focus:outline-none"
              id="mobile-search-input"
            />
            <Search className="w-4 h-4 text-[#6A7D71] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F9F5] border-b border-[#DFE5DD] px-4 py-4 space-y-3 animate-in fade-in duration-200">
          <div className="space-y-1">
            <button
              onClick={() => {
                goToHome();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-3 py-2 rounded-xl text-sm font-medium text-[#2F4136] hover:bg-[#EAF0E8]"
            >
              صفحه نخست
            </button>
            <button
              onClick={() => {
                goToCategory(null);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-3 py-2 rounded-xl text-sm font-medium text-[#2F4136] hover:bg-[#EAF0E8] flex items-center justify-between"
            >
              <span>دسته‌بندی موضوعی</span>
              <Layers className="w-4 h-4 text-[#607466]" />
            </button>
            <button
              onClick={() => {
                setActiveView('authors-list');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-3 py-2 rounded-xl text-sm font-medium text-[#2F4136] hover:bg-[#EAF0E8] flex items-center justify-between"
            >
              <span>نویسندگان</span>
              <Users className="w-4 h-4 text-[#607466]" />
            </button>
            <button
              onClick={() => {
                setActiveView('publishers-list');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-3 py-2 rounded-xl text-sm font-medium text-[#2F4136] hover:bg-[#EAF0E8] flex items-center justify-between"
            >
              <span>ناشران برگزیده</span>
              <Building2 className="w-4 h-4 text-[#607466]" />
            </button>
            <button
              onClick={() => {
                goToUserPanel('orders');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-3 py-2 rounded-xl text-sm font-medium text-[#2F4136] hover:bg-[#EAF0E8] flex items-center justify-between"
            >
              <span>پیگیری سفارشات و پروفایل</span>
              <Clock className="w-4 h-4 text-[#607466]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
