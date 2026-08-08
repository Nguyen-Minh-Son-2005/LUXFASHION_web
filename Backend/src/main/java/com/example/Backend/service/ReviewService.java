package com.example.Backend.service;

import com.example.Backend.dto.ReviewRequestDTO;
import com.example.Backend.dto.ReviewResponseDTO;
import java.util.List;

public interface ReviewService {

    List<ReviewResponseDTO> getReviewsForProduct(Long productId);

    ReviewResponseDTO getMyReviewForProduct(Long productId, Long userId);

    ReviewResponseDTO createOrUpdateReview(ReviewRequestDTO dto, Long userId);
}