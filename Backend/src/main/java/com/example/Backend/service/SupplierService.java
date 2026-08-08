package com.example.Backend.service;

import com.example.Backend.dto.SimpleInfoDTO;
import java.util.List;

public interface SupplierService {

   
    List<SimpleInfoDTO> getAllSuppliers();

   
    SimpleInfoDTO getSupplierById(Long id);

  
    SimpleInfoDTO createSupplier(SimpleInfoDTO dto);



    SimpleInfoDTO updateSupplier(Long id, SimpleInfoDTO dto);

    void deleteSupplier(Long id);
}