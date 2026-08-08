package com.example.Backend.dto;

import java.util.List;

public class BillCreateRequestDTO {

    private List<Long> cartDetailIds;

    private ShippingInfoDTO shippingInfo;

    // Getters and Setters
    public List<Long> getCartDetailIds() {
        return cartDetailIds;
    }

    public void setCartDetailIds(List<Long> cartDetailIds) {
        this.cartDetailIds = cartDetailIds;
    }

    public ShippingInfoDTO getShippingInfo() {
        return shippingInfo;
    }

    public void setShippingInfo(ShippingInfoDTO shippingInfo) {
        this.shippingInfo = shippingInfo;
    }
}