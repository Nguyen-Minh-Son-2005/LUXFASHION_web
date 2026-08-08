package com.example.Backend.dto;

import com.example.Backend.entity.Cart;
import java.util.List;
import java.util.stream.Collectors;

// DTO để "trả về" toàn bộ giỏ hàng
public class CartResponseDTO {
    private Long cartId;
    private Long userId;
    private List<CartDetailResponseDTO> items;
    private Double totalPrice;

    public CartResponseDTO(Cart cart) {
        this.cartId = cart.getId();
        if (cart.getUser() != null) {
            this.userId = cart.getUser().getId();
        }

        // Map danh sách CartDetail sang DTO
        if (cart.getCartDetails() != null) {
            this.items = cart.getCartDetails().stream()
                    .map(CartDetailResponseDTO::new)
                    .collect(Collectors.toList());
        }

        // Tính tổng tiền
        this.totalPrice = calculateTotalPrice(items);
    }

    // Hàm helper tính tổng tiền
    private Double calculateTotalPrice(List<CartDetailResponseDTO> items) {
        if (items == null)
            return 0.0;
        return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartDetailResponseDTO> getItems() {
        return items;
    }

    public void setItems(List<CartDetailResponseDTO> items) {
        this.items = items;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

}