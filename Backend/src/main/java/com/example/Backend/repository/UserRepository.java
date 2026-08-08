package com.example.Backend.repository;

import com.example.Backend.entity.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findAllByStatus(String status);

    Optional<User> findByIdAndStatus(Long id, String status);
}