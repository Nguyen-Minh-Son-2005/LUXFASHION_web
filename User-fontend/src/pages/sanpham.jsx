import { useLocation } from "react-router-dom";
import ProductSection from "../components/dssp";

export default function SanPhamPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("categoryId");
  const supplierIds = params.get("supplierIds");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const minRating = params.get("minRating");
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
  // API backend có hỗ trợ lọc theo categoryId
   const query = [];
  if (categoryId) query.push(`categoryId=${categoryId}`);
  if (supplierIds) query.push(`supplierIds=${supplierIds}`);
  if (minPrice) query.push(`minPrice=${minPrice}`);
  if (maxPrice) query.push(`maxPrice=${maxPrice}`);
  if (minRating) query.push(`minRating=${minRating}`);

  const apiUrl =
    query.length > 0 ? `/api/products?${query.join("&")}` : `/api/products`;
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
          {categoryId
            ? `Danh mục ${categories.find(c => c.id === Number(categoryId))?.name || ""}`
            : "Tất cả sản phẩm"}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </div>
      <ProductSection apiUrl={apiUrl} />
    </div>
  );
}