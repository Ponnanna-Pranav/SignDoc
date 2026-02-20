package com.signature.signatureapp.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Base64;

@Service
public class PdfService {

    public String addSignatureToPdf(String hiddenFilePath, String signatureDataUrl, float x, float y, int pageNumber)
            throws IOException {
        System.out.println("PdfService: Adding signature to " + hiddenFilePath + " at page " + pageNumber);

        File file = new File(hiddenFilePath);
        if (!file.exists()) {
            System.err.println("PdfService Error: File not found at " + hiddenFilePath);
            throw new IOException("File not found at " + hiddenFilePath);
        }

        PDDocument document = PDDocument.load(file);

        if (pageNumber < 1 || pageNumber > document.getNumberOfPages()) {
            document.close();
            throw new IllegalArgumentException("Invalid page number");
        }

        PDPage page = document.getPage(pageNumber - 1);
        System.out.println("PdfService: Page loaded. MediaBox: " + page.getMediaBox());

        // PDFBox 2.0.x coordinate system (0,0 is bottom-left).
        // We might need to flip Y coordinate if frontend sends top-left relative.
        // For now, assuming Y is correct from frontend or normalized.
        // x and y are in PDF points (1/72 inch).

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page,
                PDPageContentStream.AppendMode.APPEND, true, true)) {

            if (signatureDataUrl.startsWith("data:image")) {
                System.out.println("PdfService: Processing image signature...");
                // Processing Base64 Image
                try {
                    String base64Image = signatureDataUrl.split(",")[1];
                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                    PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, imageBytes, "signature");
                    System.out.println("PdfService: Image created. Drawing at " + x + ", " + y);

                    // Draw image. Adjust width/height as needed.
                    // float scale = 0.5f; // Example scale
                    contentStream.drawImage(pdImage, x, y, 100, 50); // Hardcoded size for now
                } catch (Exception e) {
                    System.err.println("PdfService Error drawing image: " + e.getMessage());
                    e.printStackTrace();
                    throw new IOException("Failed to draw signature image", e);
                }
            } else {
                // Text Signature
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.newLineAtOffset(x, y);
                contentStream.showText(signatureDataUrl); // Assuming simple text
                contentStream.endText();
            }
        }

        // Save as new file
        String signedFilePath = hiddenFilePath.replace(".pdf", "_signed_" + System.currentTimeMillis() + ".pdf");
        System.out.println("PdfService: Saving signed file to " + signedFilePath);
        document.save(signedFilePath);
        document.close();

        return signedFilePath;
    }
}
