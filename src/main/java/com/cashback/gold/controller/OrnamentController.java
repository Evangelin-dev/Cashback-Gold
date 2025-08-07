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

    private final OrnamentService ornamentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrnamentResponse> create(
            @RequestPart("mainImage") MultipartFile mainImage,
            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,
            @RequestPart("data") String dataJson) {

        if (mainImage == null || mainImage.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok(ornamentService.create(mainImage, subImages, dataJson));
    }

    @GetMapping
    public ResponseEntity<List<OrnamentResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ornamentService.getAllOrnaments(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrnamentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ornamentService.getOrnamentById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ornamentService.deleteOrnament(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrnamentResponse> updateOrnament(
            @PathVariable Long id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages
    ) {
        OrnamentResponse response = ornamentService.update(id, dataJson, mainImage, subImages);
        return ResponseEntity.ok(response);
    }


}
