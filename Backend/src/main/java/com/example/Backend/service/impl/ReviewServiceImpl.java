package com.example.Backend.service.impl;

import com.example.Backend.dto.ReviewRequestDTO;
import com.example.Backend.dto.ReviewResponseDTO;
import com.example.Backend.entity.*;
import com.example.Backend.exception.ForbiddenException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.repository.*;
import com.example.Backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    // Comment: Cần BillRepository để kiểm tra quyền
    @Autowired
    private BillRepository billRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getReviewsForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return reviewRepository.findByProduct(product).stream()
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponseDTO getMyReviewForProduct(Long productId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Tìm review có sẵn, nếu không có thì trả về null
        return reviewRepository.findByUserAndProduct(user, product)
                .map(ReviewResponseDTO::new)
                .orElse(null);
    }

    @Override
    @Transactional
    public ReviewResponseDTO createOrUpdateReview(ReviewRequestDTO dto, Long userId) {

        // 1. Kiểm tra dữ liệu đầu vào
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // 2. KIỂM TRA QUYỀN (tạm thời cho phép mọi user đã đăng nhập đánh giá)
        // Nếu cần bật lại kiểm tra mua hàng, sử dụng hasPurchasedProduct(user, product)

        // 3. Tìm review cũ (nếu có) để cập nhật, hoặc tạo mới
        Optional<Review> existingReviewOpt = reviewRepository.findByUserAndProduct(user, product);

        Review review;
        if (existingReviewOpt.isPresent()) {
            // Cập nhật review cũ
            review = existingReviewOpt.get();
        } else {
            // Tạo review mới
            review = new Review();
            review.setUser(user);
            review.setProduct(product);
        }

        // Gán thông tin mới
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        // 4. Lưu vào DB
        Review savedReview = reviewRepository.save(review);

        // 5. Trả về DTO
        return new ReviewResponseDTO(savedReview);
    }

    private boolean hasPurchasedProduct(User user, Product product) {
        // Lấy tất cả hóa đơn của user
        List<Bill> userBills = billRepository.findByUserOrderByCreatedAtDesc(user);

        // Lọc các hóa đơn đã giao thành công
        for (Bill bill : userBills) {
            // Bạn phải đảm bảo Admin cập nhật trạng thái thành "DELIVERED"
            if ("DELIVERED".equals(bill.getStatus())) {

                // Kiểm tra xem bill này có chứa sản phẩm đó không
                for (BillDetail detail : bill.getBillDetails()) {
                    if (detail.getProductVariant() != null &&
                            detail.getProductVariant().getProduct() != null &&
                            detail.getProductVariant().getProduct().getId().equals(product.getId())) {

                        // Nếu tìm thấy, user có quyền.
                        return true;
                    }
                }
            }
        }

        // Nếu không tìm thấy, user không có quyền
        return false;
    }
}