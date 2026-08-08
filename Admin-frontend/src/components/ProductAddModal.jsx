import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";
import { getCategories } from "../services/productService";
import { getPromotions } from "../services/promotionService";

export default function ProductAddModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    supplierId: "",
    promotionId: "", // CHỈ 1 promotion
    image: null,
    sizeS: 0,
    sizeM: 0,
    sizeL: 0,
    sizeXL: 0,
  });

  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 LOAD DANH MỤC + KHUYẾN MÃI
  useEffect(() => {
    (async () => {
      const cat = await getCategories();
      setCategories(cat);

      const pro = await getPromotions();
      setPromotions(pro);
    })();
  }, []);

  // 📌 Xử lý input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 📌 Upload ảnh đúng API backend của bạn
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await api.post("/api/admin/files/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Backend bọc response trong RestResponse => url nằm trong res.data.data.url
    return res.data?.data?.url;
  };

  // 📌 Submit tạo sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceValue = Number(form.price);
      if (Number.isNaN(priceValue) || priceValue < 0) {
        alert("Giá sản phẩm phải lớn hơn hoặc bằng 0.");
        setLoading(false);
        return;
      }

      // 🖼 Upload ảnh trước
      let imageUrl = null;
      if (form.image) {
        try {
          imageUrl = await uploadImage(form.image);
          console.log(">>> Uploaded image URL:", imageUrl);
        } catch (uploadError) {
          console.error("Lỗi khi upload ảnh:", uploadError);
          alert("Lỗi khi upload ảnh. Vui lòng thử lại.");
          setLoading(false);
          return;
        }

        if (!imageUrl) {
          alert("Upload ảnh không trả về URL hợp lệ.");
          setLoading(false);
          return;
        }
      }

      // 🧩 Tạo variants S-M-L-XL - Backend yêu cầu colorId, sử dụng colorId mặc định là 1
      const variants = [];
      const sizeS = Number(form.sizeS) || 0;
      const sizeM = Number(form.sizeM) || 0;
      const sizeL = Number(form.sizeL) || 0;
      const sizeXL = Number(form.sizeXL) || 0;

      if (sizeS > 0) variants.push({ colorId: 1, sizeId: 1, quantity: sizeS });
      if (sizeM > 0) variants.push({ colorId: 1, sizeId: 2, quantity: sizeM });
      if (sizeL > 0) variants.push({ colorId: 1, sizeId: 3, quantity: sizeL });
      if (sizeXL > 0) variants.push({ colorId: 1, sizeId: 4, quantity: sizeXL });

      // 📦 Chuẩn payload theo mẫu JSON của bạn
      const payload = {
        name: form.name,
        price: priceValue,
        description: form.description,
        categoryId: Number(form.categoryId),
        supplierId: Number(form.supplierId),
        imageUrls: imageUrl ? [imageUrl] : [],
        promotionIds: form.promotionId ? [Number(form.promotionId)] : [],
        variants,
      };

      console.log(">>> PAYLOAD CREATE:", payload);

      const response = await api.post("/api/admin/products", payload);
      console.log(">>> Response:", response.data);

      alert("Thêm sản phẩm thành công!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      const errorMessage = err.response?.data?.message || err.message || "Lỗi khi thêm sản phẩm";
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,1)] w-full max-w-5xl p-6 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-rose-400"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-1 text-slate-50">Thêm sản phẩm</h2>
        <p className="text-xs text-slate-400 text-center mb-4">
          Điền thông tin chi tiết cho sản phẩm mới. Những trường có dấu * là bắt buộc.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1">

          {/* Cột trái */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-200">
              Tên sản phẩm *
            </label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 p-2 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70" required />

            <label className="block text-sm font-medium text-slate-200">Giá (VND) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange}
              min="0"
              className="border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 p-2 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70" required />

            <label className="block text-sm font-medium text-slate-200">Thể loại *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 p-2 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70" required>
              <option value="">-- Chọn thể loại --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-slate-200">Nhà cung cấp (ID tạm thời) *</label>
            <input type="number" name="supplierId" value={form.supplierId} onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 p-2 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70" required />

            <label className="block text-sm font-medium text-slate-200">Khuyến mãi</label>
            <select name="promotionId" value={form.promotionId} onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 p-2 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70">
              <option value="">-- Không áp dụng --</option>
              {promotions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-slate-200">Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 p-2 w-full rounded-lg h-24 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70" />
          </div>

          {/* Cột phải */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-200">Số lượng theo size</label>
            <div className="border border-slate-700 rounded-xl p-3 mb-2 bg-slate-900/60">
              {["S", "M", "L", "XL"].map((s) => (
                <div key={s} className="flex items-center mb-2">
                  <span className="w-10 text-slate-200 text-sm">Size {s}</span>
                  <input
                    type="number"
                    name={`size${s}`}
                    value={form[`size${s}`]}
                    onChange={handleChange}
                    className="border border-slate-700 rounded-lg flex-1 p-1.5 text-sm bg-slate-950 text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-400/70"
                    min="0"
                  />
                </div>
              ))}
            </div>

            <label className="block text-sm font-medium text-slate-200">Ảnh sản phẩm</label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl h-40 flex items-center justify-center relative mb-3 bg-slate-900/60">
              {preview ? (
                <img src={preview} className="h-full object-contain" alt="Preview" />
              ) : (
                <span className="text-slate-500 text-sm">Chọn hoặc kéo thả ảnh vào đây</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-sky-500 via-emerald-500 to-violet-500 text-white w-full py-2.5 rounded-xl text-sm font-semibold shadow-md hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang thêm..." : "Thêm sản phẩm"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}