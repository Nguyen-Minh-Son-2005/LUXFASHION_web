package com.example.Backend.dto;

import java.util.List;

public class ProductFilterDTO {

    private String name;
    private List<Long> sizeIds;

    // --- CÁC TRƯỜNG LỌC BẠN ĐÃ CÓ ---
    private Long categoryId;
    private List<Long> supplierIds;
    private Double minRating;
    private Double minPrice;
    private Double maxPrice;
    private List<Long> promotionIds;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getSizeIds() {
        return sizeIds;
    }

    public void setSizeIds(List<Long> sizeIds) {
        this.sizeIds = sizeIds;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<Long> getSupplierIds() {
        return supplierIds;
    }

    public void setSupplierIds(List<Long> supplierIds) {
        this.supplierIds = supplierIds;
    }

    public Double getMinRating() {
        return minRating;
    }

    public void setMinRating(Double minRating) {
        this.minRating = minRating;
    }

    public Double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }

    public List<Long> getPromotionIds() {
        return promotionIds;
    }

    public void setPromotionIds(List<Long> promotionIds) {
        this.promotionIds = promotionIds;
    }
}