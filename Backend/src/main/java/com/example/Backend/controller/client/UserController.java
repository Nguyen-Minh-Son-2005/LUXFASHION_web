package com.example.Backend.controller.client;

import com.example.Backend.dto.UserCreateRequestDTO;
import com.example.Backend.dto.UserProfileDTO; // (Bạn cần tạo file DTO này, code ở dưới)
import com.example.Backend.dto.UserResponseDTO;
import com.example.Backend.entity.User;

import com.example.Backend.service.UserService; // <-- Import Service

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    private Long getUserIdFromPrincipal(Principal principal) {
        if (principal == null) {
            throw new SecurityException("User not authenticated");
        }

        Authentication authentication = (Authentication) principal;
        Object principalDetails = authentication.getPrincipal();
        String email;
        String name = null;

        if (principalDetails instanceof OAuth2User) {
            // Case 1: Đăng nhập bằng Google
            OAuth2User oauthUser = (OAuth2User) principalDetails;
            email = oauthUser.getAttribute("email");
            name = oauthUser.getAttribute("name");
        } else {
            // Case 2: Đăng nhập bằng Local
            email = principal.getName();
        }

        // Dùng hàm findOrCreateUser (an toàn cho cả 2 trường hợp)
        User user = userService.findOrCreateUser(email, name);
        return user.getId();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getMyProfile(Principal principal) { // <-- Sửa thành Principal
        // Lấy ID thật
        Long userId = getUserIdFromPrincipal(principal);

        // Lấy thông tin user (dùng lại hàm cũ của service)
        UserResponseDTO userDTO = userService.getUserById(userId);

        User user = new User();
        user.setId(userDTO.getId());
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setUsername(userDTO.getUsername());

        return ResponseEntity.ok(new UserProfileDTO(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponseDTO> updateMyProfile(
            @RequestBody UserCreateRequestDTO request,
            Principal principal) {

        // 1. Lấy ID người dùng đang đăng nhập
        Long userId = getUserIdFromPrincipal(principal);

        // 2. Gọi service mới
        UserResponseDTO updatedUser = userService.updateMyProfile(userId, request);

        return ResponseEntity.ok(updatedUser);
    }
}