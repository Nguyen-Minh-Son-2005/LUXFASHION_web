// src/components/OrderDetailModal.jsx
import React from "react";
import { X, Package, User, MapPin, Phone, FileText } from "lucide-react";

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/15 text-amber-700";
      case "CONFIRMED":
        return "bg-sky-500/15 text-sky-700";
      case "PROCESSING":
        return "bg-violet-500/15 text-violet-700";
      case "DELIVERED":
        return "bg-emerald-500/15 text-emerald-700";
      case "CANCELLED":
        return "bg-rose-500/15 text-rose-700";
      case "CANCEL_REQUEST":
        return "bg-orange-500/15 text-orange-700";
      default:
        return "bg-slate-200 text-slate-800";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Chờ xử lý",
      CONFIRMED: "Đã xác nhận",
      PROCESSING: "Đang giao hàng",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
      CANCEL_REQUEST: "Yêu cầu hủy",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,1)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Chi tiết đơn hàng</p>
            <h2 className="text-xl font-semibold text-slate-50">#{order.id}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Thông tin đơn hàng */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-50">
              <Package size={20} />
              Thông tin đơn hàng
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
              <div>
                <span className="text-slate-400">Mã đơn hàng:</span>
                <span className="ml-2 font-medium text-slate-50">#{order.id}</span>
              </div>
              <div>
                <span className="text-slate-400">Ngày đặt:</span>
                <span className="ml-2 font-medium text-slate-50">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-slate-400">Trạng thái:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Tổng tiền:</span>
                <span className="ml-2 font-bold text-lg text-emerald-300">
                  {Number(order.totalAmount || 0).toLocaleString("vi-VN")} VND
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-50">
              <User size={20} />
              Thông tin khách hàng
            </h3>
            <div className="space-y-2 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <span className="text-slate-400">Tên:</span>
                <span className="ml-2 font-medium text-slate-50">{order.shippingName || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-400">SĐT:</span>
                <span className="ml-2 font-medium text-slate-50">{order.shippingPhone || "—"}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <span className="text-slate-400">Địa chỉ:</span>
                  <span className="ml-2 text-slate-50">{order.shippingAddress || "—"}</span>
                </div>
              </div>
              {order.shippingNote && (
                <div className="flex items-start gap-2">
                  <FileText size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Ghi chú:</span>
                    <span className="ml-2 italic text-slate-200">{order.shippingNote}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-50">
              <Package size={20} />
              Sản phẩm ({order.billDetails?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.billDetails && order.billDetails.length > 0 ? (
                order.billDetails.map((detail,index) => (
                  <div
                    // Nếu detail.id không có, dùng index làm key tạm thời
                    key={detail.id || index} 
                    className="bg-slate-950 rounded-xl p-3 flex gap-4 items-center border border-slate-800"
                  >
                    <div className="w-20 h-20 bg-slate-900 rounded-lg overflow-hidden shrink-0">
                      {detail.imageUrl ? (
                        <img
                          src={detail.imageUrl}
                          alt={detail.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-50">{detail.productName || "—"}</div>
                      <div className="text-sm text-slate-300 mt-1">
                        Màu: <span className="font-medium">{detail.colorName || "—"}</span>
                        {" • "}
                        Size: <span className="font-medium">{detail.sizeName || "—"}</span>
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        Số lượng: <span className="font-medium">{detail.quantity}</span>
                        {" • "}
                        Đơn giá: <span className="font-medium">
                          {Number(detail.price || 0).toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium tracking-wide text-slate-400 uppercase">Thành tiền</div>
                      <div className="text-lg font-bold text-emerald-300">
                        {Number((detail.price || 0) * (detail.quantity || 0)).toLocaleString("vi-VN")} VND
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-4 text-sm">Không có sản phẩm</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/80 border-t border-slate-800 px-6 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

