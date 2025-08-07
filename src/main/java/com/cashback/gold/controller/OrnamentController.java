//package com.cashback.gold.controller;
//
//import com.cashback.gold.dto.ornament.OrnamentResponse;
//import com.cashback.gold.service.OrnamentService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/admin/ornaments")
//@RequiredArgsConstructor
//public class OrnamentController {
//
//    private final OrnamentService service;
//
//    // ✅ Get all ornaments with pagination
//    @GetMapping
//    public ResponseEntity<List<OrnamentResponse>> all(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "5") int size) {
//        return ResponseEntity.ok(service.getAll(page, size));
//    }
//
//    // ✅ Get single ornament by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<OrnamentResponse> getById(@PathVariable Long id) {
//        return ResponseEntity.ok(service.getById(id));
//    }
//
//    // ✅ Create new ornament (multipart request)
//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<OrnamentResponse> create(
//            @RequestPart("mainImage") MultipartFile mainImage,
//            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,
//            @RequestPart("data") String dataJson) {
//
//        if (mainImage == null || mainImage.isEmpty()) {
//            return ResponseEntity.badRequest().body(null);
//        }
//
//        return ResponseEntity.ok(service.create(mainImage, subImages, dataJson));
//    }
//
//    // ✅ Update existing ornament
//    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<OrnamentResponse> update(
//            @PathVariable Long id,
//            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
//            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,
//            @RequestPart("data") String dataJson) {
//
//        return ResponseEntity.ok(service.update(id, mainImage, subImages, dataJson));
//    }
//
//    // ✅ Delete an ornament by ID
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> delete(@PathVariable Long id) {
//        service.delete(id);
//        return ResponseEntity.ok("Deleted");
//    }
//
//    // ✅ Filter ornaments by item type (e.g., Ring, Bracelet)
//    @GetMapping("/by-item-type")
//    public ResponseEntity<List<OrnamentResponse>> getByItemType(
//            @RequestParam String itemType,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "5") int size) {
//
//        return ResponseEntity.ok(service.getByItemType(itemType, page, size));
//    }
//}


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

    // ✅ Create new ornament (multipart with JSON + files)
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

    // ✅ Get all ornaments
    @GetMapping
    public ResponseEntity<List<OrnamentResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ornamentService.getAllOrnaments(page, size));
    }

    // ✅ Get single ornament by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrnamentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ornamentService.getOrnamentById(id));
    }

    // ✅ Delete ornament by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ornamentService.deleteOrnament(id);
        return ResponseEntity.noContent().build();
    }

//    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<OrnamentResponse> updateOrnament(
//            @PathVariable Long id,
//            @RequestPart("data") String dataJson,
//            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
//            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages
//    ) {
//        return ResponseEntity.ok(ornamentService.update(id, dataJson, mainImage, subImages));
//    }

}
