import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function DonHang({ userId }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State cho form thông tin giao hàng
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
    note: "",
  });

  // State cho danh sách sản phẩm (từ giỏ hàng hoặc từ nút "Mua ngay")
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Lấy thông tin user từ localStorage để điền sẵn form
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        const userData = parsed?.data ?? parsed;
        if (userData) {
          // ✅ Sửa: Normalize phone field (có thể là phone hoặc phoneNumber)
          const normalizedPhone = userData.phone || userData.phoneNumber || "";
          setShippingInfo({
            name: userData.fullName || "",
            address: userData.address || "",
            phone: normalizedPhone,
            note: "",
          });
        }
      }
    } catch (err) {
      console.error("Lỗi load user info:", err);
    }
  }, []);

  // Lấy dữ liệu sản phẩm từ location.state (từ nút "Mua ngay" hoặc từ giỏ hàng)
  useEffect(() => {
    if (location.state) {
      // Nếu có state từ navigation, sử dụng nó
      if (location.state.items) {
        setItems(location.state.items);
      } else if (location.state.cartDetailIds) {
        // Nếu chỉ có cartDetailIds, cần fetch thông tin giỏ hàng
        fetchCartItems(location.state.cartDetailIds);
      }
    } else {
      // Nếu không có state, kiểm tra xem có phải từ giỏ hàng không
      // Hoặc có thể redirect về giỏ hàng
      if (!userId) {
        showError("Bạn cần đăng nhập để đặt hàng!");
        setTimeout(() => navigate("/giohang"), 1500);
        return;
      }
    }
  }, [location.state, userId, navigate]);

  // Fetch thông tin giỏ hàng dựa trên cartDetailIds
  const fetchCartItems = async (cartDetailIds) => {
    if (!userId || !cartDetailIds || cartDetailIds.length === 0) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      if (!res.ok) throw new Error("Không thể tải giỏ hàng");
      
      const data = await res.json();
      const payload = data?.data ?? data;
      const allItems = payload?.items ?? [];
      
      // Lọc chỉ các items có cartDetailId trong danh sách
      const selectedItems = allItems.filter(item => 
        cartDetailIds.includes(item.cartDetailId)
      );
      
      setItems(selectedItems);
    } catch (err) {
      console.error("Lỗi fetch cart:", err);
      setError("Không thể tải thông tin giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Tính tổng tiền
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Xử lý đặt hàng
  const handleSubmitOrder = async () => {
    // Validation
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
      showError("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    if (items.length === 0) {
      showError("Không có sản phẩm nào để đặt hàng!");
      return;
    }

    // Lấy cartDetailIds từ items
    const cartDetailIds = items.map(item => item.cartDetailId).filter(id => id != null);

    if (cartDetailIds.length === 0) {
      showError("Không tìm thấy thông tin sản phẩm!");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        cartDetailIds: cartDetailIds,
        shippingInfo: {
          name: shippingInfo.name,
          address: shippingInfo.address,
          phone: shippingInfo.phone,
          note: shippingInfo.note || "",
        },
      };

      console.log("📦 Gửi đơn hàng:", payload);

      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = "Đặt hàng thất bại!";
        try {
          const err = await res.json();
          console.error("❌ Server error:", err);
          errorMessage = err.message || err.error || JSON.stringify(err);
        } catch {
          const textError = await res.text();
          console.error("❌ Server error (text):", textError);
          errorMessage = `Server error: ${res.status} - ${textError}`;
        }
        setError(errorMessage);
        setSubmitting(false);
        return;
      }

      const result = await res.json();
      console.log("✅ Đặt hàng thành công:", result);
      
      showSuccess("Đặt hàng thành công! Cảm ơn bạn đã mua sắm!");
      
      // Redirect về trang lịch sử đơn hàng hoặc trang chủ sau 2 giây
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("💥 Lỗi đặt hàng:", err);
      setError("Lỗi kết nối server, vui lòng thử lại!");
      setSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <i className="fa-solid fa-circle-exclamation text-yellow-500 text-5xl mb-4"></i>
          <p className="text-gray-700 text-lg font-semibold mb-4">Bạn cần đăng nhập để đặt hàng!</p>
          <button
            onClick={() => navigate("/taikhoan")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-bold"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <i className="fa-solid fa-shopping-cart text-gray-400 text-5xl mb-4"></i>
          <p className="text-gray-600 text-lg font-semibold mb-4">Không có sản phẩm nào để đặt hàng!</p>
          <button
            onClick={() => navigate("/giohang")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-bold"
          >
            Quay về giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <div className="max-w-6xl mx-auto mt-8 mb-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <i className="fa-solid fa-receipt text-indigo-500"></i>
          ĐẶT HÀNG
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <p className="text-red-700 font-semibold flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form thông tin giao hàng */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-truck text-indigo-600"></i>
            Thông tin giao hàng
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                <i className="fa-solid fa-user mr-2 text-indigo-500"></i>
                Họ và tên người nhận *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={shippingInfo.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                <i className="fa-solid fa-phone mr-2 text-indigo-500"></i>
                Số điện thoại *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">
                <i className="fa-solid fa-location-dot mr-2 text-indigo-500"></i>
                Địa chỉ giao hàng *
              </label>
              <textarea
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Nhập địa chỉ giao hàng"
                required
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-bold text-gray-700 mb-2">
                <i className="fa-solid fa-note-sticky mr-2 text-indigo-500"></i>
                Ghi chú (tùy chọn)
              </label>
              <textarea
                id="note"
                name="note"
                value={shippingInfo.note}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Ghi chú thêm cho đơn hàng..."
              />
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm và tổng tiền */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-shopping-bag text-indigo-600"></i>
            Đơn hàng của bạn
          </h2>

          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.cartDetailId || item.variantId}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <img
                  src={item.imageUrl}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{item.product?.name || "Sản phẩm"}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="bg-blue-100 px-2 py-1 rounded">{item.color?.name}</span> /{" "}
                    <span className="bg-purple-100 px-2 py-1 rounded">{item.size?.name}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Số lượng: <span className="font-bold">{item.quantity}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">
                    {formatVND(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatVND(item.price)}/sản phẩm
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-700">Tổng tiền:</span>
              <span className="text-3xl font-extrabold text-red-600">
                {formatVND(totalAmount)}
              </span>
            </div>
            
            <button
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <span className="animate-spin inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-credit-card mr-2"></i>
                  Xác nhận đặt hàng
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

