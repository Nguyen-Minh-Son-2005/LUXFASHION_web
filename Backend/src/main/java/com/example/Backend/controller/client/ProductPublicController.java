package com.example.Backend.controller.client; // Hoặc package controller.client

import com.example.Backend.dto.ProductCardDTO;
import com.example.Backend.dto.ProductFilterDTO; // <-- Import
import com.example.Backend.dto.ProductResponseDTO;
import com.example.Backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductPublicController {

    @Autowired
    private ProductService productService;

    // --- API Lấy sản phẩm nổi bật (Giữ nguyên) ---
    @GetMapping("/featured")
    public List<ProductCardDTO> getFeaturedProducts() {
        List<ProductCardDTO> featuredProducts = productService.getFeaturedProducts();
        return featuredProducts.stream().collect(Collectors.toList());
    }

    /**
     * API Lấy tất cả sản phẩm (Shop page), có lọc và sắp xếp động
     */
    @GetMapping
    public List<ProductCardDTO> getAllPublicProducts(
            // --- THÊM 2 DÒNG LỌC MỚI ---
            @RequestParam(required = false) String name, // Lọc theo tên
            @RequestParam(required = false) List<Long> sizeIds, // Lọc theo size

            // --- CÁC BỘ LỌC CŨ (Giữ nguyên) ---
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) List<Long> supplierIds,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<Long> promotionIds,

            // --- SẮP XẾP (Giữ nguyên) ---
            @RequestParam(required = false, defaultValue = "name") String sort,
            @RequestParam(required = false, defaultValue = "asc") String direction) {

        // 1. Tạo Filter DTO
        ProductFilterDTO filters = new ProductFilterDTO();

        // --- Gán 2 giá trị mới ---
        filters.setName(name);
        filters.setSizeIds(sizeIds);

        // --- Gán các giá trị cũ ---
        filters.setCategoryId(categoryId);
        filters.setSupplierIds(supplierIds);
        filters.setMinRating(minRating);
        filters.setMinPrice(minPrice);
        filters.setMaxPrice(maxPrice);
        filters.setPromotionIds(promotionIds);

        // 2. Tạo Sort Object
        // (Logic này đã hỗ trợ sort theo "id", "name", "price")
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Sort sortObj = Sort.by(sortDirection, sort);

        // 3. Gọi service
        return productService.getAllPublicProducts(filters, sortObj);
    }

    // --- API Lấy chi tiết sản phẩm (Giữ nguyên) ---
    @GetMapping("/{id}")
    public ProductResponseDTO getProductDetailById(@PathVariable Long id) {
        return this.productService.getProductById(id);
    }
}