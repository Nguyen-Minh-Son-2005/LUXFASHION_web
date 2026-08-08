// Trong file: OAuth2LoginSuccessHandler.java

package com.example.Backend.config;

import com.example.Backend.entity.Role; // <-- THÊM IMPORT
import com.example.Backend.entity.User;
import com.example.Backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority; // <-- THÊM IMPORT
import org.springframework.security.core.authority.SimpleGrantedAuthority; // <-- THÊM IMPORT
import org.springframework.security.core.context.SecurityContextHolder; // <-- THÊM IMPORT
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken; // <-- THÊM IMPORT
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList; // <-- THÊM IMPORT
import java.util.List; // <-- THÊM IMPORT

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    public OAuth2LoginSuccessHandler() {
        super();
        this.setDefaultTargetUrl("http://localhost:5173/");
        this.setAlwaysUseDefaultTargetUrl(true);
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws ServletException, IOException {

        // 1. Lấy thông tin user Google
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        // 2. GỌI HÀM LƯU VÀO DB (Logic cũ của bạn)
        User ourUser = userService.findOrCreateUser(email, name);

        // === 3. PHẦN CODE MỚI QUAN TRỌNG ===
        // Lấy Role (vai trò) từ user trong DB
        Role role = ourUser.getRole_id();
        List<GrantedAuthority> newAuthorities = new ArrayList<>(authentication.getAuthorities());

        if (role != null && role.getName() != null) {
            // Thêm quyền "ROLE_..." của chúng ta vào danh sách quyền
            newAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
        }

        // Tạo một đối tượng Authentication mới với ĐẦY ĐỦ QUYỀN
        Authentication newAuth = new OAuth2AuthenticationToken(
                oauth2User,
                newAuthorities, // <-- Dùng danh sách quyền mới
                ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId());

        // Dòng QUAN TRỌNG NHẤT: Cập nhật lại phiên đăng nhập (Session)
        // để nó chứa đối tượng newAuth (đã có ROLE_USER)
        SecurityContextHolder.getContext().setAuthentication(newAuth);

        // === KẾT THÚC PHẦN CODE MỚI ===

        // 4. GỌI SUPER ĐỂ NÓ XỬ LÝ CHUYỂN HƯỚNG
        super.onAuthenticationSuccess(request, response, newAuth); // <-- Dùng newAuth
    }
}