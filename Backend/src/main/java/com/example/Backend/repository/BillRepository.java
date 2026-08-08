package com.example.Backend.repository;

import com.example.Backend.entity.Bill;
import com.example.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {


    List<Bill> findByUserOrderByCreatedAtDesc(User user);

    List<Bill> findByUserAndStatusOrderByCreatedAtDesc(User user, String status);

    List<Bill> findByStatusOrderByCreatedAtDesc(String status);
}