package com.example.Backend.repository;

import com.example.Backend.entity.Product;
import com.example.Backend.entity.Promotion;
import com.example.Backend.entity.PromotionDetail;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionDetailRepository extends JpaRepository<PromotionDetail, Long> {
    @Query("SELECT pd FROM PromotionDetail pd WHERE pd.product_id = :product AND pd.promotion_id = :promotion")
    Optional<PromotionDetail> findByProduct_idAndPromotion_id(
            @Param("product") Product product,
            @Param("promotion") Promotion promotion);

    @Modifying
    @Query("DELETE FROM PromotionDetail pd WHERE pd.promotion_id = :promotion")
    void deleteByPromotion_id(@Param("promotion") Promotion promotion);
}