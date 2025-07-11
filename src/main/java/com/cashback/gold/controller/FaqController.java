package com.cashback.gold.controller;

import com.cashback.gold.dto.FaqRequest;
import com.cashback.gold.entity.Faq;
import com.cashback.gold.enums.FaqType;
import com.cashback.gold.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
public class FaqController {

    private final FaqService faqService;

    @PostMapping
    public ResponseEntity<Faq> create(@RequestBody FaqRequest request) {
        return ResponseEntity.ok(faqService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faq> update(@PathVariable Long id, @RequestBody FaqRequest request) {
        return ResponseEntity.ok(faqService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        faqService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<Faq>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) FaqType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return ResponseEntity.ok(faqService.list(search, type, pageable));
    }
}

