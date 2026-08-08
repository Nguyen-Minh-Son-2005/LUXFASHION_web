package com.example.Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "product_variants", uniqueConstraints = {
        // Đảm bảo không thể có 2 dòng trùng lặp cho cùng Product-Color-Size
        @UniqueConstraint(columnNames = { "product_id", "color_id", "size_id" })
})
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false) // Liên kết tới sản phẩm cha
    private Product product;

    @ManyToOne
    @JoinColumn(name = "color_id", nullable = false) // Liên kết tới màu
    private Color color;

    @ManyToOne
    @JoinColumn(name = "size_id", nullable = false) // Liên kết tới size
    private Size size;

    private int quantity; // Số lượng tồn kho cho biến thể này

    // Constructors
    public ProductVariant() {
    }

    public ProductVariant(Product product, Color color, Size size, int quantity) {
        this.product = product;
        this.color = color;
        this.size = size;
        this.quantity = quantity;
    }

    // --- Getters and Setters (BẮT BUỘC) ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}