import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";
import { getCategories } from "../services/productService";
import { getPromotions } from "../services/promotionService";

export default function ProductEditModal({ product, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    supplierId: "",
    promotionId: "", // chỉ chọn 1 ID khuyến mãi
    sizeS: 0,
    sizeM: 0,
    sizeL: 0,
    sizeXL: 0,
    image: null, // file upload mới
  });

  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // =============================
  // 🔵 LOAD DỮ LIỆU BAN ĐẦU
  // =============================
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.originalPrice || product.price || "",
        description: product.description || "",
        categoryId: product.category?.id || "",
        supplierId: product.supplier?.id || "",
        promotionId: product.promotions?.[0]?.id || "",
        // Sửa: đọc size từ v.size?.id thay vì v.sizeId
        sizeS: product.variants?.find(v => v.size?.id === 1)?.quantity || 0,
        sizeM: product.variants?.find(v => v.size?.id === 2)?.quantity || 0,
        sizeL: product.variants?.find(v => v.size?.id === 3)?.quantity || 0,
        sizeXL: product.variants?.find(v => v.size?.id === 4)?.quantity || 0,
        image: null,
      });

      // ảnh preview (lấy ảnh đầu tiên từ product.images)
      if (product.images && product.images.length > 0) {
        setPreview(product.images[0]);
      }
    }
  }, [product]);

  // =============================
  // 🔵 LOAD CATEGORY + PROMOTIONS
  // =============================
  useEffect(() => {
    (async () => {
      setCategories(await getCategories());
      setPromotions(await getPromotions());
    })();
  }, []);

  // =============================
  // 🔵 HANDLE INPUT CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // =============================
  // 🔵 UPLOAD ẢNH
  // =============================
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/admin/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Backend bọc response trong RestResponse => url nằm trong res.data.data.url
    return res.data?.data?.url;
  };

  // =============================
  // 🔵 SUBMIT FORM
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Lấy ảnh hiện tại từ product.images (List<String>)
      let imageUrls = product.images && Array.isArray(product.images) ? [...product.images] : [];

      // Nếu user upload ảnh mới → upload và thay thế ảnh cũ
      if (form.image) {
        try {
          const uploadedUrl = await uploadImage(form.image);
          console.log(">>> Uploaded image URL:", uploadedUrl);
          if (!uploadedUrl) {
            alert("Upload ảnh không trả về URL hợp lệ.");
            setLoading(false);
            return;
          }
          imageUrls = [uploadedUrl];
        } catch (uploadError) {
          console.error("Lỗi khi upload ảnh:", uploadError);
          alert("Lỗi khi upload ảnh. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      }

      // Chuẩn bị variants - Backend yêu cầu colorId, sử dụng colorId mặc định là 1
      // Lưu ý: Backend sẽ clear tất cả variants cũ và thêm mới
      // Nên chỉ gửi những variants có quantity > 0
      const variants = [];
      const sizeS = Number(form.sizeS) || 0;
      const sizeM = Number(form.sizeM) || 0;
      const sizeL = Number(form.sizeL) || 0;
      const sizeXL = Number(form.sizeXL) || 0;
      
      if (sizeS > 0) variants.push({ colorId: 1, sizeId: 1, quantity: sizeS });
      if (sizeM > 0) variants.push({ colorId: 1, sizeId: 2, quantity: sizeM });
      if (sizeL > 0) variants.push({ colorId: 1, sizeId: 3, quantity: sizeL });
      if (sizeXL > 0) variants.push({ colorId: 1, sizeId: 4, quantity: sizeXL });

      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        categoryId: Number(form.categoryId),
        supplierId: Number(form.supplierId),
        imageUrls,
        promotionIds: form.promotionId ? [Number(form.promotionId)] : [],
        variants,
      };

      console.log(">>> PAYLOAD UPDATE:", payload);
      
      await api.put(`/api/admin/products/${product.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Cập nhật sản phẩm thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      const errorMessage = err.response?.data?.message || err.message || "Không cập nhật được sản phẩm";
      alert(`Lỗi: ${errorMessage}\n\nNếu sản phẩm đã có đơn hàng, có thể không thể thay đổi số lượng variants.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 w-full max-w-5xl relative shadow-[0_24px_80px_rgba(15,23,42,1)] max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-red-500">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-1 text-slate-50">Chỉnh sửa sản phẩm</h2>
        <p className="text-xs text-slate-400 text-center mb-4">
          Cập nhật thông tin và số lượng cho sản phẩm hiện có.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-200">Tên sản phẩm</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            />

            <label className="block text-sm font-medium text-slate-200">Giá (VND)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            />

            <label className="block text-sm font-medium text-slate-200">Danh mục</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            >
              <option value="">-- Chọn --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-slate-200">Nhà cung cấp ID</label>
            <input
              name="supplierId"
              type="number"
              value={form.supplierId}
              onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
              placeholder="Nhập ID nhà cung cấp"
            />

            <label className="block text-sm font-medium text-slate-200">Khuyến mãi</label>
            <select
              name="promotionId"
              value={form.promotionId}
              onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            >
              <option value="">Không áp dụng</option>
              {promotions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-slate-200">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500 rounded-lg p-2 w-full h-28 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-200">Số lượng theo size</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {["S", "M", "L", "XL"].map((s, idx) => {
                const key = ["sizeS", "sizeM", "sizeL", "sizeXL"][idx];
                return (
                  <div key={s}>
                    <label className="text-xs font-medium text-slate-300">Size {s}</label>
                    <input
                      type="number"
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      min="0"
                      className="border border-slate-700 rounded-lg p-2 w-full bg-slate-900 text-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400/70"
                    />
                  </div>
                );
              })}
            </div>

            <label className="block text-sm font-medium text-slate-200">Ảnh sản phẩm</label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl h-40 mb-3 flex items-center justify-center relative bg-slate-900/70">
              {preview ? (
                <img src={preview} className="h-full object-contain" />
              ) : (
                <span className="text-slate-500 text-sm">Chọn ảnh mới</span>
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
              className="bg-linear-to-r from-sky-500 via-emerald-500 to-violet-500 text-white w-full py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}