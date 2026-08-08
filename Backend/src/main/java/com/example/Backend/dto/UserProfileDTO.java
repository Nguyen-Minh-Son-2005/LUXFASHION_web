package com.example.Backend.dto;

import com.example.Backend.entity.User;

// DTO này dùng để trả về thông tin user (giống UserResponseDTO)
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String address;
    private String phone;
    private String roleName;

    public UserProfileDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.address = user.getAddress();
        this.phone = user.getPhoneNumber();
        if (user.getRole_id() != null) {
            this.roleName = user.getRole_id().getName();
        }
    }

    // --- Bắt buộc có Getters ---
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getRoleName() {
        return roleName;
    }
}