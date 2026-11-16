import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { CompareSection } from './components/CompareSection';
import { FAQSection } from './components/FAQSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLiveBar } from './components/admin/AdminLiveBar';
import { DirectProductModal } from './components/admin/DirectProductModal';
import { ToastContainer } from './components/Toast';
import { MessageCircle, Phone, PackageSearch, ArrowUp } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { siteSettings, setIsOrderTrackingOpen } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for back-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Admin In-Place Live Edit Bar (When Admin is logged in) */}
      <AdminLiveBar />

      {/* Navigation Header */}
      <Navbar
        onScrollToSection={(sec) => {
          const el = document.getElementById(sec);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section */}
      <HeroSection
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Main Product Catalog */}
      <ProductCatalog />

      {/* Comparison Guide: eSIM vs Physical SIM vs Pocket WiFi */}
      <CompareSection
        onSelectCategory={() => {
          scrollToCatalog();
        }}
      />

      {/* Customer Testimonials & Reviews */}
      <ReviewsSection />

      {/* FAQ & Setup Instructions */}
      <FAQSection />

      {/* Footer */}
      <Footer onScrollToCatalog={scrollToCatalog} />

      {/* Modals */}
      <OrderModal />
      <OrderTrackingModal />
      <AdminLoginModal />
      <AdminDashboard />
      <DirectProductModal />

      {/* Mobile Floating Actions: Ergonomic and compact */}
      <div className="sm:hidden">
        {/* Back to top (bottom-left) */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-4 left-4 z-40 w-10 h-10 rounded-full bg-white text-slate-700 shadow-xl border border-slate-200 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            title="Lên đầu trang"
            aria-label="Lên đầu trang"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Floating WhatsApp Quick Chat (bottom-right) */}
        {(() => {
          const rawWa = siteSettings.whatsappPhone || siteSettings.zaloPhone || '818088889999';
          let cleanWa = rawWa.replace(/[^0-9]/g, '');
          if (cleanWa.startsWith('0')) {
            cleanWa = '81' + cleanWa.slice(1);
          }
          return (
            <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
              <a
                href={`https://wa.me/${cleanWa}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 active:scale-95 transition-transform"
                title="Chat WhatsApp hỗ trợ"
                aria-label="Chat WhatsApp hỗ trợ"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.974.55 1.777.839 2.796.839 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.765-5.768-5.765zm3.377 8.219c-.145.407-.743.766-1.025.799-.281.033-.615.147-2.023-.424-1.693-.687-2.775-2.434-2.859-2.547-.085-.114-.688-.916-.688-1.747 0-.832.435-1.241.591-1.411.156-.169.34-.212.453-.212.114 0 .227.002.327.007.106.005.247-.04.387.296.145.348.497 1.214.54 1.302.043.088.072.19.014.305-.058.115-.087.186-.173.286-.086.1-.18.224-.257.301-.086.086-.176.18-.076.352.1.171.444.733.953 1.186.655.584 1.207.765 1.378.851.171.086.271.072.372-.043.101-.115.432-.503.547-.676.115-.172.23-.143.388-.086.158.058 1.002.472 1.174.558.173.086.288.129.331.201.043.072.043.418-.102.825zm-3.377-10.391c-4.407 0-7.992 3.585-7.992 7.991 0 1.408.369 2.73 1.012 3.876l-1.051 3.844 3.939-1.033c1.104.602 2.373.938 3.722.938 4.406 0 7.99-3.584 7.99-7.99 0-4.407-3.584-7.992-7.99-7.992zm0 14.558c-1.218 0-2.358-.337-3.337-.923l-.239-.143-2.333.612.623-2.274-.156-.249c-.645-1.026-.987-2.213-.987-3.447 0-3.616 2.942-6.558 6.559-6.558 3.618 0 6.559 2.942 6.559 6.558 0 3.617-2.941 6.558-6.559 6.558z"/>
                </svg>
              </a>
            </div>
          );
        })()}
      </div>

      {/* Desktop Floating Action Buttons */}
      <div className="hidden sm:flex fixed bottom-6 right-6 z-40 flex-col gap-3 items-end">
        {/* Back to top */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
            title="Lên đầu trang"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Floating Quick Order Tracking */}
        <button
          onClick={() => setIsOrderTrackingOpen(true)}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/30 transition-transform hover:scale-105 cursor-pointer"
          title="Tra cứu đơn hàng"
        >
          <PackageSearch className="w-5 h-5 text-cyan-400" />
          <span className="absolute right-14 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Tra cứu đơn hàng
          </span>
        </button>

        {/* Floating WhatsApp Chat */}
        {(() => {
          const rawWa = siteSettings.whatsappPhone || siteSettings.zaloPhone || '818088889999';
          let cleanWa = rawWa.replace(/[^0-9]/g, '');
          if (cleanWa.startsWith('0')) {
            cleanWa = '81' + cleanWa.slice(1);
          }
          return (
            <a
              href={`https://wa.me/${cleanWa}`}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-[#25D366]/30 transition-transform hover:scale-105"
              title="Chat WhatsApp hỗ trợ"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.974.55 1.777.839 2.796.839 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.765-5.768-5.765zm3.377 8.219c-.145.407-.743.766-1.025.799-.281.033-.615.147-2.023-.424-1.693-.687-2.775-2.434-2.859-2.547-.085-.114-.688-.916-.688-1.747 0-.832.435-1.241.591-1.411.156-.169.34-.212.453-.212.114 0 .227.002.327.007.106.005.247-.04.387.296.145.348.497 1.214.54 1.302.043.088.072.19.014.305-.058.115-.087.186-.173.286-.086.1-.18.224-.257.301-.086.086-.176.18-.076.352.1.171.444.733.953 1.186.655.584 1.207.765 1.378.851.171.086.271.072.372-.043.101-.115.432-.503.547-.676.115-.172.23-.143.388-.086.158.058 1.002.472 1.174.558.173.086.288.129.331.201.043.072.043.418-.102.825zm-3.377-10.391c-4.407 0-7.992 3.585-7.992 7.991 0 1.408.369 2.73 1.012 3.876l-1.051 3.844 3.939-1.033c1.104.602 2.373.938 3.722.938 4.406 0 7.99-3.584 7.99-7.99 0-4.407-3.584-7.992-7.99-7.992zm0 14.558c-1.218 0-2.358-.337-3.337-.923l-.239-.143-2.333.612.623-2.274-.156-.249c-.645-1.026-.987-2.213-.987-3.447 0-3.616 2.942-6.558 6.559-6.558 3.618 0 6.559 2.942 6.559 6.558 0 3.617-2.941 6.558-6.559 6.558z"/>
              </svg>
              <span className="absolute right-14 whitespace-nowrap bg-[#25D366] text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                Hỗ trợ WhatsApp 24/7
              </span>
            </a>
          );
        })()}

        {/* Floating Hotline Call */}
        <a
          href={`tel:${siteSettings.hotline.replace(/\s+/g, '')}`}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-transform hover:scale-105"
          title="Gọi Hotline tư vấn"
        >
          <Phone className="w-5 h-5" />
          <span className="absolute right-14 whitespace-nowrap bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Hotline: {siteSettings.hotline}
          </span>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
