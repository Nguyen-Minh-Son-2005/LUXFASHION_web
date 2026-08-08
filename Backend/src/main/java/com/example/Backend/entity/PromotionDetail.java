package com.example.Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "promotion_details")
public class PromotionDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Promotion promotion_id;

    @ManyToOne
    private Product product_id;
    
    private String status;

    public PromotionDetail() {
    }

    public PromotionDetail(Promotion promotion_id, Product product_id, String status) {
        this.promotion_id = promotion_id;
        this.product_id = product_id;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Promotion getPromotion_id() {
        return promotion_id;
    }

    public void setPromotion_id(Promotion promotion_id) {
        this.promotion_id = promotion_id;
    }

    public Product getProduct_id() {
        return product_id;
    }

    public void setProduct_id(Product product_id) {
        this.product_id = product_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}