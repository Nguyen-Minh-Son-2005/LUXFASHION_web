// src/pages/OrdersPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { getBillsByStatus, confirmBill, approveCancelBill, rejectCancelBill } from "../services/billService";
import OrderStatusTabs from "../components/OrderStatusTabs";
import OrderToolbar from "../components/OrderToolbar";
import OrderList from "../components/OrderList";
import OrderDetailModal from "../components/OrderDetailModal";
import RejectCancelModal from "../components/RejectCancelModal";
import Pagination from "../components/Pagination";

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState([]); // Tất cả đơn hàng từ API
  const [displayedOrders, setDisplayedOrders] = useState([]); // Đơn hàng hiển thị sau khi lọc/tìm kiếm
  const [currentStatus, setCurrentStatus] = useState(null); // null = ALL, hoặc status cụ thể
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("dateDesc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectCancelOrder, setRejectCancelOrder] = useState(null);

  // Load orders từ API
  const loadOrders = useCallback(async (status) => {
    try {
      let orders = [];
      
      if (status === null || status === "ALL") {
        // Load tất cả các status
        const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "DELIVERED", "CANCEL_REQUEST", "CANCELLED"];
        const promises = statuses.map((s) => getBillsByStatus(s));
        const results = await Promise.all(promises);
        orders = results.flat();
      } else {
        orders = await getBillsByStatus(status);
      }

      // Sắp xếp theo ngày tạo (mới nhất trước)
      orders.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setAllOrders(orders);
      setPage(1);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      setAllOrders([]);
    }
  }, []);

  // Load orders khi status thay đổi
  useEffect(() => {
    loadOrders(currentStatus);
  }, [currentStatus, loadOrders]);

  // Hàm lọc và sắp xếp
  const applyFiltersAndSort = useCallback(() => {
    let result = [...allOrders];

    // Tìm kiếm
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((order) => {
        const idMatch = order.id?.toString().includes(query);
        const nameMatch = order.shippingName?.toLowerCase().includes(query);
        const phoneMatch = order.shippingPhone?.includes(query);
        return idMatch || nameMatch || phoneMatch;
      });
    }

    // Sắp xếp
    switch (sort) {
      case "dateDesc":
        result.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        break;
      case "dateAsc":
        result.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA - dateB;
        });
        break;
      case "amountDesc":
        result.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
        break;
      case "amountAsc":
        result.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
        break;
      default:
        break;
    }

    return result;
  }, [allOrders, searchQuery, sort]);

  // Cập nhật displayedOrders khi filters/sort thay đổi
  useEffect(() => {
    const result = applyFiltersAndSort();
    setPage(1);
    const startIndex = 0;
    setDisplayedOrders(result.slice(startIndex, startIndex + pageSize));
  }, [allOrders, searchQuery, sort, applyFiltersAndSort, pageSize]);

  // Cập nhật displayedOrders khi page thay đổi
  useEffect(() => {
    const result = applyFiltersAndSort();
    const startIndex = (page - 1) * pageSize;
    setDisplayedOrders(result.slice(startIndex, startIndex + pageSize));
  }, [page, applyFiltersAndSort, pageSize]);

  // Handlers
  const handleStatusChange = (status) => {
    setCurrentStatus(status);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleConfirm = async (billId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xác nhận đơn hàng này?")) {
      return;
    }

    try {
      await confirmBill(billId);
      alert("Đã xác nhận đơn hàng thành công!");
      loadOrders(currentStatus);
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
      alert("Không thể xác nhận đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleApproveCancel = async (billId) => {
    if (!window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu hủy đơn này? Sản phẩm sẽ được hoàn lại tồn kho.")) {
      return;
    }

    try {
      await approveCancelBill(billId);
      alert("Đã duyệt yêu cầu hủy đơn thành công!");
      loadOrders(currentStatus);
    } catch (error) {
      console.error("Lỗi khi duyệt hủy đơn:", error);
      alert("Không thể duyệt hủy đơn. Vui lòng thử lại.");
    }
  };

  const handleRejectCancel = (billId) => {
    const order = allOrders.find((o) => o.id === billId);
    if (order) {
      setRejectCancelOrder(order);
    }
  };

  const handleConfirmRejectCancel = async (billId, reason) => {
    try {
      await rejectCancelBill(billId, reason);
      alert("Đã từ chối yêu cầu hủy đơn thành công!");
      setRejectCancelOrder(null);
      loadOrders(currentStatus);
    } catch (error) {
      console.error("Lỗi khi từ chối hủy đơn:", error);
      alert("Không thể từ chối hủy đơn. Vui lòng thử lại.");
    }
  };

  const totalFilteredOrders = applyFiltersAndSort().length;
  const totalPages = Math.ceil(totalFilteredOrders / pageSize);

  return (
    <div className="space-y-4">
      {/* Tabs lọc theo trạng thái */}
      <OrderStatusTabs currentStatus={currentStatus} onStatusChange={handleStatusChange} />

      {/* Toolbar */}
      <OrderToolbar onSearch={handleSearch} onSortChange={handleSortChange} />

      {/* Thống kê */}
      <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
        <span>
          Hiển thị <span className="font-semibold text-slate-50">{displayedOrders.length}</span> /{" "}
          <span className="font-semibold text-slate-50">{totalFilteredOrders}</span> đơn hàng
        </span>
        {totalPages > 1 && (
          <span className="text-xs text-slate-10">
            Trang {page} / {totalPages}
          </span>
        )}
      </div>

      {/* Danh sách đơn hàng */}
      <OrderList
        orders={displayedOrders}
        onViewDetail={handleViewDetail}
        onConfirm={handleConfirm}
        onApproveCancel={handleApproveCancel}
        onRejectCancel={handleRejectCancel}
      />

      {/* Phân trang */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Modal chi tiết đơn hàng */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Modal từ chối hủy đơn */}
      {rejectCancelOrder && (
        <RejectCancelModal
          order={rejectCancelOrder}
          onConfirm={handleConfirmRejectCancel}
          onCancel={() => setRejectCancelOrder(null)}
        />
      )}
    </div>
  );
}
