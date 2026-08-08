package com.example.Backend.dto;

import com.example.Backend.entity.Review;
import java.time.LocalDateTime;

public class ReviewResponseDTO {
    private Long id;
    private int rating;
    private String comment;
    private Long userId;
    private String userName;
    private Long productId;

    public ReviewResponseDTO(Review review) {
        this.id = review.getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.productId = review.getProduct().getId();

        if (review.getUser() != null) {
            this.userId = review.getUser().getId();

            this.userName = review.getUser().getFullName();
        }
    }

    // --- Getters ---
    public Long getId() {
        return id;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public Long getProductId() {
        return productId;
    }
}