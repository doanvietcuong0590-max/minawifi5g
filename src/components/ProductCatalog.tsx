import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { InlineText } from './InlineText';
import { formatJPY, formatMonthlyJPY, getWhatsAppProductUrl } from '../utils/formatters';
import { 
  Search, 
  Sparkles,
  X,
  ChevronRight,
  Plus
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const { 
    products, 
    siteSettings,
    setActiveOrderProduct, 
    isAdmin, 
    isLiveEditMode, 
    setEditingProductModal,
    currentLanguage
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Filter products by keyword
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.monthlyPriceJPY - b.monthlyPriceJPY;
      if (sortBy === 'price_desc') return b.monthlyPriceJPY - a.monthlyPriceJPY;
      return 0;
    });
  }, [products, searchQuery, sortBy]);

  return (
    <section id="products-section" className="py-14 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <InlineText textKey="catalog_badge" defaultValue="Danh mục sản phẩm" label="Huy hiệu danh mục" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            <InlineText textKey="catalog_title" defaultValue="Bảng Giá Cước Sim & Pocket WiFi Hàng Tháng" label="Tiêu đề danh mục" as="span" />
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            <InlineText textKey="catalog_desc" defaultValue="Cung cấp các gói cước Sim 4G/5G và Pocket WiFi Nhật Bản thanh toán theo tháng bằng tiền Yên (¥). Không hợp đồng ràng buộc, tốc độ cao ổn định." multiline={true} label="Mô tả danh mục" as="span" />
          </p>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm hoặc từ khoá mô tả (Pocket WiFi, Docomo, Softbank, eSIM...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-start gap-2 text-xs text-slate-600">
            <span className="font-semibold whitespace-nowrap shrink-0">Sắp xếp cước:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="default">Mặc định</option>
              <option value="price_asc">Giá cước: Thấp đến cao</option>
              <option value="price_desc">Giá cước: Cao xuống thấp</option>
            </select>
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 || (isAdmin && isLiveEditMode) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admin In-Place Add Product Card */}
            {isAdmin && isLiveEditMode && (
              <button
                type="button"
                onClick={() => setEditingProductModal('new')}
                className="min-h-[380px] rounded-3xl border-2 border-dashed border-cyan-400 bg-cyan-50/40 hover:bg-cyan-50/80 p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:scale-[1.01]"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/30 group-hover:scale-110 transition-transform mb-3">
                  <Plus className="w-7 h-7" />
                </div>
                <h4 className="font-black text-slate-900 text-base">Thêm Sản Phẩm Mới</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                  Tạo sản phẩm trực tiếp: ảnh, tên, giá tiền Yên, mô tả
                </p>
              </button>
            )}

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => setDetailProduct(prod)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Không có sản phẩm nào khớp với từ khoá &quot;{searchQuery}&quot;. Vui lòng thử tìm từ khoá khác.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Xem lại tất cả sản phẩm
            </button>
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 overflow-hidden">
            
            {/* 1. Hình ảnh sản phẩm */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-100">
              <img
                src={detailProduct.image}
                alt={detailProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <button
                onClick={() => setDetailProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs bg-cyan-500 text-slate-950 px-3 py-1 rounded-full font-black">
                  {formatMonthlyJPY(detailProduct.monthlyPriceJPY)}
                </span>
                {/* 2. Tên sản phẩm */}
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mt-2">
                  {detailProduct.name}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              
              {/* 3. Giá cước hàng tháng bằng tiền Yên */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase">Giá cước hàng tháng:</div>
                  <div className="text-2xl font-black text-cyan-700 mt-0.5">
                    {formatJPY(detailProduct.monthlyPriceJPY)} <span className="text-sm font-semibold text-slate-500">/ tháng</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    detailProduct.inStock !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {detailProduct.inStock !== false ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
              </div>

              {/* 4. Mô tả sản phẩm */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mô tả sản phẩm:</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {detailProduct.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setDetailProduct(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer text-center"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveOrderProduct(detailProduct);
                    setDetailProduct(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Điền đơn đặt hàng online trực tiếp trên website"
                >
                  <span>Điền đơn trên Web</span>
                </button>

                {detailProduct.inStock !== false ? (
                  <a
                    href={getWhatsAppProductUrl(
                      detailProduct,
                      siteSettings.whatsappPhone || siteSettings.zaloPhone,
                      siteSettings.siteName,
                      undefined,
                      currentLanguage
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      const freshUrl = getWhatsAppProductUrl(
                        detailProduct,
                        siteSettings.whatsappPhone || siteSettings.zaloPhone,
                        siteSettings.siteName,
                        undefined,
                        currentLanguage
                      );
                      e.currentTarget.href = freshUrl;
                      setDetailProduct(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                    title={`Đăng ký gói ${detailProduct.name} chuyển tiếp sang WhatsApp`}
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.086-.179.18-.077.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
                    </svg>
                    <span>Đăng Ký Ngay</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed text-center"
                  >
                    Hết Hàng
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
