package com.example.Backend.controller.client;

import com.example.Backend.dto.ReviewRequestDTO;
import com.example.Backend.dto.ReviewResponseDTO;
import com.example.Backend.entity.User; // <-- 1. THÊM IMPORT
import com.example.Backend.service.ReviewService;
import com.example.Backend.service.UserService; // <-- 2. THÊM IMPORT
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // <-- 3. THÊM IMPORT
import org.springframework.security.oauth2.core.user.OAuth2User; // <-- 4. THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.security.Principal; // <-- 5. THÊM IMPORT
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // --- 6. INJECT USER SERVICE ---
    @Autowired
    private UserService userService;

    // --- 7. XÓA BỎ HÀM HARD-CODE CŨ ---
    // private Long getCurrentUserId() {
    // return 1L;
    // }

    /**
     * =======================================================
     * HÀM HELPER MỚI (Lấy User ID thật)
     * =======================================================
     * (Hàm này giống hệt hàm trong BillController đã sửa)
     */
    private Long getUserIdFromPrincipal(Principal principal) {
        if (principal == null) {
            throw new SecurityException("User not authenticated");
        }

        Authentication authentication = (Authentication) principal;
        Object principalDetails = authentication.getPrincipal();
        String email;
        String name = null;

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
     * API Lấy TẤT CẢ review của 1 sản phẩm (CÔNG KHAI)
     * (Hàm này không cần đăng nhập, giữ nguyên)
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForProduct(@PathVariable Long productId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * API Lấy review CỦA TÔI cho 1 sản phẩm (Cần đăng nhập)
     */
    @GetMapping("/my-review")
    public ResponseEntity<ReviewResponseDTO> getMyReview(
            @RequestParam Long productId,
            Principal principal) { // <-- 8. Thêm 'Principal'

        Long userId = getUserIdFromPrincipal(principal); // Lấy ID thật
        ReviewResponseDTO review = reviewService.getMyReviewForProduct(productId, userId);
        return ResponseEntity.ok(review);
    }

    /**
     * API Tạo (hoặc Cập nhật) một review mới (Cần đăng nhập)
     */
    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createOrUpdateReview(
            @RequestBody ReviewRequestDTO request,
            Principal principal) { // <-- 9. Thêm 'Principal'

        Long userId = getUserIdFromPrincipal(principal); // Lấy ID thật
        ReviewResponseDTO savedReview = reviewService.createOrUpdateReview(request, userId);
        return ResponseEntity.ok(savedReview);
    }
}