# PHÂN TÍCH HỆ THỐNG BILL/ĐƠN HÀNG - BACKEND

## 1. CẤU TRÚC DỮ LIỆU

### 1.1. Entity Bill
```java
- id: Long
- createdAt: LocalDateTime
- status: String (PENDING, CONFIRMED, PROCESSING, DELIVERED, CANCELLED, CANCEL_REQUEST)
- totalAmount: Double
- user: User (ManyToOne)
- shippingName: String
- shippingAddress: String
- shippingPhone: String
- shippingNote: String
- billDetails: List<BillDetail> (OneToMany)
```

### 1.2. Entity BillDetail
```java
- id: Long
- bill: Bill (ManyToOne)
- productVariant: ProductVariant (ManyToOne)
- note: String
- quantity: int
- price: Double (giá tại thời điểm mua)
```

### 1.3. BillResponseDTO
```java
- id: Long
- createdAt: LocalDateTime
- status: String
- totalAmount: Double
- userId: Long
- shippingName: String
- shippingAddress: String
- shippingPhone: String
- shippingNote: String
- billDetails: List<BillDetailResponseDTO>
```

### 1.4. BillDetailResponseDTO
```java
- id: Long
- quantity: int
- price: Double
- variantId: Long
- productName: String
- colorName: String
- sizeName: String
- imageUrl: String
```

## 2. CÁC TRẠNG THÁI ĐƠN HÀNG (STATUS)

1. **PENDING**: Đơn hàng mới, chờ xử lý
2. **CONFIRMED**: Đơn hàng đã được xác nhận (admin confirm)
3. **PROCESSING**: Đơn hàng đang được xử lý/giao hàng
4. **DELIVERED**: Đơn hàng đã giao thành công
5. **CANCELLED**: Đơn hàng đã bị hủy
6. **CANCEL_REQUEST**: Khách hàng yêu cầu hủy đơn (chờ admin duyệt)

## 3. API ENDPOINTS CHO ADMIN

### 3.1. Lấy danh sách đơn hàng theo trạng thái
```
GET /api/admin/bills?status={status}
- Query param: status (optional, default: "PENDING")
- Response: List<BillResponseDTO>
```

### 3.2. Xác nhận đơn hàng (PENDING → CONFIRMED)
```
PUT /api/admin/bills/{id}/confirm
- Path param: id (billId)
- Response: BillResponseDTO
```

### 3.3. Duyệt yêu cầu hủy đơn
```
PUT /api/admin/bills/{id}/approve-cancel
- Path param: id (billId)
- Response: BillResponseDTO
- Logic: CANCEL_REQUEST → CANCELLED (tự động hoàn lại tồn kho)
```

### 3.4. Từ chối yêu cầu hủy đơn
```
PUT /api/admin/bills/{id}/reject-cancel?reason={reason}
- Path param: id (billId)
- Query param: reason (optional)
- Response: BillResponseDTO
- Logic: CANCEL_REQUEST → PENDING
```

### 3.5. Cập nhật trạng thái đơn hàng (generic)
```
Service method: updateBillStatus(billId, newStatus)
- Có thể dùng để chuyển CONFIRMED → PROCESSING → DELIVERED
- Nếu chuyển sang CANCELLED, tự động hoàn lại tồn kho
```

## 4. LOGIC NGHIỆP VỤ

### 4.1. Luồng xử lý đơn hàng
```
PENDING → CONFIRMED → PROCESSING → DELIVERED
         ↓
    CANCEL_REQUEST → (Approve) → CANCELLED
                  → (Reject) → PENDING
```

### 4.2. Hoàn lại tồn kho
- Tự động hoàn lại khi:
  - Admin approve cancel request
  - Admin cập nhật status sang CANCELLED (nếu chưa là CANCELLED)

### 4.3. Thông tin giao hàng
- Được lưu tại thời điểm đặt hàng (snapshot)
- Bao gồm: tên, địa chỉ, SĐT, ghi chú
- Ghi chú có thể chứa lý do hủy (nếu có)

## 5. YÊU CẦU THIẾT KẾ FRONTEND

### 5.1. Trang quản lý đơn hàng cần có:
1. **Bộ lọc theo trạng thái**: Tabs hoặc dropdown để chọn status
2. **Danh sách đơn hàng**: Hiển thị thông tin cơ bản
3. **Chi tiết đơn hàng**: Modal hoặc drawer hiển thị đầy đủ thông tin
4. **Các hành động**:
   - Xác nhận đơn (PENDING → CONFIRMED)
   - Chuyển trạng thái (CONFIRMED → PROCESSING → DELIVERED)
   - Duyệt/Từ chối hủy đơn (CANCEL_REQUEST)
5. **Tìm kiếm**: Theo mã đơn, tên khách hàng, SĐT
6. **Sắp xếp**: Theo ngày tạo, tổng tiền
7. **Phân trang**: Nếu có nhiều đơn hàng

### 5.2. Thông tin hiển thị trong danh sách:
- Mã đơn hàng (ID)
- Ngày tạo
- Tên khách hàng (shippingName)
- Số điện thoại (shippingPhone)
- Tổng tiền (totalAmount)
- Trạng thái (status) - có màu sắc phân biệt
- Số lượng sản phẩm

### 5.3. Thông tin chi tiết đơn hàng:
- Thông tin đơn hàng: ID, ngày tạo, trạng thái, tổng tiền
- Thông tin khách hàng: Tên, SĐT, địa chỉ, ghi chú
- Danh sách sản phẩm: Hình ảnh, tên, màu, size, số lượng, giá
- Lịch sử thay đổi trạng thái (nếu có)

