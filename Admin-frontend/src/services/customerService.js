import api from "./api";

// Lấy danh sách khách hàng
export const getCustomers = async () => {
  try {
    const response = await api.get("/api/admin/users"); // Endpoint lấy user (cần role ADMIN)
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách khách hàng:", error);
    return [];
  }
};

// (Tùy chọn) Khóa tài khoản
export const lockCustomer = async (id) => {
  return await api.put(`/api/admin/users/${id}/lock`);
};