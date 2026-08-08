// src/components/ProductFilter.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ thêm dòng này
import { getCategories } from "../services/productService";
import { getSuppliers } from "../services/supplierService";
import { getPromotions } from "../services/promotionService";
//export default function ProductFilter({ onFilterChange }) {
export default function ProductFilter({ onFilterChange, initialCategory }) {
  const navigate = useNavigate(); // ✅ khai báo
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [filters, setFilters] = useState({
    category: initialCategory || "",
    supplier: "",
    minPrice: "",
    maxPrice: "",
    promotion: "",
  });

// 🔹 Lấy dữ liệu cho dropdown 
useEffect(() => {
  async function loadData() {
    try {
      const [catData, supData, promoData] = await Promise.all([
        getCategories(),
        getSuppliers(),
        getPromotions(),
      ]);

      setCategories(Array.isArray(catData) ? catData : catData.data || []);
      setSuppliers(Array.isArray(supData) ? supData : supData.data || []);
      setPromotions(Array.isArray(promoData) ? promoData : promoData.data || []);
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu:", error);
      // Log more specific Axios error details
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Dữ liệu phản hồi:", error.response.data);
        console.error("Mã trạng thái:", error.response.status);
        console.error("Tiêu đề:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Yêu cầu không có phản hồi:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Thông báo lỗi:", error.message);
      }
      console.error("Cấu hình lỗi:", error.config); // The config that was used to make the request
    }
  }
  loadData();
}, []);

  // ✅ Khi initialCategory thay đổi (user click danh mục khác)
  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // ✅ Nếu đổi danh mục → cập nhật URL ngay
    if (name === "category" && value) {
      navigate(`/products?type=${encodeURIComponent(value)}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

return (
  <div className="w-full lg:w-64 bg-slate-950/70 shadow-sm rounded-2xl p-4 border border-slate-800 text-slate-100">
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 🔹 Danh mục */}
      <div>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full border border-slate-700 rounded-lg p-2 text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Hãng (nhà cung cấp) */}
      <div>
        <h3 className="font-semibold mb-2 text-sm text-slate-200">Hãng (nhà cung cấp)</h3>
        <div className="max-h-70 overflow-y-auto space-y-1">
          {suppliers.map((sup) => (
          <label key={sup.id} className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="radio"
                name="supplier"
                value={sup.name}
                checked={filters.supplier === sup.name}
                onChange={handleChange}
                className="text-emerald-400 focus:ring-emerald-400/70"
              />
              {sup.name}
            </label>
          ))}
        </div>
      </div>

      {/* 🔹 Giá */}
      <div>
        <h3 className="font-semibold mb-2 text-sm text-slate-200">Giá</h3>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Tối thiểu"
            value={filters.minPrice}
            onChange={handleChange}
            className="border border-slate-700 rounded-lg p-1.5 text-xs bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/70"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Tối đa"
            value={filters.maxPrice}
            onChange={handleChange}
            className="border border-slate-700 rounded-lg p-1.5 text-xs bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/70"
          />
        </div>
      </div>

      {/* 🔹 Khuyến mãi */}
      <div>
        <h3 className="font-semibold mb-2 text-sm text-slate-200">Khuyến mãi</h3>
        <div className="max-h-70 overflow-y-auto space-y-1">
          {promotions.map((promo) => (
          <label key={promo.id} className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="radio"
                name="promotion"
                value={promo.name}
                checked={filters.promotion === promo.name}
                onChange={handleChange}
                className="text-emerald-400 focus:ring-emerald-400/70"
              />
              {promo.name}
            </label>
          ))}
        </div>
      </div>

      {/* 🔹 Nút lọc */}
      <button
      type="submit"
      className="w-full bg-linear-to-r from-sky-500 to-emerald-500 hover:brightness-110 text-amber-50 font-semibold py-2 rounded-xl text-sm transition shadow-sm"
      >
        Lọc
      </button>
    </form>
  </div>
);
}