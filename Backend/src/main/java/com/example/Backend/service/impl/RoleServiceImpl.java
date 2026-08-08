package com.example.Backend.service.impl;

import com.example.Backend.dto.RoleRequestDTO;
import com.example.Backend.dto.RoleResponseDTO;
import com.example.Backend.entity.Role;
import com.example.Backend.exception.ResourceNotFoundException; // Lỗi 404
import com.example.Backend.repository.RoleRepository;
import com.example.Backend.service.RoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    // Hàm helper để tìm Role hoặc ném lỗi 404
    private Role findRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
    }

    // Hàm helper để map từ Entity sang DTO
    private RoleResponseDTO mapToDTO(Role role) {
        return new RoleResponseDTO(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponseDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToDTO) // Tương đương 'role -> mapToDTO(role)'
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponseDTO getRoleById(Long id) {
        Role role = findRoleById(id);
        return mapToDTO(role);
    }

    @Override
    @Transactional
    public RoleResponseDTO createRole(RoleRequestDTO request) {
        // Tạo Entity Role mới từ DTO
        Role role = new Role(request.getName(), request.getDescription());

        // Lưu vào DB
        Role savedRole = roleRepository.save(role);

        // Trả về DTO
        return mapToDTO(savedRole);
    }

    @Override
    @Transactional
    public RoleResponseDTO updateRole(Long id, RoleRequestDTO request) {
        // 1. Tìm Role cũ
        Role existingRole = findRoleById(id);

        // 2. Cập nhật các trường
        existingRole.setName(request.getName());
        existingRole.setDescription(request.getDescription());

        // 3. Lưu lại
        Role updatedRole = roleRepository.save(existingRole);

        // 4. Trả về DTO
        return mapToDTO(updatedRole);
    }

    @Override
    @Transactional
    public void deleteRole(Long id) {

        Role role = findRoleById(id);

        if (role.getUsers() != null && !role.getUsers().isEmpty()) {

            throw new RuntimeException("Cannot delete Role with ID " + id +
                    ": Users are still assigned to this role.");

        }

        // 3. Nếu không còn User nào, tiến hành xoá
        roleRepository.delete(role);
    }
}