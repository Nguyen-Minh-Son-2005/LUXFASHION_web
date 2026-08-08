// src/services/promotionService.js
import api from "./api";

const BASE_URL = "/api/admin/promotions";

// Lấy toàn bộ danh sách khuyến mãi
export const getPromotions = async () => {
  const response = await api.get(BASE_URL);
  return response.data.data; // <- API trả mảng full
};

// Tạo mới
export const createPromotion = async (data) => {
  return api.post(BASE_URL, data);
};

// Cập nhật
export const updatePromotion = async (id, data) => {
  return api.put(`${BASE_URL}/${id}`, data);
};

// Xóa
export const deletePromotion = async (id) => {
  return api.delete(`${BASE_URL}/${id}`);
};