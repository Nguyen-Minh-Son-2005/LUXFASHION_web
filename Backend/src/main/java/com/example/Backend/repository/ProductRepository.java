package com.example.Backend.repository;

import com.example.Backend.entity.Category;
import com.example.Backend.entity.Product;
import com.example.Backend.entity.Supplier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // <-- 1. THÊM IMPORT NÀY
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// <-- 2. THÊM KẾ THỪA NÀY
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // --- Giữ lại hàm tìm sản phẩm khuyến mãi (cho trang chủ) ---
    @Query("SELECT DISTINCT p FROM Product p " +
            "JOIN p.promotionDetails pd " +
            "JOIN pd.promotion_id pr " +
            "WHERE pr.status = :status")
    List<Product> findProductsByPromotionStatus(@Param("status") String status);

    // --- 3. XÓA HOÀN TOÀN HÀM GÂY LỖI ---
    // List<Product> findByCategory_id_Id(Long categoryId);
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category_id = :category")
    long countByCategory_id(@Param("category") Category category);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.supplier_id = :supplier")
    long countBySupplier_id(@Param("supplier") Supplier supplier);
}