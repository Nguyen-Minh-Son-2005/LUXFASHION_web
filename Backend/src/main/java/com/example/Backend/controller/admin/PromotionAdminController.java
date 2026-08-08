package com.example.Backend.controller.admin;

import com.example.Backend.dto.PromotionRequestDTO;
import com.example.Backend.dto.PromotionResponseDTO;
import com.example.Backend.service.ProductService;
import com.example.Backend.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
public class PromotionAdminController {

    @Autowired
    private PromotionService promotionService;
    @Autowired
    private ProductService productService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PromotionResponseDTO createPromotion(@RequestBody PromotionRequestDTO request) {
        return promotionService.createPromotion(request);
    }

    @GetMapping
    public List<PromotionResponseDTO> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    @GetMapping("/{id}")
    public PromotionResponseDTO getPromotionById(@PathVariable Long id) {
        return promotionService.getPromotionById(id);
    }

    @PutMapping("/{id}")
    public PromotionResponseDTO updatePromotion(@PathVariable Long id, @RequestBody PromotionRequestDTO request) {
        return promotionService.updatePromotion(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
    }

    @PostMapping("/{productId}/promotions")
    @ResponseStatus(HttpStatus.CREATED)
    public void addPromotionToProduct(
            @PathVariable Long productId,
            @RequestBody AdminPromotionRequestDTO request) {

        productService.addPromotionToProduct(productId, request.getPromotionId());
    }

    @DeleteMapping("/{productId}/promotions/{promotionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removePromotionFromProduct(
            @PathVariable Long productId,
            @PathVariable Long promotionId) {

        productService.removePromotionFromProduct(productId, promotionId);
    }
}

class AdminPromotionRequestDTO {
    private Long promotionId;

    public Long getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(Long promotionId) {
        this.promotionId = promotionId;
    }
}