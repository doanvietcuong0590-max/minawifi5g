import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  SlidersHorizontal, 
  Plus, 
  Edit3, 
  LogOut, 
  CheckCircle,
  Eye,
  Lock
} from 'lucide-react';

export const AdminLiveBar: React.FC = () => {
  const { 
    isAdmin, 
    isLiveEditMode, 
    setIsLiveEditMode, 
    setIsAdminDashboardOpen, 
    setEditingProductModal, 
    resetAllTexts,
    logoutAdmin,
    showToast 
  } = useApp();

  if (!isAdmin) return null;

  return (
    <div className="sticky top-0 z-50 bg-slate-950 text-white px-3 sm:px-6 py-2 border-b border-cyan-500/30 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Admin Status & Mode Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Admin</span>
          </div>

          {/* Toggle Live Edit Mode */}
          <button
            type="button"
            onClick={() => {
              const next = !isLiveEditMode;
              setIsLiveEditMode(next);
              showToast(
                next ? 'Bật Chế Độ Sửa Trực Tiếp' : 'Tắt Chế Độ Sửa Trực Tiếp',
                next ? 'Bấm trực tiếp vào bất kỳ dòng chữ hoặc tiêu đề nào trên website để sửa ngay' : 'Đã quay lại chế độ xem khách thông thường',
                'info'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              isLiveEditMode
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm shadow-emerald-500/30 ring-2 ring-emerald-400/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Chế độ sửa trực tiếp: {isLiveEditMode ? 'BẬT (Click để sửa chữ)' : 'TẮT'}</span>
            <span className="sm:hidden">Sửa: {isLiveEditMode ? 'BẬT' : 'TẮT'}</span>
          </button>
        </div>

        {/* Center: Helpful tip */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {isLiveEditMode 
              ? '✨ Click vào bất kỳ dòng chữ nào trên trang để sửa trực tiếp và lưu ngay!' 
              : 'Bật chế độ sửa trực tiếp để chỉnh sửa chữ ngoài trang web'}
          </span>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Add Product Button */}
          <button
            type="button"
            onClick={() => setEditingProductModal('new')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm sản phẩm</span>
          </button>

          {/* Reset texts button */}
          {isLiveEditMode && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Khôi phục toàn bộ các đoạn văn bản tuỳ chỉnh về mặc định ban đầu?')) {
                  resetAllTexts();
                }
              }}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Khôi phục tất cả các chữ đã sửa về ban đầu"
            >
              Đặt lại chữ gốc
            </button>
          )}

          {/* Open full admin dashboard */}
          <button
            type="button"
            onClick={() => setIsAdminDashboardOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Bảng Quản Trị</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={logoutAdmin}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Đăng xuất quản trị"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
