package com.example.Backend.dto;

import com.example.Backend.entity.PromotionDetail;

// DTO để trả về chi tiết liên kết (dùng SimpleInfoDTO)
public class PromotionDetailResponseDTO {
    private Long id;
    private String status;
    private SimpleInfoDTO promotion;
    private SimpleInfoDTO product;

    public PromotionDetailResponseDTO(PromotionDetail detail) {
        this.id = detail.getId();
        this.status = detail.getStatus();
        
        if (detail.getPromotion_id() != null) {
            this.promotion = new SimpleInfoDTO(
                detail.getPromotion_id().getId(),
                detail.getPromotion_id().getName()
            );
        }
        if (detail.getProduct_id() != null) {
            this.product = new SimpleInfoDTO(
                detail.getProduct_id().getId(),
                detail.getProduct_id().getName()
            );
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public SimpleInfoDTO getPromotion() {
        return promotion;
    }

    public void setPromotion(SimpleInfoDTO promotion) {
        this.promotion = promotion;
    }

    public SimpleInfoDTO getProduct() {
        return product;
    }

    public void setProduct(SimpleInfoDTO product) {
        this.product = product;
    }
    
  
}