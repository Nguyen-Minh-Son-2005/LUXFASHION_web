package com.example.Backend.controller.client;

// --- 1. THÊM CÁC IMPORT NÀY ---
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.example.Backend.service.CartService;
import com.example.Backend.service.UserService; // (Cần để lấy user)
import com.example.Backend.dto.CartAddDTO;
import com.example.Backend.dto.CartResponseDTO;
import com.example.Backend.entity.User;

import java.security.Principal; // (Import quan trọng)
import java.util.Map; // (Import để cập nhật số lượng)

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // --- 2. INJECT USER SERVICE ---
    @Autowired
    private UserService userService;

    private Long getUserIdFromPrincipal(Principal principal) {
        if (principal == null) {
            throw new SecurityException("User not authenticated");
        }

        String email;
        String name = null;

        // Ép kiểu 'principal' về 'Authentication' để lấy thông tin chi tiết
        Authentication authentication = (Authentication) principal;
        Object principalDetails = authentication.getPrincipal();

        if (principalDetails instanceof OAuth2User) {
            // Case 1: Đăng nhập bằng Google
            OAuth2User oauthUser = (OAuth2User) principalDetails;
            email = oauthUser.getAttribute("email");
            name = oauthUser.getAttribute("name");
        } else {
            // Case 2: Đăng nhập bằng Local
            email = principal.getName();
        }

        // Gọi hàm 'findOrCreateUser'
        User user = userService.findOrCreateUser(email, name);
        return user.getId();
    }

    /**
     * =======================================================
     * SỬA LẠI CÁC HÀM API
     * =======================================================
     */

    /**
     * API Lấy giỏ hàng
     * (Sửa tham số để nhận Principal)
     */
    @GetMapping
    public CartResponseDTO getMyCart(Principal principal) {
        Long userId = getUserIdFromPrincipal(principal); // Lấy ID thật
        return cartService.getCartByUserId(userId);
    }

    /**
     * API Thêm vào giỏ hàng
     * (Sửa tham số để nhận Principal)
     */
    @PostMapping("/add")
    public CartResponseDTO addToCart(@RequestBody CartAddDTO cartAddDTO,
            Principal principal) {
        Long userId = getUserIdFromPrincipal(principal); // Lấy ID thật
        return cartService.addToCart(cartAddDTO, userId);
    }

    /**
     * =======================================================
     * BỔ SUNG CÁC HÀM CÒN THIẾU
     * =======================================================
     */

    /**
     * API Cập nhật số lượng của một món hàng
     * [PUT] http://localhost:8080/api/cart/update/101
     * Body (JSON): { "quantity": 3 }
     */
    @PutMapping("/update/{cartDetailId}")
    public CartResponseDTO updateItemQuantity(
            @PathVariable Long cartDetailId,
            @RequestBody Map<String, Integer> request,
            Principal principal) {

        Long userId = getUserIdFromPrincipal(principal);
        int newQuantity = request.get("quantity");

        return cartService.updateItemQuantity(cartDetailId, newQuantity, userId);
    }

    /**
     * API Xóa một món hàng (CartDetail) khỏi giỏ
     * [DELETE] http://localhost:8080/api/cart/remove/101
     */
    @DeleteMapping("/remove/{cartDetailId}")
    public CartResponseDTO removeItemFromCart(
            @PathVariable Long cartDetailId,
            Principal principal) {

        Long userId = getUserIdFromPrincipal(principal);
        return cartService.removeItem(cartDetailId, userId);
    }
}