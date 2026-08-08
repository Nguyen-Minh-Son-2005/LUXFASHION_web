import { useEffect, useState } from "react";
import ProductGrid from "./ds-sanpham";

export default function ProductSection({ apiUrl }) {
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
      <p className="text-gray-500 text-center mt-4">Đang tải sản phẩm...</p>
    );

  if (error)
    return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div>
      {products.length > 0 ? (
        <ProductGrid products={products} itemsPerPage={12} />
      ) : (
        <p className="text-gray-500 text-center mt-4">
          Không có sản phẩm nào để hiển thị.
        </p>
      )}
    </div>
  );
}