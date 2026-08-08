package com.example.Backend.dto;

import com.example.Backend.entity.Promotion;
import java.time.LocalDate;

public class PromotionResponseDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double discountPercentage;
    private String status;

    // Constructor rỗng
    public PromotionResponseDTO() {
    }

    // Constructor để map từ Entity
    public PromotionResponseDTO(Promotion promotion) {
        this.id = promotion.getId();
        this.name = promotion.getName();
        this.description = promotion.getDescription();
        this.startDate = promotion.getStartDate();
        this.endDate = promotion.getEndDate();
        this.discountPercentage = promotion.getDiscountPercentage();
        this.status = promotion.getStatus();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}