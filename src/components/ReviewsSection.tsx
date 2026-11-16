import React from 'react';
import { InlineText } from './InlineText';
import { Star, CheckCircle, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Đặng Tuấn Anh',
    trip: 'Du lịch Tokyo & Kyoto (7 ngày)',
    package: 'eSIM Nhật Bản 5G Docomo',
    comment: 'eSIM nhận mã sau 2 phút, sang đến sân bay Narita vừa tắt chế độ máy bay là có 5G vù vù ngay. Đi tàu Shinkansen xem Youtube full HD không hề giật lag. Rất hài lòng!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    name: 'Gia đình chị Thanh Mai',
    trip: 'Du lịch Seoul & Đảo Nami (5 ngày)',
    package: 'Thuê Pocket WiFi Nhật - Hàn',
    comment: 'Gia đình mình 4 người thuê 1 cục Pocket WiFi dùng chung cả ngày không hết pin. Cục phát nhỏ gọn bỏ túi xách, con gái lướt Tiktok, bố mẹ xem bản đồ dẫn đường cực kỳ thuận tiện.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    name: 'Trần Minh Quang',
    trip: 'Công tác Châu Âu (Pháp, Ý, Đức)',
    package: 'SIM Du Lịch Châu Âu 33 Nước',
    comment: 'Sim qua mỗi biên giới tự động chuyển sang nhà mạng nội địa Vodafone rất mượt. Đặc biệt nghe gọi trong khối EU miễn phí nên gọi điện đối tác thoải mái. Năm sau đi công tác chắc chắn sẽ ủng hộ tiếp.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  }
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <InlineText textKey="review_badge" defaultValue="Đánh giá từ khách hàng" label="Huy hiệu đánh giá" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            <InlineText textKey="review_title" defaultValue="Hơn 50,000+ Khách Hàng Đồng Hành Mỗi Năm" label="Tiêu đề đánh giá" as="span" />
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            <InlineText textKey="review_sub" defaultValue="Xem trải nghiệm thực tế từ các du khách, travel blogger và doanh nhân Việt Nam" multiline={true} label="Mô tả đánh giá" as="span" />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(rev.stars)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;<InlineText textKey={`review_comment_${i}`} defaultValue={rev.comment} multiline={true} label={`Nhận xét ${i+1}`} as="span" />&rdquo;
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    <InlineText textKey={`review_name_${i}`} defaultValue={rev.name} label={`Tên khách ${i+1}`} as="span" />
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <InlineText textKey={`review_trip_${i}`} defaultValue={rev.trip} label={`Chuyến đi ${i+1}`} as="span" />
                  </div>
                  <div className="text-[10px] text-cyan-700 font-semibold">
                    <InlineText textKey={`review_pkg_${i}`} defaultValue={rev.package} label={`Gói ${i+1}`} as="span" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
