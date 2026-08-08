package com.example.Backend.dto;

import com.example.Backend.entity.User;

public class UserResponseDTO {
    private Long id;
    private String fullName;
    private String address;
    private String email;
    private String phoneNumber;
    private String username;
    private String roleName;

    public UserResponseDTO() {
    }

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.address = user.getAddress();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.username = user.getUsername();

        if (user.getRole_id() != null) {
            this.roleName = user.getRole_id().getName();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}