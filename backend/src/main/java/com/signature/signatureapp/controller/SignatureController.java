package com.signature.signatureapp.controller;

import com.signature.signatureapp.dto.SignatureRequest;
import com.signature.signatureapp.model.Document;
import com.signature.signatureapp.model.Signature;
import com.signature.signatureapp.model.User;
import com.signature.signatureapp.repository.DocumentRepository;
import com.signature.signatureapp.repository.SignatureRepository;
import com.signature.signatureapp.repository.UserRepository;
import com.signature.signatureapp.security.UserDetailsImpl;
import com.signature.signatureapp.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/signatures")
public class SignatureController {

    @Autowired
    private SignatureRepository signatureRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PdfService pdfService;

    @PostMapping("/sign")
    public ResponseEntity<?> signDocument(@RequestBody SignatureRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Document document = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found"));

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // 1. Update PDF
            // Note: Coordinate conversion might be needed here depending on frontend values
            // (top-left vs bottom-left)
            // PDFBox uses bottom-left as (0,0). Frontend (web) usually uses top-left.
            // We'll need page height to flip Y if needed. For now passed as is.
            String signedFilePath = pdfService.addSignatureToPdf(document.getFilePath(), request.getSignatureData(),
                    request.getX(), request.getY(), request.getPageNumber());

            // 2. Save Signature Record
            Signature signature = new Signature();
            signature.setDocument(document);
            signature.setUser(user);
            signature.setX(request.getX());
            signature.setY(request.getY());
            signature.setPageNumber(request.getPageNumber());
            signature.setSignatureData(request.getSignatureData()); // Store data or reference

            signatureRepository.save(signature);

            // 3. Update Document path to point to signed version? Or keep original and link
            // signed version?
            // For simplicity, let's update the document entity to point to the new file, or
            // create a new Document version.
            // Updating the current document for this POC.
            document.setFilePath(signedFilePath);
            document.setStatus("signed");
            documentRepository.save(document);

            return ResponseEntity.ok("Document signed successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error signing document: " + e.getMessage());
        }
    }
}
