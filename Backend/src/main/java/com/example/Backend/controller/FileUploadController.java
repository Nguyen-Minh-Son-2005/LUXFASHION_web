package com.example.Backend.controller;

import com.example.Backend.dto.FileResponseDTO;
import com.example.Backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/files")

public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @Value("${app.baseUrl}")
    private String baseUrl;

    @PostMapping("/upload")
    public FileResponseDTO uploadFile(@RequestParam("file") MultipartFile file) {

        String filename = fileStorageService.save(file);

        String url = String.format("%s/images/%s", baseUrl, filename);

        return new FileResponseDTO(url);
    }
}