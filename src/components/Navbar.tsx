import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleTranslate, POPULAR_LANGUAGES } from './GoogleTranslate';
import { InlineText } from './InlineText';
import { 
  Wifi, 
  Search, 
  ShieldCheck, 
  PhoneCall, 
  Menu, 
  X, 
  Globe2, 
  LogIn,
  SlidersHorizontal,
  PackageSearch,
  Edit3
} from 'lucide-react';

interface NavbarProps {
  onSelectCategory?: (category: string) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectCategory, onScrollToSection }) => {
  const { 
    siteSettings, 
    updateSiteSettings,
    isAdmin, 
    isLiveEditMode,
    setIsAdminLoginOpen, 
    setIsAdminDashboardOpen,
    setIsOrderTrackingOpen,
    setTrackingQuery,
    showToast,
    currentLanguage,
    setCurrentLanguage
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchInput.trim()) {
      setTrackingQuery(quickSearchInput.trim());
      setIsOrderTrackingOpen(true);
      setQuickSearchInput('');
    } else {
      setIsOrderTrackingOpen(true);
    }
  };

  const handleNavClick = (sectionId: string, categoryFilter?: string) => {
    setMobileMenuOpen(false);
    if (categoryFilter && onSelectCategory) {
      onSelectCategory(categoryFilter);
    }
    if (sectionId && onScrollToSection) {
      onScrollToSection(sectionId);
    } else if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Direct In-Place Edit Handlers for Header
  const handleEditAnnouncement = () => {
    const val = prompt('Chỉnh sửa nội dung thanh thông báo trên cùng:', siteSettings.announcementText);
    if (val !== null && val.trim()) {
      updateSiteSettings({ announcementText: val.trim() });
      showToast('Đã lưu', 'Cập nhật thanh thông báo thành công', 'success');
    }
  };

  const handleEditBrand = () => {
    const name = prompt('Nhập tên website / thương hiệu:', siteSettings.siteName);
    if (name !== null && name.trim()) {
      const tagline = prompt('Nhập câu slogan phụ:', siteSettings.siteTagline) || siteSettings.siteTagline;
      updateSiteSettings({ siteName: name.trim(), siteTagline: tagline.trim() });
      showToast('Đã lưu', 'Cập nhật tên thương hiệu thành công', 'success');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      {siteSettings.announcementActive && (
        <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 text-white text-xs py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2 relative">
          <span className="inline-flex items-center justify-center bg-white/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            Hot
          </span>
          <span className="truncate max-w-4xl">
            <InlineText textKey="announcementText" defaultValue={siteSettings.announcementText} label="Thanh thông báo" />
          </span>
          <button
            onClick={() => handleNavClick('products-section')}
            className="underline hover:text-cyan-100 font-semibold cursor-pointer shrink-0 ml-1 text-xs"
          >
            <InlineText textKey="announcementLinkText" defaultValue={siteSettings.announcementLinkText || 'Xem ngay'} label="Nút xem thêm" /> &rarr;
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink min-w-0 group">
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0"
            >
              {siteSettings.logoUrl ? (
                <img 
                  src={siteSettings.logoUrl} 
                  alt={siteSettings.siteName} 
                  className="h-9 sm:h-10 w-auto object-contain rounded-lg max-w-[130px] sm:max-w-[160px] shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <Wifi className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                </div>
              )}
              
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base sm:text-xl lg:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-cyan-900 to-blue-700 bg-clip-text text-transparent group-hover:text-cyan-700 transition-colors truncate">
                  <InlineText textKey="siteName" defaultValue={siteSettings.siteName} label="Tên thương hiệu" />
                </span>
                <span className="hidden sm:block text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5 line-clamp-1 max-w-[180px] sm:max-w-xs">
                  <InlineText textKey="siteTagline" defaultValue={siteSettings.siteTagline} label="Slogan thương hiệu" />
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('products-section')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <InlineText textKey="nav_pricing" defaultValue="Bảng Giá Cước" label="Menu Giá" />
            </button>
            <button
              onClick={() => handleNavClick('compare-section')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <InlineText textKey="nav_compare" defaultValue="So Sánh Sim vs WiFi" label="Menu So sánh" />
            </button>
            <button
              onClick={() => handleNavClick('faq-section')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <InlineText textKey="nav_guide" defaultValue="Hướng Dẫn Đăng Ký" label="Menu Hướng dẫn" />
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* GOOGLE TRANSLATE MULTI-LANGUAGE ELEMENT */}
            <GoogleTranslate />

            {/* Order Tracking Lookup Button - Desktop & Tablet */}
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200 transition-all cursor-pointer shadow-xs"
              title="Tra cứu đơn hàng thời gian thực"
            >
              <PackageSearch className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>
                <InlineText textKey="nav_track_btn" defaultValue="Tra cứu đơn" label="Nút tra đơn" />
              </span>
            </button>

            {/* Hotline Quick Call */}
            <a
              href={`tel:${siteSettings.hotline.replace(/\s+/g, '')}`}
              className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">
                  <InlineText textKey="nav_hotline_label" defaultValue="Hotline 24/7" label="Nhãn hotline" />
                </div>
                <div className="font-bold text-slate-800 text-xs leading-tight">{siteSettings.hotline}</div>
              </div>
            </a>

            {/* Admin Management Button */}
            {isAdmin ? (
              <button
                onClick={() => setIsAdminDashboardOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-md shadow-slate-900/10 transition-all cursor-pointer border border-slate-700"
              >
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span className="hidden md:inline">Bảng Quản Trị</span>
                <span className="md:hidden">Quản trị</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                title="Dành cho Quản trị viên"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Quản Trị</span>
              </button>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          
          {/* Quick Tracking Search in Mobile Drawer */}
          <form onSubmit={handleQuickLookup} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Nhập mã đơn (WF-...) hoặc SĐT"
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 shrink-0 cursor-pointer"
            >
              <InlineText textKey="mobile_search_btn" defaultValue="Tra cứu" label="Nút tra cứu mobile" />
            </button>
          </form>

          {/* Mobile Language Selector */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-bold text-slate-700">
                  <InlineText textKey="mobile_lang_label" defaultValue="Ngôn ngữ dịch trang web:" label="Nhãn dịch" />
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full">
                {(POPULAR_LANGUAGES.find(l => l.code === currentLanguage)?.shortName || currentLanguage).toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-1.5">
              {POPULAR_LANGUAGES.slice(0, 6).map((lang) => {
                const isActive = currentLanguage === lang.code;
                return (
                  <button
                    key={`mob-${lang.code}`}
                    type="button"
                    onClick={() => {
                      setCurrentLanguage(lang.code);
                      try {
                        localStorage.setItem('wifigo_current_lang', lang.code);
                        window.dispatchEvent(new CustomEvent('wifigo_language_change', { detail: { lang: lang.code } }));
                        const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
                        if (combo) {
                          combo.value = lang.code;
                          combo.dispatchEvent(new Event('change'));
                        }
                      } catch {
                        /* ignore */
                      }
                    }}
                    className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-[11px] font-semibold">{lang.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('products-section')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
            >
              <span>
                <InlineText textKey="mobile_menu_pricing" defaultValue="Bảng Giá Cước Sim & Pocket WiFi" label="Menu cước mobile" />
              </span>
              <Globe2 className="w-4 h-4 text-cyan-600" />
            </button>
            <button
              onClick={() => handleNavClick('compare-section')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <InlineText textKey="mobile_menu_compare" defaultValue="So sánh Sim vs WiFi" label="Menu so sánh mobile" />
            </button>
            <button
              onClick={() => handleNavClick('faq-section')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <InlineText textKey="mobile_menu_faq" defaultValue="Hướng dẫn & Câu hỏi thường gặp" label="Menu FAQ mobile" />
            </button>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${siteSettings.hotline.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-sm border border-emerald-200"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>
                <InlineText textKey="mobile_hotline_text" defaultValue={`Hotline Tư Vấn: ${siteSettings.hotline}`} label="Nút hotline mobile" />
              </span>
            </a>

            {!isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminLoginOpen(true);
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <InlineText textKey="mobile_admin_login" defaultValue="Đăng nhập quản trị viên" label="Nút admin login mobile" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
