import React from 'react';
import { InlineText } from './InlineText';
import { Zap, Smartphone, Wifi, Check, X, Users, BatteryCharging, QrCode } from 'lucide-react';

export const CompareSection: React.FC<{ onSelectCategory: (cat?: string) => void }> = ({ onSelectCategory }) => {
  return (
    <section id="compare-section" className="py-16 sm:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <InlineText textKey="compare_badge" defaultValue="Tư vấn chọn giải pháp" label="Huy hiệu so sánh" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            <InlineText textKey="compare_title" defaultValue="Nên Chọn eSIM, SIM Vật Lý Hay Pocket WiFi?" label="Tiêu đề so sánh" as="span" />
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            <InlineText textKey="compare_sub" defaultValue="Mỗi chuyến đi có nhu cầu khác nhau. Bảng so sánh trực quan dưới đây giúp bạn lựa chọn phương án tiện lợi và tiết kiệm nhất!" multiline={true} label="Mô tả so sánh" as="span" />
          </p>
        </div>

        {/* 3 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: eSIM */}
          <div className="rounded-3xl border-2 border-amber-400 bg-amber-50/20 p-6 sm:p-8 flex flex-col justify-between relative shadow-lg shadow-amber-500/5">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              <InlineText textKey="compare_c1_badge" defaultValue="Tiện Lợi Số 1 • Nhận Ngay" label="Huy hiệu Card 1" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                <InlineText textKey="compare_c1_title" defaultValue="eSIM Quét Mã QR" label="Tên giải pháp 1" as="span" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                <InlineText textKey="compare_c1_desc" defaultValue="Mã QR gửi qua WhatsApp/Email trong 3 phút, không cần chờ ship." label="Mô tả Card 1" as="span" />
              </p>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c1_f1" defaultValue="Giữ nguyên SIM Việt Nam để nhận mã OTP ngân hàng, cuộc gọi quan trọng" label="Ưu điểm 1 (eSIM)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c1_f2" defaultValue="Không cần tháo lắp khay sim, không sợ rơi mất sim gốc" label="Ưu điểm 2 (eSIM)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c1_f3" defaultValue="Cài đặt trước tại Việt Nam, máy bay hạ cánh bật lên là dùng" label="Ưu điểm 3 (eSIM)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2 text-slate-400">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c1_limit" defaultValue="Yêu cầu máy hỗ trợ eSIM (iPhone XS trở lên, Samsung S20+...)" label="Lưu ý (eSIM)" as="span" />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-amber-200">
              <div className="text-xs text-slate-500 mb-2">
                <InlineText textKey="compare_c1_suit" defaultValue="Phù hợp: Du lịch 1-2 người, bay gấp trong ngày" label="Đối tượng phù hợp 1" as="span" />
              </div>
              <button
                onClick={() => onSelectCategory('esim')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <InlineText textKey="compare_c1_btn" defaultValue="Xem các gói eSIM" label="Nút Card 1" />
              </button>
            </div>
          </div>

          {/* Card 2: SIM Vật Lý */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                <InlineText textKey="compare_c2_title" defaultValue="SIM Vật Lý Quốc Tế" label="Tên giải pháp 2" as="span" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                <InlineText textKey="compare_c2_desc" defaultValue="Cắm sim vào máy là tự động nhận sóng 4G/5G ngay lập tức." label="Mô tả Card 2" as="span" />
              </p>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c2_f1" defaultValue="Tương thích 100% mọi dòng điện thoại (kể cả máy đời cũ, máy khoá mạng đã unlock)" label="Ưu điểm 1 (SIM)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c2_f2" defaultValue="Tặng que chọc sim và khay bảo quản sim mini cao cấp" label="Ưu điểm 2 (SIM)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c2_f3" defaultValue="Có thể tháo ra chia sẻ hoặc chuyển qua máy khác linh hoạt" label="Ưu điểm 3 (SIM)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c2_limit" defaultValue="Cần đặt trước 1-2 ngày để giao hàng tận nơi hoặc nhận tại sân bay" label="Lưu ý (SIM)" as="span" />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100">
              <div className="text-xs text-slate-500 mb-2">
                <InlineText textKey="compare_c2_suit" defaultValue="Phù hợp: Mọi đối tượng, người lớn tuổi, du lịch tự túc" label="Đối tượng phù hợp 2" as="span" />
              </div>
              <button
                onClick={() => onSelectCategory('sim')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <InlineText textKey="compare_c2_btn" defaultValue="Xem các gói SIM Vật Lý" label="Nút Card 2" />
              </button>
            </div>
          </div>

          {/* Card 3: Pocket WiFi */}
          <div className="rounded-3xl border-2 border-blue-600 bg-blue-50/20 p-6 sm:p-8 flex flex-col justify-between relative shadow-lg shadow-blue-500/5">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              <InlineText textKey="compare_c3_badge" defaultValue="Tiết Kiệm Nhóm • Không Giới Hạn" label="Huy hiệu Card 3" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-5">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                <InlineText textKey="compare_c3_title" defaultValue="Thuê Pocket WiFi" label="Tên giải pháp 3" as="span" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                <InlineText textKey="compare_c3_desc" defaultValue="1 cục phát wifi bỏ túi chia sẻ cho 5 thiết bị (điện thoại, laptop, ipad)." label="Mô tả Card 3" as="span" />
              </p>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c3_f1" defaultValue="Chia sẻ tới 5 thiết bị: Cả gia đình hoặc nhóm bạn chỉ cần 1 thiết bị" label="Ưu điểm 1 (WiFi)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c3_f2" defaultValue="Không hao pin điện thoại do không cần bật điểm phát Hotspot" label="Ưu điểm 2 (WiFi)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c3_f3" defaultValue="Dung lượng 4G/5G không giới hạn, lướt web, họp video thoải mái" label="Ưu điểm 3 (WiFi)" as="span" />
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <InlineText textKey="compare_c3_f4" defaultValue="Pin khủng 16 tiếng, tặng kèm túi chống sốc và củ sạc đa năng" label="Ưu điểm 4 (WiFi)" as="span" />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-blue-200">
              <div className="text-xs text-slate-500 mb-2">
                <InlineText textKey="compare_c3_suit" defaultValue="Phù hợp: Nhóm 2-5 người, gia đình, công tác làm việc" label="Đối tượng phù hợp 3" as="span" />
              </div>
              <button
                onClick={() => onSelectCategory('pocket_wifi')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <InlineText textKey="compare_c3_btn" defaultValue="Xem dịch vụ Pocket WiFi" label="Nút Card 3" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
