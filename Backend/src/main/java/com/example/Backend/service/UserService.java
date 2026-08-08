package com.example.Backend.service;

import com.example.Backend.dto.RegisterRequestDTO;
import com.example.Backend.dto.UserCreateRequestDTO;
import com.example.Backend.dto.UserProfileUpdateRequestDTO;
import com.example.Backend.dto.UserResponseDTO;
import com.example.Backend.dto.UserUpdateRequestDTO;
import com.example.Backend.entity.User;

import java.util.List;

public interface UserService {

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    UserResponseDTO createUser(UserCreateRequestDTO createRequest);

    UserResponseDTO updateUser(Long id, UserUpdateRequestDTO updateRequest);

    void deleteUser(Long id);

    User findOrCreateUser(String email, String name);

    UserResponseDTO registerNewUser(RegisterRequestDTO registerRequest);

    UserResponseDTO updateMyProfile(Long userId, UserCreateRequestDTO request);

}