package com.signature.signatureapp.repository;

import com.signature.signatureapp.model.Signature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SignatureRepository extends JpaRepository<Signature, Long> {
    List<Signature> findByDocumentId(Long documentId);
}
