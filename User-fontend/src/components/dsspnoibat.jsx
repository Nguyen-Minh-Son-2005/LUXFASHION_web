import { useEffect, useState } from "react";
import ProductGrid from "./ds-sanpham";

export default function ProductSection({ apiUrl , soluonghien=8}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error("Không thể tải danh sách sản phẩm");
        }
        const data = await res.json();

        console.log("Data nhận được từ API:", data);

        const rawList = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

        if (rawList.length === 0) {
          console.warn("Không có danh sách sản phẩm hợp lệ");
          setProducts([]);
          return;
        }

        const mapped = rawList.map((p) => {
          const imageLink = p.imageUrl || p.images?.[0] || "";

          return {
            id: p.id,
            name: p.name,
            brand: p.supplierName || p.supplier?.name || "N/A",
            rating: p.averageRating ?? p.rating ?? "N/A",
            price: p.salePrice ?? p.price ?? p.originalPrice ?? 0,
            sale: p.discountPercentage ?? p.sale ?? 0,
            image: imageLink,
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg text-center max-w-md mx-auto">
        <i className="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
        <p className="font-semibold">{error}</p>
      </div>
    );

  return (
    <div>
      {products.length > 0 ? (
        <ProductGrid products={products}  itemsPerPage={soluonghien}/>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <i className="fa-solid fa-box-open text-gray-400 text-5xl mb-4"></i>
          <p className="text-gray-600 text-lg font-semibold">Không có sản phẩm nào để hiển thị.</p>
        </div>
      )}
    </div>
  );
}