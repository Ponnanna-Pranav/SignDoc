package com.signature.signatureapp.repository;

import com.signature.signatureapp.model.Template;
import com.signature.signatureapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    List<Template> findByCreatedBy(User user);
}
