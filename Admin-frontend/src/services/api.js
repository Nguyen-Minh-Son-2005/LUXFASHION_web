import axios from "axios";

// Tạo instance axios (giữ nguyên cấu hình cũ của bạn)
const api = axios.create({
  baseURL: "http://localhost:8080", // Hoặc URL backend của bạn
  withCredentials: true, // Quan trọng: Để gửi kèm cookie JSESSIONID
  headers: {
    "Content-Type": "application/json",
  },
});

// --- PHẦN QUAN TRỌNG CẦN THÊM VÀO ---

// Response Interceptor: Xử lý phản hồi từ server trước khi component nhận được
api.interceptors.response.use(
  (response) => {
    // Nếu API trả về thành công (2xx), cứ cho qua
    return response;
  },
  (error) => {
    // Nếu có lỗi xảy ra
    if (error.response && error.response.status === 401) {
      
      // Kiểm tra xem user đang ở trang nào
      // Nếu đang ở trang Login mà bị 401 (do sai pass) thì KHÔNG hiện thông báo hết phiên
      if (window.location.pathname !== "/login") {
        
        // 1. Xóa thông tin user trong localStorage để AdminLayout biết là đã logout
        localStorage.removeItem("admin");

        // 2. Hiện thông báo cho người dùng
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");

        // 3. Chuyển hướng về trang Login
        window.location.href = "/login";
      }
    }
    
    // Trả lỗi về để các hàm gọi API cụ thể có thể xử lý riêng (nếu cần)
    return Promise.reject(error);
  }
);

export default api;