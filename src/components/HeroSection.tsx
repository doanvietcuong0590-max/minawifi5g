import React from 'react';
import { useApp } from '../context/AppContext';
import { InlineText } from './InlineText';
import { 
  Wifi, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Award,
  Edit3
} from 'lucide-react';

interface HeroSectionProps {
  onSelectCountry?: (country: string) => void;
  onScrollToCatalog?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onScrollToCatalog 
}) => {
  const { 
    siteSettings, 
    updateSiteSettings, 
    setIsOrderTrackingOpen, 
    isAdmin, 
    isLiveEditMode, 
    showToast 
  } = useApp();

  const handleEditHeroImage = () => {
    const url = prompt('Dán link URL hình ảnh banner Hero mới:', siteSettings.heroBannerImage || '');
    if (url !== null && url.trim()) {
      updateSiteSettings({ heroBannerImage: url.trim() });
      showToast('Đã lưu', 'Cập nhật ảnh banner Hero thành công', 'success');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm shadow-cyan-900/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <InlineText textKey="heroBadge" defaultValue={siteSettings.heroBadge} label="Huy hiệu Hero" />
            </div>

            {/* Main Heading with live in-place editable texts */}
            <div className="w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                <InlineText textKey="heroTitle" defaultValue={siteSettings.heroTitle} label="Tiêu đề chính" as="span" />{' '}
                <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  <InlineText textKey="heroHighlight" defaultValue={siteSettings.heroHighlight} label="Tiêu đề nổi bật" as="span" />
                </span>
              </h1>
            </div>

            {/* Subtitle with live in-place editable text */}
            <div className="mt-5 w-full">
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                <InlineText textKey="heroSubtitle" defaultValue={siteSettings.heroSubtitle} multiline={true} label="Mô tả Hero" as="span" />
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onScrollToCatalog}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <InlineText textKey="hero_btn_pricing" defaultValue="Xem Bảng Giá Cước Hàng Tháng" label="Nút xem giá" />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsOrderTrackingOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <InlineText textKey="hero_btn_tracking" defaultValue="Tra Cứu Đơn Hàng" label="Nút tra đơn" />
              </button>
            </div>

          </div>

          {/* Right Column: Visual Product Showcase / Hero Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card with Hero Banner Image */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-800/90 shadow-2xl p-2 group/heroimg">
                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden">
                  <img
                    src={siteSettings.heroBannerImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'}
                    alt="Sim du lịch & Pocket WiFi"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating badge inside image */}
                  <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>
                      <InlineText textKey="hero_img_badge" defaultValue="Mạng 5G Nhật Bản 24/7" label="Huy hiệu ảnh" />
                    </span>
                  </div>

                  {/* Direct Edit button on Hero image */}
                  {isAdmin && isLiveEditMode && (
                    <button
                      type="button"
                      onClick={handleEditHeroImage}
                      className="absolute top-4 right-4 bg-black/70 hover:bg-black text-cyan-300 border border-cyan-400/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Đổi ảnh banner</span>
                    </button>
                  )}

                  {/* Device highlights at bottom of image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                          <Wifi className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            <InlineText textKey="hero_card_wifi_title" defaultValue="Pocket WiFi 4G/5G Không Giới Hạn" label="Tên WiFi" />
                          </div>
                          <div className="text-[11px] text-slate-400">
                            <InlineText textKey="hero_card_wifi_sub" defaultValue="Kết nối cùng lúc 5 máy • Pin 16 tiếng" label="Mô tả WiFi" />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-cyan-400">
                          <InlineText textKey="hero_card_wifi_price" defaultValue="Từ ¥3,600/tháng" label="Giá WiFi" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second mini card: eSIM QR Fast delivery */}
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <InlineText textKey="hero_card_sim_title" defaultValue="SIM & eSIM Data Tốc Độ Cao" label="Tên gói Sim" />
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-semibold">Hot</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <InlineText textKey="hero_card_sim_sub" defaultValue="Cước trọn gói hàng tháng ổn định" label="Mô tả gói Sim" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">
                      <InlineText textKey="hero_card_sim_price" defaultValue="Chỉ từ ¥1,500/tháng" label="Giá gói Sim" />
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Bottom Trust Factors Bar */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                <InlineText textKey="hero_trust_1_title" defaultValue="Cài đặt trong 5 phút" label="Cam kết 1" />
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                <InlineText textKey="hero_trust_1_desc" defaultValue="eSIM gửi qua Email ngay lập tức, quét mã là lướt mạng." label="Mô tả cam kết 1" />
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                <InlineText textKey="hero_trust_2_title" defaultValue="Giao tận nơi nhanh chóng" label="Cam kết 2" />
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                <InlineText textKey="hero_trust_2_desc" defaultValue="Giao nhận tại Nhật Bản (Yamato / Sagawa) và Việt Nam." label="Mô tả cam kết 2" />
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                <InlineText textKey="hero_trust_3_title" defaultValue="Cước trọn gói minh bạch" label="Cam kết 3" />
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                <InlineText textKey="hero_trust_3_desc" defaultValue="Không phí ẩn, không hợp đồng ràng buộc phức tạp." label="Mô tả cam kết 3" />
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                <InlineText textKey="hero_trust_4_title" defaultValue="Hỗ trợ tiếng Việt 24/7" label="Cam kết 4" />
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                <InlineText textKey="hero_trust_4_desc" defaultValue="Đội ngũ kỹ thuật viên người Việt đồng hành nhiệt tình." label="Mô tả cam kết 4" />
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

