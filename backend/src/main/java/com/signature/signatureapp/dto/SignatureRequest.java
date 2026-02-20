package com.signature.signatureapp.dto;

import lombok.Data;

@Data
public class SignatureRequest {
    private Long documentId;
    private String signatureData; // text or base64 image
    private float x;
    private float y;
    private int pageNumber;
}
