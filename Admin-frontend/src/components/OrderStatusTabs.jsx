// src/components/OrderStatusTabs.jsx
import React from "react";

export default function OrderStatusTabs({ currentStatus, onStatusChange }) {
  const statuses = [
    { value: "ALL", label: "Tất cả", count: null },
    { value: "PENDING", label: "Chờ xử lý", count: null },
    { value: "CONFIRMED", label: "Đã xác nhận", count: null },
    { value: "PROCESSING", label: "Đang giao hàng", count: null },
    { value: "DELIVERED", label: "Đã giao", count: null },
    { value: "CANCEL_REQUEST", label: "Yêu cầu hủy", count: null },
    { value: "CANCELLED", label: "Đã hủy", count: null },
  ];

  return (
    <div className="bg-linear-to-r from-sky-300 via-emerald-300 to-violet-300 bg-clip-text text-transparent backdrop-blur-sm rounded-2xl shadow-sm p-2 mb-5 border border-sky-800">
      <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value === "ALL" ? null : status.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              (currentStatus === null && status.value === "ALL") ||
              (currentStatus === status.value && status.value !== "ALL")
                ? "bg-linear-to-r from-sky-300 via-emerald-300 to-violet-300 text-blue-950 shadow-sm"
                : "bg-cyan-500 text-amber-50 hover:bg-slate-100 border border-slate-900"
            }`}
          >
            {status.label}
            {status.count !== null && (
              <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                {status.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

