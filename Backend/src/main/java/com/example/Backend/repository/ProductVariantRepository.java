package com.example.Backend.repository;

import com.example.Backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    @Modifying
    @Query("UPDATE ProductVariant v SET v.quantity = v.quantity - :qty WHERE v.id = :id AND v.quantity >= :qty")
    int decreaseStock(@Param("id") Long id, @Param("qty") int qty);
}