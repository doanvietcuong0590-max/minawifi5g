import React from 'react';
import { useApp } from '../context/AppContext';
import { InlineText } from './InlineText';
import { 
  Wifi, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  CreditCard,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC<{ onScrollToCatalog: () => void }> = ({ onScrollToCatalog }) => {
  const { siteSettings, setIsAdminLoginOpen, setIsOrderTrackingOpen, isAdmin, setIsAdminDashboardOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {siteSettings.logoUrl ? (
                <img 
                  src={siteSettings.logoUrl} 
                  alt={siteSettings.siteName} 
                  className="h-10 w-auto object-contain rounded-lg max-w-[150px]"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                  <Wifi className="w-5 h-5" />
                </div>
              )}
              <span className="font-black text-xl text-white tracking-tight">
                <InlineText textKey="siteName" defaultValue={siteSettings.siteName} label="Tên thương hiệu" />
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              <InlineText 
                textKey="footer_desc" 
                defaultValue={`${siteSettings.siteTagline}. Đối tác phân phối sim số và thiết bị viễn thông du lịch hàng đầu tại Việt Nam và hơn 150 quốc gia trên toàn thế giới.`} 
                multiline={true} 
                label="Mô tả chân trang" 
                as="span" 
              />
            </p>

            <div className="pt-2 flex items-center gap-3">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.974.55 1.777.839 2.796.839 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.765-5.768-5.765zm3.377 8.219c-.145.407-.743.766-1.025.799-.281.033-.615.147-2.023-.424-1.693-.687-2.775-2.434-2.859-2.547-.085-.114-.688-.916-.688-1.747 0-.832.435-1.241.591-1.411.156-.169.34-.212.453-.212.114 0 .227.002.327.007.106.005.247-.04.387.296.145.348.497 1.214.54 1.302.043.088.072.19.014.305-.058.115-.087.186-.173.286-.086.1-.18.224-.257.301-.086.086-.176.18-.076.352.1.171.444.733.953 1.186.655.584 1.207.765 1.378.851.171.086.271.072.372-.043.101-.115.432-.503.547-.676.115-.172.23-.143.388-.086.158.058 1.002.472 1.174.558.173.086.288.129.331.201.043.072.043.418-.102.825zm-3.377-10.391c-4.407 0-7.992 3.585-7.992 7.991 0 1.408.369 2.73 1.012 3.876l-1.051 3.844 3.939-1.033c1.104.602 2.373.938 3.722.938 4.406 0 7.99-3.584 7.99-7.99 0-4.407-3.584-7.992-7.99-7.992zm0 14.558c-1.218 0-2.358-.337-3.337-.923l-.239-.143-2.333.612.623-2.274-.156-.249c-.645-1.026-.987-2.213-.987-3.447 0-3.616 2.942-6.558 6.559-6.558 3.618 0 6.559 2.942 6.559 6.558 0 3.617-2.941 6.558-6.559 6.558z"/>
                    </svg>
                    <span><InlineText textKey="footer_wa_label" defaultValue="Chat WhatsApp" label="Nút WhatsApp" /></span>
                  </a>
                );
              })()}

              <a
                href={`tel:${siteSettings.hotline.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span><InlineText textKey="footer_hotline_label" defaultValue="Hotline 24/7" label="Nút Hotline" /></span>
              </a>
            </div>
          </div>

          {/* Col 2: Văn phòng & Chi nhánh */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">
              <InlineText textKey="footer_col2_title" defaultValue="Văn Phòng & Quầy Sân Bay" label="Tiêu đề Cột 2" as="span" />
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">
                    <InlineText textKey="footer_branch1_label" defaultValue="Trụ sở Hà Nội:" label="Nhãn trụ sở Hà Nội" as="span" />
                  </strong>
                  <InlineText textKey="addressHanoi" defaultValue={siteSettings.addressHanoi} label="Địa chỉ Hà Nội" as="span" />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">
                    <InlineText textKey="footer_branch2_label" defaultValue="Chi nhánh TP. HCM / Tokyo:" label="Nhãn chi nhánh 2" as="span" />
                  </strong>
                  <InlineText textKey="addressHcm" defaultValue={siteSettings.addressHcm} label="Địa chỉ HCM / Tokyo" as="span" />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">
                    <InlineText textKey="footer_hours_label" defaultValue="Thời gian làm việc:" label="Nhãn giờ làm việc" as="span" />
                  </strong>
                  <InlineText textKey="workingHours" defaultValue={siteSettings.workingHours} label="Giờ làm việc" as="span" />
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Dịch vụ & Hỗ trợ */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">
              <InlineText textKey="footer_col3_title" defaultValue="Liên Kết Nhanh" label="Tiêu đề Cột 3" as="span" />
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={onScrollToCatalog}
                  className="hover:text-cyan-400 transition-colors text-left cursor-pointer flex items-center gap-1"
                >
                  <span>&rarr;</span>
                  <InlineText textKey="footer_link_catalog" defaultValue="Bảng giá SIM & Pocket WiFi" label="Link giá" as="span" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsOrderTrackingOpen(true)}
                  className="hover:text-cyan-400 transition-colors text-left cursor-pointer flex items-center gap-1"
                >
                  <span>&rarr;</span>
                  <InlineText textKey="footer_link_tracking" defaultValue="Tra cứu tiến trình đơn hàng" label="Link tra cứu" as="span" />
                </button>
              </li>
              <li>
                <a
                  href={`tel:${siteSettings.hotline.replace(/\s+/g, '')}`}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <span>&rarr;</span>
                  <InlineText textKey="footer_link_hotline" defaultValue={`Hotline hỗ trợ: ${siteSettings.hotline}`} label="Link hotline" as="span" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteSettings.supportEmail}`}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <span>&rarr;</span>
                  <InlineText textKey="footer_link_email" defaultValue={`Email tiếp nhận: ${siteSettings.supportEmail}`} label="Link email" as="span" />
                </a>
              </li>
              <li className="pt-1">
                {isAdmin ? (
                  <button
                    onClick={() => setIsAdminDashboardOpen(true)}
                    className="text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span><InlineText textKey="footer_admin_active" defaultValue="Mở Bảng Điều Khiển Quản Trị" label="Link bảng quản trị" /></span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAdminLoginOpen(true)}
                    className="text-slate-500 hover:text-slate-300 transition-colors text-[11px] cursor-pointer"
                  >
                    <InlineText textKey="footer_admin_login" defaultValue="Đăng nhập Quản Trị Hệ Thống →" label="Link đăng nhập admin" />
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Col 4: Thanh toán & An toàn */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">
              <InlineText textKey="footer_col4_title" defaultValue="Phương Thức Thanh Toán" label="Tiêu đề Cột 4" as="span" />
            </h4>
            <p className="text-xs text-slate-400">
              <InlineText textKey="footer_payment_desc" defaultValue="Thanh toán an toàn, bảo mật qua VietQR, chuyển khoản ngân hàng hoặc COD khi nhận hàng." label="Mô tả thanh toán" as="span" />
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <QrCode className="w-4 h-4" />
                <InlineText textKey="footer_qr_title" defaultValue="VietQR 24/7 Tự Động" label="Tiêu đề VietQR" as="span" />
              </div>
              <div className="text-[11px] text-slate-400">
                {siteSettings.bankName} - {siteSettings.bankAccountNo}
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <InlineText textKey="footer_security_note" defaultValue="Bảo mật giao dịch chuẩn mã hoá SSL 256-bit" label="Ghi chú bảo mật" as="span" />
            </div>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <InlineText 
              textKey="footer_copyright" 
              defaultValue={`© ${new Date().getFullYear()} ${siteSettings.siteName}. Bản quyền thuộc về hệ thống dịch vụ viễn thông du lịch quốc tế.`} 
              label="Bản quyền chân trang" 
              as="span" 
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">
              <InlineText textKey="footer_policy_privacy" defaultValue="Chính sách bảo mật" label="Chính sách bảo mật" as="span" />
            </span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">
              <InlineText textKey="footer_policy_terms" defaultValue="Điều khoản dịch vụ" label="Điều khoản dịch vụ" as="span" />
            </span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">
              <InlineText textKey="footer_policy_refund" defaultValue="Chính sách hoàn tiền" label="Chính sách hoàn tiền" as="span" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
