// src/components/PromotionEditModal.jsx
import { useState, useEffect } from "react";
import { updatePromotion } from "../services/promotionService";

export default function PromotionEditModal({ promotion, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    discountPercentage: "",
    status: "ACTIVE",
  });

  // Khi modal mở → đổ dữ liệu vào form
  useEffect(() => {
    if (promotion) {
      setForm({
        name: promotion.name || "",
        description: promotion.description || "",
        startDate: promotion.startDate || "",
        endDate: promotion.endDate || "",
        discountPercentage: promotion.discountPercentage || "",
        status: promotion.status || "ACTIVE",
      });
    }
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        discountPercentage: Number(form.discountPercentage),
      };

      await updatePromotion(promotion.id, payload);

      alert("Cập nhật khuyến mãi thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Lỗi cập nhật khuyến mãi:", error);
      alert("Không thể cập nhật khuyến mãi.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto">
      <div className="bg-slate-950/90 w-full max-w-md p-6 rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,1)] border border-slate-800 space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">
          Chỉnh sửa khuyến mãi
        </h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-200">Tên khuyến mãi</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-slate-700 rounded-lg p-2 mt-1 bg-slate-900 text-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-200">Mô tả</label>
          <textarea
            name="description"
            rows={2}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-slate-700 rounded-lg p-2 mt-1 bg-slate-900 text-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
          ></textarea>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-200">Ngày bắt đầu</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border border-slate-700 rounded-lg p-2 mt-1 bg-slate-900 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">Ngày kết thúc</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border border-slate-700 rounded-lg p-2 mt-1 bg-slate-900 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            />
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-slate-200">% giảm giá</label>
          <input
            type="number"
            name="discountPercentage"
            value={form.discountPercentage}
            onChange={handleChange}
            className="w-full border border-slate-700 rounded-lg p-2 mt-1 bg-slate-900 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-200">Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-slate-700 rounded-lg p-2 mt-1 bg-slate-900 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-sm"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className="px-4 py-2 bg-linear-to-r from-sky-500 to-emerald-500 text-slate-950 rounded-lg text-sm font-semibold hover:brightness-110"
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}