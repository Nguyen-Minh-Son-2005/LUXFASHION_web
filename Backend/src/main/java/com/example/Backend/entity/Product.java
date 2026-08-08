package com.example.Backend.entity;

import java.util.List;
import jakarta.persistence.*;
import org.hibernate.annotations.Formula; // <-- Import Formula

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price; // Giá gốc
    // private int quantity; // <-- XÓA DÒNG NÀY

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier_id; // Dùng để lọc "hãng"

    @OneToMany(mappedBy = "product_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    @OneToMany(mappedBy = "product_id")
    private List<PromotionDetail> promotionDetails;

    // --- THÊM QUAN HỆ VỚI REVIEW (Đã yêu cầu ở lọc) ---
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    // --- THÊM TRƯỜNG TỰ TÍNH RATING (Đã yêu cầu ở lọc) ---
    @Formula("(SELECT COALESCE(AVG(r.rating), 0.0) FROM reviews r WHERE r.product_id = id)")
    private Double averageRating;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants;

    public Product(String string, Double double1, String string2, Category category,
            Supplier supplier, Promotion pormotion) {
    }

    public Product() {
    }

    // Cập nhật Constructor (bỏ quantity)
    public Product(String name, Double price, String description, Category category_id,
            Supplier supplier_id) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.category_id = category_id;

        this.supplier_id = supplier_id;
    }

    // --- Getters and Setters ---
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

    public Category getCategory_id() {
        return category_id;
    }

    public void setCategory_id(Category category_id) {
        this.category_id = category_id;
    }

    public Supplier getSupplier_id() {
        return supplier_id;
    }

    public void setSupplier_id(Supplier supplier_id) {
        this.supplier_id = supplier_id;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<PromotionDetail> getPromotionDetails() {
        return promotionDetails;
    }

    public void setPromotionDetails(List<PromotionDetail> promotionDetails) {
        this.promotionDetails = promotionDetails;
    }

    // --- THÊM/SỬA CÁC HÀM MỚI ---
    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public List<ProductVariant> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariant> variants) {
        this.variants = variants;
    }

}