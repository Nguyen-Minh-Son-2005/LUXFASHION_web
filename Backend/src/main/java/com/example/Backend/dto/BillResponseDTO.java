package com.example.Backend.dto;

import com.example.Backend.entity.Bill;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BillResponseDTO {

    private Long id;
    private LocalDateTime createdAt;
    private String status;
    private Double totalAmount;
    private Long userId;

    // Thông tin giao hàng
    private String shippingName;
    private String shippingAddress;
    private String shippingPhone;
    private String shippingNote;

    private List<BillDetailResponseDTO> billDetails; // Danh sách chi tiết

    public BillResponseDTO(Bill bill) {
        this.id = bill.getId();
        this.createdAt = bill.getCreatedAt();
        this.status = bill.getStatus();
        this.totalAmount = bill.getTotalAmount();
        if (bill.getUser() != null) {
            this.userId = bill.getUser().getId();
        }

        // Map thông tin giao hàng
        this.shippingName = bill.getShippingName();
        this.shippingAddress = bill.getShippingAddress();
        this.shippingPhone = bill.getShippingPhone();
        this.shippingNote = bill.getShippingNote();

        // Map danh sách chi tiết
        if (bill.getBillDetails() != null) {
            this.billDetails = bill.getBillDetails().stream()
                    .map(BillDetailResponseDTO::new) // Dùng constructor của DTO con
                    .collect(Collectors.toList());
        }
    }

    // --- Cần đủ Getters ---
    // (tự động tạo hoặc viết tay)
    public Long getId() {
        return id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getStatus() {
        return status;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public Long getUserId() {
        return userId;
    }

    public String getShippingName() {
        return shippingName;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public String getShippingPhone() {
        return shippingPhone;
    }

    public String getShippingNote() {
        return shippingNote;
    }

    public List<BillDetailResponseDTO> getBillDetails() {
        return billDetails;
    }
}