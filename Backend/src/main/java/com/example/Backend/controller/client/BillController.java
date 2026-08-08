package com.example.Backend.controller.client;

import com.example.Backend.dto.BillCreateRequestDTO;
import com.example.Backend.dto.BillResponseDTO;
import com.example.Backend.entity.User;
import com.example.Backend.service.BillService;
import com.example.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;
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
            OAuth2User oauthUser = (OAuth2User) principalDetails;
            email = oauthUser.getAttribute("email");
            name = oauthUser.getAttribute("name");
        } else {
            email = principal.getName();
        }
        User user = userService.findOrCreateUser(email, name);
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<BillResponseDTO> createBill(@RequestBody BillCreateRequestDTO request, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        BillResponseDTO createdBill = billService.createBill(request, userId);
        return ResponseEntity.ok(createdBill);
    }

    @GetMapping
    public ResponseEntity<List<BillResponseDTO>> getMyBills(
            @RequestParam(required = false) String status,
            Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        List<BillResponseDTO> bills;
        if (status != null && !status.isBlank()) {
            bills = billService.getMyBillsByStatus(userId, status);
        } else {
            bills = billService.getBillHistory(userId);
        }
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponseDTO> getBillById(@PathVariable("id") Long billId, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        BillResponseDTO bill = billService.getBillDetail(billId, userId);
        return ResponseEntity.ok(bill);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BillResponseDTO> requestCancelBill(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "") String reason,
            Principal principal) {

        Long userId = getUserIdFromPrincipal(principal);

        BillResponseDTO bill = billService.requestCancelBill(id, userId, reason);
        return ResponseEntity.ok(bill);
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<BillResponseDTO> confirmReceived(@PathVariable Long id, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);

        billService.getBillDetail(id, userId);

        BillResponseDTO updatedBill = billService.updateBillStatus(id, "DELIVERED");
        return ResponseEntity.ok(updatedBill);
    }
}