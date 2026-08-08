package com.example.Backend.exception;

// Lỗi này dùng khi ID truyền vào không hợp lệ (ví dụ: chữ, số âm)
// Nó sẽ trả về lỗi 400 BAD REQUEST
public class IdInvalidException extends RuntimeException {
    public IdInvalidException(String message) {
        super(message);
    }
}