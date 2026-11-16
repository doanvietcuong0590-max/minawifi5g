import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatJPY, formatMonthlyJPY, formatDate, getStatusBadgeInfo } from '../utils/formatters';
import { 
  X, 
  Search, 
  PackageSearch, 
  Truck, 
  AlertCircle, 
  Phone, 
  Info
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { 
    isOrderTrackingOpen, 
    setIsOrderTrackingOpen, 
    trackingQuery, 
    setTrackingQuery, 
    getOrderById, 
    getOrdersByPhone,
    orders,
    siteSettings
  } = useApp();

  const [inputQuery, setInputQuery] = useState(trackingQuery || '');
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Sync when trackingQuery changes externally
  useEffect(() => {
    if (trackingQuery) {
      setInputQuery(trackingQuery);
      performSearch(trackingQuery);
    }
  }, [trackingQuery]);

  // Keep selected order in sync in real time when admin updates status!
  useEffect(() => {
    if (selectedOrder) {
      const refreshed = orders.find(o => o.id === selectedOrder.id);
      if (refreshed) {
        setSelectedOrder(refreshed);
      }
    }
  }, [orders]);

  const performSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSelectedOrder(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);

    // Try finding by Order ID first
    const byId = getOrderById(trimmed);
    if (byId) {
      setSearchResults([byId]);
      setSelectedOrder(byId);
      return;
    }

    // Try finding by phone number
    const byPhone = getOrdersByPhone(trimmed);
    if (byPhone.length > 0) {
      setSearchResults(byPhone);
      setSelectedOrder(byPhone[0]);
      return;
    }

    // No results
    setSearchResults([]);
    setSelectedOrder(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(inputQuery);
  };

  const copyTrackingNum = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  if (!isOrderTrackingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsOrderTrackingOpen(false);
            setTrackingQuery('');
          }}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8">
          
          {/* Header */}
          <div className="mb-6 pr-8">
            <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider">
              <PackageSearch className="w-4 h-4" />
              <span>Hệ thống tra cứu thời gian thực</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Tra Cứu Tiến Trình Đơn Hàng
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhập mã đơn (ví dụ: <button type="button" onClick={() => { setInputQuery('WF-892314'); performSearch('WF-892314'); }} className="text-cyan-600 font-mono font-bold underline">WF-892314</button> hoặc <button type="button" onClick={() => { setInputQuery('WF-892315'); performSearch('WF-892315'); }} className="text-cyan-600 font-mono font-bold underline">WF-892315</button>) hoặc số điện thoại đặt hàng.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Nhập mã đơn hàng (WF-...) hoặc Số điện thoại"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              Tra Cứu
            </button>
          </form>

          {/* If multiple orders for the phone number */}
          {searchResults.length > 1 && (
            <div className="mb-6">
              <div className="text-xs font-bold text-slate-700 mb-2">
                Tìm thấy {searchResults.length} đơn hàng liên kết với số điện thoại này:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchResults.map((order) => {
                  const badge = getStatusBadgeInfo(order.status);
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-600 bg-cyan-50/70 shadow-xs ring-1 ring-cyan-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-mono font-bold text-xs text-slate-900">{order.id}</div>
                        <div className="text-[11px] text-slate-500">{formatDate(order.createdAt)}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Order Details */}
          {selectedOrder ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Order Status Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Mã đơn hàng</span>
                    <h4 className="text-xl font-black text-cyan-400 font-mono tracking-wider">{selectedOrder.id}</h4>
                    <span className="text-xs text-slate-400">Đặt lúc: {formatDate(selectedOrder.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(() => {
                      const badge = getStatusBadgeInfo(selectedOrder.status);
                      return (
                        <div className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-2 border ${badge.color}`}>
                          <span className={`w-2 h-2 rounded-full ${badge.dot} animate-ping`} />
                          <span>{badge.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Real-time Order Timeline Progress Bar */}
                {selectedOrder.status !== 'cancelled' ? (
                  <div className="pt-5 pb-2">
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      
                      {/* Step 1: Pending */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 z-10 ${
                          ['pending', 'confirmed', 'shipping', 'completed'].includes(selectedOrder.status)
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          ✓
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">Tiếp nhận</span>
                      </div>

                      {/* Step 2: Confirmed */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 z-10 ${
                          ['confirmed', 'shipping', 'completed'].includes(selectedOrder.status)
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {['confirmed', 'shipping', 'completed'].includes(selectedOrder.status) ? '✓' : '2'}
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">Xác nhận</span>
                      </div>

                      {/* Step 3: Shipping */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 z-10 ${
                          ['shipping', 'completed'].includes(selectedOrder.status)
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {['shipping', 'completed'].includes(selectedOrder.status) ? '✓' : '3'}
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">Đang giao</span>
                      </div>

                      {/* Step 4: Completed */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 z-10 ${
                          selectedOrder.status === 'completed'
                            ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {selectedOrder.status === 'completed' ? '✓' : '4'}
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">Hoàn tất</span>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="pt-4 pb-2 text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Đơn hàng này đã được huỷ bỏ.</span>
                  </div>
                )}

                {/* Latest Status Note from Admin */}
                {selectedOrder.statusNote && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-cyan-300">Cập nhật mới nhất từ quản trị: </span>
                      <span>{selectedOrder.statusNote}</span>
                    </div>
                  </div>
                )}

                {/* Tracking Number if provided */}
                {selectedOrder.trackingNumber && (
                  <div className="mt-2 p-3 rounded-xl bg-cyan-950/50 border border-cyan-800/50 text-xs text-cyan-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span>Mã vận đơn / Mã kích hoạt: <strong className="font-mono text-white">{selectedOrder.trackingNumber}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyTrackingNum(selectedOrder.trackingNumber!)}
                      className="text-[11px] font-bold bg-cyan-800/80 hover:bg-cyan-700 text-white px-2 py-1 rounded cursor-pointer"
                    >
                      {copiedTracking ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>
                )}

              </div>

              {/* Items List */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Sản phẩm đã đặt ({selectedOrder.items.length})
                </h5>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-900 line-clamp-1">{item.productName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-slate-700">Số lượng: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xs text-slate-900">{formatMonthlyJPY(item.monthlyPriceJPY * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Cước hàng tháng:</span>
                  <span className="text-base font-black text-cyan-700">{formatMonthlyJPY(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Delivery and Customer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold">Khách hàng:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedOrder.customerName}</div>
                  {selectedOrder.customerPhone ? (
                    <div className="text-slate-600 font-mono">{selectedOrder.customerPhone}</div>
                  ) : (
                    <div className="text-slate-400 italic text-[11px]">Chưa cung cấp SĐT</div>
                  )}
                  {selectedOrder.customerEmail && <div className="text-slate-500">{selectedOrder.customerEmail}</div>}
                </div>

                <div>
                  <span className="text-slate-400 font-semibold">Địa chỉ / Quầy nhận:</span>
                  <div className="font-medium text-slate-800 mt-0.5">{selectedOrder.customerAddress || 'Gửi qua Email / WhatsApp'}</div>
                  {selectedOrder.departureDate && (
                    <div className="text-slate-500 mt-1">Ngày khởi hành: {selectedOrder.departureDate}</div>
                  )}
                </div>
              </div>

              {/* Support Hotline CTA */}
              <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-xs flex items-center justify-between">
                <span className="text-cyan-900">Cần hỗ trợ gấp về đơn hàng này?</span>
                <a
                  href={`tel:${siteSettings.hotline.replace(/\s+/g, '')}`}
                  className="font-bold text-cyan-700 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi {siteSettings.hotline}</span>
                </a>
              </div>

            </div>
          ) : hasSearched ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-500 mb-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Không tìm thấy đơn hàng</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Không tìm thấy đơn hàng với mã hoặc số điện thoại &quot;{inputQuery}&quot;. Vui lòng kiểm tra lại số điện thoại hoặc mã đơn đã được cấp.
              </p>
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};
