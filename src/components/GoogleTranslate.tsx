import React, { useEffect, useState, useRef } from 'react';
import { Languages, ChevronDown, Check, Globe, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export interface LanguageOption {
  code: string;
  label: string;
  shortName: string;
  flag: string;
}

export const POPULAR_LANGUAGES: LanguageOption[] = [
  { code: 'vi', label: 'Tiếng Việt', shortName: 'VN', flag: '🇻🇳' },
  { code: 'id', label: 'Bahasa Indonesia', shortName: 'ID', flag: '🇮🇩' },
  { code: 'ja', label: '日本語 (Tiếng Nhật)', shortName: 'JP', flag: '🇯🇵' },
  { code: 'en', label: 'English (Tiếng Anh)', shortName: 'EN', flag: '🇺🇸' },
  { code: 'zh-CN', label: '中文 (Tiếng Trung)', shortName: 'CN', flag: '🇨🇳' },
  { code: 'ko', label: '한국어 (Tiếng Hàn)', shortName: 'KR', flag: '🇰🇷' },
  { code: 'th', label: 'ไทย (Tiếng Thái)', shortName: 'TH', flag: '🇹🇭' },
  { code: 'tl', label: 'Tagalog (Philippines)', shortName: 'PH', flag: '🇵🇭' },
  { code: 'fr', label: 'Français (Tiếng Pháp)', shortName: 'FR', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch (Tiếng Đức)', shortName: 'DE', flag: '🇩🇪' },
  { code: 'es', label: 'Español (Tây Ban Nha)', shortName: 'ES', flag: '🇪🇸' },
];

interface GoogleTranslateProps {
  className?: string;
  dropdownAlign?: 'left' | 'right';
  showDirectPills?: boolean;
}

export const GoogleTranslate: React.FC<GoogleTranslateProps> = ({ 
  className = '',
  dropdownAlign = 'right',
  showDirectPills = false
}) => {
  const { currentLanguage, setCurrentLanguage } = useApp();
  const [currentLang, setCurrentLang] = useState(currentLanguage || 'vi');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLanguage && currentLanguage !== currentLang) {
      setCurrentLang(currentLanguage);
    }
  }, [currentLanguage]);

  useEffect(() => {
    // 1. Clean up Google banner frames and body offset continuously
    const suppressGoogleBanner = () => {
      if (document.body && document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== '0px') {
        document.documentElement.style.top = '0px';
      }

      // Hide all Google banner frames and top toolbar elements
      const banners = document.querySelectorAll<HTMLElement>(
        '.goog-te-banner-frame, iframe.goog-te-banner-frame, iframe[id^=":"][class*="skiptranslate"], .VIpgJd-ZVi9od-ORHb-OEVmcd, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-y6EkJd'
      );
      banners.forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('height', '0px', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
      });
    };

    // Run on load and periodically
    suppressGoogleBanner();
    const timer = setInterval(suppressGoogleBanner, 400);

    // Watch for DOM changes to suppress banner immediately when injected
    const observer = new MutationObserver(() => {
      suppressGoogleBanner();
    });
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    // 2. Initialize Google Translate Script
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'vi',
            includedLanguages: 'vi,id,ja,en,zh-CN,ko,th,tl,fr,de,es',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    // 3. Read current language from cookie
    const match = document.cookie.match(/googtrans=\/vi\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setCurrentLanguage(langCode);
    setIsOpen(false);

    try {
      localStorage.setItem('wifigo_current_lang', langCode);
      window.dispatchEvent(new CustomEvent('wifigo_language_change', { detail: { lang: langCode } }));
    } catch {
      /* ignore */
    }

    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const baseDomain = parts.length > 2 ? `.${parts.slice(-2).join('.')}` : hostname;

    if (langCode === 'vi') {
      // Return to original Vietnamese
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
      if (baseDomain !== hostname) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${baseDomain}; path=/;`;
      }

      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = 'vi';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      // Reload to ensure clean restore of original text
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return;
    }

    // Set cookie for target language
    const cookieVal = `/vi/${langCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; domain=${hostname}; path=/;`;
    if (baseDomain !== hostname) {
      document.cookie = `googtrans=${cookieVal}; domain=${baseDomain}; path=/;`;
    }

    // Direct in-page translation via combo event
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      if (typeof (combo as any).onchange === 'function') {
        (combo as any).onchange();
      }
    } else {
      window.location.reload();
    }
  };

  const activeLangObj = POPULAR_LANGUAGES.find(l => l.code === currentLang) || {
    code: currentLang,
    label: currentLang.toUpperCase(),
    shortName: currentLang.toUpperCase(),
    flag: '🌐'
  };

  const directQuickLangs = POPULAR_LANGUAGES.slice(0, 4); // vi, id, ja, en

  return (
    <div ref={containerRef} className={`relative inline-flex items-center notranslate ${className}`}>
      {/* Invisible container for Google Translate to mount .goog-te-combo without rendering visible UI */}
      <div 
        id="google_translate_element" 
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Optional Direct Quick-Switch Pills */}
      {showDirectPills && (
        <div className="flex items-center gap-1 mr-1">
          {directQuickLangs.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={`Dịch trực tiếp sang ${lang.label}`}
              >
                <span>{lang.flag}</span>
                <span className="text-[11px]">{lang.shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Clean Language Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-2xs group shrink-0"
        title="Chọn ngôn ngữ dịch trực tiếp"
        aria-label="Chọn ngôn ngữ"
      >
        <span className="text-sm leading-none">{activeLangObj.flag}</span>
        <span className="font-bold text-slate-900">{activeLangObj.shortName}</span>
        <span className="hidden xl:inline text-slate-600 font-medium">({activeLangObj.label.split(' ')[0]})</span>
        <Languages className="w-3.5 h-3.5 text-cyan-600 shrink-0 ml-0.5 group-hover:scale-110 transition-transform" />
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute ${dropdownAlign === 'left' ? 'left-0' : 'right-0'} top-full mt-2 z-50 w-64 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header */}
          <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-600" />
              <span>Dịch trực tiếp trang web</span>
            </span>
            <span className="text-[10px] bg-cyan-50 text-cyan-700 font-semibold px-1.5 py-0.5 rounded border border-cyan-200/60">
              Không thanh trên
            </span>
          </div>

          {/* Quick Click Row: VN, ID, JP, EN */}
          <div className="mb-2 pb-2 border-b border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Ngôn ngữ phổ biến:
            </div>
            <div className="grid grid-cols-2 gap-1 px-1">
              {directQuickLangs.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={`quick-${lang.code}`}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="truncate">{lang.shortName} - {lang.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Language List */}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
            Tất cả ngôn ngữ:
          </div>
          <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
            {POPULAR_LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-50 text-cyan-900 font-bold border border-cyan-200/60'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0">{lang.flag}</span>
                    <span className="truncate">{lang.label}</span>
                  </div>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{lang.shortName}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-2 pt-2 border-t border-slate-100 px-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-500" />
            <span>Tự động dịch tức thì &bull; Ẩn thanh Google</span>
          </div>
        </div>
      )}
    </div>
  );
};

