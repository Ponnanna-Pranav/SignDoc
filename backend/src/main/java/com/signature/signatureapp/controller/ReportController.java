package com.signature.signatureapp.controller;

import com.signature.signatureapp.model.User;
import com.signature.signatureapp.repository.DocumentRepository;
import com.signature.signatureapp.repository.UserRepository;
import com.signature.signatureapp.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReportController {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestHeader("Authorization") String token) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("envelopesSent", 124);
        stats.put("envelopesCompleted", 98);
        stats.put("turnaroundTime", "1 day 4 hours");
        return ResponseEntity.ok(stats);
    }
}
