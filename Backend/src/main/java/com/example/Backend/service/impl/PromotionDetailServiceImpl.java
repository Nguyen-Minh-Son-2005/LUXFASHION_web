package com.example.Backend.service.impl;

import com.example.Backend.dto.PromotionDetailRequestDTO;
import com.example.Backend.dto.PromotionDetailResponseDTO;
import com.example.Backend.entity.Product;
import com.example.Backend.entity.Promotion;
import com.example.Backend.entity.PromotionDetail;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.repository.ProductRepository;
import com.example.Backend.repository.PromotionDetailRepository;
import com.example.Backend.repository.PromotionRepository;
import com.example.Backend.service.PromotionDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PromotionDetailServiceImpl implements PromotionDetailService {

    @Autowired
    private PromotionDetailRepository promotionDetailRepository;

    @Autowired
    private PromotionRepository promotionRepository; // Cần để tìm Promotion

    @Autowired
    private ProductRepository productRepository; // Cần để tìm Product

    @Override
    @Transactional
    public PromotionDetailResponseDTO addProductToPromotion(PromotionDetailRequestDTO request) {
        // 1. Tìm Promotion
        Promotion promotion = promotionRepository.findById(request.getPromotionId())
            .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));

        // 2. Tìm Product
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            
        // 3. Tạo mới PromotionDetail
        PromotionDetail detail = new PromotionDetail(
            promotion,
            product,
            request.getStatus()
        );

        // 4. Lưu vào DB
        PromotionDetail savedDetail = promotionDetailRepository.save(detail);
        
        // 5. Trả về DTO
        return new PromotionDetailResponseDTO(savedDetail);
    }

    @Override
    @Transactional
    public void removeProductFromPromotion(Long detailId) {
        PromotionDetail detail = promotionDetailRepository.findById(detailId)
            .orElseThrow(() -> new ResourceNotFoundException("PromotionDetail not found"));
        
        promotionDetailRepository.delete(detail);
    }
}