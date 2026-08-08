// src/services/billService.js
import api from "./api";

const BASE_URL = "/api/admin/bills";

// Hàm chuẩn hóa dữ liệu từ Backend -> Frontend
const mapBillData = (item) => {
  return {
    // 1. Map ID (Thử các trường hợp phổ biến)
    id: item.id || item.billId || item.bill_id || item.orderId,
    
    // 2. Map Trạng thái
    status: item.status || "PENDING",
    
    // 3. Map Tổng tiền (Thử totalAmount, total, totalMoney...)
    totalAmount: item.totalAmount || item.total || item.totalMoney || item.price || 0,
    
    // 4. Map thông tin khách hàng
    shippingName: item.shippingName || item.customerName || item.fullName || item.name || "Khách lẻ",
    shippingPhone: item.shippingPhone || item.phoneNumber || item.phone || "—",
    shippingAddress: item.shippingAddress || item.address || "—",
    shippingNote: item.shippingNote || item.note || "",
    
    // 5. Map ngày tạo
    createdAt: item.createdAt || item.createdDate || item.date || new Date().toISOString(),
    
    // 6. Map chi tiết (nếu có)
    billDetails: item.billDetails || item.details || item.products || []
  };
};

export async function getBillsByStatus(status = "PENDING") {
  try {
    const response = await api.get(BASE_URL, {
      params: { status },
    });
    
    // --- ĐOẠN CODE SỬA LỖI QUAN TRỌNG ---
    let rawData = response.data;

    // Kiểm tra: Nếu Backend trả về object bọc dạng { data: [...] }
    if (rawData && !Array.isArray(rawData) && Array.isArray(rawData.data)) {
        console.log("⚠️ Phát hiện dữ liệu bị bọc trong biến .data");
        rawData = rawData.data; // Lấy ruột bên trong
    }
    
    // Nếu vẫn không phải Array (ví dụ null hoặc lỗi lạ), gán thành mảng rỗng để không crash
    if (!Array.isArray(rawData)) {
        console.warn("⚠️ Dữ liệu nhận được không phải là mảng:", rawData);
        rawData = [];
    }
    // -------------------------------------

    // Áp dụng hàm map để sửa tên biến
    return rawData.map(mapBillData);

  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return [];
  }
}

// ... (Các hàm confirmBill, approveCancelBill, ... giữ nguyên như cũ)
export async function confirmBill(billId) {
  try {
    const response = await api.put(`${BASE_URL}/${billId}/confirm`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xác nhận đơn hàng:", error);
    throw error;
  }
}

export async function approveCancelBill(billId) {
  try {
    const response = await api.put(`${BASE_URL}/${billId}/approve-cancel`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi duyệt hủy đơn:", error);
    throw error;
  }
}

export async function rejectCancelBill(billId, reason = "") {
  try {
    const response = await api.put(`${BASE_URL}/${billId}/reject-cancel`, null, {
      params: { reason },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi từ chối hủy đơn:", error);
    throw error;
  }
}

// Ghi chú: Các trạng thái nâng cao (PROCESSING, DELIVERED, ...) hiện chưa có API riêng cho Admin.