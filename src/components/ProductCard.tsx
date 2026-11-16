import React from 'react';
import { Product } from '../types';
import { formatJPY, formatMonthlyJPY, getWhatsAppProductUrl } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import { ChevronRight, Info, Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { 
    siteSettings,
    isAdmin, 
    isLiveEditMode, 
    setEditingProductModal, 
    deleteProduct,
    currentLanguage
  } = useApp();

  const whatsappUrl = getWhatsAppProductUrl(
    product,
    siteSettings.whatsappPhone || siteSettings.zaloPhone,
    siteSettings.siteName,
    undefined,
    currentLanguage
  );

  const handleDirectEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProductModal(product);
  };

  const handleDirectDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Xoá sản phẩm "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const handleWhatsAppRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const freshUrl = getWhatsAppProductUrl(
      product,
      siteSettings.whatsappPhone || siteSettings.zaloPhone,
      siteSettings.siteName,
      undefined,
      currentLanguage
    );
    e.currentTarget.href = freshUrl;
  };

  return (
    <div className={`group relative bg-white rounded-3xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
      isAdmin && isLiveEditMode 
        ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md' 
        : 'border-slate-200/90 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-900/5'
    }`}>
      
      {/* ADMIN IN-PLACE DIRECT EDIT OVERLAY BADGE */}
      {isAdmin && isLiveEditMode && (
        <div className="bg-cyan-950 text-white px-3 py-1.5 flex items-center justify-between text-xs border-b border-cyan-800">
          <span className="font-extrabold text-cyan-300 text-[11px] flex items-center gap-1">
            <span>🛠 Sửa trực tiếp:</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDirectEdit}
              className="px-2.5 py-0.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Chỉnh sửa hình ảnh, tên, giá cước Yên, mô tả"
            >
              <Edit className="w-3 h-3" />
              <span>Sửa</span>
            </button>
            <button
              type="button"
              onClick={handleDirectDelete}
              className="p-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 transition-colors cursor-pointer"
              title="Xoá sản phẩm này"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 1. HÌNH ẢNH SẢN PHẨM */}
      <div 
        onClick={() => onSelect(product)}
        className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 cursor-pointer"
        title="Nhấn vào ảnh để xem chi tiết sản phẩm"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />

        {/* Hover edit prompt when admin is active */}
        {isAdmin && isLiveEditMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDirectEdit(e);
            }}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer z-10"
          >
            <div className="px-3.5 py-2 rounded-xl bg-cyan-600 text-white shadow-xl flex items-center gap-1.5">
              <Edit className="w-4 h-4" />
              <span>Sửa ảnh & thông tin</span>
            </div>
          </button>
        )}

        {/* Badge giá cước tiền Yên nổi bật góc trên */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-xs font-black px-3 py-1 rounded-full shadow-lg pointer-events-none">
          {formatMonthlyJPY(product.monthlyPriceJPY)}
        </div>

        {/* Trạng thái còn hàng */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md ${
            product.inStock !== false ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {product.inStock !== false ? 'Còn hàng' : 'Hết hàng'}
          </span>
        </div>
      </div>

      {/* THÔNG TIN CHI TIẾT */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* 2. TÊN SẢN PHẨM */}
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={(e) => {
                if (isAdmin && isLiveEditMode) {
                  e.stopPropagation();
                  handleDirectEdit(e);
                } else {
                  onSelect(product);
                }
              }}
              className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug line-clamp-2 transition-colors flex-1 cursor-pointer hover:text-cyan-600 hover:underline"
              title={isAdmin && isLiveEditMode ? 'Click để sửa tên sản phẩm' : 'Nhấn vào tên để xem chi tiết sản phẩm'}
            >
              {product.name}
            </h3>
            {isAdmin && isLiveEditMode && (
              <button
                type="button"
                onClick={handleDirectEdit}
                className="text-cyan-600 hover:text-cyan-800 p-1 rounded-lg hover:bg-cyan-50 shrink-0 cursor-pointer"
                title="Chỉnh sửa tên & thông tin"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3. GIÁ CƯỚC HÀNG THÁNG TIỀN YÊN */}
          <div 
            onClick={isAdmin && isLiveEditMode ? handleDirectEdit : undefined}
            className={`mt-3 flex items-baseline gap-1.5 ${
              isAdmin && isLiveEditMode ? 'cursor-pointer hover:opacity-80' : ''
            }`}
            title={isAdmin && isLiveEditMode ? 'Click để sửa giá cước Yên' : undefined}
          >
            <span className="text-xs text-slate-500 font-semibold uppercase">Cước hàng tháng:</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-700 tracking-tight">
              {formatJPY(product.monthlyPriceJPY)}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ tháng</span>
          </div>

          {/* 4. MÔ TẢ SẢN PHẨM */}
          <p 
            onClick={isAdmin && isLiveEditMode ? handleDirectEdit : undefined}
            className={`mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 ${
              isAdmin && isLiveEditMode ? 'cursor-pointer hover:text-cyan-700 hover:bg-cyan-50/50 p-1 -m-1 rounded' : ''
            }`}
            title={isAdmin && isLiveEditMode ? 'Click để sửa mô tả sản phẩm' : undefined}
          >
            {product.description}
          </p>
        </div>

        {/* NÚT THAO TÁC */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => onSelect(product)}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
            title="Xem chi tiết gói cước"
          >
            <Info className="w-4 h-4" />
          </button>

          {product.inStock !== false ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppRedirect}
              className="flex-1 min-w-0 py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-[0.98] cursor-pointer"
              title={`Đăng ký gói ${product.name} chuyển tiếp sang WhatsApp`}
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.086-.179.18-.077.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
              </svg>
              <span className="truncate">Đăng Ký Ngay</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            </a>
          ) : (
            <button
              disabled
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-200 text-slate-400 cursor-not-allowed shadow-none flex items-center justify-center gap-1.5"
            >
              <span>Hết Hàng</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
