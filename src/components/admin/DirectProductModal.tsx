import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { formatMonthlyJPY } from '../../utils/formatters';
import { PRESET_PRODUCT_IMAGES } from '../../data/initialData';
import { compressImage } from '../../utils/imageCompressor';
import { X, Upload, Image as ImageIcon, Check, Sparkles, Loader2 } from 'lucide-react';

export const DirectProductModal: React.FC = () => {
  const { 
    editingProductModal, 
    setEditingProductModal, 
    addProduct, 
    updateProduct, 
    showToast 
  } = useApp();

  const [form, setForm] = useState<Partial<Product>>({
    image: PRESET_PRODUCT_IMAGES[0].url,
    name: '',
    monthlyPriceJPY: 3500,
    description: '',
    inStock: true
  });

  const [showGallery, setShowGallery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressingImg, setIsCompressingImg] = useState(false);

  useEffect(() => {
    if (editingProductModal && editingProductModal !== 'new') {
      setForm({ ...editingProductModal });
    } else if (editingProductModal === 'new') {
      setForm({
        image: PRESET_PRODUCT_IMAGES[0].url,
        name: '',
        monthlyPriceJPY: 3500,
        description: '',
        inStock: true
      });
    }
  }, [editingProductModal]);

  if (!editingProductModal) return null;

  const isEditing = editingProductModal !== 'new';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ảnh quá lớn', 'Vui lòng chọn ảnh dung lượng dưới 5MB', 'error');
        return;
      }
      setIsCompressingImg(true);
      try {
        const compressed = await compressImage(file, 800, 0.75);
        if (compressed) {
          setForm(prev => ({ ...prev, image: compressed }));
          showToast('Đã tải ảnh lên', 'Ảnh sản phẩm đã được tối ưu dung lượng thành công', 'success');
        } else {
          showToast('Lỗi ảnh', 'Không thể xử lý ảnh này, vui lòng thử ảnh khác', 'error');
        }
      } catch (err) {
        console.warn('Compress image error:', err);
        showToast('Lỗi tải ảnh', 'Có lỗi khi nén ảnh, vui lòng thử lại', 'error');
      } finally {
        setIsCompressingImg(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      showToast('Thiếu thông tin', 'Vui lòng nhập tên sản phẩm', 'error');
      return;
    }
    if (!form.monthlyPriceJPY || Number(form.monthlyPriceJPY) <= 0) {
      showToast('Thiếu thông tin', 'Vui lòng nhập giá cước hàng tháng bằng tiền Yên', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && typeof editingProductModal === 'object') {
        await updateProduct(editingProductModal.id, {
          image: form.image || editingProductModal.image,
          name: form.name.trim(),
          monthlyPriceJPY: Number(form.monthlyPriceJPY),
          description: form.description?.trim() || '',
          inStock: form.inStock ?? true
        });
      } else {
        await addProduct({
          image: form.image || PRESET_PRODUCT_IMAGES[0].url,
          name: form.name.trim(),
          monthlyPriceJPY: Number(form.monthlyPriceJPY),
          description: form.description?.trim() || '',
          inStock: form.inStock ?? true
        });
      }
      setEditingProductModal(null);
    } catch (err) {
      console.error('Error saving product in DirectProductModal:', err);
      showToast('Lỗi', 'Không thể hoàn tất thao tác. Vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-7 relative my-auto animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => setEditingProductModal(null)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3 text-cyan-600" />
            <span>Chỉnh sửa trực tiếp trên giao diện</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            {isEditing ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Thay đổi hình ảnh, tên sản phẩm, giá cước hàng tháng (tiền Yên) và mô tả.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. HÌNH ẢNH SẢN PHẨM */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              1. Hình ảnh sản phẩm <span className="text-red-500">*</span>:
            </label>

            <div className="flex items-center gap-4">
              <img
                src={form.image || PRESET_PRODUCT_IMAGES[0].url}
                alt="Product preview"
                className="w-20 h-20 rounded-xl object-cover border border-slate-300 shrink-0 bg-white"
              />

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Dán đường link URL hình ảnh..."
                  value={form.image || ''}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 bg-white"
                />

                <div className="flex flex-wrap gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh từ máy</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowGallery(!showGallery)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Kho ảnh mẫu</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery picker */}
            {showGallery && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700">Chọn ảnh mẫu có sẵn:</span>
                  <button
                    type="button"
                    onClick={() => setShowGallery(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-700"
                  >
                    Đóng
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setForm(prev => ({ ...prev, image: preset.url }));
                        setShowGallery(false);
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
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* 3. GIÁ CƯỚC HÀNG THÁNG BẰNG TIỀN YÊN */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>3. Giá cước hàng tháng bằng tiền Yên (¥) <span className="text-red-500">*</span>:</span>
              {form.monthlyPriceJPY ? (
                <span className="text-cyan-700 font-extrabold text-xs">
                  Hiển thị: {formatMonthlyJPY(Number(form.monthlyPriceJPY))}
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
                value={form.monthlyPriceJPY || ''}
                onChange={(e) => setForm({ ...form, monthlyPriceJPY: Number(e.target.value) })}
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
              rows={3}
              required
              placeholder="Nhập thông tin mô tả chi tiết: tốc độ mạng, dung lượng, thiết bị kết nối..."
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Tình trạng còn hàng */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="directInStock"
              checked={form.inStock !== false}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="w-4 h-4 accent-cyan-600 rounded cursor-pointer"
            />
            <label htmlFor="directInStock" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Đang còn hàng và sẵn sàng nhận đăng ký
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setEditingProductModal(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              Huỷ
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isCompressingImg}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Lưu Thay Đổi Ngay' : 'Tạo Sản Phẩm Mới'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
