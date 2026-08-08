package com.example.Backend.dto;

import java.util.List;

public class ProductRequestDTO {
    private String name;
    private Double price; // Giá gốc

    private String description;

    private Long categoryId;

    private Long supplierId;
    private List<Long> promotionIds;
    private List<String> imageUrls;

    private List<VariantRequestDTO> variants;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<VariantRequestDTO> getVariants() {
        return variants;
    }

    public void setVariants(List<VariantRequestDTO> variants) {
        this.variants = variants;
    }

    public List<Long> getPromotionIds() {
        return promotionIds;
    }

    public void setPromotionIds(List<Long> promotionIds) {
        this.promotionIds = promotionIds;
    }

}