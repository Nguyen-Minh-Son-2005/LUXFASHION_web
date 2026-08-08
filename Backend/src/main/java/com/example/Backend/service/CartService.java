package com.example.Backend.service;

import com.example.Backend.dto.CartAddDTO;
import com.example.Backend.dto.CartResponseDTO;

public interface CartService {

    CartResponseDTO getCartByUserId(Long userId);

    CartResponseDTO addToCart(CartAddDTO dto, Long userId);

    CartResponseDTO updateItemQuantity(Long cartDetailId, int newQuantity, Long userId);

    CartResponseDTO removeItem(Long cartDetailId, Long userId);
}