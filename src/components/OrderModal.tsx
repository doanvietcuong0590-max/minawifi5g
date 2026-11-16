import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';
import { formatJPY, formatMonthlyJPY, getVietQRUrl, getWhatsAppProductUrl } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  QrCode, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Copy, 
  Check, 
  ExternalLink
} from 'lucide-react';

export const OrderModal: React.FC = () => {
  const { 
    activeOrderProduct, 
    setActiveOrderProduct, 
    createOrder, 
    siteSettings, 
    setIsOrderTrackingOpen,
    setTrackingQuery,
    showToast,
    currentLanguage
  } = useApp();

  // If no product is chosen, don't show
  if (!activeOrderProduct) return null;

  // State
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'home_delivery' | 'esim_email'>('home_delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'cod'>('vietqr');
  
  // Post-order state
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedBankInfo, setCopiedBankInfo] = useState(false);

  // Calculation in JPY
  const totalAmount = activeOrderProduct.monthlyPriceJPY * quantity;

  const whatsappUrl = activeOrderProduct
    ? getWhatsAppProductUrl(
        activeOrderProduct,
        siteSettings.whatsappPhone || siteSettings.zaloPhone,
        siteSettings.siteName,
        {
          orderId: createdOrderId || undefined,
          customerName: customerName.trim() || undefined,
          customerPhone: customerPhone.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          deliveryMethod,
          notes: notes.trim() || undefined
        },
        currentLanguage
      )
    : '';

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Thiếu thông tin', 'Vui lòng nhập họ và tên của bạn', 'error');
      return;
    }
    if (deliveryMethod === 'home_delivery' && !customerAddress.trim()) {
      showToast('Thiếu thông tin', 'Vui lòng nhập địa chỉ nhận hàng', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItem: OrderItem = {
        productId: activeOrderProduct.id,
        productName: activeOrderProduct.name,
        productImage: activeOrderProduct.image,
        monthlyPriceJPY: activeOrderProduct.monthlyPriceJPY,
        quantity: quantity,
      };

      const newId = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerAddress: deliveryMethod === 'esim_email' ? 'Nhận mã qua Email' : customerAddress.trim(),
        deliveryMethod,
        notes: notes.trim(),
        paymentMethod,
        paymentStatus: 'unpaid',
        totalAmount,
        status: 'pending',
        items: [orderItem]
      });

      setCreatedOrderId(newId);

      // Open WhatsApp with complete translated product details & new order info
      try {
        const directWhatsAppUrl = getWhatsAppProductUrl(
          activeOrderProduct,
          siteSettings.whatsappPhone || siteSettings.zaloPhone,
          siteSettings.siteName,
          {
            orderId: newId,
            customerName: customerName.trim() || undefined,
            customerPhone: customerPhone.trim() || undefined,
            customerEmail: customerEmail.trim() || undefined,
            deliveryMethod,
            notes: notes.trim() || undefined
          },
          currentLanguage
        );
        window.open(directWhatsAppUrl, '_blank', 'noopener,noreferrer');
      } catch {
        /* ignore window open blocker if any */
      }
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch { /* ignore */ }

      showToast('Đăng ký thành công!', `Mã đơn hàng của bạn là ${newId}`, 'success');
    } catch {
      showToast('Lỗi', 'Không thể tạo đơn hàng, vui lòng thử lại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'order' | 'bank') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } else {
      setCopiedBankInfo(true);
      setTimeout(() => setCopiedBankInfo(false), 2000);
    }
  };

  const handleTrackThisOrder = () => {
    if (createdOrderId) {
      setTrackingQuery(createdOrderId);
      setActiveOrderProduct(null);
      setIsOrderTrackingOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Close Button */}
        <button
          onClick={() => setActiveOrderProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* VIEW 1: SUCCESSFUL ORDER PLACEMENT */}
        {createdOrderId ? (
          <div className="p-6 sm:p-8 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">Đăng Ký Thành Công!</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Cảm ơn <strong>{customerName}</strong>! Chúng tôi đã tiếp nhận đơn đăng ký gói cước. Đội ngũ nhân viên sẽ liên hệ xác nhận trong ít phút.
            </p>

            {/* Order Code Box */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-center justify-between gap-3 max-w-md w-full mx-auto">
              <div className="text-left">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Mã đơn hàng của bạn</div>
                <div className="text-xl font-black text-cyan-700 tracking-wider font-mono">{createdOrderId}</div>
              </div>

              <button
                onClick={() => copyToClipboard(createdOrderId, 'order')}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOrderId ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>
            </div>

            {/* Total Amount Box in Yen */}
            <div className="mt-4 text-sm text-slate-600 font-medium">
              Cước hàng tháng: <strong className="text-xl font-black text-slate-900">{formatMonthlyJPY(totalAmount)}</strong>
            </div>

            {/* Bank payment prompt if chosen */}
            {paymentMethod === 'vietqr' && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-b from-blue-50/80 to-cyan-50/50 border border-blue-200 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  <span className="font-extrabold text-blue-950 text-sm">Thông tin thanh toán chuyển khoản</span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <div className="text-slate-400 text-[11px]">Ngân hàng thụ hưởng:</div>
                    <div className="font-bold text-slate-900">{siteSettings.bankName}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Số tài khoản:</div>
                    <div className="font-mono font-bold text-slate-900 flex items-center gap-2">
                      <span>{siteSettings.bankAccountNo}</span>
                      <button
                        onClick={() => copyToClipboard(siteSettings.bankAccountNo, 'bank')}
                        className="text-[10px] text-cyan-600 hover:underline"
                      >
                        {copiedBankInfo ? 'Đã chép STK' : 'Chép STK'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Chủ tài khoản:</div>
                    <div className="font-bold text-slate-900">{siteSettings.bankAccountName}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Nội dung chuyển khoản:</div>
                    <div className="font-mono font-bold text-cyan-800 bg-white px-2 py-1 rounded border border-blue-200 inline-block">
                      THANH TOAN DON {createdOrderId}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Direct Transfer Card */}
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.086-.179.18-.077.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Chuyển tiếp đơn hàng sang WhatsApp</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Gửi trọn bộ nội dung gói cước kèm mã đơn hàng sang WhatsApp để nhân viên hỗ trợ kích hoạt và tư vấn ngay lập tức.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
                  >
                    <span>Mở WhatsApp Gửi Đơn Ngay</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Next actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.086-.179.18-.077.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
                </svg>
                <span>Chuyển đơn sang WhatsApp</span>
              </a>

              <button
                onClick={handleTrackThisOrder}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Theo dõi tiến trình đơn hàng</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveOrderProduct(null)}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>

          </div>
        ) : (
          /* VIEW 2: CHECKOUT FORM */
          <div className="p-5 sm:p-7">
            
            {/* Modal Title */}
            <div className="mb-5 pr-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">
                Đăng ký dịch vụ
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Thông Tin Đặt Hàng
              </h3>
            </div>

            {/* Selected Product Summary Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3.5 mb-5">
              <img
                src={activeOrderProduct.image}
                alt={activeOrderProduct.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                  {activeOrderProduct.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {activeOrderProduct.description}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                  <div className="text-base font-extrabold text-cyan-700">
                    {formatMonthlyJPY(activeOrderProduct.monthlyPriceJPY)}
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                    title="Đăng ký gói này nhanh qua WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.086-.179.18-.077.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
                    </svg>
                    <span>Đăng ký qua WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              
              {/* Quantity */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Số lượng đăng ký:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-white flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-black text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-white flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delivery method options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hình thức nhận:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex flex-col justify-between gap-1 transition-all ${
                      deliveryMethod === 'home_delivery'
                        ? 'border-cyan-600 bg-cyan-50/60 text-cyan-900 ring-1 ring-cyan-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Giao tận nơi</span>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'home_delivery'}
                        onChange={() => setDeliveryMethod('home_delivery')}
                        className="accent-cyan-600"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">Nhật Bản & Việt Nam</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex flex-col justify-between gap-1 transition-all ${
                      deliveryMethod === 'esim_email'
                        ? 'border-cyan-600 bg-cyan-50/60 text-cyan-900 ring-1 ring-cyan-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Nhận qua Email</span>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'esim_email'}
                        onChange={() => setDeliveryMethod('esim_email')}
                        className="accent-cyan-600"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">Mã QR trong 5 phút</span>
                  </label>
                </div>
              </div>

              {/* Customer information fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên người nhận <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại / WhatsApp <span className="text-slate-400 font-normal text-[11px]">(không bắt buộc)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="080... hoặc để trống nếu chưa có"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email <span className="text-slate-400 font-normal text-[11px]">(không bắt buộc)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="tenban@gmail.com (không bắt buộc)"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {deliveryMethod === 'home_delivery' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Địa chỉ nhận hàng <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Địa chỉ tại Nhật hoặc Việt Nam"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú thêm (không bắt buộc)
                  </label>
                  <input
                    type="text"
                    placeholder="Thời gian nhận hàng, ghi chú số nhà..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hình thức thanh toán:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'vietqr'
                        ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 ring-1 ring-cyan-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-cyan-600" />
                      <div>
                        <div className="font-bold">Chuyển khoản (Yucho / VN)</div>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                      className="accent-cyan-600"
                    />
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 ring-1 ring-cyan-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold">Thanh toán khi nhận (COD)</div>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-cyan-600"
                    />
                  </label>
                </div>
              </div>

              {/* Total Summary & Submit Button in Yen */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto text-left">
                  <div className="text-xs text-slate-500">Cước hàng tháng:</div>
                  <div className="text-2xl font-black text-cyan-700">
                    {formatMonthlyJPY(totalAmount)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      const freshUrl = getWhatsAppProductUrl(
                        activeOrderProduct,
                        siteSettings.whatsappPhone || siteSettings.zaloPhone,
                        siteSettings.siteName,
                        {
                          orderId: createdOrderId || undefined,
                          customerName: customerName.trim() || undefined,
                          customerPhone: customerPhone.trim() || undefined,
                          customerEmail: customerEmail.trim() || undefined,
                          deliveryMethod,
                          notes: notes.trim() || undefined
                        },
                        currentLanguage
                      );
                      e.currentTarget.href = freshUrl;
                    }}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    title="Chuyển toàn bộ nội dung sản phẩm sang WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.086-.179.18-.077.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
                    </svg>
                    <span>Gửi Qua WhatsApp</span>
                  </a>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Đang xử lý đăng ký...</span>
                    ) : (
                      <span>Xác Nhận Đăng Ký Ngay</span>
                    )}
                  </button>
                </div>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
