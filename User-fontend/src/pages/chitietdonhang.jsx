import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function ChiTietDonHang({ userId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
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
      PENDING: { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: "fa-clock" },
      PROCESSING: { text: "Đang xử lý", color: "bg-blue-100 text-blue-700 border-blue-300", icon: "fa-spinner" },
      DELIVERED: { text: "Đã giao", color: "bg-green-100 text-green-700 border-green-300", icon: "fa-check-circle" },
      CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-700 border-red-300", icon: "fa-times-circle" },
    };
    return statusMap[status] || { text: status, color: "bg-gray-100 text-gray-700 border-gray-300", icon: "fa-question" };
  };

  useEffect(() => {
    const fetchBillDetail = async () => {
      if (!userId) {
        setError("Bạn cần đăng nhập để xem chi tiết đơn hàng.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/bills/${id}`, { credentials: "include" });
        if (!res.ok) {
          let errorText = "Không thể tải chi tiết đơn hàng.";
          if (res.status === 403 || res.status === 404) {
            errorText = "Không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn hàng này.";
          }
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
        console.log("📦 Bill Detail API Response:", data);
        
        // ✅ Xử lý response: có thể là object trực tiếp hoặc được wrap trong { data }
        const billData = data?.data || data;
        console.log("✅ Parsed bill data:", billData);
        setBill(billData);
      } catch (err) {
        console.error("❌ Fetch bill detail error:", err);
        const errorMessage = err.message || "Không thể tải chi tiết đơn hàng.";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBillDetail();
    // ✅ Sửa: Loại bỏ showError khỏi dependency để tránh infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  if (!userId) {
    return (
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <i className="fa-solid fa-circle-exclamation text-yellow-500 text-5xl mb-4"></i>
          <p className="text-gray-700 text-lg font-semibold mb-4">Bạn cần đăng nhập để xem chi tiết đơn hàng!</p>
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
          <p className="text-gray-600 text-lg">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error && !bill) {
    return (
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <p className="text-red-700 font-semibold flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </p>
          <button
            onClick={() => navigate("/thongtindonhang")}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  if (!bill) return null;

  const statusBadge = getStatusBadge(bill.status);

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <div className="max-w-6xl mx-auto mt-8 mb-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/thongtindonhang")}
            className="mb-4 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Quay lại danh sách đơn hàng
          </button>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <i className="fa-solid fa-receipt text-indigo-500"></i>
            CHI TIẾT ĐƠN HÀNG #{bill.id}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-shopping-bag"></i>
              Sản phẩm đã đặt ({bill.billDetails?.length || 0} sản phẩm)
            </h2>
          </div>
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
              <tfoot>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <td colSpan="4" className="p-4 text-right font-bold text-lg">
                    Tổng tiền:
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-2xl text-red-600">{formatVND(bill.totalAmount)}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Thông tin đơn hàng và giao hàng - Ở dưới cùng */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin đơn hàng */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-info-circle text-indigo-600"></i>
                Thông tin đơn hàng
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="font-bold text-lg text-gray-800">#{bill.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                  <p className="font-semibold text-gray-800">{formatDate(bill.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <span className={`inline-block px-4 py-2 rounded-full border-2 font-semibold text-sm mt-1 ${statusBadge.color}`}>
                    <i className={`fa-solid ${statusBadge.icon} mr-2`}></i>
                    {statusBadge.text}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng tiền</p>
                  <p className="font-bold text-2xl text-red-600">{formatVND(bill.totalAmount)}</p>
                </div>
              </div>
            </div>

            {/* Thông tin giao hàng */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-truck text-indigo-600"></i>
                Thông tin giao hàng
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Người nhận</p>
                  <p className="font-semibold text-gray-800">{bill.shippingName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-semibold text-gray-800">{bill.shippingPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-gray-800">{bill.shippingAddress}</p>
                </div>
                {bill.shippingNote && (
                  <div>
                    <p className="text-sm text-gray-600">Ghi chú</p>
                    <p className="font-semibold text-gray-800">{bill.shippingNote}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

