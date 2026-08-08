package com.example.Backend.service.impl;

import com.example.Backend.dto.SimpleInfoDTO;
import com.example.Backend.entity.Supplier;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.repository.ProductRepository;
import com.example.Backend.repository.SupplierRepository;
import com.example.Backend.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductRepository productRepository; // Dùng để kiểm tra khi xóa

    @Override
    @Transactional(readOnly = true)
    public List<SimpleInfoDTO> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(supplier -> new SimpleInfoDTO(supplier.getId(), supplier.getName()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SimpleInfoDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        return new SimpleInfoDTO(supplier.getId(), supplier.getName());
    }

    @Override
    @Transactional
    public SimpleInfoDTO createSupplier(SimpleInfoDTO dto) {
        if (dto == null || dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("Supplier name cannot be null or empty");
        }

        Supplier newSupplier = new Supplier();
        newSupplier.setName(dto.getName());

        Supplier savedSupplier = supplierRepository.save(newSupplier);
        return new SimpleInfoDTO(savedSupplier.getId(), savedSupplier.getName());
    }

    @Override
    @Transactional
    public SimpleInfoDTO updateSupplier(Long id, SimpleInfoDTO dto) {
        if (dto == null || dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("Supplier name cannot be null or empty");
        }

        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        existingSupplier.setName(dto.getName());

        Supplier updatedSupplier = supplierRepository.save(existingSupplier);
        return new SimpleInfoDTO(updatedSupplier.getId(), updatedSupplier.getName());
    }

    @Override
    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplierToDelete = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        // BƯỚC KIỂM TRA AN TOÀN
        long productCount = productRepository.countBySupplier_id(supplierToDelete);

        if (productCount > 0) {
            // Nếu có, ném lỗi và không cho xóa
            throw new RuntimeException("Cannot delete supplier: It is currently used by "
                    + productCount + " product(s).");
        }

        // Nếu không có sản phẩm nào dùng, tiến hành xóa
        supplierRepository.delete(supplierToDelete);
    }
}