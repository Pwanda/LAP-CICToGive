package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${app.upload.dir:${user.home}/uploads}")
    private String uploadDir;

    @PostMapping("/images")
    public ResponseEntity<?> uploadImages(@RequestParam("files") MultipartFile[] files) {
        List<String> fileUrls = new ArrayList<>();
        
        try {
            // Create directory if it doesn't exist
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            for (MultipartFile file : files) {
                // Check if file is an image
                if (!file.getContentType().startsWith("image/")) {
                    return ResponseEntity.badRequest().body("Only image files are allowed");
                }
                
                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String newFilename = UUID.randomUUID().toString() + extension;
                
                // Save file
                Path filePath = Paths.get(uploadDir, newFilename);
                Files.write(filePath, file.getBytes());
                
                // Add URL to response
                String fileUrl = "/api/upload/images/" + newFilename;
                fileUrls.add(fileUrl);
            }
            
            return ResponseEntity.ok(fileUrls);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload files: " + e.getMessage());
        }
    }
    
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<?> serveImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            byte[] imageData = Files.readAllBytes(filePath);
            
            return ResponseEntity.ok()
                    .header("Content-Type", Files.probeContentType(filePath))
                    .body(imageData);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
