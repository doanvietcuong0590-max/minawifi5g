import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Order, OrderStatus } from '../../types';
import { formatJPY, formatMonthlyJPY, formatDate, getStatusBadgeInfo } from '../../utils/formatters';
import { PRESET_PRODUCT_IMAGES } from '../../data/initialData';
import { compressImage } from '../../utils/imageCompressor';
import { 
  X, 
  ShoppingBag, 
  Package, 
  Settings, 
  KeyRound, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  RefreshCw, 
  LogOut, 
  Image as ImageIcon, 
  Upload, 
  Save, 
  Eye, 
  FileText,
  Loader2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    orders,
    products,
    siteSettings,
    logoutAdmin,
    updateOrderStatus,
    updateOrderPaymentStatus,
    deleteOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    updateSiteSettings,
    changeAdminPassword,
    resetToDemoData,
    showToast
  } = useApp();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'site_settings' | 'security'>('products');

  // Orders State
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);
  const [editStatusNote, setEditStatusNote] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [viewOrderDetail, setViewOrderDetail] = useState<Order | null>(null);

  // Products State
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showImagePickerFor, setShowImagePickerFor] = useState<'new' | 'edit' | 'logo' | 'hero' | null>(null);

  // Simplified Product Form: ONLY Image, Name, Monthly Price in Yen, Description
  const [productForm, setProductForm] = useState<Partial<Product>>({
    image: PRESET_PRODUCT_IMAGES[0].url,
    name: '',
    monthlyPriceJPY: 3500,
    description: '',
    inStock: true
  });
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isCompressingProductImage, setIsCompressingProductImage] = useState(false);

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAdminDashboardOpen) return null;

  // Filter Orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = (order.customerPhone || '').includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // Filter Products
  const filteredProducts = products.filter(product => {
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      return product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Handle local image upload via FileReader and immediate compression
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'logo' | 'hero') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ảnh quá lớn', 'Vui lòng chọn ảnh dung lượng dưới 5MB', 'error');
        return;
      }
      if (target === 'product') {
        setIsCompressingProductImage(true);
      }
      try {
        const compressed = await compressImage(file, 800, 0.75);
        if (target === 'product') {
          if (editingProduct) {
            setEditingProduct({ ...editingProduct, image: compressed });
          }
          setProductForm(prev => ({ ...prev, image: compressed }));
          showToast('Đã tải ảnh lên', 'Ảnh sản phẩm đã được tối ưu thành công', 'success');
        } else if (target === 'logo') {
          setSettingsForm(prev => ({ ...prev, logoUrl: compressed }));
          showToast('Đã tải logo', 'Logo mới đã được áp dụng', 'success');
        } else if (target === 'hero') {
          setSettingsForm(prev => ({ ...prev, heroBannerImage: compressed }));
          showToast('Đã tải banner', 'Ảnh Hero banner đã được cập nhật', 'success');
        }
      } catch (err) {
        console.warn('Compress image error in AdminDashboard:', err);
        showToast('Lỗi tải ảnh', 'Không thể xử lý ảnh này, vui lòng thử lại', 'error');
      } finally {
        if (target === 'product') {
          setIsCompressingProductImage(false);
        }
        setShowImagePickerFor(null);
      }
    }
  };

  // Add / Edit Product (ONLY image, name, monthlyPriceJPY, description)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name?.trim()) {
      showToast('Thiếu thông tin', 'Vui lòng nhập tên sản phẩm', 'error');
      return;
    }
    if (!productForm.monthlyPriceJPY || Number(productForm.monthlyPriceJPY) <= 0) {
      showToast('Thiếu thông tin', 'Vui lòng nhập giá cước hàng tháng bằng tiền Yên', 'error');
      return;
    }

    setIsSubmittingProduct(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          image: productForm.image || editingProduct.image,
          name: productForm.name.trim(),
          monthlyPriceJPY: Number(productForm.monthlyPriceJPY),
          description: productForm.description?.trim() || '',
          inStock: productForm.inStock ?? true
        });
        setEditingProduct(null);
      } else {
        await addProduct({
          image: productForm.image || PRESET_PRODUCT_IMAGES[0].url,
          name: productForm.name.trim(),
          monthlyPriceJPY: Number(productForm.monthlyPriceJPY),
          description: productForm.description?.trim() || '',
          inStock: productForm.inStock ?? true
        });
      }

      setIsAddProductModalOpen(false);
      // Reset form
      setProductForm({
        image: PRESET_PRODUCT_IMAGES[0].url,
        name: '',
        monthlyPriceJPY: 3500,
        description: '',
        inStock: true
      });
    } catch (err) {
      console.error('Error saving product in AdminDashboard:', err);
      showToast('Lỗi', 'Không thể hoàn tất thao tác. Vui lòng thử lại.', 'error');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Open Edit Product Modal
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      image: prod.image,
      name: prod.name,
      monthlyPriceJPY: prod.monthlyPriceJPY,
      description: prod.description,
      inStock: prod.inStock ?? true
    });
    setIsAddProductModalOpen(true);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
  };

  // Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
      return;
    }

    const res = changeAdminPassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Admin Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight">Trung Tâm Quản Trị Hệ Thống</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Quản lý: {siteSettings.siteName} &bull; Cập nhật thay đổi tức thì
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdminDashboardOpen(false)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Xem giao diện ngoài</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 text-xs transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAdminDashboardOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Body with Sidebar Tabs and Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Sản Phẩm & Giá Cước</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Quản Lý Đơn Hàng</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('site_settings')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'site_settings'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Giao Diện & Cài Đặt</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Đổi Mật Khẩu</span>
          </button>

          <div className="hidden md:block mt-auto pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                if (window.confirm('Khôi phục toàn bộ sản phẩm và đơn hàng về mặc định ban đầu?')) {
                  resetToDemoData();
                }
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu mẫu</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* ============================================================== */}
          {/* TAB 1: SẢN PHẨM & GIÁ CƯỚC HÀNG THÁNG TIỀN YÊN */}
          {/* ============================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Header with Search and Add Product button */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm theo tên hoặc nội dung mô tả..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      image: PRESET_PRODUCT_IMAGES[0].url,
                      name: '',
                      monthlyPriceJPY: 3500,
                      description: '',
                      inStock: true
                    });
                    setIsAddProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Sản Phẩm Mới</span>
                </button>
              </div>

              {/* Product cards list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* 1. HÌNH ẢNH SẢN PHẨM */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              startEditProduct(product);
                              setShowImagePickerFor('edit');
                            }}
                            className="px-3.5 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-lg hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Đổi ảnh</span>
                          </button>
                        </div>

                        {/* Price Badge in Yen */}
                        <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-cyan-300 text-xs font-black px-3 py-1 rounded-full shadow-md">
                          {formatMonthlyJPY(product.monthlyPriceJPY)}
                        </div>

                        {/* Stock toggle */}
                        <div className="absolute top-2.5 right-2.5">
                          <button
                            onClick={() => toggleProductStock(product.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                              product.inStock !== false ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                            }`}
                          >
                            {product.inStock !== false ? 'Còn hàng' : 'Hết hàng'}
                          </button>
                        </div>
                      </div>

                      {/* 2. TÊN & 3. GIÁ CƯỚC TIỀN YÊN & 4. MÔ TẢ */}
                      <div className="p-4 sm:p-5">
                        {/* Tên sản phẩm */}
                        <h4 className="font-extrabold text-slate-900 text-base line-clamp-1">{product.name}</h4>
                        
                        {/* Giá cước hàng tháng bằng tiền Yên */}
                        <div className="text-lg font-black text-cyan-700 mt-1">
                          {formatMonthlyJPY(product.monthlyPriceJPY)}
                        </div>

                        {/* Mô tả sản phẩm */}
                        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => startEditProduct(product)}
                        className="text-xs font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Sửa thông tin & ảnh</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Xác nhận xoá sản phẩm "${product.name}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xoá</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: QUẢN LÝ ĐƠN HÀNG THỜI GIAN THỰC */}
          {/* ============================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Order KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Tổng số đơn</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{orders.length}</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs">
                  <div className="text-xs text-amber-700 font-semibold uppercase">Đơn mới chờ xử lý</div>
                  <div className="text-2xl font-black text-amber-900 mt-1">
                    {orders.filter(o => o.status === 'pending').length}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80 shadow-xs">
                  <div className="text-xs text-purple-700 font-semibold uppercase">Đang giao / Gửi QR</div>
                  <div className="text-2xl font-black text-purple-900 mt-1">
                    {orders.filter(o => o.status === 'shipping' || o.status === 'confirmed').length}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-xs">
                  <div className="text-xs text-emerald-700 font-semibold uppercase">Doanh thu cước hoàn tất</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-900 mt-1 truncate">
                    {formatMonthlyJPY(
                      orders
                        .filter(o => o.status === 'completed' || o.paymentStatus === 'paid')
                        .reduce((sum, o) => sum + o.totalAmount, 0)
                    )}
                  </div>
                </div>
              </div>

              {/* Order Filters and Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Tìm đơn theo mã (WF-...), tên khách, hoặc số điện thoại..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Trạng thái:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="all">Tất cả ({orders.length})</option>
                    <option value="pending">Chờ xử lý ({orders.filter(o => o.status === 'pending').length})</option>
                    <option value="confirmed">Đã xác nhận ({orders.filter(o => o.status === 'confirmed').length})</option>
                    <option value="shipping">Đang giao ({orders.filter(o => o.status === 'shipping').length})</option>
                    <option value="completed">Hoàn thành ({orders.filter(o => o.status === 'completed').length})</option>
                    <option value="cancelled">Đã huỷ ({orders.filter(o => o.status === 'cancelled').length})</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Mã đơn & Thời gian</th>
                        <th className="py-3 px-4">Khách hàng</th>
                        <th className="py-3 px-4">Sản phẩm</th>
                        <th className="py-3 px-4">Cước hàng tháng</th>
                        <th className="py-3 px-4">Thanh toán</th>
                        <th className="py-3 px-4">Cập nhật trạng thái</th>
                        <th className="py-3 px-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                          const badge = getStatusBadgeInfo(order.status);
                          return (
                            <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                              
                              {/* Order ID & Time */}
                              <td className="py-3.5 px-4">
                                <div className="font-mono font-black text-slate-900 text-sm">{order.id}</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">{formatDate(order.createdAt)}</div>
                              </td>

                              {/* Customer info */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900">{order.customerName}</div>
                                <div className="text-slate-500 font-mono">
                                  {order.customerPhone || <span className="text-slate-400 italic text-[11px]">(Chưa có SĐT)</span>}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{order.customerAddress}</div>
                              </td>

                              {/* Items list summary */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 font-medium text-slate-700">
                                      <span className="font-bold text-cyan-700">x{item.quantity}</span>
                                      <span className="line-clamp-1 max-w-[180px]">{item.productName}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* Total Amount in Yen */}
                              <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                                {formatMonthlyJPY(order.totalAmount)}
                              </td>

                              {/* Payment status toggle */}
                              <td className="py-3.5 px-4">
                                <button
                                  type="button"
                                  onClick={() => updateOrderPaymentStatus(order.id, order.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                    order.paymentStatus === 'paid'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-amber-50 text-amber-700 border-amber-300'
                                  }`}
                                >
                                  {order.paymentStatus === 'paid' ? '✓ Đã thanh toán' : 'Chưa thanh toán'}
                                </button>
                              </td>

                              {/* Real-time Order Status Changer Dropdown */}
                              <td className="py-3.5 px-4">
                                <div className="flex flex-col gap-1.5">
                                  <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:ring-2 focus:ring-cyan-500 cursor-pointer ${badge.color}`}
                                  >
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="shipping">Đang giao / Đã gửi QR</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="cancelled">Đã huỷ</option>
                                  </select>

                                  {order.statusNote && (
                                    <span className="text-[10px] text-slate-500 line-clamp-1 max-w-[160px]" title={order.statusNote}>
                                      Ghi chú: {order.statusNote}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Action buttons */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setViewOrderDetail(order)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    title="Xem chi tiết đơn"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedOrderForEdit(order);
                                      setEditStatusNote(order.statusNote || '');
                                      setEditTrackingNumber(order.trackingNumber || '');
                                    }}
                                    className="p-1.5 rounded-lg text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50"
                                    title="Cập nhật ghi chú & Mã vận đơn"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Xoá đơn hàng ${order.id}?`)) {
                                        deleteOrder(order.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                    title="Xoá đơn hàng"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400">
                            Không tìm thấy đơn hàng nào phù hợp bộ lọc.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: SITE SETTINGS & INTERFACE CUSTOMIZATION */}
          {/* ============================================================== */}
          {activeTab === 'site_settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="text-lg font-black text-slate-900">Tuỳ Chỉnh Giao Diện & Thông Tin Website</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thay đổi logo, tên website, câu slogan và thông điệp hiển thị ngoài trang chủ
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  
                  {/* Brand & Logo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tên website / Thương hiệu:
                      </label>
                      <input
                        type="text"
                        value={settingsForm.siteName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Slogan / Khẩu hiệu:
                      </label>
                      <input
                        type="text"
                        value={settingsForm.siteTagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, siteTagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Logo Image URL / Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ảnh Logo (URL hoặc tải file từ máy tính):
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Nhập đường link URL ảnh logo..."
                        value={settingsForm.logoUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-cyan-500"
                      />
                      <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, 'logo')}
                        />
                      </label>
                    </div>
                    {settingsForm.logoUrl && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Xem trước:</span>
                        <img src={settingsForm.logoUrl} alt="Logo preview" className="h-8 object-contain rounded bg-slate-50 p-1 border" />
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                          className="text-[11px] text-rose-500 hover:underline"
                        >
                          Xoá logo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Top Announcement Bar */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-900">
                        Thanh thông báo nổi bật trên cùng:
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={settingsForm.announcementActive}
                          onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                          className="accent-cyan-600 rounded"
                        />
                        <span>Hiển thị thông báo</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      placeholder="Nội dung khuyến mãi..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Contact Details */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Thông Tin Liên Hệ
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Hotline:</label>
                        <input
                          type="text"
                          value={settingsForm.hotline}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hotline: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Số WhatsApp (Quốc tế):</label>
                        <input
                          type="text"
                          placeholder="+81 80 8888 9999 hoặc 84988888999"
                          value={settingsForm.whatsappPhone ?? settingsForm.zaloPhone ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value, zaloPhone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Email hỗ trợ:</label>
                        <input
                          type="email"
                          value={settingsForm.supportEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Cài Đặt Giao Diện</span>
                    </button>
                  </div>

                </form>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: BẢO MẬT (ĐỔI MẬT KHẨU) */}
          {/* ============================================================== */}
          {activeTab === 'security' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Thay Đổi Mật Khẩu Quản Trị</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cập nhật mật khẩu mới để bảo vệ an toàn cho bảng điều khiển
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mật khẩu hiện tại:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Nhập mật khẩu hiện tại..."
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mật khẩu mới (tối thiểu 6 ký tự):
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Nhập mật khẩu mới..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Xác nhận mật khẩu mới:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu mới..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>

                  {passwordMsg && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${
                      passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {passwordMsg.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                  >
                    Cập Nhật Mật Khẩu Mới
                  </button>
                </form>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: THÊM / SỬA SẢN PHẨM (CHỈ HÌNH ẢNH, TÊN, GIÁ YÊN, MÔ TẢ) */}
      {/* ============================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-7 relative my-auto animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => {
                setIsAddProductModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Vui lòng nhập hình ảnh, tên sản phẩm, giá cước hàng tháng (tiền Yên) và mô tả sản phẩm.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              {/* 1. HÌNH ẢNH SẢN PHẨM */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  1. Hình ảnh sản phẩm <span className="text-red-500">*</span>:
                </label>

                <div className="flex items-center gap-4">
                  <img
                    src={productForm.image || PRESET_PRODUCT_IMAGES[0].url}
                    alt="Product preview"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-300 shrink-0 bg-white"
                  />

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Dán đường link URL hình ảnh..."
                      value={productForm.image || ''}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500"
                    />

                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5 shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh từ máy tính</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, 'product')}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowImagePickerFor(showImagePickerFor === 'edit' ? null : 'edit')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Kho ảnh mẫu</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Gallery Picker Dropdown */}
                {showImagePickerFor && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-700">Chọn nhanh ảnh mẫu chất lượng cao:</span>
                      <button
                        type="button"
                        onClick={() => setShowImagePickerFor(null)}
                        className="text-[10px] text-slate-400 hover:text-slate-700"
                      >
                        Đóng
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {PRESET_PRODUCT_IMAGES.map((preset, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => {
                            setProductForm(prev => ({ ...prev, image: preset.url }));
                            setShowImagePickerFor(null);
                          }}
                          className="group/item relative h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-cyan-500 cursor-pointer"
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-[9px] text-white font-semibold leading-tight flex items-end">
                            {preset.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. TÊN SẢN PHẨM */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Tên sản phẩm <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Pocket WiFi SoftBank 100GB Không Giới Hạn"
                  value={productForm.name || ''}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* 3. GIÁ CƯỚC HÀNG THÁNG BẰNG TIỀN YÊN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>3. Giá cước hàng tháng bằng tiền Yên (¥) <span className="text-red-500">*</span>:</span>
                  {productForm.monthlyPriceJPY ? (
                    <span className="text-cyan-700 font-extrabold text-xs">
                      Hiển thị: {formatMonthlyJPY(Number(productForm.monthlyPriceJPY))}
                    </span>
                  ) : null}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-2.5 text-sm font-black text-slate-400">
                    ¥
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    placeholder="Ví dụ: 3500 (tức ¥3,500/tháng)"
                    value={productForm.monthlyPriceJPY || ''}
                    onChange={(e) => setProductForm({ ...productForm, monthlyPriceJPY: Number(e.target.value) })}
                    className="w-full pl-8 pr-20 py-2.5 rounded-xl border border-slate-300 text-sm font-black text-cyan-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  <div className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                    Yên / tháng
                  </div>
                </div>
              </div>

              {/* 4. MÔ TẢ SẢN PHẨM */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. Mô tả sản phẩm <span className="text-red-500">*</span>:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập thông tin mô tả chi tiết: tốc độ mạng, dung lượng, thiết bị kết nối, ưu đãi..."
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* Tình trạng còn hàng */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="productInStock"
                  checked={productForm.inStock !== false}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="w-4 h-4 accent-cyan-600 rounded cursor-pointer"
                />
                <label htmlFor="productInStock" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Sản phẩm đang còn hàng và sẵn sàng nhận đăng ký
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isSubmittingProduct}
                  onClick={() => {
                    setIsAddProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  Huỷ
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingProduct || isCompressingProductImage}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmittingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Lưu Thay Đổi Sản Phẩm' : 'Tạo Sản Phẩm Mới'}</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: UPDATE ORDER STATUS / TRACKING CODE / NOTE */}
      {/* ============================================================== */}
      {selectedOrderForEdit && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedOrderForEdit(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="text-base font-black text-slate-900 mb-1">
              Cập Nhật Đơn {selectedOrderForEdit.id}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Khách hàng: {selectedOrderForEdit.customerName} {selectedOrderForEdit.customerPhone ? `(${selectedOrderForEdit.customerPhone})` : ''}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái đơn hàng:</label>
                <select
                  value={selectedOrderForEdit.status}
                  onChange={(e) => setSelectedOrderForEdit({ ...selectedOrderForEdit, status: e.target.value as OrderStatus })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao hàng / Gửi eSIM</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã huỷ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã vận đơn / Mã kích hoạt:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: YAMATO-882319 hoặc ESIM-AU-9923"
                  value={editTrackingNumber}
                  onChange={(e) => setEditTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú trạng thái hiển thị cho khách hàng:
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Đã gửi thiết bị WiFi qua bưu điện Yamato, dự kiến giao vào ngày mai..."
                  value={editStatusNote}
                  onChange={(e) => setEditStatusNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForEdit(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-600"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(
                      selectedOrderForEdit.id,
                      selectedOrderForEdit.status,
                      editStatusNote.trim(),
                      editTrackingNumber.trim()
                    );
                    setSelectedOrderForEdit(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Lưu cập nhật
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VIEW FULL ORDER DETAILS */}
      {/* ============================================================== */}
      {viewOrderDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-auto">
            <button
              onClick={() => setViewOrderDetail(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-200 pb-4 mb-4">
              <span className="text-xs uppercase font-extrabold text-cyan-600">Chi tiết hoá đơn đơn hàng</span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{viewOrderDetail.id}</h3>
              <p className="text-xs text-slate-400">Thời gian tạo: {formatDate(viewOrderDetail.createdAt)}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border">
                <div>
                  <span className="text-slate-400 font-semibold">Khách hàng:</span>
                  <div className="font-bold text-slate-900">{viewOrderDetail.customerName}</div>
                  <div className="font-mono text-slate-700">{viewOrderDetail.customerPhone || '(Không có SĐT)'}</div>
                  {viewOrderDetail.customerEmail && <div className="text-slate-500">{viewOrderDetail.customerEmail}</div>}
                </div>

                <div>
                  <span className="text-slate-400 font-semibold">Giao hàng:</span>
                  <div className="font-bold text-slate-900">
                    {viewOrderDetail.deliveryMethod === 'esim_email' ? 'Nhận mã qua Email' : 'Giao tận nơi'}
                  </div>
                  <div className="text-slate-600">{viewOrderDetail.customerAddress}</div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h5 className="font-bold text-slate-700 mb-2">Danh sách sản phẩm ({viewOrderDetail.items.length})</h5>
                <div className="space-y-2">
                  {viewOrderDetail.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
                      <div className="flex items-center gap-2">
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{item.productName}</div>
                          <div className="text-[11px] text-slate-500">
                            Số lượng: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">{formatMonthlyJPY(item.monthlyPriceJPY * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700">Cước hàng tháng:</span>
                <span className="font-black text-lg text-cyan-700">{formatMonthlyJPY(viewOrderDetail.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewOrderDetail(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
