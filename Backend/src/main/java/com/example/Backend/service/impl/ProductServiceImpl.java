package com.example.Backend.service.impl;

import com.example.Backend.dto.ProductCardDTO;
import com.example.Backend.dto.ProductRequestDTO;
import com.example.Backend.dto.ProductResponseDTO;
import com.example.Backend.dto.SimpleInfoDTO;
import com.example.Backend.dto.ProductFilterDTO;
import com.example.Backend.dto.VariantRequestDTO;
import com.example.Backend.dto.VariantResponseDTO;
import com.example.Backend.entity.*;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.repository.*;
import com.example.Backend.service.ProductService;
import com.example.Backend.service.ProductSpecifications;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

        @Autowired
        private ProductRepository productRepository;
        @Autowired
        private CategoryRepository categoryRepository;

        @Autowired
        private SupplierRepository supplierRepository;
        @Autowired
        private PromotionRepository promotionRepository;
        @Autowired
        private PromotionDetailRepository promotionDetailRepository;
        @Autowired
        private ImageRepository imageRepository;
        @Autowired
        private ColorRepository colorRepository;
        @Autowired
        private SizeRepository sizeRepository;

        @Autowired
        private ProductVariantRepository productVariantRepository;

        // Tìm sản phẩm theo ID hoặc ném lỗi 404
        private Product findProductById(Long id) {
                if (id == null) {
                        throw new IllegalArgumentException("Product ID cannot be null.");
                }
                return productRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        }

        // Tìm 1 khuyến mãi đang "ACTIVE" của sản phẩm (Giữ nguyên)
        private Promotion findActivePromotion(Product product) {
                if (product == null || product.getPromotionDetails() == null
                                || product.getPromotionDetails().isEmpty()) {
                        return null;
                }
                for (PromotionDetail detail : product.getPromotionDetails()) {
                        if (detail != null && detail.getPromotion_id() != null &&
                                        "ACTIVE".equals(detail.getPromotion_id().getStatus())) {
                                return detail.getPromotion_id();
                        }
                }
                return null;
        }

        // (Giữ nguyên hàm mapToProductCardDTO)
        private ProductCardDTO mapToProductCardDTO(Product product) {
                ProductCardDTO dto = new ProductCardDTO();
                if (product == null)
                        return dto;

                dto.setId(product.getId());
                dto.setName(product.getName());
                dto.setOriginalPrice(product.getPrice());
                dto.setAverageRating(product.getAverageRating()); // Lấy rating trung bình

                // (logic tính totalQuantity)
                int totalQuantity = 0;
                if (product.getVariants() != null) {
                        totalQuantity = product.getVariants().stream()
                                        .mapToInt(ProductVariant::getQuantity)
                                        .sum();
                }
                dto.setTotalQuantity(totalQuantity);

                // (logic lấy supplierName)
                if (product.getSupplier_id() != null) {
                        dto.setSupplierName(product.getSupplier_id().getName());
                }

                // (logic lấy imageUrl)
                if (product.getImages() != null && !product.getImages().isEmpty()) {
                        Image firstImage = product.getImages().get(0);
                        if (firstImage != null) {
                                dto.setImageUrl(firstImage.getUrl());
                        }
                }

                // Tính giá sale
                Promotion activePromotion = findActivePromotion(product);

                if (activePromotion != null && activePromotion.getDiscountPercentage() != null
                                && product.getPrice() != null) {

                        // (Phần logic cũ của bạn)
                        double discount = activePromotion.getDiscountPercentage();
                        double originalPrice = product.getPrice();
                        discount = Math.max(0.0, Math.min(100.0, discount));
                        double salePrice = originalPrice * (1 - (discount / 100.0));
                        dto.setSalePrice(Math.round(salePrice * 1.0) / 1.0);
                        dto.setDiscountPercentage(discount);

                        dto.setPromotionName(activePromotion.getName());
                        // ------------------------------

                } else {
                        dto.setSalePrice(product.getPrice());
                        dto.setDiscountPercentage(0.0);

                }

                return dto;
        }

        // --- SỬA 1: THÊM @Override VÀO ĐÂY ---
        @Override
        @Transactional
        public void addPromotionToProduct(Long productId, Long promotionId) {
                // 1. Tìm Product và Promotion
                Product product = findProductById(productId); // (Dùng hàm helper cũ của bạn)
                Promotion promotion = promotionRepository.findById(promotionId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Promotion not found: " + promotionId));

                // 2. Kiểm tra xem link này đã tồn tại chưa
                Optional<PromotionDetail> existingLink = promotionDetailRepository
                                .findByProduct_idAndPromotion_id(product, promotion);

                if (existingLink.isPresent()) {
                        // Nếu đã tồn tại, không làm gì cả (hoặc ném lỗi)
                        throw new RuntimeException("Product is already in this promotion");
                }

                // 3. Nếu chưa tồn tại, tạo link (PromotionDetail) mới
                PromotionDetail newDetail = new PromotionDetail();
                newDetail.setProduct_id(product);
                newDetail.setPromotion_id(promotion);
                newDetail.setStatus("ACTIVE"); // Hoặc logic khác

                promotionDetailRepository.save(newDetail);
        }

        // --- SỬA 2: THÊM @Override VÀO ĐÂY ---
        @Override
        @Transactional
        public void removePromotionFromProduct(Long productId, Long promotionId) {
                // 1. Tìm Product và Promotion
                Product product = findProductById(productId);
                Promotion promotion = promotionRepository.findById(promotionId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Promotion not found: " + promotionId));

                // 2. Tìm link (PromotionDetail)
                PromotionDetail linkToRemove = promotionDetailRepository
                                .findByProduct_idAndPromotion_id(product, promotion)
                                .orElseThrow(() -> new ResourceNotFoundException("Promotion link not found"));

                // 3. Xóa link
                promotionDetailRepository.delete(linkToRemove);
        }

        private ProductResponseDTO mapProductToResponseDTOWithSale(Product product) {
                ProductResponseDTO dto = new ProductResponseDTO(product);
                Promotion activePromotion = findActivePromotion(product);

                if (activePromotion != null && activePromotion.getDiscountPercentage() != null
                                && product.getPrice() != null) {
                        double discount = activePromotion.getDiscountPercentage();
                        double originalPrice = product.getPrice();
                        discount = Math.max(0.0, Math.min(100.0, discount));
                        double salePrice = originalPrice * (1 - (discount / 100.0));
                        dto.setSalePrice(Math.round(salePrice * 1.0) / 1.0);
                        dto.setDiscountPercentage(discount);
                        ;
                } else {
                        dto.setSalePrice(product.getPrice());
                        dto.setDiscountPercentage(0.0);
                }
                return dto;
        }

        @Override
        @Transactional(readOnly = true)
        public List<ProductResponseDTO> getAllProducts() {
                List<Product> products = productRepository.findAll();
                return products.stream()
                                .filter(Objects::nonNull)
                                .map(this::mapProductToResponseDTOWithSale)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public ProductResponseDTO createProduct(ProductRequestDTO request) {
                if (request == null) {
                        throw new IllegalArgumentException("Product request cannot be null.");
                }
                // --- SỬA 3: SỬA LẠI THÔNG BÁO LỖI CHO ĐÚNG ---
                if (request.getCategoryId() == null
                                || request.getSupplierId() == null) {
                        throw new IllegalArgumentException(
                                        "Category and Supplier IDs are required.");
                }

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                Supplier supplier = supplierRepository.findById(request.getSupplierId())
                                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

                // 2. Tạo Product chính
                Product product = new Product(
                                request.getName(),
                                request.getPrice(), // Giá gốc
                                request.getDescription(),
                                category, supplier);
                Product savedProduct = productRepository.save(product);

                // 3. Xử lý Images
                List<Image> images = new ArrayList<>();
                if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
                        images = request.getImageUrls().stream()
                                        .filter(url -> url != null && !url.isBlank())
                                        .map(url -> new Image(url, savedProduct))
                                        .collect(Collectors.toList());
                        if (!images.isEmpty()) {
                                imageRepository.saveAll(images); // Lưu ảnh
                        }
                }
                savedProduct.setImages(images);

                // 4. XỬ LÝ VARIANTS
                List<ProductVariant> variants = new ArrayList<>();
                if (request.getVariants() != null && !request.getVariants().isEmpty()) {
                        for (VariantRequestDTO variantDto : request.getVariants()) {
                                if (variantDto == null || variantDto.getColorId() == null
                                                || variantDto.getSizeId() == null) {
                                        continue;
                                }
                                Color color = colorRepository.findById(variantDto.getColorId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Color not found: " + variantDto.getColorId()));
                                Size size = sizeRepository.findById(variantDto.getSizeId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Size not found: " + variantDto.getSizeId()));

                                ProductVariant variant = new ProductVariant(
                                                savedProduct, // Liên kết với Product vừa lưu
                                                color,
                                                size,
                                                variantDto.getQuantity() // Số lượng của biến thể này
                                );
                                variants.add(variant);
                        }
                        productVariantRepository.saveAll(variants);
                }
                savedProduct.setVariants(variants);

                // logic xử lý PromotionIds
                if (request.getPromotionIds() != null && !request.getPromotionIds().isEmpty()) {
                        List<PromotionDetail> promoDetails = new ArrayList<>();

                        for (Long promoId : request.getPromotionIds()) {
                                Promotion promotion = promotionRepository.findById(promoId)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Promotion not found: " + promoId));

                                PromotionDetail detail = new PromotionDetail();
                                detail.setProduct_id(savedProduct);
                                detail.setPromotion_id(promotion);
                                detail.setStatus("ACTIVE");

                                promoDetails.add(detail);
                        }

                        promotionDetailRepository.saveAll(promoDetails);
                }

                return mapProductToResponseDTOWithSale(savedProduct);
        }

        // (Giữ nguyên hàm updateProduct)
        @Override
        @Transactional
        public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
                if (id == null)
                        throw new IllegalArgumentException("Product ID for update cannot be null.");
                if (request == null)
                        throw new IllegalArgumentException("Product request cannot be null.");

                Product existingProduct = findProductById(id);

                // Cập nhật thông tin cơ bản
                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                Supplier supplier = supplierRepository.findById(request.getSupplierId())
                                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
                existingProduct.setName(request.getName());
                existingProduct.setPrice(request.getPrice());
                existingProduct.setDescription(request.getDescription());
                existingProduct.setCategory_id(category);

                existingProduct.setSupplier_id(supplier);

                // Xử lý Images (Xóa cũ, thêm mới)
                if (existingProduct.getImages() == null)
                        existingProduct.setImages(new ArrayList<>());
                existingProduct.getImages().clear(); // Xóa cũ
                if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
                        List<Image> newImages = request.getImageUrls().stream()
                                        .filter(url -> url != null && !url.isBlank())
                                        .map(url -> new Image(url, existingProduct))
                                        .collect(Collectors.toList());
                        existingProduct.getImages().addAll(newImages); // Thêm mới
                }

                // XỬ LÝ VARIANTS (Xóa cũ, thêm mới)
                if (existingProduct.getVariants() == null) {
                        existingProduct.setVariants(new ArrayList<>());
                }
                existingProduct.getVariants().clear(); // Xóa hết variant cũ

                if (request.getVariants() != null && !request.getVariants().isEmpty()) {
                        List<ProductVariant> newVariants = new ArrayList<>();
                        for (VariantRequestDTO variantDto : request.getVariants()) {
                                if (variantDto == null || variantDto.getColorId() == null
                                                || variantDto.getSizeId() == null) {
                                        continue;
                                }
                                Color color = colorRepository.findById(variantDto.getColorId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Color not found: " + variantDto.getColorId()));
                                Size size = sizeRepository.findById(variantDto.getSizeId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Size not found: " + variantDto.getSizeId()));

                                ProductVariant newVariant = new ProductVariant(
                                                existingProduct,
                                                color,
                                                size,
                                                variantDto.getQuantity());
                                newVariants.add(newVariant);
                        }
                        existingProduct.getVariants().addAll(newVariants);
                }

                Product updatedProduct = productRepository.save(existingProduct);

                return mapProductToResponseDTOWithSale(updatedProduct);
        }

        // --- SỬA 4: SỬA HÀM DELETE ---
        @Override // (Nhớ @Override)
        @Transactional(readOnly = true)
        public ProductResponseDTO getProductById(Long id) {
                // 1. Tìm Product (Giữ nguyên)
                Product product = findProductById(id);

                // 2. Map Product và tính giá Sale (Giữ nguyên)
                ProductResponseDTO dto = mapProductToResponseDTOWithSale(product);

                // === 3. SỬA LOGIC MAP VARIANTS ===
                List<VariantResponseDTO> variantDTOs = product.getVariants().stream()
                                // Dùng thẳng constructor của bạn, rất sạch!
                                .map(variant -> new VariantResponseDTO(variant))
                                .collect(Collectors.toList());

                // 4. Gán danh sách variants vào DTO
                dto.setVariants(variantDTOs);

                // 5. Tính tổng số lượng (totalQuantity)
                int totalQuantity = product.getVariants().stream()
                                .mapToInt(ProductVariant::getQuantity)
                                .sum();
                dto.setTotalQuantity(totalQuantity);

                // === KẾT THÚC PHẦN SỬA ===

                return dto; // 6. Trả về DTO đã hoàn chỉnh
        }

        @Transactional(readOnly = true)
        public List<ProductCardDTO> getFeaturedProducts() {
                List<Product> featuredProducts = productRepository.findProductsByPromotionStatus("ACTIVE");
                return featuredProducts.stream()
                                .filter(Objects::nonNull)
                                .map(this::mapToProductCardDTO)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public List<ProductCardDTO> getAllPublicProducts(ProductFilterDTO filters, Sort sort) {
                Specification<Product> spec = ProductSpecifications.filterBy(filters);
                List<Product> products = productRepository.findAll(spec, sort);
                return products.stream()
                                .filter(Objects::nonNull)
                                .map(this::mapToProductCardDTO)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public void deleteProduct(Long id) {

                Product product = findProductById(id);

                if (product.getPromotionDetails() != null && !product.getPromotionDetails().isEmpty()) {
                        promotionDetailRepository.deleteAll(product.getPromotionDetails());
                }

                productRepository.delete(product);
        }

}