package com.signature.signatureapp.controller;

import com.signature.signatureapp.model.Template;
import com.signature.signatureapp.model.User;
import com.signature.signatureapp.repository.TemplateRepository;
import com.signature.signatureapp.repository.UserRepository;
import com.signature.signatureapp.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TemplateController {

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // Use same upload dir as documents for simplicity, or a subdirectory
    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping
    public ResponseEntity<List<Template>> getAllTemplates(@RequestHeader("Authorization") String token) {
        String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(templateRepository.findByCreatedBy(user));
    }

    @PostMapping
    public ResponseEntity<?> createTemplate(@RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
            User user = userRepository.findByEmail(email).orElseThrow();

            // Ensure upload directory exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save file
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            Template template = new Template();
            template.setName(name);
            template.setFilePath(filePath.toString());
            template.setCreatedBy(user);

            return ResponseEntity.ok(templateRepository.save(template));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload template: " + e.getMessage());
        }
    }
}
