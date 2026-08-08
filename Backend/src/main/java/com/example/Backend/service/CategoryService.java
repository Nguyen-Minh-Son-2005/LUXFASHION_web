package com.example.Backend.service;

import com.example.Backend.dto.SimpleInfoDTO;
import java.util.List;

public interface CategoryService {

    List<SimpleInfoDTO> getAllCategories();

    SimpleInfoDTO getCategoryById(Long id);

    SimpleInfoDTO createCategory(SimpleInfoDTO dto);

    SimpleInfoDTO updateCategory(Long id, SimpleInfoDTO dto);

    void deleteCategory(Long id);
}