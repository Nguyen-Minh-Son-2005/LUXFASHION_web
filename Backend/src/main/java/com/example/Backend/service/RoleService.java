package com.example.Backend.service;

import com.example.Backend.dto.RoleRequestDTO;
import com.example.Backend.dto.RoleResponseDTO;
import java.util.List;

public interface RoleService {

    List<RoleResponseDTO> getAllRoles();

    RoleResponseDTO getRoleById(Long id);

    RoleResponseDTO createRole(RoleRequestDTO request);

    RoleResponseDTO updateRole(Long id, RoleRequestDTO request);

    void deleteRole(Long id);
}