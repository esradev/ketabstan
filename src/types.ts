export type ViewType = 
  | 'home'
  | 'categories'
  | 'book-detail'
  | 'author-detail'
  | 'publisher-detail'
  | 'authors-list'
  | 'publishers-list'
  | 'checkout'
  | 'payment-gateway'
  | 'user-panel'
  | 'wishlist';

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  authorId: string;
  authorName: string;
  publisherId: string;
  publisherName: string;
  translator?: string;
  price: number; // in Tomans
  originalPrice?: number;
  discountPercent?: number;
  coverImage: string;
  categoryId: string;
  categoryName: string;
  rating: number; // 1-5
  reviewCount: number;
  pages: number;
  publishYear: string;
  isbn: string;
  format: string; // e.g. رقعی، شومیز
  description: string;
  excerpt: string; // برشی از کتاب
  quote?: string;
  inStock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  editorPick?: boolean;
  tags: string[];
}

export interface Author {
  id: string;
  name: string;
  portrait: string;
  bio: string;
  birthYear: string;
  nationality: string;
  quote: string;
  keyThemes: string[];
  totalBooks: number;
}

export interface Publisher {
  id: string;
  name: string;
  logo: string;
  foundedYear: string;
  city: string;
  description: string;
  mission: string;
  bookCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  accentColor: string;
  bookCount: number;
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  moodTag?: string;
  likes: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface OrderItem {
  bookId: string;
  bookTitle: string;
  bookCover: string;
  authorName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  trackingCode: string;
  postalTrackingCode: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  shippingAddress: {
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
  };
  status: OrderStatus;
  paymentMethod: string;
  paymentRefId: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  joinDate: string;
}
