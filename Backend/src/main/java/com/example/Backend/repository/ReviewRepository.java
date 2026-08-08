package com.example.Backend.repository;

import com.example.Backend.entity.Product;
import com.example.Backend.entity.Review;
import com.example.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Comment: Tìm tất cả review của 1 sản phẩm (để hiển thị công khai)
    List<Review> findByProduct(Product product);

    // Comment: Tìm xem 1 user cụ thể đã review sản phẩm này chưa
    Optional<Review> findByUserAndProduct(User user, Product product);
}