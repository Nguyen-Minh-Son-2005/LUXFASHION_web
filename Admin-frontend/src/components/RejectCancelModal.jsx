// src/components/RejectCancelModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export default function RejectCancelModal({ order, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm(order.id, reason);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-950/90 rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,1)] max-w-md w-full border border-slate-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-50">Từ chối yêu cầu hủy đơn</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-slate-200 mb-2 text-sm">
              Bạn có chắc chắn muốn từ chối yêu cầu hủy đơn hàng <strong>#{order?.id}</strong>?
            </p>
            <p className="text-xs text-slate-400">
              Đơn hàng sẽ được chuyển về trạng thái "Chờ xử lý".
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-200">
                Lý do từ chối (tùy chọn):
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="w-full border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
                rows="3"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold"
              >
                Từ chối hủy đơn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

