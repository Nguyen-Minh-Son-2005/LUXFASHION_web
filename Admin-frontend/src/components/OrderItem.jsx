// src/components/OrderItem.jsx
import React from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";

export default function OrderItem({
  order,
  onViewDetail,
  onConfirm,
  onApproveCancel,
  onRejectCancel,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/15 text-amber-300 border-amber-400/40";
      case "CONFIRMED":
        return "bg-sky-500/15 text-sky-300 border-sky-400/40";
      case "PROCESSING":
        return "bg-violet-500/15 text-violet-300 border-violet-400/40";
      case "DELIVERED":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-400/40";
      case "CANCELLED":
        return "bg-rose-500/15 text-rose-300 border-rose-400/40";
      case "CANCEL_REQUEST":
        return "bg-orange-500/15 text-orange-300 border-orange-400/40";
      default:
        return "bg-slate-600/20 text-slate-200 border-slate-500/50";
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

  const totalItems = order.billDetails?.length || 0;

  return (
    <div className="bg-slate-950/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 border border-slate-800">
      <div className="flex items-start justify-between gap-6">
        {/* Thông tin chính */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-xs font-semibold text-slate-200 border border-slate-700">
              #{order.id}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-3 text-slate-600">
            <div className="space-y-1">
              <div>
                <span className="text-blue-50">Khách hàng:</span>
                <span className="ml-2 font-medium text-emerald-200">{order.shippingName || "—"}</span>
              </div>
              <div>
                <span className="text-blue-50">SĐT:</span>
                <span className="ml-2 font-medium text-emerald-200">{order.shippingPhone || "—"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div>
                <span className="text-blue-50">Ngày đặt:</span>
                <span className="ml-2 font-medium text-emerald-200">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-blue-50">Số sản phẩm:</span>
                <span className="ml-2 font-medium text-emerald-200">{totalItems} sản phẩm</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-blue-50">
            <span className="text-blue-50">Địa chỉ:</span>
            <span className="ml-2 text-emerald-200">{order.shippingAddress || "—"}</span>
          </div>

          {order.shippingNote && (
            <div className="mt-2 text-sm">
              <span className="text-blue-50">Ghi chú:</span>
              <span className="ml-2 text-amber-50 italic">{order.shippingNote}</span>
            </div>
          )}
        </div>

        {/* Tổng tiền và hành động */}
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <div className="text-xs font-medium tracking-wide text-amber-400 uppercase">Tổng tiền</div>
            <div className="text-2xl font-bold text-emerald-300">
              {Number(order.totalAmount || 0).toLocaleString("vi-VN")} VND
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={() => onViewDetail(order)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-full text-sm border border-slate-700 transition"
              title="Xem chi tiết"
            >
              <Eye size={16} />
              Chi tiết
            </button>

            {/* Các nút hành động theo trạng thái */}
            {order.status === "PENDING" && (
              <button
                onClick={() => onConfirm(order.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm shadow-sm transition"
                title="Xác nhận đơn hàng"
              >
                <CheckCircle size={16} />
                Xác nhận
              </button>
            )}

            {order.status === "CANCEL_REQUEST" && (
              <>
                <button
                  onClick={() => onApproveCancel(order.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm shadow-sm transition"
                  title="Duyệt hủy đơn"
                >
                  <CheckCircle size={16} />
                  Duyệt hủy
                </button>
                <button
                  onClick={() => onRejectCancel(order.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm shadow-sm transition"
                  title="Từ chối hủy đơn"
                >
                  <XCircle size={16} />
                  Từ chối
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

