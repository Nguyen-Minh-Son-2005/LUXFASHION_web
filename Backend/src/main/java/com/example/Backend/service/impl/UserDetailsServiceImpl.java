package com.example.Backend.service.impl;

import com.example.Backend.entity.Role;
import com.example.Backend.entity.User;
import com.example.Backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
// -----------------------------

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional // (Nên thêm @Transactional)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Tìm user bằng email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 2. Kiểm tra user (Giữ nguyên logic cũ của bạn)
        if (!"LOCAL".equals(user.getProvider())) {
            throw new UsernameNotFoundException("Please log in using your Google account");
        }
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new UsernameNotFoundException("User is not active");
        }

        // --- 3. SỬA LẠI LOGIC NÀY ---
        // Lấy Role (quyền) từ database
        Role role = user.getRole_id();
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (role != null && role.getName() != null) {
            // QUAN TRỌNG: Spring Security tự động thêm tiền tố "ROLE_"
            // 'ADMIN' -> "ROLE_ADMIN"
            // 'USER' -> "ROLE_USER"
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
        }

        // 4. Trả về đối tượng UserDetails (với danh sách quyền đã được tải)
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities // <-- Truyền danh sách quyền vào đây
        );
    }
}