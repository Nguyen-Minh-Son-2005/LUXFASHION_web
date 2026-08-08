package com.example.Backend.repository;

import com.example.Backend.entity.Cart;
import com.example.Backend.entity.CartDetail;
import com.example.Backend.entity.ProductVariant; // Import Variant
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {

    // Query để tìm theo 'cart' (tên trường mới) và 'productVariant'
    @Query("SELECT cd FROM CartDetail cd WHERE cd.cart = :cart AND cd.productVariant = :variant")
    Optional<CartDetail> findExistingDetail(
            @Param("cart") Cart cart,
            @Param("variant") ProductVariant variant);
}