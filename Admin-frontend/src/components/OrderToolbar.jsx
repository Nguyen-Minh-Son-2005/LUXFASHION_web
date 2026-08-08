// src/components/OrderToolbar.jsx
import React from "react";
import { Search } from "lucide-react";

export default function OrderToolbar({ onSearch, onSortChange }) {
  const sortOptions = [
    { value: "dateDesc", label: "Mới nhất" },
    { value: "dateAsc", label: "Cũ nhất" },
    { value: "amountDesc", label: "Giá cao → thấp" },
    { value: "amountAsc", label: "Giá thấp → cao" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-linear-to-r from-sky-300 via-emerald-300 to-violet-300 bg-clip-text text-transparent backdrop-blur-sm p-4 rounded-2xl shadow-sm mb-5 border border-slate-100">
      <div>
        <h2 className="text-lg font-semibold text-amber-50">Quản lý đơn hàng</h2>
        <p className="text-xs text-slate-400 mt-0.5">Lọc, tìm kiếm và sắp xếp danh sách đơn một cách nhanh chóng</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Dropdown sắp xếp */}
        {sortOptions.length > 0 && (
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-b-cyan-700 rounded-xl px-3 py-1.5 text-sm text-amber-50 bg-blue-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Ô tìm kiếm */}
        <div className="flex items-center border border-slate-200 rounded-full px-3 py-1.5 bg-slate-50">
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên KH, SĐT..."
            onChange={(e) => onSearch(e.target.value)}
            className="outline-none py-1 px-2 w-52 md:w-64 bg-transparent text-sm text-slate-800 placeholder:text-slate-400"
          />
          <Search size={18} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

