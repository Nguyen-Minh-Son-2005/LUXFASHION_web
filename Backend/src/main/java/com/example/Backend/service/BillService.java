package com.example.Backend.service;

import com.example.Backend.dto.BillCreateRequestDTO;
import com.example.Backend.dto.BillResponseDTO;
import java.util.List;

public interface BillService {

    BillResponseDTO createBill(BillCreateRequestDTO request, Long userId);

    List<BillResponseDTO> getBillHistory(Long userId);

    BillResponseDTO getBillDetail(Long billId, Long userId);

    List<BillResponseDTO> getAllBillsByStatus(String status);

    List<BillResponseDTO> getMyBillsByStatus(Long userId, String status);

    BillResponseDTO updateBillStatus(Long billId, String newStatus);

    BillResponseDTO requestCancelBill(Long billId, Long userId, String reason);

    BillResponseDTO approveCancelBill(Long billId);

    BillResponseDTO rejectCancelBill(Long billId, String reason);
}