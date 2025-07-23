package com.cashback.gold.controller;

import com.cashback.gold.dto.ornament.OrnamentResponse;
import com.cashback.gold.service.OrnamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/ornaments")
@RequiredArgsConstructor
public class OrnamentController {

    private final OrnamentService service;

    @GetMapping
    public ResponseEntity<List<OrnamentResponse>> all(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) { // Changed size to match frontend (5 items per page)
        return ResponseEntity.ok(service.getAll(page, size));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrnamentResponse> create(
            @RequestPart("mainImage") MultipartFile mainImage,
            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,
            @RequestPart("data") String dataJson
    ) {
        // Validate mainImage
        if (mainImage == null || mainImage.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(service.create(mainImage, subImages, dataJson));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrnamentResponse> update(
            @PathVariable Long id,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,
            @RequestPart("data") String dataJson
    ) {
        return ResponseEntity.ok(service.update(id, mainImage, subImages, dataJson));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().body("Deleted");
    }

    @RestController
    @RequestMapping("/user/ornaments")
    public static class UserOrnamentController {
        private final OrnamentService service;
        public UserOrnamentController(OrnamentService service) {
            this.service = service;
        }
        @GetMapping
        public ResponseEntity<List<OrnamentResponse>> getAllForUser(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "5") int size) {
            return ResponseEntity.ok(service.getAll(page, size));
        }
    }
}