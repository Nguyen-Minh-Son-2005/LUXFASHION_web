// src/components/ProductItem.jsx
import React from "react";

export default function ProductItem({ product, onEdit, onSelect }) {
  // product shape expected (ví dụ):
  // {
  //   id, name, description, price,
  //   category: { id, name }  OR categoryId
  //   supplier: { id, name }  OR supplierName
  //   imageUrls: [url,...],
  //   variants: [{ size: {id,name}, quantity }, ...],
  //   promotions: [{ id, name }, ...]
  // }

  // Backend trả về product.images (List<String>)
  const image = (product.images && product.images.length > 0) ? product.images[0] : "/placeholder.png";

  // Tính tổng số lượng từ variants
  // Backend getAllProducts không tính totalQuantity, chỉ có getProductById mới tính
  // Nên luôn tính từ variants ở frontend
  const totalQuantity = (product.variants || []).reduce((sum, v) => {
    const qty = Number(v.quantity) || 0;
    return sum + qty;
  }, 0);

  return (
    <div className="bg-slate-950/70 border border-b-cyan-300 rounded-3xl shadow-sm p-4 flex gap-4 items-start ">
      {/* Ảnh */}
      <div className="w-36 h-36 shrink-0 bg-slate-900 rounded-xl overflow-hidden">
        <img src={image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Thông tin chính */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-400">Mã: <span className="text-2xl font-bold bg-linear-to-b from-sky-300 to-pink-300 bg-clip-text text-transparent">{product.id}</span></div>
            <h3 className="text-lg font-semibold text-slate-50">{product.name}</h3>
            <div className="text-sm text-slate-300">
              Thể loại: <span className="font-medium">{product.category?.name ?? product.categoryName ?? "—"}</span>
              {"  •  "}
              Hãng: <span className="font-medium">{product.supplier?.name ?? product.supplierName ?? "—"}</span>
            </div>
          </div>

          {/* Giá */}
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-wide">Đơn giá</div>
            <div className="text-xl font-bold text-emerald-300">
              {Number(product.originalPrice || 0).toLocaleString()} VND
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <p className="mt-3 text-sm text-slate-200 line-clamp-3">
          {product.description || "—"}
        </p>

        <div className="mt-3 flex items-center gap-6 text-sm">
          {/* Khuyến mãi */}
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Khuyến mãi</div>
            <div className="text-rose-300">
              {(product.promotions && product.promotions.length > 0)
                ? product.promotions.map((p) => p.name).join(", ")
                : "Không"}
            </div>
          </div>

          {/*rating*/}
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Đánh giá</div>
            <div className="text-yellow-300 font-semibold">
              {product.averageRating ? product.averageRating.toFixed(1) : "Chưa có"}
            </div>
          </div>

          {/* Số lượng theo size (tóm tắt) */}
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Số lượng</div>
            <div className="text-slate-100">
              {(product.variants && product.variants.length > 0) ? (
                <div className="text-sm">
                  {product.variants.map((v, idx) => (
                    <div key={idx}>
                      <span className="font-medium">{v.size?.name ?? v.sizeName ?? `Size #${v.size?.id ?? v.sizeId ?? idx}`}</span>: {v.quantity || 0}
                    </div>
                  ))}
                  <div className="mt-1 text-sm">Tổng: <span className="font-semibold text-emerald-300">{totalQuantity}</span></div>
                </div>
              ) : (
                <div>{totalQuantity}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nút sửa + checkbox chọn */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit?.(product)}
          className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm hover:bg-slate-800"
        >
          Sửa
        </button>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            onChange={(e) => onSelect?.(product.id, e.target.checked)}
            className="w-5 h-5 rounded border-slate-600 text-emerald-400 focus:ring-emerald-500/70"
          />
          <span className="text-slate-300">Chọn</span>
        </label>
      </div>
    </div>
  );
}