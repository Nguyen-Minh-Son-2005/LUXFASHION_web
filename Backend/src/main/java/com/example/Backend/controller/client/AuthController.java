package com.example.Backend.controller.client;

import com.example.Backend.dto.LoginRequestDTO;
import com.example.Backend.dto.RegisterRequestDTO;
import com.example.Backend.dto.UserResponseDTO;
import com.example.Backend.entity.User;
import com.example.Backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody RegisterRequestDTO registerRequest) {
        // Gọi hàm service chúng ta vừa tạo
        UserResponseDTO userResponse = userService.registerNewUser(registerRequest);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> loginUser(@RequestBody LoginRequestDTO loginRequest,
            HttpServletRequest request) { // 1. Tiêm HttpServletRequest

        // 1. Xác thực user (Giữ nguyên)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        // 2. TẠO SESSION VÀ LƯU CONTEXT BẰNG TAY

        // Tạo một SecurityContext trống
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        // Đặt thông tin xác thực vào context
        context.setAuthentication(authentication);
        // Lưu context này vào SecurityContextHolder
        SecurityContextHolder.setContext(context);

        HttpSession session = request.getSession(true);

        // Lưu SecurityContext (chứa thông tin đăng nhập) vào Session
        // với cái tên (Key) mà Spring Security dùng
        session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, context);

        // 3. Lấy thông tin user (Giữ nguyên)
        String userEmail = authentication.getName();
        // Dùng userService.findOrCreateUser để lấy thông tin (đừng lo, hàm này
        // của bạn chỉ tìm chứ không tạo mới user "LOCAL")
        User user = userService.findOrCreateUser(userEmail, null);

        // 4. Trả về thông tin user (Giữ nguyên)
        return ResponseEntity.ok(new UserResponseDTO(user));
    }
}