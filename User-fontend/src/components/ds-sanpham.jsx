import { useState } from "react";
import ProductCard from "./cp-sanpham";

export default function ProductGrid({ products, itemsPerPage = 8 }) {
 const safeProducts = Array.isArray(products) ? products : [];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(safeProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = safeProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Lưới sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((p) => (
          <ProductCard
        key={p.id}
         id={p.id} 
        image={p.image}
        name={p.name}
        brand={p.brand}
        rating={Number(p.rating).toFixed(1)}
        price={p.price}
        sale={p.sale}
        />
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-5 py-2.5 border-2 rounded-lg font-semibold transition-all duration-200 ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
                : "text-indigo-600 border-indigo-500 hover:bg-indigo-500 hover:text-white hover:scale-105 active:scale-95 shadow-md"
            }`}
          >
            <i className="fa-solid fa-chevron-left mr-2"></i>Trước
          </button>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg">
            Trang {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-5 py-2.5 border-2 rounded-lg font-semibold transition-all duration-200 ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
                : "text-indigo-600 border-indigo-500 hover:bg-indigo-500 hover:text-white hover:scale-105 active:scale-95 shadow-md"
            }`}
          >
            Sau<i className="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>
      )}
    </div>
  );
}