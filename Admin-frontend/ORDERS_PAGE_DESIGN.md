# THIẾT KẾ TRANG QUẢN LÝ ĐƠN HÀNG - ADMIN FRONTEND

## 1. TỔNG QUAN

Trang quản lý đơn hàng (`OrdersPage`) được thiết kế để admin có thể:
- Xem danh sách đơn hàng theo các trạng thái khác nhau
- Tìm kiếm đơn hàng theo mã, tên khách hàng, SĐT
- Xem chi tiết đơn hàng
- Xác nhận, cập nhật trạng thái đơn hàng
- Duyệt/từ chối yêu cầu hủy đơn

## 2. CẤU TRÚC COMPONENTS

### 2.1. OrdersPage (Main Component)
**File**: `src/pages/OrdersPage.jsx`

**Chức năng chính**:
- Quản lý state: danh sách đơn hàng, filters, pagination
- Xử lý logic lọc, tìm kiếm, sắp xếp
- Gọi API để load và cập nhật đơn hàng
- Quản lý các modal (chi tiết, từ chối hủy)

**State Management**:
- `allOrders`: Tất cả đơn hàng từ API
- `displayedOrders`: Đơn hàng hiển thị sau khi lọc/tìm kiếm
- `currentStatus`: Trạng thái hiện tại (null = ALL)
- `searchQuery`: Từ khóa tìm kiếm
- `sort`: Cách sắp xếp
- `page`, `pageSize`: Phân trang

### 2.2. OrderStatusTabs
**File**: `src/components/OrderStatusTabs.jsx`

**Chức năng**:
- Hiển thị các tab để lọc đơn hàng theo trạng thái
- Trạng thái: Tất cả, Chờ xử lý, Đã xác nhận, Đang giao hàng, Đã giao, Yêu cầu hủy, Đã hủy

### 2.3. OrderToolbar
**File**: `src/components/OrderToolbar.jsx`

**Chức năng**:
- Thanh công cụ với tìm kiếm và sắp xếp
- Tìm kiếm: theo mã đơn, tên KH, SĐT
- Sắp xếp: Mới nhất, Cũ nhất, Giá cao→thấp, Giá thấp→cao

### 2.4. OrderList
**File**: `src/components/OrderList.jsx`

**Chức năng**:
- Hiển thị danh sách đơn hàng
- Render danh sách `OrderItem` components
- Hiển thị thông báo khi không có đơn hàng

### 2.5. OrderItem
**File**: `src/components/OrderItem.jsx`

**Chức năng**:
- Hiển thị thông tin một đơn hàng:
  - Mã đơn, trạng thái (có màu sắc)
  - Thông tin khách hàng (tên, SĐT, địa chỉ)
  - Ngày đặt, số sản phẩm
  - Tổng tiền
- Các nút hành động theo trạng thái:
  - PENDING: Nút "Xác nhận"
  - CANCEL_REQUEST: Nút "Duyệt hủy" và "Từ chối"
  - Tất cả: Nút "Chi tiết"

### 2.6. OrderDetailModal
**File**: `src/components/OrderDetailModal.jsx`

**Chức năng**:
- Modal hiển thị chi tiết đơn hàng:
  - Thông tin đơn hàng: ID, ngày đặt, trạng thái, tổng tiền
  - Thông tin khách hàng: Tên, SĐT, địa chỉ, ghi chú
  - Danh sách sản phẩm: Hình ảnh, tên, màu, size, số lượng, giá
- Cho phép cập nhật trạng thái đơn hàng

### 2.7. RejectCancelModal
**File**: `src/components/RejectCancelModal.jsx`

**Chức năng**:
- Modal để từ chối yêu cầu hủy đơn
- Cho phép nhập lý do từ chối (tùy chọn)

## 3. SERVICE LAYER

### 3.1. billService.js
**File**: `src/services/billService.js`

**Các hàm**:
- `getBillsByStatus(status)`: Lấy danh sách đơn hàng theo trạng thái
- `confirmBill(billId)`: Xác nhận đơn hàng (PENDING → CONFIRMED)
- `approveCancelBill(billId)`: Duyệt hủy đơn (CANCEL_REQUEST → CANCELLED)
- `rejectCancelBill(billId, reason)`: Từ chối hủy đơn (CANCEL_REQUEST → PENDING)
- `updateBillStatus(billId, newStatus)`: Cập nhật trạng thái generic

## 4. API ENDPOINTS SỬ DỤNG

