package com.example.Backend.controller.admin; // <-- Đặt trong package 'admin'

import com.example.Backend.dto.SimpleInfoDTO;
import com.example.Backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories") // Đường dẫn riêng cho Admin
public class AdminCategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<SimpleInfoDTO> createCategory(@RequestBody SimpleInfoDTO dto) {
        SimpleInfoDTO createdCategory = categoryService.createCategory(dto);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SimpleInfoDTO> updateCategory(@PathVariable Long id, @RequestBody SimpleInfoDTO dto) {
        SimpleInfoDTO updatedCategory = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SimpleInfoDTO> getCategoryById(@PathVariable Long id) {
        SimpleInfoDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

}