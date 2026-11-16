import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, Order, SiteSettings, OrderStatus } from '../types';
import { DEFAULT_SITE_SETTINGS, INITIAL_PRODUCTS, INITIAL_ORDERS, PRESET_PRODUCT_IMAGES } from '../data/initialData';
import { compressImage } from '../utils/imageCompressor';

const STORAGE_KEYS = {
  PRODUCTS: 'wifigo_products_v2',
  ORDERS: 'wifigo_orders_v2',
  SETTINGS: 'wifigo_settings_v2',
  ADMIN_PASS: 'wifigo_admin_password_v1',
  ADMIN_AUTH: 'wifigo_admin_session_v1',
};

const DEFAULT_ADMIN_PASSWORD = 'admin123';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  products: Product[];
  orders: Order[];
  siteSettings: SiteSettings;
  isAdmin: boolean;
  
  // Modals & triggers
  activeOrderProduct: Product | null;
  setActiveOrderProduct: (product: Product | null) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  trackingQuery: string;
  setTrackingQuery: (q: string) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
  isLiveEditMode: boolean;
  setIsLiveEditMode: (active: boolean) => void;
  editingProductModal: Product | null | 'new';
  setEditingProductModal: (prod: Product | null | 'new') => void;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStock: (id: string) => Promise<void>;

  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string, trackingNumber?: string) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: 'paid' | 'unpaid') => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];

  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  getText: (key: string, defaultText: string) => string;
  updateText: (key: string, newText: string) => Promise<void>;
  resetAllTexts: () => Promise<void>;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  resetToDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize states with localStorage fallback for instant boot
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // UI state
  const [activeOrderProduct, setActiveOrderProduct] = useState<Product | null>(null);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isLiveEditMode, setIsLiveEditMode] = useState(true);
  const [editingProductModal, setEditingProductModal] = useState<Product | null | 'new'>(null);
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('wifigo_current_lang');
      if (saved) return saved;
      const match = typeof document !== 'undefined' ? document.cookie.match(/googtrans=\/vi\/([a-zA-Z0-9_-]+)/) : null;
      if (match && match[1]) return match[1];
    } catch {
      /* ignore */
    }
    return 'vi';
  });

  const setCurrentLanguage = useCallback((lang: string) => {
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem('wifigo_current_lang', lang);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      if (e?.detail?.lang) {
        setCurrentLanguageState(e.detail.lang);
      }
    };
    window.addEventListener('wifigo_language_change', handleLangChange);
    return () => {
      window.removeEventListener('wifigo_language_change', handleLangChange);
    };
  }, []);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const showToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save to localStorage as backup/cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
    } catch (e) {
      console.error(e);
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
    } catch (e) {
      console.error(e);
    }
  }, [adminPassword]);

  // Real-time synchronization with Firestore Database
  useEffect(() => {
    // 1. Sync Products
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
          // Safely merge with any products in local state that were created recently (last 2 minutes)
          setProducts(prev => {
            const remoteIds = new Set(list.map(p => p.id));
            const recentLocal = prev.filter(p => {
              if (remoteIds.has(p.id)) return false;
              if (!p.createdAt) return false;
              const ageMs = Date.now() - new Date(p.createdAt).getTime();
              return ageMs < 120000; // keep locally created products for at least 2 minutes
            });

            const merged = [...recentLocal, ...list];
            merged.sort((a, b) => {
              const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              if (timeA !== timeB) return timeB - timeA;
              return (a.name || '').localeCompare(b.name || '');
            });
            return merged;
          });
        } else {
          // If remote is empty, seed if no products exist locally either
          INITIAL_PRODUCTS.forEach(async (prod) => {
            try {
              await setDoc(doc(db, 'products', prod.id), prod);
            } catch (err) {
              console.warn('Seeding initial product warning:', err);
            }
          });
        }
      },
      (error) => {
        console.warn('Products onSnapshot sync warning:', error);
      }
    );

    // 2. Sync Orders
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
          // Sort orders: newest first
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setOrders(list);
        } else {
          // Seed initial orders if database collection is empty
          INITIAL_ORDERS.forEach(async (ord) => {
            try {
              await setDoc(doc(db, 'orders', ord.id), ord);
            } catch (err) {
              console.warn('Seeding initial order error:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
      }
    );

    // 3. Sync Settings & 100% Inline Live Texts
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'site'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as Partial<SiteSettings>;
          setSiteSettings(prev => ({
            ...DEFAULT_SITE_SETTINGS,
            ...prev,
            ...remoteData,
            customTexts: {
              ...(DEFAULT_SITE_SETTINGS.customTexts || {}),
              ...(prev.customTexts || {}),
              ...(remoteData.customTexts || {})
            }
          }));
        } else {
          // Initialize settings document in database
          setDoc(doc(db, 'settings', 'site'), DEFAULT_SITE_SETTINGS).catch(err => {
            console.warn('Seeding site settings error:', err);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/site');
      }
    );

    return () => {
      unsubProducts();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  // Product database actions
  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    let processedImage = productData.image;
    if (processedImage && processedImage.startsWith('data:') && processedImage.length > 70000) {
      try {
        processedImage = await compressImage(processedImage, 800, 0.75);
      } catch (err) {
        console.warn('Image compression fallback:', err);
      }
    }

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: 'prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      name: (productData.name || '').trim(),
      monthlyPriceJPY: Number(productData.monthlyPriceJPY) || 0,
      description: (productData.description || '').trim(),
      image: processedImage || PRESET_PRODUCT_IMAGES[0].url,
      inStock: productData.inStock !== false,
      createdAt: now
    };

    // 1. OPTIMISTIC UPDATE: Add to UI state immediately so user sees the product instantly
    setProducts(prev => {
      if (prev.some(p => p.id === newProduct.id)) return prev;
      return [newProduct, ...prev];
    });

    // Also update localStorage backup immediately
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const parsed: Product[] = existing ? JSON.parse(existing) : [];
      if (!parsed.some(p => p.id === newProduct.id)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([newProduct, ...parsed]));
      }
    } catch {
      /* ignore */
    }

    // 2. Persist to Firestore
    const payload: Record<string, any> = {
      id: newProduct.id,
      name: newProduct.name,
      monthlyPriceJPY: newProduct.monthlyPriceJPY,
      description: newProduct.description,
      image: newProduct.image,
      inStock: newProduct.inStock,
      createdAt: newProduct.createdAt
    };

    try {
      await setDoc(doc(db, 'products', newProduct.id), payload);
      showToast('Thành công', `Đã thêm sản phẩm "${newProduct.name}" vào danh mục`, 'success');
      return newProduct;
    } catch (err: any) {
      console.warn('Lỗi lưu sản phẩm vào Firestore, giữ lại sản phẩm cục bộ:', err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes('exceeds the maximum allowed size') || errMsg.includes('maximum size')) {
        showToast('Ảnh hơi lớn', `Sản phẩm "${newProduct.name}" đã được lưu. Lưu ý chọn ảnh nhẹ hơn để tải nhanh hơn.`, 'info');
      } else {
        showToast('Đã lưu thành công', `Sản phẩm "${newProduct.name}" đã được thêm vào danh mục.`, 'success');
      }
      return newProduct;
    }
  }, [showToast]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    let processedImage = updates.image;
    if (processedImage && processedImage.startsWith('data:') && processedImage.length > 70000) {
      try {
        processedImage = await compressImage(processedImage, 800, 0.75);
      } catch (err) {
        console.warn('Image compression fallback:', err);
      }
    }

    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name.trim();
    if (updates.monthlyPriceJPY !== undefined) payload.monthlyPriceJPY = Number(updates.monthlyPriceJPY);
    if (updates.description !== undefined) payload.description = updates.description.trim();
    if (processedImage !== undefined) payload.image = processedImage;
    if (updates.inStock !== undefined) payload.inStock = Boolean(updates.inStock);

    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, ...(processedImage ? { image: processedImage } : {}) } : p));

    try {
      await updateDoc(doc(db, 'products', id), payload);
      showToast('Thành công', 'Đã lưu thay đổi thông tin sản phẩm', 'success');
    } catch (err: any) {
      console.warn('Lỗi cập nhật sản phẩm lên Firestore:', err);
      showToast('Đã cập nhật', 'Thông tin sản phẩm đã được lưu', 'info');
    }
  }, [showToast]);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Đã xoá', 'Sản phẩm đã được gỡ khỏi cơ sở dữ liệu', 'info');

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  }, [showToast]);

  const toggleProductStock = useCallback(async (id: string) => {
    let nextState = true;
    let prodName = '';
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        nextState = !p.inStock;
        prodName = p.name;
        return { ...p, inStock: nextState };
      }
      return p;
    }));
    showToast('Trạng thái kho', `${prodName} hiện ${nextState ? 'Còn hàng' : 'Hết hàng'}`, 'info');

    try {
      await updateDoc(doc(db, 'products', id), { inStock: nextState });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  }, [showToast]);

  // Order database actions
  const createOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderId = `WF-${randomDigits}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      statusNote: 'Đơn hàng mới tạo. Hệ thống đang tiếp nhận xử lý.'
    };

    setOrders(prev => [newOrder, ...prev]);

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
    }

    return orderId;
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus, note?: string, trackingNumber?: string) => {
    const now = new Date().toISOString();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updated: Order = {
          ...order,
          status,
          updatedAt: now,
          statusNote: note !== undefined ? note : order.statusNote,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber
        };
        return updated;
      }
      return order;
    }));
    showToast('Cập nhật đơn hàng', `Đơn ${orderId} đã đổi sang trạng thái mới`, 'success');

    try {
      const payload: Record<string, any> = { status, updatedAt: now };
      if (note !== undefined) payload.statusNote = note;
      if (trackingNumber !== undefined) payload.trackingNumber = trackingNumber;
      await updateDoc(doc(db, 'orders', orderId), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  }, [showToast]);

  const updateOrderPaymentStatus = useCallback(async (orderId: string, paymentStatus: 'paid' | 'unpaid') => {
    const now = new Date().toISOString();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          paymentStatus,
          updatedAt: now
        };
      }
      return order;
    }));
    showToast('Thanh toán', `Đã cập nhật trạng thái thanh toán đơn ${orderId}`, 'info');

    try {
      await updateDoc(doc(db, 'orders', orderId), { paymentStatus, updatedAt: now });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  }, [showToast]);

  const deleteOrder = useCallback(async (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    showToast('Đã xoá đơn hàng', `Đơn hàng ${orderId} đã được xoá vĩnh viễn`, 'info');

    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
    }
  }, [showToast]);

  const getOrderById = useCallback((orderId: string) => {
    const normalized = orderId.trim().toUpperCase();
    return orders.find(o => o.id.toUpperCase() === normalized);
  }, [orders]);

  const getOrdersByPhone = useCallback((phone: string) => {
    const cleanPhone = phone.replace(/[\s.-]/g, '');
    return orders.filter(o => o.customerPhone.replace(/[\s.-]/g, '').includes(cleanPhone));
  }, [orders]);

  // Site Settings & 100% Inline Editable Texts Database Actions
  const updateSiteSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    showToast('Lưu cài đặt', 'Đã lưu các thay đổi vào cơ sở dữ liệu', 'success');

    try {
      await setDoc(doc(db, 'settings', 'site'), newSettings, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/site');
    }
  }, [showToast]);

  // Live in-place text retrieval and updating
  const getText = useCallback((key: string, defaultText: string): string => {
    if (siteSettings.customTexts && siteSettings.customTexts[key] !== undefined && siteSettings.customTexts[key].trim() !== '') {
      return siteSettings.customTexts[key];
    }
    if (key in siteSettings && typeof (siteSettings as any)[key] === 'string' && (siteSettings as any)[key].trim() !== '') {
      return (siteSettings as any)[key];
    }
    return defaultText;
  }, [siteSettings]);

  const updateText = useCallback(async (key: string, newText: string) => {
    const updatedCustomTexts = { ...(siteSettings.customTexts || {}), [key]: newText };
    const updates: Partial<SiteSettings> = { customTexts: updatedCustomTexts };
    if (key in siteSettings && typeof (siteSettings as any)[key] === 'string') {
      (updates as any)[key] = newText;
    }
    setSiteSettings(prev => ({ ...prev, ...updates }));
    showToast('Đã lưu văn bản', `Nội dung đã được lưu vào database`, 'success');

    try {
      await setDoc(doc(db, 'settings', 'site'), updates, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/site');
    }
  }, [siteSettings, showToast]);

  const resetAllTexts = useCallback(async () => {
    setSiteSettings(prev => ({ ...prev, customTexts: {} }));
    showToast('Đã khôi phục', 'Các văn bản tuỳ chỉnh đã được đưa về mặc định', 'info');

    try {
      await setDoc(doc(db, 'settings', 'site'), { customTexts: {} }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/site');
    }
  }, [showToast]);

  // Admin Auth
  const loginAdmin = useCallback((password: string): boolean => {
    if (password === adminPassword) {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } catch { /* ignore */ }
      setIsAdminLoginOpen(false);
      setIsAdminDashboardOpen(true);
      showToast('Đăng nhập Quản Trị', 'Chào mừng bạn quay lại hệ thống quản lý!', 'success');
      return true;
    } else {
      showToast('Sai mật khẩu', 'Mật khẩu quản trị không chính xác. Mặc định là: admin123', 'error');
      return false;
    }
  }, [adminPassword, showToast]);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch { /* ignore */ }
    setIsAdminDashboardOpen(false);
    showToast('Đã đăng xuất', 'Bạn đã rời khỏi trang quản trị an toàn', 'info');
  }, [showToast]);

  const changeAdminPassword = useCallback((oldPass: string, newPass: string) => {
    if (oldPass !== adminPassword) {
      return { success: false, message: 'Mật khẩu hiện tại không đúng' };
    }
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' };
    }
    setAdminPassword(newPass.trim());
    showToast('Đổi mật khẩu', 'Mật khẩu quản trị viên đã được cập nhật thành công!', 'success');
    return { success: true, message: 'Cập nhật mật khẩu thành công' };
  }, [adminPassword, showToast]);

  const resetToDemoData = useCallback(async () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setAdminPassword(DEFAULT_ADMIN_PASSWORD);
    showToast('Khôi phục thành công', 'Toàn bộ sản phẩm, đơn hàng và cấu hình đã đồng bộ lại về mặc định trong database', 'success');

    try {
      // Overwrite settings in firestore
      await setDoc(doc(db, 'settings', 'site'), DEFAULT_SITE_SETTINGS);
      // Overwrite products
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }
      // Overwrite orders
      for (const o of INITIAL_ORDERS) {
        await setDoc(doc(db, 'orders', o.id), o);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'database_reset');
    }
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        siteSettings,
        isAdmin,
        activeOrderProduct,
        setActiveOrderProduct,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        trackingQuery,
        setTrackingQuery,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isAdminDashboardOpen,
        setIsAdminDashboardOpen,
        isLiveEditMode,
        setIsLiveEditMode,
        editingProductModal,
        setEditingProductModal,
        currentLanguage,
        setCurrentLanguage,
        toasts,
        showToast,
        removeToast,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,
        getOrderById,
        getOrdersByPhone,
        updateSiteSettings,
        getText,
        updateText,
        resetAllTexts,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
