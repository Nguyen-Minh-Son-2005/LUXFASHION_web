package com.example.Backend.dto;

// DTO để nhận request tạo một liên kết
public class PromotionDetailRequestDTO {
    private Long promotionId;
    private Long productId;
    private String status; // Ví dụ: "ACTIVE"
    public Long getPromotionId() {
        return promotionId;
    }
    public void setPromotionId(Long promotionId) {
        this.promotionId = promotionId;
    }
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

}