import { Search, Plus, Trash2 } from "lucide-react";

export default function Toolbar({
  title,
  onAdd,
  onDelete,
  onSearch,
  onSortChange,
  sortOptions = [],
  searchPlaceholder = "Nhập để tìm...",
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl shadow-sm">
      {/* Bên trái: Tiêu đề (nếu có) */}
      {title && <h2 className="text-lg font-semibold text-slate-50">{title}</h2>}

      {/* Bên phải: Các thao tác */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onAdd}
          className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-xl text-sm shadow-sm"
        >
          <Plus size={16} /> Thêm
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-xl text-sm shadow-sm"
        >
          <Trash2 size={16} /> Xóa
        </button>

        {/* Dropdown sắp xếp */}
        {sortOptions.length > 0 && (
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-slate-700 rounded-xl px-2 py-1 text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          >
            {sortOptions.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Ô tìm kiếm */}
        <div className="flex items-center border border-slate-700 rounded-full px-2 bg-slate-900/70">
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch(e.target.value)}
            className="outline-none py-1.5 px-1.5 w-65 bg-transparent text-sm text-slate-50 placeholder:text-slate-500"
          />
          <Search size={18} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
}