package com.example.Backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN) // Báo cho Spring Boot trả về lỗi 403
public class ForbiddenException extends RuntimeException {

    // Constructor
    public ForbiddenException(String message) {
        super(message);
    }
}