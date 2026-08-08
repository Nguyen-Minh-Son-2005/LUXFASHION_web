package com.example.Backend.dto;

import com.example.Backend.entity.Role;

public class RoleResponseDTO {
    private Long id;
    private String name;
    private String description;

    // Constructor để map (chuyển đổi) từ Entity
    public RoleResponseDTO(Role role) {
        this.id = role.getId();
        this.name = role.getName();
        this.description = role.getDescription();
    }

    // Constructor rỗng (một số thư viện mapping cần)
    public RoleResponseDTO() {
    }

    // Getters and Setters (Bạn tự generate nhé)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}