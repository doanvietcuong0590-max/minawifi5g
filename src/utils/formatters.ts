import { buildMultilingualWhatsAppMessage, getActiveLanguage, ProductData, CustomerOrderDetails } from './whatsappTranslations';

export const formatJPY = (amount: number): string => {
  return `¥${new Intl.NumberFormat('ja-JP').format(amount)}`;
};

export const formatMonthlyJPY = (amount: number): string => {
  return `¥${new Intl.NumberFormat('ja-JP').format(amount)} / tháng`;
};

export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
};

/**
 * Generate quick VietQR payment link
 * Bank IDs standard: MB = 970422 or "MB", VCB, TCB, etc.
 */
export const getVietQRUrl = (
  bankName: string,
  accountNo: string,
  accountName: string,
  amount: number,
  orderId: string
): string => {
  // Quick public VietQR image API (VietQR.io)
  // https://api.vietqr.io/image/[BIN]-[ACCOUNT]-[TEMPLATE].jpg?amount=[AMOUNT]&addInfo=[INFO]&accountName=[NAME]
  // Standard MB bank code: MBBank (970422) or ICB (970415)
  const bankCode = bankName.toLowerCase().includes('mb') ? 'MB' : '970422';
  const cleanAccount = accountNo.replace(/\s+/g, '');
  const encodedInfo = encodeURIComponent(`THANH TOAN DON ${orderId}`);
  const encodedName = encodeURIComponent(accountName);
  
  return `https://img.vietqr.io/image/${bankCode}-${cleanAccount}-compact2.jpg?amount=${amount}&addInfo=${encodedInfo}&accountName=${encodedName}`;
};

export const getStatusBadgeInfo = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Chờ xử lý',
        color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40',
        dot: 'bg-amber-500'
      };
    case 'confirmed':
      return {
        label: 'Đã xác nhận',
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40',
        dot: 'bg-blue-500'
      };
    case 'shipping':
      return {
        label: 'Đang giao hàng',
        color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/40',
        dot: 'bg-purple-500'
      };
    case 'completed':
      return {
        label: 'Hoàn thành',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
        dot: 'bg-emerald-500'
      };
    case 'cancelled':
      return {
        label: 'Đã huỷ',
        color: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40',
        dot: 'bg-rose-500'
      };
    default:
      return {
        label: status,
        color: 'bg-slate-100 text-slate-800 border-slate-200',
        dot: 'bg-slate-400'
      };
  }
};

/**
 * Clean phone number for WhatsApp wa.me link
 */
export const cleanWhatsAppNumber = (phone?: string): string => {
  const raw = phone || '+81 80 8888 9999';
  let digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '818088889999';
  
  if (digits.startsWith('0')) {
    // Japanese domestic format (080, 090, 070...) -> replace leading 0 with 81
    digits = '81' + digits.slice(1);
  }
  return digits;
};

/**
 * Build WhatsApp redirect link with entire product content pre-filled in the selected language
 */
export const getWhatsAppProductUrl = (
  product: ProductData,
  whatsappPhone?: string,
  siteName = 'WifiGo Japan',
  customerDetails?: CustomerOrderDetails,
  language?: string
): string => {
  const cleanPhone = cleanWhatsAppNumber(whatsappPhone);
  const activeLang = getActiveLanguage(language);
  const msg = buildMultilingualWhatsAppMessage(product, siteName, customerDetails, activeLang);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
};
