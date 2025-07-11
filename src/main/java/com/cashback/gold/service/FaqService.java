package com.cashback.gold.service;

import com.cashback.gold.dto.FaqRequest;
import com.cashback.gold.entity.Faq;
import com.cashback.gold.enums.FaqType;
import com.cashback.gold.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository faqRepository;

    public Faq create(FaqRequest request) {
        Faq faq = Faq.builder()
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .type(request.getType())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return faqRepository.save(faq);
    }

    public Faq update(Long id, FaqRequest request) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        faq.setType(request.getType());
        faq.setUpdatedAt(LocalDateTime.now());
        return faqRepository.save(faq);
    }

    public void delete(Long id) {
        faqRepository.deleteById(id);
    }

    public Page<Faq> list(String search, FaqType type, Pageable pageable) {
        // Handle null or empty search for efficiency
        if (search == null || search.trim().isEmpty()) {
            if (type != null) {
                return faqRepository.findByType(type, pageable);
            }
            return faqRepository.findAll(pageable);
        }

        // Dynamic search with Specification
        Specification<Faq> spec = (root, query, cb) -> {
            Predicate questionPredicate = cb.like(cb.lower(root.get("question")), "%" + search.toLowerCase() + "%");
            Predicate answerPredicate = cb.like(cb.lower(root.get("answer")), "%" + search.toLowerCase() + "%");
            Predicate searchPredicate = cb.or(questionPredicate, answerPredicate);

            if (type != null) {
                Predicate typePredicate = cb.equal(root.get("type"), type);
                return cb.and(searchPredicate, typePredicate);
            }
            return searchPredicate;
        };

        return faqRepository.findAll(spec, pageable);
    }
}