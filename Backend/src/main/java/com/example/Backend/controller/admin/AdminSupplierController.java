package com.example.Backend.controller.admin;

import com.example.Backend.dto.SimpleInfoDTO;
import com.example.Backend.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/suppliers")
public class AdminSupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<SimpleInfoDTO>> getAllSuppliers() {
        List<SimpleInfoDTO> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SimpleInfoDTO> getSupplierById(@PathVariable Long id) {
        SimpleInfoDTO supplier = supplierService.getSupplierById(id);
        return ResponseEntity.ok(supplier);
    }

    @PostMapping
    public ResponseEntity<SimpleInfoDTO> createSupplier(@RequestBody SimpleInfoDTO dto) {
        SimpleInfoDTO createdSupplier = supplierService.createSupplier(dto);
        return new ResponseEntity<>(createdSupplier, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SimpleInfoDTO> updateSupplier(@PathVariable Long id, @RequestBody SimpleInfoDTO dto) {
        SimpleInfoDTO updatedSupplier = supplierService.updateSupplier(id, dto);
        return ResponseEntity.ok(updatedSupplier);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}