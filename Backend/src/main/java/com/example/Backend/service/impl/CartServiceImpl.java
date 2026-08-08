package com.example.Backend.service.impl;

import com.example.Backend.dto.CartAddDTO;
import com.example.Backend.dto.CartResponseDTO;
import com.example.Backend.entity.*;
import com.example.Backend.exception.ForbiddenException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.repository.*;
import com.example.Backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartDetailRepository cartDetailRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;

    private Cart getOrCreateCart(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        // Tìm giỏ hàng theo User
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    // Nếu không tìm thấy, tạo giỏ hàng mới
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }

    private Promotion findActivePromotion(Product product) {
        if (product == null || product.getPromotionDetails() == null || product.getPromotionDetails().isEmpty()) {
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

    private Double getSalePrice(Product product) {
        if (product == null)
            return 0.0;
        Double originalPrice = product.getPrice() != null ? product.getPrice() : 0.0;

        Promotion activePromotion = findActivePromotion(product);

        if (activePromotion != null && activePromotion.getDiscountPercentage() != null) {
            double discount = activePromotion.getDiscountPercentage();
            discount = Math.max(0.0, Math.min(100.0, discount)); // Đảm bảo discount 0-100
            return originalPrice * (1 - (discount / 100.0));
        }
        return originalPrice; // Trả về giá gốc nếu không có KM
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponseDTO getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Cart cart = getOrCreateCart(user);
        // Constructor của CartResponseDTO sẽ tự động map data
        return new CartResponseDTO(cart);
    }

    /**
     * Thêm sản phẩm (biến thể) vào giỏ hàng
     */
    @Override
    @Transactional
    public CartResponseDTO addToCart(CartAddDTO dto, Long userId) {
        // 1. Tìm User và Cart
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = getOrCreateCart(user);

        // 2. Tìm ProductVariant (biến thể)
        ProductVariant variant = productVariantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product Variant not found with id: " + dto.getVariantId()));

        // 3. KIỂM TRA SỐ LƯỢNG TỒN KHO (của biến thể)
        if (variant.getQuantity() < dto.getQuantity()) {
            throw new RuntimeException("Not enough stock for this variant. Available: " + variant.getQuantity());
        }

        // 4. Tìm xem biến thể này đã có trong giỏ chưa
        // (Dùng hàm findExistingDetail đã sửa trong Repository)
        Optional<CartDetail> existingDetail = cartDetailRepository
                .findExistingDetail(cart, variant);

        if (existingDetail.isPresent()) {
            // --- Cập nhật số lượng (nếu đã có) ---
            CartDetail detail = existingDetail.get();
            int newQuantity = detail.getQuantity() + dto.getQuantity();

            // Kiểm tra lại tổng số lượng (không vượt quá tồn kho)
            if (variant.getQuantity() < newQuantity) {
                throw new RuntimeException("Not enough stock for this variant. Requested total (" + newQuantity
                        + ") exceeds available stock (" + variant.getQuantity() + ")");
            }
            detail.setQuantity(newQuantity);
            cartDetailRepository.save(detail);

        } else {
            // --- Thêm mới (nếu chưa có) ---

            Double salePrice = getSalePrice(variant.getProduct());

            CartDetail newDetail = new CartDetail(
                    cart,
                    variant, // Gán ProductVariant
                    dto.getQuantity(),
                    salePrice // Lưu giá tại thời điểm mua
            );
            cart.getCartDetails().add(newDetail); // Thêm detail vào list của cart
            cartDetailRepository.save(newDetail);
        }

        // Trả về toàn bộ giỏ hàng đã cập nhật

        Cart updatedCart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found after update")); // Lỗi hiếm gặp
        return new CartResponseDTO(updatedCart);
    }

    /**
     * Cập nhật số lượng của một món hàng trong giỏ
     */
    @Override
    @Transactional
    public CartResponseDTO updateItemQuantity(Long cartDetailId, int newQuantity, Long userId) {
        // 1. Tìm chi tiết giỏ hàng
        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartDetailId));

        // 2. Kiểm tra bảo mật: Đảm bảo món hàng này thuộc về đúng user
        if (cartDetail.getCart() == null || cartDetail.getCart().getUser() == null
                || !cartDetail.getCart().getUser().getId().equals(userId)) {

            // --- SỬA LỖI CÚ PHÁP Ở ĐÂY ---
            throw new ForbiddenException("You do not have permission to modify this item");
        }

        // 3. Kiểm tra số lượng tồn kho của Variant
        ProductVariant variant = cartDetail.getProductVariant();
        if (variant == null) {
            throw new ResourceNotFoundException("Product variant associated with this cart item not found");
        }
        if (variant.getQuantity() < newQuantity) {
            throw new RuntimeException("Not enough stock for this variant. Available: " + variant.getQuantity());
        }

        // 4. Nếu số lượng mới <= 0, thì xóa luôn
        if (newQuantity <= 0) {
            cartDetailRepository.delete(cartDetail);
        } else {
            // 5. Cập nhật số lượng và lưu
            cartDetail.setQuantity(newQuantity);
            cartDetailRepository.save(cartDetail);
        }

        // 6. Trả về toàn bộ giỏ hàng đã cập nhật
        return getCartByUserId(userId);
    }

    /**
     * Xóa một món hàng khỏi giỏ
     */
    @Override
    @Transactional
    public CartResponseDTO removeItem(Long cartDetailId, Long userId) {

        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartDetailId));

        if (cartDetail.getCart() == null || cartDetail.getCart().getUser() == null
                || !cartDetail.getCart().getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to remove this item");
        }

        cartDetailRepository.delete(cartDetail);

        return getCartByUserId(userId);
    }
}