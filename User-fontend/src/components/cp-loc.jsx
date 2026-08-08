import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FilterModal({ isOpen, onClose }) {

  const navigate = useNavigate();
   // const params = new URLSearchParams();
  // --- State ---
  
  const [suppliers, setSuppliers] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
    
  // --- Gọi API lấy danh sách hãng ---
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("/api/suppliers");
        if (!res.ok) {
          throw new Error("Không thể tải danh sách hãng");
        }
        const result = await res.json();

        console.log("Data nhận được từ API:", result);

        const list = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        setSuppliers(list);
      } catch (err) {
        console.error("Lỗi khi gọi API /api/suppliers:", err);
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, []);
 if (!isOpen) return null;
  // --- Danh mục tĩnh ---
  const categories = [
  { id: 1, name: "Áo thun" },
  { id: 2, name: "Áo sơ mi" },
  { id: 3, name: "Áo len" },
  { id: 4, name: "Áo khoác" },
  { id: 5, name: "Áo hoodie" },
  { id: 6, name: "Áo vest" },
  { id: 7, name: "Áo dài" },
  { id: 8, name: "Găng tay da" },
  { id: 9, name: "Găng tay len" },
  { id: 10, name: "Găng tay vải" },
  { id: 11, name: "Giày sneaker" },
  { id: 12, name: "Giày thể thao" },
  { id: 13, name: "Giày da" },
  { id: 14, name: "Bốt" },
  { id: 15, name: "Dép quai hậu" },
  { id: 16, name: "Mũ lưỡi trai" },
  { id: 17, name: "Mũ tròn" },
  { id: 18, name: "Mũ bucket" },
  { id: 19, name: "Mũ len" },
  { id: 20, name: "Quần short" },
  { id: 21, name: "Quần jean" },
  { id: 22, name: "Quần dài vải" },
  { id: 23, name: "Váy" },
  { id: 24, name: "Kính" },
  { id: 25, name: "Nơ" },
  { id: 26, name: "Cà vạt" },
  { id: 27, name: "Tất" },
  { id: 28, name: "Túi xách tay" },
  { id: 29, name: "Túi đeo ngang hông" },
  { id: 30, name: "Balo" }
];

  // --- Xử lý nhấn nút Lọc ---
  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    if (selectedCategory) params.append("categoryId", selectedCategory);
    if (selectedBrand) params.append("supplierIds", selectedBrand);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (minRating) params.append("minRating", minRating);

    navigate(`/sanpham?${params.toString()}`);
    onClose(); // đóng modal
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-indigo-200">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Bộ lọc sản phẩm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* --- Chọn Thể loại --- */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <i className="fa-solid fa-tags text-indigo-600"></i>Thể loại
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
               onClick={() =>
              setSelectedCategory(selectedCategory === c.id ? null : c.id)
                    }
                className={`border-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  selectedCategory === c.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-md"
                    : "bg-white hover:bg-indigo-50 border-gray-300 text-gray-700 hover:border-indigo-300"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- Chọn Hãng --- */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <i className="fa-solid fa-building text-indigo-600"></i>Hãng
          </h3>
          {suppliers.length === 0 ? (
            <p className="text-gray-500 text-sm">Đang tải danh sách hãng...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {suppliers.map((b) => (
                <button
                  key={b.id}
                  onClick={() =>
                setSelectedBrand(selectedBrand === b.id ? null : b.id)
                  }
                  className={`border-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    selectedBrand === b.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-md"
                      : "bg-white hover:bg-purple-50 border-gray-300 text-gray-700 hover:border-purple-300"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Lọc theo giá --- */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <i className="fa-solid fa-dollar-sign text-indigo-600"></i>Giá
          </h3>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Từ (VNĐ)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border-2 border-gray-300 rounded-lg w-1/2 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
            <input
              type="number"
              placeholder="Đến (VNĐ)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border-2 border-gray-300 rounded-lg w-1/2 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* --- Lọc theo đánh giá --- */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <i className="fa-solid fa-star text-indigo-600"></i>Đánh giá (sao tối thiểu)
          </h3>
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            placeholder="VD: 3.5"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
          />
        </div>
 
        {/* --- Nút hành động --- */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-bold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Hủy
          </button>
          <button
            onClick={handleApplyFilter}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <i className="fa-solid fa-filter mr-2"></i>Áp dụng lọc
          </button>
        </div>
      </div>
    </div>
  );
}