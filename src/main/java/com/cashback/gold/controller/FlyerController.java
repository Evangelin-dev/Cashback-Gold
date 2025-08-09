package com.cashback.gold.controller;

import com.cashback.gold.dto.FlyerResponse;
import com.cashback.gold.enums.FlyerType;
import com.cashback.gold.service.FlyerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/flyers")
@RequiredArgsConstructor
@Tag(name = "Flyer Controller", description = "Upload, list, and delete flyers by Admin")
public class FlyerController {

    private final FlyerService flyerService;

    @Operation(summary = "Upload a flyer")
    @ApiResponse(responseCode = "200", description = "Flyer uploaded successfully")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FlyerResponse> uploadFlyer(
            @Parameter(description = "Flyer file") @RequestParam("file") MultipartFile file,
            @Parameter(description = "Flyer type") @RequestParam("type") FlyerType type
    ) {
        return ResponseEntity.ok(flyerService.upload(file, type));
    }

    //    @GetMapping
//    public ResponseEntity<List<FlyerResponse>> listAllFlyers() {
//        return ResponseEntity.ok(flyerService.getAll());
//    }

    @Operation(summary = "Delete a flyer by ID")
    @ApiResponse(responseCode = "204", description = "Flyer deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlyer(
            @Parameter(description = "Flyer ID") @PathVariable Long id
    ) {
        flyerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List flyers (optionally filter by type)")
    @ApiResponse(responseCode = "200", description = "Flyers fetched successfully")
    @GetMapping
    public ResponseEntity<List<FlyerResponse>> listAllFlyers2(
            @Parameter(description = "Optional flyer type filter")
            @RequestParam(value = "type", required = false) FlyerType type
    ) {
        List<FlyerResponse> flyers = (type != null)
                ? flyerService.getAllByType(type)
                : flyerService.getAll();
        return ResponseEntity.ok(flyers);
    }
}
