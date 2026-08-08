package com.example.Backend.service;

import com.example.Backend.dto.ProductCardDTO;
import com.example.Backend.dto.ProductFilterDTO; // <-- 1. THÊM IMPORT
import com.example.Backend.dto.ProductRequestDTO;
import com.example.Backend.dto.ProductResponseDTO;
import org.springframework.data.domain.Sort; // <-- 2. THÊM IMPORT
import java.util.List;

public interface ProductService {

    // --- Admin CRUD (Giữ nguyên) ---
    List<ProductResponseDTO> getAllProducts();

    ProductResponseDTO getProductById(Long id);

    ProductResponseDTO createProduct(ProductRequestDTO productRequest);

    ProductResponseDTO updateProduct(Long id, ProductRequestDTO productRequest);

    void deleteProduct(Long id);

    // --- User Public ---
    List<ProductCardDTO> getFeaturedProducts(); // Trang chủ

    void addPromotionToProduct(Long productId, Long promotionId);

    /**
     * [ADMIN] Gỡ (xóa) một Promotion khỏi một Product.
     */
    void removePromotionFromProduct(Long productId, Long promotionId);

    List<ProductCardDTO> getAllPublicProducts(ProductFilterDTO filters, Sort sort);

}