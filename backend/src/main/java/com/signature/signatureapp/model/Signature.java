package com.signature.signatureapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "signatures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Signature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private float x;
    private float y;
    private float width;
    private float height;
    private int pageNumber;

    @Column(columnDefinition = "TEXT")
    private String signatureData; // Store base64 signature image or text

    private LocalDateTime signedAt;

    @PrePersist
    protected void onSign() {
        this.signedAt = LocalDateTime.now();
    }
}
