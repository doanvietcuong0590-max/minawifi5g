import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, X, KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, loginAdmin } = useApp();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(password);
    if (!success) {
      setErrorMsg('Mật khẩu không đúng. Mật khẩu mặc định: admin123');
    } else {
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        
        <button
          onClick={() => {
            setIsAdminLoginOpen(false);
            setPassword('');
            setErrorMsg('');
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-slate-900/10">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Đăng Nhập Quản Trị Viên</h3>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý đơn hàng, kho sản phẩm, chỉnh sửa giao diện và thông tin liên hệ website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Mật khẩu quản trị</span>
              <span className="text-[11px] text-slate-400 font-normal">Mặc định: <strong>admin123</strong></span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Nhập mật khẩu quản trị..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 cursor-pointer"
          >
            <span>Vào Bảng Điều Khiển</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            * Sau khi đăng nhập, bạn có thể đổi mật khẩu mới bất cứ lúc nào trong tab <strong>Bảo Mật</strong>.
          </p>
        </div>

      </div>
    </div>
  );
};
