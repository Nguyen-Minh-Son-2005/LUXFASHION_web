package com.example.Backend.controller.admin;

import com.example.Backend.dto.PromotionDetailRequestDTO;
import com.example.Backend.dto.PromotionDetailResponseDTO;
import com.example.Backend.service.PromotionDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/promotion-details")

public class PromotionDetailAdminController {

    @Autowired
    private PromotionDetailService promotionDetailService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PromotionDetailResponseDTO addProductToPromotion(@RequestBody PromotionDetailRequestDTO request) {
        return promotionDetailService.addProductToPromotion(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeProductFromPromotion(@PathVariable Long id) {
        promotionDetailService.removeProductFromPromotion(id);
    }
}