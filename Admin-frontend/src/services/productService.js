// src/services/productService.js
import api from "./api";

const BASE_URL = "/api/admin/products"; // dùng chung baseURL từ api.js

/*export async function getCategories() {
  try {
    const response = await axios.get("http://localhost:8080/api/categories");
    return response.data; // Giả sử API trả về mảng [{id, name}, ...]
  } catch (error) {
    console.error("Lỗi khi gọi API danh mục:", error);
    return [];
  }
}*/

export async function getCategories() {
  return [
    { "id": 1, "name": "Áo thun" },
    { "id": 2, "name": "Áo sơ mi" },
    { "id": 3, "name": "Áo len" },
    { "id": 4, "name": "Áo khoác" },
    { "id": 5, "name": "Áo hoodie" },
    { "id": 6, "name": "Áo vest" },
    { "id": 7, "name": "Áo dài" },
    { "id": 8, "name": "Găng tay da" },
    { "id": 9, "name": "Găng tay len" },
    { "id": 10, "name": "Găng tay vải" },
    { "id": 11, "name": "Giày sneaker" },
    { "id": 12, "name": "Giày thể thao" },
    { "id": 13, "name": "Giày da" },
    { "id": 14, "name": "Bốt" },
    { "id": 15, "name": "Dép quai hậu" },
    { "id": 16, "name": "Mũ lưỡi trai" },
    { "id": 17, "name": "Mũ tròn" },
    { "id": 18, "name": "Mũ bucket" },
    { "id": 19, "name": "Mũ len" },
    { "id": 20, "name": "Quần short" },
    { "id": 21, "name": "Quần Jean" },
    { "id": 22, "name": "Quần dài vải" },
    { "id": 23, "name": "Váy" },
    { "id": 24, "name": "Kính" },
    { "id": 25, "name": "Nơ" },
    { "id": 26, "name": "Cà vạt" },
    { "id": 27, "name": "Tất" },
    { "id": 28, "name": "Túi xách tay" },
    { "id": 29, "name": "Túi đeo ngang hông" },
    { "id": 30, "name": "Balo" }
    
  ];
}

// 📦 Lấy toàn bộ danh sách sản phẩm theo tên thể loại (không phân trang)
export async function getAllProducts(category) {
  try {
    const url = category
      ? `${BASE_URL}?category=${encodeURIComponent(category)}`
      : BASE_URL;
    const response = await api.get(url);
    // Backend trả trực tiếp List<ProductResponseDTO>, không có wrapper
    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return [];
  }
}
export async function addProduct(productData) {
  try {
    const response = await api.post(`${BASE_URL}`, productData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    throw error;
  }
}
// 🔍 Tìm sản phẩm theo mã hoặc tên
export async function searchProducts(keyword) {
  try {
    const response = await api.get(BASE_URL, { // đổi base_url thành `${base_url}/search` nếu back có endpoint riêng cho search
      params: { keyword },
    });
    return response.data; // backend trả danh sách sản phẩm phù hợp
  } catch (error) {
    console.error("Lỗi khi tìm sản phẩm:", error);
    return [];
  }
}
// 🗑️ Xóa sản phẩm theo ID (đã k còn dùng đến)
export async function deleteProductById(productId) {
  try {
    const response = await api.delete(`${BASE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa sản phẩm ID=${productId}:`, error);
    throw error;
  }
}