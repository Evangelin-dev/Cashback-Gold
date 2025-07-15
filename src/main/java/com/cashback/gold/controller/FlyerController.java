package com.cashback.gold.controller;

import com.cashback.gold.dto.FlyerResponse;
import com.cashback.gold.enums.FlyerType;
import com.cashback.gold.service.FlyerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/flyers")
@RequiredArgsConstructor
public class FlyerController {

    private final FlyerService flyerService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FlyerResponse> uploadFlyer(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") FlyerType type
    ) {
        return ResponseEntity.ok(flyerService.upload(file, type));
    }

//    @GetMapping
//    public ResponseEntity<List<FlyerResponse>> listAllFlyers() {
//        return ResponseEntity.ok(flyerService.getAll());
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlyer(@PathVariable Long id) {
        flyerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FlyerResponse>> listAllFlyers2(@RequestParam(value = "type", required = false) FlyerType type) {
        List<FlyerResponse> flyers = (type != null)
                ? flyerService.getAllByType(type)
                : flyerService.getAll();
        return ResponseEntity.ok(flyers);
    }

}

