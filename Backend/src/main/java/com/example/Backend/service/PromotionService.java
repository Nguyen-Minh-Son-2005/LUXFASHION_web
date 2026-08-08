package com.example.Backend.service;

import com.example.Backend.dto.PromotionRequestDTO;
import com.example.Backend.dto.PromotionResponseDTO;
import java.util.List;

public interface PromotionService {
    PromotionResponseDTO createPromotion(PromotionRequestDTO request);

    PromotionResponseDTO getPromotionById(Long id);

    List<PromotionResponseDTO> getAllPromotions();

    PromotionResponseDTO updatePromotion(Long id, PromotionRequestDTO request);

    void deletePromotion(Long id);
}