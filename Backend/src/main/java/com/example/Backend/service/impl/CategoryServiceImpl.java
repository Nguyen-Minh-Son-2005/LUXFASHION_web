package com.example.Backend.service.impl;

import com.example.Backend.dto.SimpleInfoDTO;
import com.example.Backend.entity.Category;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.repository.CategoryRepository;
import com.example.Backend.repository.ProductRepository;
import com.example.Backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // 4. INJECT REPO CỦA PRODUCT
    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SimpleInfoDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new SimpleInfoDTO(category.getId(), category.getName()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SimpleInfoDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return new SimpleInfoDTO(category.getId(), category.getName());
    }

    @Override
    @Transactional
    public SimpleInfoDTO createCategory(SimpleInfoDTO dto) {
        if (dto == null || dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("Category name cannot be null or empty");
        }

        Category newCategory = new Category();
        newCategory.setName(dto.getName());

        Category savedCategory = categoryRepository.save(newCategory);
        return new SimpleInfoDTO(savedCategory.getId(), savedCategory.getName());
    }

    @Override
    @Transactional
    public SimpleInfoDTO updateCategory(Long id, SimpleInfoDTO dto) {
        if (dto == null || dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("Category name cannot be null or empty");
        }

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        existingCategory.setName(dto.getName());

        Category updatedCategory = categoryRepository.save(existingCategory);
        return new SimpleInfoDTO(updatedCategory.getId(), updatedCategory.getName());
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category categoryToDelete = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // KIỂM TRA QUAN TRỌNG: Category này có đang được sử dụng không?
        long productCount = productRepository.countByCategory_id(categoryToDelete);

        if (productCount > 0) {
            // Nếu có, ném lỗi và không cho xóa
            throw new RuntimeException("Cannot delete category: It is currently used by "
                    + productCount + " product(s).");
        }

        // Nếu không có sản phẩm nào dùng, tiến hành xóa
        categoryRepository.delete(categoryToDelete);
    }
}