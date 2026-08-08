package com.example.Backend.dto;

import com.example.Backend.entity.Image;
import com.example.Backend.entity.Product;
import com.example.Backend.entity.ProductVariant;
import java.util.List;
import java.util.stream.Collectors;

public class ProductResponseDTO {
    private Long id;
    private String name;

    private String description;
    private Double originalPrice;
    private Double salePrice;
    private Double discountPercentage;
    private Double averageRating;
    private List<SimpleInfoDTO> promotions;
    private SimpleInfoDTO category;
    private SimpleInfoDTO categoryProduct;
    private SimpleInfoDTO supplier;

    private List<String> images;

    private List<VariantResponseDTO> variants;
    private int totalQuantity;

    public ProductResponseDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.originalPrice = product.getPrice();
        this.description = product.getDescription();
        this.averageRating = product.getAverageRating();

        // Map category
        if (product.getCategory_id() != null) {
            this.category = new SimpleInfoDTO(product.getCategory_id().getId(), product.getCategory_id().getName());
        }
        // Map categoryProduct

        // Map supplier
        if (product.getSupplier_id() != null) {
            this.supplier = new SimpleInfoDTO(product.getSupplier_id().getId(), product.getSupplier_id().getName());
        }
        // Map images
        if (product.getImages() != null) {
            this.images = product.getImages().stream()
                    .map(Image::getUrl)
                    .collect(Collectors.toList());
        }
        if (product.getVariants() != null) {
            this.variants = product.getVariants().stream()
                    .map(VariantResponseDTO::new)
                    .collect(Collectors.toList());
        }
        // --- LOGIC MAP MỚI ---
        if (product.getPromotionDetails() != null) {
            this.promotions = product.getPromotionDetails().stream()
                    // Chỉ map những promotion nào không null
                    .filter(detail -> detail.getPromotion_id() != null)
                    .map(detail -> new SimpleInfoDTO(
                            detail.getPromotion_id().getId(),
                            detail.getPromotion_id().getName()))
                    .collect(Collectors.toList());
        } else {
            this.promotions = List.of(); // Trả về list rỗng
        }
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

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Double getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(Double salePrice) {
        this.salePrice = salePrice;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public SimpleInfoDTO getCategory() {
        return category;
    }

    public void setCategory(SimpleInfoDTO category) {
        this.category = category;
    }

    public SimpleInfoDTO getCategoryProduct() {
        return categoryProduct;
    }

    public void setCategoryProduct(SimpleInfoDTO categoryProduct) {
        this.categoryProduct = categoryProduct;
    }

    public SimpleInfoDTO getSupplier() {
        return supplier;
    }

    public void setSupplier(SimpleInfoDTO supplier) {
        this.supplier = supplier;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public List<VariantResponseDTO> getVariants() {
        return variants;
    }

    public void setVariants(List<VariantResponseDTO> variants) {
        this.variants = variants;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public List<SimpleInfoDTO> getPromotions() {
        return promotions;
    }

    public void setPromotions(List<SimpleInfoDTO> promotions) {
        this.promotions = promotions;
    }
}