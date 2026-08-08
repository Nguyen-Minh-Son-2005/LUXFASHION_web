package com.example.Backend.repository;

import com.example.Backend.entity.Cart;
import com.example.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Tìm giỏ hàng theo User
    Optional<Cart> findByUser(User user);
}