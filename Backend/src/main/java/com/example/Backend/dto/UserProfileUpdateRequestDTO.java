package com.example.Backend.dto;

// DTO này chỉ chứa các trường user được phép tự cập nhật
public class UserProfileUpdateRequestDTO {
    private String fullName;
    private String address;
    private String phoneNumber;

    // --- Getters and Setters (Bắt buộc) ---
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}