import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InlineText } from './InlineText';

const FAQS = [
  {
    q: 'eSIM là gì và làm thế nào để cài đặt trên điện thoại?',
    a: 'eSIM là sim điện tử được tích hợp sẵn trong phần cứng điện thoại. Khi bạn đặt mua, hệ thống sẽ gửi cho bạn 1 mã QR qua Email & WhatsApp. Bạn chỉ cần vào Cài đặt (Settings) -> Di động (Cellular) -> Thêm eSIM (Add eSIM) -> Quét mã QR là xong! Quá trình mất chưa đầy 2 phút.'
  },
  {
    q: 'Khi dùng eSIM du lịch, tôi có bị mất số điện thoại và tin nhắn WhatsApp, ngân hàng ở Việt Nam không?',
    a: 'Hoàn toàn KHÔNG! Bạn vẫn giữ sim Việt Nam hoạt động song song để nhận tin nhắn mã OTP ngân hàng, cuộc gọi quan trọng. eSIM quốc tế chỉ đảm nhận việc phát dữ liệu 4G/5G khi bạn ra nước ngoài.'
  },
  {
    q: 'Thuê Pocket WiFi nhận và trả máy như thế nào?',
    a: 'Bạn có thể chọn nhận máy trước 1-2 ngày tại nhà miễn phí giao hàng toàn quốc, hoặc nhận trực tiếp tại quầy của chúng tôi ở Sân bay Quốc tế Nội Bài (T2) / Sân bay Tân Sơn Nhất. Khi kết thúc chuyến đi trở về Việt Nam, bạn chỉ cần gửi trả lại tại quầy sân bay hoặc gửi bưu điện hoàn trả.'
  },
  {
    q: 'Nếu sang nước ngoài sim không có sóng hoặc không vào được mạng thì sao?',
    a: 'Chúng tôi có đội ngũ kỹ sư người Việt trực WhatsApp & Hotline 24/7. Hầu hết các trường hợp chỉ cần bật Chuyển vùng dữ liệu (Data Roaming) là kết nối thành công. Nếu do lỗi kỹ thuật mạng không thể khắc phục, chúng tôi cam kết hoàn tiền 100% cho quý khách.'
  },
  {
    q: 'Pocket WiFi có kết nối được cho nhiều người cùng lúc không?',
    a: 'Pocket WiFi phát sóng cực mạnh, hỗ trợ kết nối đồng thời từ 5 đến 8 thiết bị (cả iPhone, Android, Laptop và iPad). Dung lượng pin khủng 5000mAh hoạt động liên tục 14-16 tiếng cho cả ngày khám phá.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { siteSettings } = useApp();

  return (
    <section id="faq-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
            <InlineText textKey="faq_badge" defaultValue="Hỏi đáp du lịch" label="Huy hiệu hỏi đáp" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            <InlineText textKey="faq_title" defaultValue="Câu Hỏi Thường Gặp" label="Tiêu đề hỏi đáp" as="span" />
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            <InlineText textKey="faq_sub" defaultValue="Giải đáp nhanh các thắc mắc về cài đặt eSIM, nhận SIM vật lý và thuê thiết bị Pocket WiFi" multiline={true} label="Mô tả hỏi đáp" as="span" />
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-cyan-600 cursor-pointer"
                >
                  <span>
                    <InlineText textKey={`faq_q_${idx}`} defaultValue={faq.q} label={`Câu hỏi ${idx+1}`} as="span" />
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <InlineText textKey={`faq_a_${idx}`} defaultValue={faq.a} multiline={true} label={`Trả lời ${idx+1}`} as="p" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-cyan-600/20">
          <div>
            <h4 className="font-extrabold text-base">
              <InlineText textKey="faq_banner_title" defaultValue="Vẫn còn thắc mắc cần tư vấn trước chuyến bay?" label="Tiêu đề banner hỗ trợ" as="span" />
            </h4>
            <p className="text-xs text-cyan-100 mt-0.5">
              <InlineText textKey="faq_banner_sub" defaultValue="Kỹ thuật viên sẵn sàng tư vấn gói cước phù hợp lịch trình của bạn" label="Mô tả banner hỗ trợ" as="span" />
            </p>
          </div>
          <a
            href={`tel:${siteSettings.hotline.replace(/\s+/g, '')}`}
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-cyan-50 shrink-0 flex items-center gap-2 shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-cyan-600" />
            <InlineText textKey="faq_banner_hotline_btn" defaultValue={`Hotline ${siteSettings.hotline}`} label="Chữ nút Hotline" as="span" />
          </a>
        </div>

      </div>
    </section>
  );
};
