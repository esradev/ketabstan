import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  AUTHORS, 
  BOOKS, 
  CATEGORIES, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS, 
  INITIAL_USER_PROFILE, 
  PUBLISHERS 
} from '../data/mockData';
import { 
  Author, 
  Book, 
  CartItem, 
  Category, 
  Order, 
  Publisher, 
  Review, 
  UserProfile, 
  ViewType 
} from '../types';

interface ToastInfo {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  books: Book[];
  authors: Author[];
  publishers: Publisher[];
  categories: Category[];
  reviews: Review[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  userProfile: UserProfile;
  activeView: ViewType;
  selectedBookId: string | null;
  selectedAuthorId: string | null;
  selectedPublisherId: string | null;
  selectedCategoryId: string | null;
  userPanelTab: 'orders' | 'profile' | 'wishlist';
  searchQuery: string;
  isCartOpen: boolean;
  toast: ToastInfo | null;
  
  // Actions
  setActiveView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setUserPanelTab: (tab: 'orders' | 'profile' | 'wishlist') => void;
  
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; shippingFee: number; total: number; itemCount: number };
  
  toggleWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  
  addReview: (review: { bookId: string; userName: string; rating: number; comment: string; moodTag?: string }) => void;
  addOrder: (orderInfo: {
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    total: number;
    shippingAddress: UserProfile;
    paymentMethod: string;
    paymentRefId: string;
  }) => Order;
  
  updateProfile: (updated: Partial<UserProfile>) => void;
  
  // Navigation
  goToBook: (bookId: string) => void;
  goToAuthor: (authorId: string) => void;
  goToPublisher: (publisherId: string) => void;
  goToCategory: (categoryId: string | null) => void;
  goToCheckout: () => void;
  goToUserPanel: (tab?: 'orders' | 'profile' | 'wishlist') => void;
  goToHome: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books] = useState<Book[]>(BOOKS);
  const [authors] = useState<Author[]>(AUTHORS);
  const [publishers] = useState<Publisher[]>(PUBLISHERS);
  const [categories] = useState<Category[]>(CATEGORIES);
  
  // Reviews state with localStorage fallback
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('ketabestan_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ketabestan_cart');
      return saved ? JSON.parse(saved) : [
        { book: BOOKS[0], quantity: 1 },
      ];
    } catch {
      return [{ book: BOOKS[0], quantity: 1 }];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ketabestan_wishlist');
      return saved ? JSON.parse(saved) : ['book-stranger', 'book-status-anxiety'];
    } catch {
      return ['book-stranger', 'book-status-anxiety'];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ketabestan_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ketabestan_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [selectedPublisherId, setSelectedPublisherId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [userPanelTab, setUserPanelTab] = useState<'orders' | 'profile' | 'wishlist'>('orders');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ketabestan_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ketabestan_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('ketabestan_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ketabestan_reviews', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('ketabestan_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  const addToCart = (book: Book, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { book, quantity }];
    });
    showToast(`«${book.title}» به سبد خرید اضافه شد`, 'success');
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
    showToast('کتاب از سبد خرید حذف شد', 'info');
  };

  const updateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.book.id === bookId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Free shipping over 500,000 Tomans
    const shippingFee = subtotal > 500000 || subtotal === 0 ? 0 : 39000;
    const total = subtotal + shippingFee;
    return { subtotal, shippingFee, total, itemCount };
  };

  const toggleWishlist = (bookId: string) => {
    setWishlist((prev) => {
      if (prev.includes(bookId)) {
        showToast('کتاب از نشان‌شده‌ها حذف شد', 'info');
        return prev.filter((id) => id !== bookId);
      } else {
        showToast('کتاب به نشان‌شده‌ها اضافه شد', 'success');
        return [...prev, bookId];
      }
    });
  };

  const isInWishlist = (bookId: string) => wishlist.includes(bookId);

  const addReview = (newReview: {
    bookId: string;
    userName: string;
    rating: number;
    comment: string;
    moodTag?: string;
  }) => {
    const review: Review = {
      id: `rev-${Date.now()}`,
      bookId: newReview.bookId,
      userName: newReview.userName || 'کاربر مهمان',
      rating: newReview.rating,
      date: 'لحظاتی پیش',
      comment: newReview.comment,
      moodTag: newReview.moodTag || 'خواندنی و الهام‌بخش',
      likes: 0,
    };
    setReviews((prev) => [review, ...prev]);
    showToast('دیدگاه و امتیاز شما با موفقیت ثبت شد', 'success');
  };

  const addOrder = (orderInfo: {
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    total: number;
    shippingAddress: UserProfile;
    paymentMethod: string;
    paymentRefId: string;
  }): Order => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const randomPostal = '42' + Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      trackingCode: `KB-${randomCode}`,
      postalTrackingCode: randomPostal,
      date: 'امروز',
      items: orderInfo.items.map((item) => ({
        bookId: item.book.id,
        bookTitle: item.book.title,
        bookCover: item.book.coverImage,
        authorName: item.book.authorName,
        price: item.book.price,
        quantity: item.quantity,
      })),
      subtotal: orderInfo.subtotal,
      shippingFee: orderInfo.shippingFee,
      discountAmount: orderInfo.discountAmount,
      total: orderInfo.total,
      shippingAddress: {
        recipientName: orderInfo.shippingAddress.name,
        phone: orderInfo.shippingAddress.phone,
        province: orderInfo.shippingAddress.province,
        city: orderInfo.shippingAddress.city,
        address: orderInfo.shippingAddress.address,
        postalCode: orderInfo.shippingAddress.postalCode,
      },
      status: 'processing',
      paymentMethod: orderInfo.paymentMethod,
      paymentRefId: orderInfo.paymentRefId,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    showToast('اطلاعات پروفایل با موفقیت به‌روزرسانی شد', 'success');
  };

  const goToBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setActiveView('book-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAuthor = (authorId: string) => {
    setSelectedAuthorId(authorId);
    setActiveView('author-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPublisher = (publisherId: string) => {
    setSelectedPublisherId(publisherId);
    setActiveView('publisher-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setActiveView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToUserPanel = (tab: 'orders' | 'profile' | 'wishlist' = 'orders') => {
    setUserPanelTab(tab);
    setActiveView('user-panel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    setActiveView('home');
    setSelectedBookId(null);
    setSelectedAuthorId(null);
    setSelectedPublisherId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        books,
        authors,
        publishers,
        categories,
        reviews,
        cart,
        wishlist,
        orders,
        userProfile,
        activeView,
        selectedBookId,
        selectedAuthorId,
        selectedPublisherId,
        selectedCategoryId,
        userPanelTab,
        searchQuery,
        isCartOpen,
        toast,
        setActiveView,
        setSearchQuery,
        setIsCartOpen,
        setUserPanelTab,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        toggleWishlist,
        isInWishlist,
        addReview,
        addOrder,
        updateProfile,
        goToBook,
        goToAuthor,
        goToPublisher,
        goToCategory,
        goToCheckout,
        goToUserPanel,
        goToHome,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
