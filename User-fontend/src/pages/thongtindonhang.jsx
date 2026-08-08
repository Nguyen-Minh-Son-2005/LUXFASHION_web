import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function ThongTinDonHang({ userId }) {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast, showError, hideToast } = useToast();

  const formatVND = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      PROCESSING: { text: "Đang xử lý", color: "bg-blue-100 text-blue-700 border-blue-300" },
      DELIVERED: { text: "Đã giao", color: "bg-green-100 text-green-700 border-green-300" },
      CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-700 border-red-300" },
    };
    return statusMap[status] || { text: status, color: "bg-gray-100 text-gray-700 border-gray-300" };
  };

  useEffect(() => {
    const fetchBills = async () => {
      if (!userId) {
        setError("Bạn cần đăng nhập để xem đơn hàng.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/bills", { credentials: "include" });
        if (!res.ok) {
          let errorText = "Không thể tải danh sách đơn hàng.";
          try {
            const errData = await res.json();
            errorText = errData.message || errData.error || errorText;
          } catch {
            const text = await res.text();
            errorText = text || errorText;
          }
          throw new Error(errorText);
        }
        const data = await res.json();
        console.log("📦 Bills API Response:", data);
        
        // ✅ Xử lý response: có thể là array trực tiếp hoặc được wrap trong { data }
        let billsList = [];
        if (Array.isArray(data)) {
          billsList = data;
        } else if (data?.data && Array.isArray(data.data)) {
          billsList = data.data;
        } else if (Array.isArray(data?.bills)) {
          billsList = data.bills;
        }
        
        console.log("✅ Parsed bills list:", billsList);
        setBills(billsList);
      } catch (err) {
        console.error("❌ Fetch bills error:", err);
        const errorMessage = err.message || "Không thể tải danh sách đơn hàng.";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
    // ✅ Sửa: Loại bỏ showError khỏi dependency để tránh infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!userId) {
    return (
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <i className="fa-solid fa-circle-exclamation text-yellow-500 text-5xl mb-4"></i>
          <p className="text-gray-700 text-lg font-semibold mb-4">Bạn cần đăng nhập để xem đơn hàng!</p>
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
          <p className="text-gray-600 text-lg">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <i className="fa-solid fa-receipt text-indigo-500"></i>
            THÔNG TIN ĐƠN HÀNG
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-lg">
            <p className="text-red-700 font-semibold flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </p>
          </div>
        )}

        {bills.length === 0 && !loading ? (
          <div className="text-center mt-10 bg-gray-50 border border-gray-200 rounded-xl p-12">
            <i className="fa-solid fa-receipt text-gray-400 text-6xl mb-4"></i>
            <p className="text-gray-600 text-xl font-semibold">Bạn chưa có đơn hàng nào 😢</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bills.map((bill) => {
              const statusBadge = getStatusBadge(bill.status);
              return (
                <div
                  key={bill.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/chitietdonhang/${bill.id}`)}
                >
                  {/* Header đơn hàng */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Mã đơn hàng</p>
                          <p className="font-bold text-lg text-gray-800">#{bill.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ngày đặt</p>
                          <p className="font-semibold text-gray-800">{formatDate(bill.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng tiền</p>
                          <p className="font-bold text-lg text-red-600">{formatVND(bill.totalAmount)}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full border-2 font-semibold text-sm ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          <th className="p-4">Sản phẩm</th>
                          <th className="p-4">Màu / Size</th>
                          <th className="p-4 text-center">Số lượng</th>
                          <th className="p-4 text-right">Đơn giá</th>
                          <th className="p-4 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bill.billDetails?.map((detail, index) => (
                          <tr
                            key={detail.id || index}
                            className="border-b border-gray-200 hover:bg-indigo-50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={detail.imageUrl || "/placeholder.jpg"}
                                  alt={detail.productName}
                                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                                />
                                <div>
                                  <p className="font-bold text-gray-800">{detail.productName || "Sản phẩm"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <span className="bg-blue-100 px-2 py-1 rounded text-sm">{detail.colorName || "N/A"}</span>
                                <span className="bg-purple-100 px-2 py-1 rounded text-sm">{detail.sizeName || "N/A"}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <span className="font-bold">{detail.quantity}</span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="font-semibold text-gray-700">{formatVND(detail.price)}</span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="font-bold text-red-600 text-lg">
                                {formatVND(detail.price * detail.quantity)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer với nút xem chi tiết */}
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        <i className="fa-solid fa-truck mr-2"></i>
                        Giao đến: {bill.shippingName} - {bill.shippingAddress}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chitietdonhang/${bill.id}`);
                        }}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                      >
                        <i className="fa-solid fa-eye mr-2"></i>Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

