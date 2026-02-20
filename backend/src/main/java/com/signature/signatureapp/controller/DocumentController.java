package com.signature.signatureapp.controller;

import com.signature.signatureapp.model.Document;
import com.signature.signatureapp.security.UserDetailsImpl;
import com.signature.signatureapp.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/docs")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Document document = documentService.storeFile(file, userDetails.getId());
        return ResponseEntity.ok(document);
    }

    @GetMapping
    public List<Document> getMyDocuments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        System.out.println(
                "Fetching documents for user: " + userDetails.getUsername() + " (ID: " + userDetails.getId() + ")");
        List<Document> docs = documentService.getDocumentsByUser(userDetails.getId());
        System.out.println("Found " + docs.size() + " documents.");
        return docs;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable Long id) {
        Document document = documentService.getDocument(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Document document = documentService.getDocument(id);
        Resource resource = documentService.loadFileAsResource(document.getFilePath());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getName() + "\"")
                .body(resource);
    }
}
