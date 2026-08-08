package com.example.Backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.util.StringUtils;

@Service
public class FileStorageService {

    private final Path rootLocation = Paths.get("uploads");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);

            System.out.println(">>> [FileStorageService] init() ĐÃ CHẠY. Thư mục: " +
                    rootLocation.toAbsolutePath());

        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    public String save(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = StringUtils.getFilenameExtension(originalFilename);
            String baseName = StringUtils.stripFilenameExtension(originalFilename);
            String cleanBaseName = baseName.replaceAll("[^a-zA-Z0-9._-]", "_");
            String timeStamp = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
            String newFilename = timeStamp + "_" + cleanBaseName + "." + extension;

            Path destinationFile = this.rootLocation.resolve(newFilename);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return newFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}