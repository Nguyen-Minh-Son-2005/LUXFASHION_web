package com.example.Backend.controller.admin;

import com.example.Backend.dto.BillResponseDTO;
import com.example.Backend.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bills")
public class BillAdminController {

    @Autowired
    private BillService billService;

    @GetMapping
    public ResponseEntity<List<BillResponseDTO>> getBillsByStatus(
            @RequestParam(required = false, defaultValue = "PENDING") String status) {
        List<BillResponseDTO> bills = billService.getAllBillsByStatus(status);
        return ResponseEntity.ok(bills);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<BillResponseDTO> confirmBill(@PathVariable Long id) {
        BillResponseDTO updatedBill = billService.updateBillStatus(id, "CONFIRMED");
        return ResponseEntity.ok(updatedBill);
    }

    @PutMapping("/{id}/approve-cancel")
    public ResponseEntity<BillResponseDTO> approveCancel(@PathVariable Long id) {
        BillResponseDTO bill = billService.approveCancelBill(id);
        return ResponseEntity.ok(bill);
    }

    @PutMapping("/{id}/reject-cancel")
    public ResponseEntity<BillResponseDTO> rejectCancel(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "") String reason) {
        BillResponseDTO bill = billService.rejectCancelBill(id, reason);
        return ResponseEntity.ok(bill);
    }
}