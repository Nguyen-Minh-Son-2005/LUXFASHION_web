package com.example.Backend.dto;

import com.example.Backend.entity.ProductVariant;

public class VariantResponseDTO {
    private Long id;
    private SimpleInfoDTO color;
    private SimpleInfoDTO size;
    private int quantity;

    public VariantResponseDTO(ProductVariant variant) {
        this.id = variant.getId();
        this.quantity = variant.getQuantity();
        if (variant.getColor() != null) {
            this.color = new SimpleInfoDTO(variant.getColor().getId(), variant.getColor().getName());
        }
        if (variant.getSize() != null) {
            this.size = new SimpleInfoDTO(variant.getSize().getId(), variant.getSize().getName());
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SimpleInfoDTO getColor() {
        return color;
    }

    public void setColor(SimpleInfoDTO color) {
        this.color = color;
    }

    public SimpleInfoDTO getSize() {
        return size;
    }

    public void setSize(SimpleInfoDTO size) {
        this.size = size;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}