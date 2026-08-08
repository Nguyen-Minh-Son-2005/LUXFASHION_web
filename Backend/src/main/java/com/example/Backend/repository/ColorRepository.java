package com.example.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.entity.Color;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {
}
