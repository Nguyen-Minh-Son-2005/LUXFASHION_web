// src/components/OrderList.jsx
import React from "react";
import OrderItem from "./OrderItem";

export default function OrderList({
  orders,
  onViewDetail,
  onConfirm,
  onApproveCancel,
  onRejectCancel,
}) {
  console.log("Dữ liệu nhận được:", orders);
  console.log("Danh sách ID:", orders?.map(o => o.id));
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Không có đơn hàng nào</p>
        <p className="text-sm mt-2">Hãy thử chọn trạng thái khác hoặc tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order, index) => (
        <OrderItem
          key={order.id || `order-${index}`}
          order={order}
          onViewDetail={onViewDetail}
          onConfirm={onConfirm}
          onApproveCancel={onApproveCancel}
          onRejectCancel={onRejectCancel}
        />
      ))}
    </div>
  );
}

