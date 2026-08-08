package com.example.Backend.dto;

import com.example.Backend.entity.BillDetail;
import com.example.Backend.entity.Image;
import com.example.Backend.entity.ProductVariant;

public class BillDetailResponseDTO {
    private Long id;
    private int quantity;
    private Double price; // Giá tại thời điểm mua

    private Long variantId;
    private String productName;
    private String colorName;
    private String sizeName;
    private String imageUrl;

    public BillDetailResponseDTO(BillDetail billDetail) {
        this.id = billDetail.getId();
        this.quantity = billDetail.getQuantity();
        this.price = billDetail.getPrice();

        ProductVariant variant = billDetail.getProductVariant();
        if (variant != null) {
            this.variantId = variant.getId();

            if (variant.getProduct() != null) {
                this.productName = variant.getProduct().getName();

                // Lấy ảnh đầu tiên của sản phẩm cha
                if (variant.getProduct().getImages() != null && !variant.getProduct().getImages().isEmpty()) {
                    Image firstImage = variant.getProduct().getImages().get(0);
                    if (firstImage != null) {
                        this.imageUrl = firstImage.getUrl();
                    }
                }
            }
            if (variant.getColor() != null) {
                this.colorName = variant.getColor().getName();
            }
            if (variant.getSize() != null) {
                this.sizeName = variant.getSize().getName();
            }
        }
    }

    public Long getId() {
        return id;
    }

    public int getQuantity() {
        return quantity;
    }

    public Double getPrice() {
        return price;
    }

    public Long getVariantId() {
        return variantId;
    }

    public String getProductName() {
        return productName;
    }

    public String getColorName() {
        return colorName;
    }

    public String getSizeName() {
        return sizeName;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}