### 4.1. Backend Endpoints
```
GET  /api/admin/bills?status={status}          - Lấy danh sách đơn hàng
PUT  /api/admin/bills/{id}/confirm            - Xác nhận đơn hàng
PUT  /api/admin/bills/{id}/approve-cancel     - Duyệt hủy đơn
PUT  /api/admin/bills/{id}/reject-cancel      - Từ chối hủy đơn
PUT  /api/admin/bills/{id}/status?status={s}  - Cập nhật trạng thái (mới thêm)
```

## 5. LUỒNG XỬ LÝ

### 5.1. Load đơn hàng
1. User chọn tab trạng thái
2. `OrdersPage` gọi `loadOrders(status)`
3. Nếu status = null (ALL), load tất cả các status
4. Sắp xếp theo ngày tạo (mới nhất trước)
5. Áp dụng filters (tìm kiếm, sắp xếp)
6. Phân trang và hiển thị

### 5.2. Xác nhận đơn hàng
1. User click "Xác nhận" trên đơn PENDING
2. Hiện confirm dialog
3. Gọi `confirmBill(billId)`
4. Reload danh sách đơn hàng

### 5.3. Duyệt/Từ chối hủy đơn
1. User click "Duyệt hủy" hoặc "Từ chối" trên đơn CANCEL_REQUEST
2. (Nếu từ chối) Hiện modal nhập lý do
3. Gọi `approveCancelBill()` hoặc `rejectCancelBill()`
4. Reload danh sách đơn hàng

### 5.4. Cập nhật trạng thái
1. User mở modal chi tiết
2. Chọn trạng thái mới từ dropdown
3. Click "Lưu"
4. Gọi `updateBillStatus(billId, newStatus)`
5. Reload danh sách và đóng modal

## 6. UI/UX FEATURES

### 6.1. Màu sắc trạng thái
- **PENDING**: Vàng (bg-yellow-100, text-yellow-800)
- **CONFIRMED**: Xanh dương (bg-blue-100, text-blue-800)
- **PROCESSING**: Tím (bg-purple-100, text-purple-800)
- **DELIVERED**: Xanh lá (bg-green-100, text-green-800)
- **CANCELLED**: Đỏ (bg-red-100, text-red-800)
- **CANCEL_REQUEST**: Cam (bg-orange-100, text-orange-800)

### 6.2. Responsive Design
- Sử dụng Tailwind CSS
- Grid layout cho thông tin đơn hàng
- Modal responsive với max-width và scroll

### 6.3. User Feedback
- Alert khi thành công/thất bại
- Confirm dialog trước khi thực hiện hành động quan trọng
- Loading states (có thể thêm spinner nếu cần)

## 7. CẢI TIẾN CÓ THỂ THÊM

1. **Thống kê**: Hiển thị số lượng đơn hàng theo từng trạng thái trên tabs
2. **Export**: Xuất danh sách đơn hàng ra Excel/PDF
3. **Lọc nâng cao**: Lọc theo khoảng thời gian, khoảng giá
4. **Lịch sử thay đổi**: Hiển thị lịch sử thay đổi trạng thái đơn hàng
5. **In hóa đơn**: Chức năng in hóa đơn cho đơn hàng
6. **Bulk actions**: Xử lý nhiều đơn hàng cùng lúc
7. **Real-time updates**: WebSocket để cập nhật real-time khi có đơn mới

## 8. LƯU Ý KỸ THUẬT

1. **Backend endpoint mới**: Đã thêm endpoint `PUT /api/admin/bills/{id}/status` vào `BillAdminController`
2. **Error handling**: Các hàm service đều có try-catch và throw error để component xử lý
3. **State management**: Sử dụng React hooks (useState, useEffect, useCallback)
4. **Performance**: Sử dụng useCallback để tránh re-render không cần thiết
5. **Pagination**: Client-side pagination (có thể chuyển sang server-side nếu cần)

## 9. TESTING CHECKLIST

- [ ] Load danh sách đơn hàng theo từng trạng thái
- [ ] Tìm kiếm đơn hàng theo mã, tên, SĐT
- [ ] Sắp xếp đơn hàng
- [ ] Xem chi tiết đơn hàng
- [ ] Xác nhận đơn hàng PENDING
- [ ] Duyệt yêu cầu hủy đơn
- [ ] Từ chối yêu cầu hủy đơn
- [ ] Cập nhật trạng thái đơn hàng
- [ ] Phân trang hoạt động đúng
- [ ] Hiển thị đúng khi không có đơn hàng

