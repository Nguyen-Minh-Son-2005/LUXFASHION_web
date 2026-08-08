package com.example.Backend.service.impl;

import com.example.Backend.dto.PromotionRequestDTO;
import com.example.Backend.dto.PromotionResponseDTO;
import com.example.Backend.entity.Promotion;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.repository.PromotionDetailRepository;
import com.example.Backend.repository.PromotionRepository;
import com.example.Backend.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl implements PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private PromotionDetailRepository promotionDetailRepository;

    private Promotion findPromotionById(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
    }

    @Override
    @Transactional
    public PromotionResponseDTO createPromotion(PromotionRequestDTO request) {
        Promotion promotion = new Promotion(
                request.getName(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate(),
                request.getDiscountPercentage(),
                request.getStatus());
        Promotion savedPromotion = promotionRepository.save(promotion);
        return new PromotionResponseDTO(savedPromotion);
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionResponseDTO getPromotionById(Long id) {
        return new PromotionResponseDTO(findPromotionById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionResponseDTO> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(PromotionResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PromotionResponseDTO updatePromotion(Long id, PromotionRequestDTO request) {
        Promotion existingPromotion = findPromotionById(id);
        existingPromotion.setName(request.getName());
        existingPromotion.setDescription(request.getDescription());
        existingPromotion.setStartDate(request.getStartDate());
        existingPromotion.setEndDate(request.getEndDate());
        existingPromotion.setDiscountPercentage(request.getDiscountPercentage());
        existingPromotion.setStatus(request.getStatus());

        Promotion updatedPromotion = promotionRepository.save(existingPromotion);
        return new PromotionResponseDTO(updatedPromotion);
    }

    @Override
    @Transactional
    public void deletePromotion(Long id) {
        Promotion promotion = findPromotionById(id);
        promotionDetailRepository.deleteByPromotion_id(promotion);
        promotionRepository.delete(promotion);
    }
}