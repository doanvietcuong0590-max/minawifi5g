import { Product, Order, SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Wifigo Japan',
  siteTagline: 'Cung Cấp Sim & Pocket WiFi Nhật Bản Cước Hàng Tháng Tiết Kiệm',
  logoUrl: '',
  logoType: 'text_icon',
  hotline: '080 8888 9999',
  whatsappPhone: '+81 80 8888 9999',
  zaloPhone: '080 8888 9999',
  supportEmail: 'hotro@wifigo.jp',
  addressHanoi: 'Tầng 3, Toà nhà SkyCity, 88 Láng Hạ, Đống Đa, Hà Nội',
  addressHcm: 'Tầng 5, Saigon Center, 65 Lê Lợi, Quận 1, TP. Hồ Chí Minh / Tokyo, Japan',
  workingHours: '08:00 - 22:00 (Hàng ngày, Hỗ trợ tiếng Việt 24/7)',

  announcementActive: true,
  announcementText: '🔥 Ưu đãi đặc biệt: Đăng ký Sim & Pocket WiFi nhận ngay cước tháng đầu chỉ từ ¥1,500/tháng - Miễn phí giao hàng toàn Nhật Bản & Việt Nam!',
  announcementLinkText: 'Xem ngay',

  heroTitle: 'Sim & Pocket WiFi Nhật Bản',
  heroHighlight: 'Cước Hàng Tháng Siêu Tiết Kiệm',
  heroSubtitle: 'Đăng ký Sim 4G/5G và Cục phát Pocket WiFi tốc độ cao không giới hạn. Thủ tục đơn giản chỉ cần hộ chiếu, thanh toán linh hoạt bằng tiền Yên.',
  heroBadge: '🇯🇵 DỊCH VỤ SIM & WIFI UY TÍN DÀNH CHO NGƯỜI VIỆT TẠI NHẬT',
  heroBannerImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',

  bankName: 'Yucho Bank (ゆうちょ銀行) / MB Bank',
  bankAccountNo: '10120-12345671',
  bankAccountName: 'WIFIGO JAPAN TELECOM',
  bankBranch: 'Tokyo'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-wifi-softbank',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    name: 'Pocket WiFi SoftBank 100GB Không Giới Hạn',
    monthlyPriceJPY: 4500,
    description: 'Cục phát WiFi bỏ túi tốc độ cao mạng SoftBank 4G/5G LTE. Dung lượng 100GB/tháng, pin trâu 16 tiếng, kết nối cùng lúc tối đa 5 thiết bị điện thoại, laptop mượt mà.',
    inStock: true
  },
  {
    id: 'prod-sim-docomo',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    name: 'SIM Data NTT Docomo 5G 50GB Tốc Độ Cao',
    monthlyPriceJPY: 3200,
    description: 'SIM data mạng Docomo số 1 Nhật Bản, phủ sóng rộng khắp từ thành phố đến vùng quê. Tốc độ ổn định, không bóp băng thông, phù hợp học tập và làm việc lâu dài.',
    inStock: true
  },
  {
    id: 'prod-esim-au',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
    name: 'eSIM Nhật Bản UQ Mobile / au 20GB Cước Rẻ',
    monthlyPriceJPY: 2400,
    description: 'Cài đặt tức thì qua mã QR sau 5 phút. Dung lượng 20GB tốc độ cao mỗi tháng, giữ nguyên sim chính Việt Nam nhận mã OTP ngân hàng.',
    inStock: true
  },
  {
    id: 'prod-wifi-ymobile',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    name: 'Pocket WiFi Y!mobile 50GB Bỏ Túi Tiện Lợi',
    monthlyPriceJPY: 3600,
    description: 'Thiết bị phát sóng WiFi nhỏ gọn di động, mạng phủ sóng toàn diện Nhật Bản. Hỗ trợ xem phim, chơi game, học online mượt mà không lo đứt mạng.',
    inStock: true
  },
  {
    id: 'prod-sim-rakuten',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    name: 'SIM Nghe Gọi + Data Rakuten Mobile Un-limit',
    monthlyPriceJPY: 3278,
    description: 'SIM kèm số điện thoại Nhật (+81) nghe gọi và nhận OTP nội địa. Data không giới hạn trong vùng sóng Rakuten, cước trọn gói tiết kiệm hàng tháng.',
    inStock: true
  },
  {
    id: 'prod-sim-iijmio',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80',
    name: 'SIM Data Tiết Kiệm IIJmio 10GB Sinh Viên & Tu Nghiệp',
    monthlyPriceJPY: 1500,
    description: 'Gói cước giá rẻ tối ưu chi phí cho du học sinh và người lao động tại Nhật. 10GB data tốc độ cao, hỗ trợ tích luỹ dung lượng thừa sang tháng sau.',
    inStock: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'WF-892314',
    customerName: 'Nguyễn Hoàng Nam',
    customerPhone: '0912345678',
    customerEmail: 'hoangnam.tokyo@gmail.com',
    customerAddress: 'Tokyo-to, Shinjuku-ku, Okubo 1-2-3',
    deliveryMethod: 'home_delivery',
    departureDate: '2026-10-15',
    notes: 'Giao hàng buổi tối sau 18h giúp mình',
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    totalAmount: 4500,
    status: 'completed',
    statusNote: 'Đã giao thiết bị Pocket WiFi tới tận nơi thành công.',
    trackingNumber: 'JP-YAMATO-8923',
    createdAt: '2026-10-05T09:15:00.000Z',
    updatedAt: '2026-10-05T10:00:00.000Z',
    items: [
      {
        productId: 'prod-wifi-softbank',
        productName: 'Pocket WiFi SoftBank 100GB Không Giới Hạn',
        productImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        monthlyPriceJPY: 4500,
        quantity: 1
      }
    ]
  },
  {
    id: 'WF-892315',
    customerName: 'Trần Thị Mai Phương',
    customerPhone: '0978654321',
    customerEmail: 'maiphuong.osaka@gmail.com',
    customerAddress: 'Osaka-shi, Naniwa-ku, Nipponbashi 2-4',
    deliveryMethod: 'home_delivery',
    departureDate: '2026-10-18',
    notes: 'Kích hoạt sim ngày 18 hàng tháng',
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    totalAmount: 3200,
    status: 'shipping',
    statusNote: 'Đang vận chuyển qua Sagawa Express, dự kiến nhận ngày mai',
    trackingNumber: 'SG-882910384JP',
    createdAt: '2026-10-05T14:30:00.000Z',
    updatedAt: '2026-10-06T08:20:00.000Z',
    items: [
      {
        productId: 'prod-sim-docomo',
        productName: 'SIM Data NTT Docomo 5G 50GB Tốc Độ Cao',
        productImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        monthlyPriceJPY: 3200,
        quantity: 1
      }
    ]
  },
  {
    id: 'WF-892316',
    customerName: 'Lê Quốc Bảo',
    customerPhone: '0903112233',
    customerEmail: 'bao.le@startup.jp',
    customerAddress: 'Gửi mã qua Email',
    deliveryMethod: 'esim_email',
    departureDate: '2026-10-10',
    notes: 'Cần eSIM gấp để liên lạc',
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    totalAmount: 2400,
    status: 'confirmed',
    statusNote: 'Đã chuẩn bị mã QR eSIM gửi qua email khách',
    trackingNumber: 'ESIM-AU-9923',
    createdAt: '2026-10-06T02:10:00.000Z',
    updatedAt: '2026-10-06T04:45:00.000Z',
    items: [
      {
        productId: 'prod-esim-au',
        productName: 'eSIM Nhật Bản UQ Mobile / au 20GB Cước Rẻ',
        productImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
        monthlyPriceJPY: 2400,
        quantity: 1
      }
    ]
  }
];

export const PRESET_PRODUCT_IMAGES = [
  {
    label: 'Pocket WiFi Bỏ Túi Đen Sang Trọng',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Pocket WiFi Thiết Bị Màn Hình Màu',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'SIM / eSIM Nhật Bản (Tokyo, Sakura)',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'SIM / eSIM Nhật Bản (Núi Phú Sĩ)',
    url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'SIM Du Lịch & Hộ Chiếu Quốc Tế',
    url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'SIM Điện Thoại Smartphone 5G',
    url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'
  }
];
