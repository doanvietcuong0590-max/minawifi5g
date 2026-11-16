export interface Product {
  id: string;
  image: string;
  name: string;
  monthlyPriceJPY: number; // Giá cước hàng tháng bằng tiền Yên (¥)
  description: string;
  inStock?: boolean;
  createdAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  monthlyPriceJPY: number;
  quantity: number;
}

export interface Order {
  id: string; // e.g. "WF-928371"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  deliveryMethod: 'esim_email' | 'home_delivery' | 'airport_pickup';
  airportName?: string;
  departureDate?: string;
  notes?: string;
  paymentMethod: 'vietqr' | 'cod';
  paymentStatus: 'unpaid' | 'paid';
  totalAmount: number;
  status: OrderStatus;
  statusNote?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  logoType: 'text_icon' | 'image';
  hotline: string;
  whatsappPhone?: string;
  zaloPhone: string;
  supportEmail: string;
  addressHanoi: string;
  addressHcm: string;
  workingHours: string;
  
  // Announcement bar
  announcementActive: boolean;
  announcementText: string;
  announcementLinkText?: string;

  // Hero section customisation
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroBadge: string;
  heroBannerImage?: string;

  // Custom in-place editable texts on the website
  customTexts?: Record<string, string>;

  // Payment info for VietQR
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankBranch: string;
}
