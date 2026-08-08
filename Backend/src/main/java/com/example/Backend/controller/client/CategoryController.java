package com.example.Backend.controller.client; // Hoặc package controller chung

import com.example.Backend.dto.SimpleInfoDTO;
import com.example.Backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<SimpleInfoDTO>> getAllCategories() {
        List<SimpleInfoDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}