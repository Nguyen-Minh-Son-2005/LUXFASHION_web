import React from "react";
import { Link  } from "react-router-dom";

const ProductCard = ({ image, name, brand, rating, price, sale, id }) => {
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toLocaleString('vi-VN') : price;
  };

  return (
    <Link to={`/chitietsp/${id}`}>
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100 group">
      {/* Ảnh sản phẩm */}
      <div className="w-full h-64 overflow-hidden rounded-xl relative mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {sale && sale > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            -{sale}%
          </div>
        )}
      </div>
    
      {/* Tên sản phẩm */}
      <h3 className="text-lg font-bold text-gray-800 mt-2 text-center truncate group-hover:text-red-600 transition-colors duration-200">
        {name}
      </h3>

      {/* Hãng */}
      <p className="text-sm text-gray-500 text-center mb-3 font-medium">{brand}</p>

      {/* Các thông tin phụ */}
      <div className="flex justify-between items-center gap-2 mt-4">
        <div className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-700 font-semibold">Đánh giá</div>
          <div className="text-red-600 font-bold text-sm">{Number(rating).toFixed(1)}⭐</div>
        </div>
        <div className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-700 font-semibold">Giá</div>
          <div className="text-white font-bold text-sm">{formatPrice(price)}₫</div>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;