package com.example.Backend.exception;

import com.example.Backend.dto.RestResponse; // Import lớp RestResponse
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Hàm này "bắt" lấy Exception: ResourceNotFoundException (lỗi 404)
     */
    @ExceptionHandler(value = ResourceNotFoundException.class)
    public ResponseEntity<RestResponse<Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex) {

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
        res.setError(ex.getMessage()); // Nội dung lỗi (ví dụ: "User not found")
        res.setMessage("ResourceNotFoundException"); // Tên lớp lỗi
        res.setData(null); // Không có data khi bị lỗi

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    /**
     * Hàm này "bắt" lấy Exception: IdInvalidException (lỗi 400)
     */
    @ExceptionHandler(value = IdInvalidException.class)
    public ResponseEntity<RestResponse<Object>> handleIdException(IdInvalidException ex) {

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value()); // 400
        res.setError(ex.getMessage());
        res.setMessage("IdInvalidException");
        res.setData(null);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    // Hàm này "bắt" tất cả các Exception còn lại (lỗi 500)

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<RestResponse<Object>> handleGeneralException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
        res.setError(ex.getMessage());
        res.setMessage("InternalServerError");
        res.setData(null);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }
}