package com.example.Backend.service.impl;

import com.example.Backend.dto.BillCreateRequestDTO;
import com.example.Backend.dto.BillResponseDTO;
import com.example.Backend.dto.ShippingInfoDTO;
import com.example.Backend.entity.*;
import com.example.Backend.exception.ForbiddenException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.repository.*;
import com.example.Backend.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

    @Autowired
    private BillRepository billRepository;
    @Autowired
    private BillDetailRepository billDetailRepository;
    @Autowired
    private CartDetailRepository cartDetailRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;

    private void restockItems(Bill bill) {
        List<ProductVariant> variantsToUpdate = new ArrayList<>();
        for (BillDetail detail : bill.getBillDetails()) {
            ProductVariant variant = detail.getProductVariant();
            if (variant != null) {
                int quantityToReturn = detail.getQuantity();
                variant.setQuantity(variant.getQuantity() + quantityToReturn);
                variantsToUpdate.add(variant);
            }
        }
        productVariantRepository.saveAll(variantsToUpdate);
    }

    @Override
    @Transactional
    public BillResponseDTO createBill(BillCreateRequestDTO request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Long> cartDetailIds = request.getCartDetailIds();
        ShippingInfoDTO shippingInfo = request.getShippingInfo();

        if (cartDetailIds == null || cartDetailIds.isEmpty()) {
            throw new IllegalArgumentException("Cart item list cannot be empty");
        }
        if (shippingInfo == null) {
            throw new IllegalArgumentException("Shipping information is required");
        }

        List<CartDetail> cartDetails = cartDetailRepository.findAllById(cartDetailIds);
        List<ProductVariant> variantsToUpdate = new ArrayList<>();
        double totalAmount = 0.0;

        for (CartDetail item : cartDetails) {
            if (!item.getCart().getUser().getId().equals(userId)) {
                throw new ForbiddenException("You do not own cart item with id: " + item.getId());
            }

            ProductVariant variant = item.getProductVariant();
            int requestedQuantity = item.getQuantity();

            if (variant.getQuantity() < requestedQuantity) {
                throw new RuntimeException("Not enough stock for variant: " + variant.getId());
            }

            variant.setQuantity(variant.getQuantity() - requestedQuantity);
            variantsToUpdate.add(variant);
            totalAmount += (item.getPrice() * requestedQuantity);
        }

        Bill newBill = new Bill();
        newBill.setUser(user);
        newBill.setCreatedAt(LocalDateTime.now());
        newBill.setStatus("PENDING");
        newBill.setTotalAmount(totalAmount);
        newBill.setShippingName(shippingInfo.getName());
        newBill.setShippingAddress(shippingInfo.getAddress());
        newBill.setShippingPhone(shippingInfo.getPhone());
        newBill.setShippingNote(shippingInfo.getNote());

        List<BillDetail> billDetails = new ArrayList<>();
        for (CartDetail item : cartDetails) {
            BillDetail billDetail = new BillDetail(newBill, item.getProductVariant(), null, item.getQuantity(),
                    item.getPrice());
            billDetails.add(billDetail);
        }
        newBill.setBillDetails(billDetails);

        Bill savedBill = billRepository.save(newBill);
        productVariantRepository.saveAll(variantsToUpdate);
        cartDetailRepository.deleteAll(cartDetails);

        return new BillResponseDTO(savedBill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillResponseDTO> getBillHistory(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return billRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(BillResponseDTO::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BillResponseDTO getBillDetail(Long billId, Long userId) {
        Bill bill = billRepository.findById(billId).orElseThrow(() -> new ResourceNotFoundException("Bill not found"));
        if (!bill.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }
        return new BillResponseDTO(bill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillResponseDTO> getAllBillsByStatus(String status) {
        return billRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(BillResponseDTO::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillResponseDTO> getMyBillsByStatus(Long userId, String status) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return billRepository.findByUserAndStatusOrderByCreatedAtDesc(user, status).stream()
                .map(BillResponseDTO::new).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BillResponseDTO requestCancelBill(Long billId, Long userId, String reason) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (!bill.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không sở hữu đơn hàng này");
        }

        if (!"PENDING".equals(bill.getStatus())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng khi đang chờ xử lý.");
        }

        bill.setStatus("CANCEL_REQUEST");
        bill.setShippingNote(bill.getShippingNote() + " | Lý do hủy: " + reason);

        return new BillResponseDTO(billRepository.save(bill));
    }

    @Override
    @Transactional
    public BillResponseDTO approveCancelBill(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (!"CANCEL_REQUEST".equals(bill.getStatus())) {
            throw new RuntimeException("Đơn hàng này không có yêu cầu hủy.");
        }

        bill.setStatus("CANCELLED");

        restockItems(bill);

        return new BillResponseDTO(billRepository.save(bill));
    }

    @Override
    @Transactional
    public BillResponseDTO rejectCancelBill(Long billId, String reason) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (!"CANCEL_REQUEST".equals(bill.getStatus())) {
            throw new RuntimeException("Đơn hàng này không có yêu cầu hủy.");
        }

        bill.setStatus("PENDING");
        bill.setShippingNote(bill.getShippingNote() + " | Admin từ chối hủy: " + reason);

        return new BillResponseDTO(billRepository.save(bill));
    }

    @Override
    @Transactional
    public BillResponseDTO updateBillStatus(Long billId, String newStatus) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if ("CANCELLED".equals(newStatus)) {

            if (!"CANCELLED".equals(bill.getStatus())) {
                restockItems(bill);
            }
        }

        bill.setStatus(newStatus);
        return new BillResponseDTO(billRepository.save(bill));
    }
}