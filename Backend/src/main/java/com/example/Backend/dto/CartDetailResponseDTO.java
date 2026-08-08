package com.example.Backend.dto;

import com.example.Backend.entity.CartDetail;
import com.example.Backend.entity.Product;
import com.example.Backend.entity.Image;

public class CartDetailResponseDTO {
    private Long cartDetailId;
    private int quantity;
    private Double price; // Giá đã lưu
    private Long variantId; // ID của biến thể
    private SimpleInfoDTO product; // Tên/ID sản phẩm cha
    private SimpleInfoDTO color;
    private SimpleInfoDTO size;

    private String imageUrl; // <-- 3. THÊM TRƯỜNG MỚI

    public CartDetailResponseDTO(CartDetail cartDetail) {
        this.cartDetailId = cartDetail.getId();
        this.quantity = cartDetail.getQuantity();
        this.price = cartDetail.getPrice();

        if (cartDetail.getProductVariant() != null) {
            this.variantId = cartDetail.getProductVariant().getId();

            // Lấy sản phẩm cha (parent Product)
            Product parentProduct = cartDetail.getProductVariant().getProduct();

            if (parentProduct != null) {
                // Gán thông tin sản phẩm
                this.product = new SimpleInfoDTO(
                        parentProduct.getId(),
                        parentProduct.getName());

                // --- 4. THÊM LOGIC LẤY ẢNH TẠI ĐÂY ---
                if (parentProduct.getImages() != null && !parentProduct.getImages().isEmpty()) {
                    Image firstImage = parentProduct.getImages().get(0); // Lấy ảnh đầu tiên
                    if (firstImage != null) {
                        this.imageUrl = firstImage.getUrl(); // Gán URL
                    }
                }
                // -------------------------------------
            }

            // Gán thông tin màu
            if (cartDetail.getProductVariant().getColor() != null) {
                this.color = new SimpleInfoDTO(
                        cartDetail.getProductVariant().getColor().getId(),
                        cartDetail.getProductVariant().getColor().getName());
            }
            // Gán thông tin size
            if (cartDetail.getProductVariant().getSize() != null) {
                this.size = new SimpleInfoDTO(
                        cartDetail.getProductVariant().getSize().getId(),
                        cartDetail.getProductVariant().getSize().getName());
            }
        }
    }

    public Long getCartDetailId() {
        return cartDetailId;
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

    public SimpleInfoDTO getProduct() {
        return product;
    }

    public SimpleInfoDTO getColor() {
        return color;
    }

    public SimpleInfoDTO getSize() {
        return size;
    }

    // --- 5. THÊM GETTER/SETTER CHO ẢNH ---
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}