package com.example.Backend.dto;

public class FileResponseDTO {
    private String url;

    public FileResponseDTO() {
    }

    public FileResponseDTO(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}