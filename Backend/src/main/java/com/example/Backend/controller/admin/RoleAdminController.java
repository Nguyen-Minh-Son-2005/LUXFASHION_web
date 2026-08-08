package com.example.Backend.controller.admin;

import com.example.Backend.dto.RoleRequestDTO;
import com.example.Backend.dto.RoleResponseDTO;
import com.example.Backend.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/roles")

public class RoleAdminController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    public List<RoleResponseDTO> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public RoleResponseDTO getRoleById(@PathVariable Long id) {

        return roleService.getRoleById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoleResponseDTO createRole(@RequestBody RoleRequestDTO request) {
        return roleService.createRole(request);
    }

    @PutMapping("/{id}")
    public RoleResponseDTO updateRole(@PathVariable Long id, @RequestBody RoleRequestDTO request) {
        return roleService.updateRole(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        // Không trả về gì (void)
    }
}