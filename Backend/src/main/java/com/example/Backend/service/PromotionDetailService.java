package com.example.Backend.service;

import com.example.Backend.dto.PromotionDetailRequestDTO;
import com.example.Backend.dto.PromotionDetailResponseDTO;

public interface PromotionDetailService {
    PromotionDetailResponseDTO addProductToPromotion(PromotionDetailRequestDTO request);

    void removeProductFromPromotion(Long detailId);
}