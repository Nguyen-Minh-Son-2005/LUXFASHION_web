import api from "./api";

// Lấy danh sách
export const getSuppliers = async () => {
  try {
    const response = await api.get("/api/admin/suppliers"); // Sửa endpoint theo backend 
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy nhà cung cấp:", error);
    return [];
  }
};

// Thêm mới
export const createSupplier = async (name) => {
  return await api.post("/api/admin/suppliers", { name });
};

// Cập nhật
export const updateSupplier = async (id, name) => {
  return await api.put(`/api/admin/suppliers/${id}`, { name });
};

// Xóa
export const deleteSupplier = async (id) => {
  return await api.delete(`/api/admin/suppliers/${id}`);
};