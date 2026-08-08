package com.example.Backend.util; // Bạn có thể đặt trong package 'config' hoặc 'util'

import com.example.Backend.dto.RestResponse; // Import DTO
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import jakarta.servlet.http.HttpServletResponse;

@RestControllerAdvice
public class FormatSuccessResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        // Trả về true để áp dụng cho tất cả các controller
        return true;
    }

    @Override
    @Nullable
    public Object beforeBodyWrite(@Nullable Object body, MethodParameter returnType, MediaType selectedContentType,
            Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {

        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();

        if (body instanceof RestResponse) {
            return body;
        }

        if (body instanceof String) {
            return body;
        }

        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(status);
        res.setData(body); // 'body' chính là data (List<Product>, UserDTO, ...)

        // Đặt message tùy theo status code
        if (status == HttpStatus.CREATED.value()) { // 201
            res.setMessage("Create success");
        } else if (status == HttpStatus.OK.value()) { // 200
            res.setMessage("Call API success");
        }
        // (Bạn có thể thêm các trường hợp khác)

        return res; // Trả về đối tượng 'res' đã được bọc
    }
}