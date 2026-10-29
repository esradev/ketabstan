import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomeView } from './views/HomeView';
import { CategoriesView } from './views/CategoriesView';
import { BookDetailView } from './views/BookDetailView';
import { AuthorView } from './views/AuthorView';
import { PublisherView } from './views/PublisherView';
import { AuthorsListView } from './views/AuthorsListView';
import { PublishersListView } from './views/PublishersListView';
import { CheckoutView } from './views/CheckoutView';
import { PaymentGatewayView } from './views/PaymentGatewayView';
import { UserPanelView } from './views/UserPanelView';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#2C6E44] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#B84E4E] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#355B82] shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-[#EFF8F1] border-[#C2E4CD] text-[#224A30]',
    error: 'bg-[#FDF2F2] border-[#F3CDCD] text-[#5C2323]',
    info: 'bg-[#F0F6FC] border-[#C9DCF1] text-[#1E3A5F]',
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg ${bgStyles[toast.type]}`}>
        {icons[toast.type]}
        <span className="text-xs font-bold leading-normal">{toast.text}</span>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 min-h-[75vh]">
      {activeView === 'home' && <HomeView />}
      {activeView === 'categories' && <CategoriesView />}
      {activeView === 'book-detail' && <BookDetailView />}
      {activeView === 'author-detail' && <AuthorView />}
      {activeView === 'publisher-detail' && <PublisherView />}
      {activeView === 'authors-list' && <AuthorsListView />}
      {activeView === 'publishers-list' && <PublishersListView />}
      {activeView === 'checkout' && <CheckoutView />}
      {activeView === 'payment-gateway' && <PaymentGatewayView />}
      {activeView === 'user-panel' && <UserPanelView />}
    </main>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F9F5] text-[#242E28]">
        <Navbar />
        <MainContent />
        <Footer />
        <CartDrawer />
        <ToastNotification />
      </div>
    </StoreProvider>
  );
}
