// src/components/PromotionItem.jsx

export default function PromotionItem({ promo, onSelect, onEdit }) {
  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("vi-VN");
  };

  const statusColor =
    promo.status === "ACTIVE" ? "text-emerald-300" : "text-slate-400";

  return (
    <div className="flex border-b border-slate-900/70 py-4 gap-4 items-center">

      {/* Khung mã khuyến mãi (ID) */}
      <div className="w-24 h-24 border border-slate-700 rounded-2xl flex items-center justify-center text-lg font-bold bg-slate-900 text-slate-50">
        {promo.id}
      </div>

      {/* Chi tiết */}
      <div className="flex-1 space-y-1">
        {/* Tên */}
        <h2 className="text-xl font-semibold text-slate-50">{promo.name}</h2>

        {/* Mô tả */}
        <p className="text-slate-300 text-sm">{promo.description}</p>

        {/* Phần trăm giảm */}
        <p className="text-rose-400 font-bold text-lg">
          -{promo.discountPercentage}% 
        </p>

        {/* Ngày */}
        <p className="text-sm text-slate-400">
          {formatDate(promo.startDate)} → {formatDate(promo.endDate)}
        </p>

        {/* Trạng thái */}
        <p className={`font-semibold text-sm ${statusColor}`}>
          ● {promo.status}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center gap-2 px-2">
        <button
          className="border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100 px-4 py-1 rounded-lg text-sm"
          onClick={() => onEdit(promo)}
        >
          Sửa
        </button>

        <input
          type="checkbox"
          className="w-4 h-4 rounded border-slate-600 text-emerald-400 focus:ring-emerald-500/70"
          onChange={() => onSelect(promo.id)}
        />
      </div>

    </div>
  );
}